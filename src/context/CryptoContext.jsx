import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  generateEccKeyPair,
  encryptFeedbackWithEcc,
  decryptFeedbackWithEcc,
  protectPrivateKeyWithPassphrase,
  unlockPrivateKeyWithPassphrase,
  generateVerificationHash,
  signDataWithEcdsa,
  verifyDataWithEcdsa
} from '../utils/cryptoUtils';
import { MOCK_AUDIT_LOGS } from '../data/mockData';

const CryptoContext = createContext();

export const CryptoProvider = ({ children }) => {
  // Audit logs store
  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('system_audit_logs');
    return saved ? JSON.parse(saved) : MOCK_AUDIT_LOGS;
  });

  // Session-protected private keys (in-memory ONLY for security, never written plain to localStorage)
  // Maps orgId -> privateKeyJwk
  const [unlockedPrivateKeys, setUnlockedPrivateKeys] = useState({});

  // Passphrase-encrypted private key vaults (stored in localStorage with PBKDF2 + AES-GCM)
  const [vaultRecords, setVaultRecords] = useState(() => {
    const saved = localStorage.getItem('ecc_key_vaults');
    return saved ? JSON.parse(saved) : {};
  });

  // Save audit logs to localStorage
  useEffect(() => {
    localStorage.setItem('system_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Save vault records to localStorage
  useEffect(() => {
    localStorage.setItem('ecc_key_vaults', JSON.stringify(vaultRecords));
  }, [vaultRecords]);

  // Log an audit trail entry
  const addAuditLog = (action, details, actorName, actorRole, organizationId, severity = 'INFO') => {
    const entry = {
      id: 'aud_' + Date.now().toString(36),
      action,
      severity,
      actor: actorName || 'System',
      actorRole: actorRole || 'SYSTEM',
      organizationId: organizationId || 'GLOBAL',
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [entry, ...prev]);
    return entry;
  };

  /**
   * Generates a new ECC Key Pair for an Organization with Key Rotation Support
   * Passphrase protects the private key before committing to vault storage
   */
  const createOrgEccKeyPair = async (orgId, actorName, passphrase = 'rso-secret-passphrase') => {
    const keyData = await generateEccKeyPair();

    // Protect private key with passphrase using PBKDF2 + AES-GCM
    const encryptedVault = await protectPrivateKeyWithPassphrase(keyData.privateKeyJwk, passphrase);

    // Save in vault storage
    setVaultRecords(prev => ({
      ...prev,
      [orgId]: {
        keyId: keyData.keyId,
        publicKeyJwk: keyData.publicKeyJwk,
        encryptedVault,
        updatedAt: new Date().toISOString(),
        algorithm: keyData.algorithm
      }
    }));

    // Unlock in active session memory
    setUnlockedPrivateKeys(prev => ({
      ...prev,
      [orgId]: keyData.privateKeyJwk
    }));

    addAuditLog(
      'ECC_KEY_PAIR_GENERATED',
      `Generated new NIST P-256 ECC key pair (${keyData.keyId}) protected by PBKDF2 vault.`,
      actorName,
      'OFFICER',
      orgId,
      'NOTICE'
    );

    return keyData;
  };

  /**
   * Unlock an organization's private key into session memory using passphrase
   */
  const unlockOrgPrivateKey = async (orgId, passphrase, actorName) => {
    const vault = vaultRecords[orgId];
    if (!vault || !vault.encryptedVault) {
      throw new Error(`No encrypted key vault found for organization: ${orgId}`);
    }

    const privateKeyJwk = await unlockPrivateKeyWithPassphrase(vault.encryptedVault, passphrase);
    setUnlockedPrivateKeys(prev => ({
      ...prev,
      [orgId]: privateKeyJwk
    }));

    addAuditLog(
      'PRIVATE_KEY_VAULT_UNLOCKED',
      `Officer successfully authenticated and unlocked ECC private key vault in session memory.`,
      actorName,
      'OFFICER',
      orgId,
      'SECURITY'
    );

    return privateKeyJwk;
  };

  /**
   * Manually load a private key JWK for session decryption (e.g. pasted or uploaded by officer)
   */
  const loadPrivateKeyDirectly = (orgId, privateKeyJwk, actorName) => {
    setUnlockedPrivateKeys(prev => ({
      ...prev,
      [orgId]: privateKeyJwk
    }));

    addAuditLog(
      'SESSION_KEY_LOADED',
      `ECC Private Key loaded into secure session memory for inline decryption.`,
      actorName,
      'OFFICER',
      orgId,
      'NOTICE'
    );
  };

  /**
   * Check if organization private key is unlocked in current session
   */
  const isKeyUnlocked = (orgId) => {
    return Boolean(unlockedPrivateKeys[orgId]);
  };

  /**
   * Lock / wipe private key from session memory
   */
  const lockOrgPrivateKey = (orgId, actorName) => {
    setUnlockedPrivateKeys(prev => {
      const copy = { ...prev };
      delete copy[orgId];
      return copy;
    });

    addAuditLog(
      'SESSION_KEY_PURGED',
      `ECC Private key memory was locked and zeroed from active session.`,
      actorName,
      'OFFICER',
      orgId,
      'INFO'
    );
  };

  /**
   * Encrypt submission feedback with the organization's public key
   */
  const encryptSubmission = async (orgPublicKeyJwk, feedbackData, eventTitle, studentName) => {
    const result = await encryptFeedbackWithEcc(orgPublicKeyJwk, feedbackData);
    addAuditLog(
      'EVALUATION_ENCRYPTED_SUBMIT',
      `Evaluation for "${eventTitle}" was authenticated and encrypted via ECDH + AES-GCM-256.`,
      studentName || 'Anonymous Participant',
      'STUDENT',
      feedbackData.organizationId,
      'INFO'
    );
    return result;
  };

  /**
   * Decrypt submission feedback using organization's private key
   */
  const decryptSubmission = async (orgId, encryptedBundle, officerName) => {
    const privateKey = unlockedPrivateKeys[orgId];
    if (!privateKey) {
      throw new Error('Organization Private Key is locked. Please unlock the key vault first.');
    }

    const decrypted = await decryptFeedbackWithEcc(privateKey, encryptedBundle);
    addAuditLog(
      'AUTHORIZED_DECRYPTION',
      `Officer unlocked and decrypted encrypted evaluation feedback inline.`,
      officerName || 'Officer',
      'OFFICER',
      orgId,
      'NOTICE'
    );
    return decrypted;
  };

  return (
    <CryptoContext.Provider
      value={{
        auditLogs,
        addAuditLog,
        createOrgEccKeyPair,
        unlockOrgPrivateKey,
        loadPrivateKeyDirectly,
        lockOrgPrivateKey,
        isKeyUnlocked,
        unlockedPrivateKeys,
        vaultRecords,
        encryptSubmission,
        decryptSubmission,
        generateVerificationHash,
        signCertificate: signDataWithEcdsa,
        verifyCertificate: verifyDataWithEcdsa
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

export const useCrypto = () => useContext(CryptoContext);
