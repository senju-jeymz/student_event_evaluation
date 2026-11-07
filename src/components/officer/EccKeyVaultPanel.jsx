import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEvaluation } from '../../context/EvaluationContext';
import { useCrypto } from '../../context/CryptoContext';
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Copy, 
  Check, 
  AlertTriangle, 
  FileText,
  CheckCircle2
} from 'lucide-react';

export default function EccKeyVaultPanel() {
  const { currentUser } = useAuth();
  const { organizations, updateOrganization } = useEvaluation();
  const { 
    createOrgEccKeyPair, 
    unlockOrgPrivateKey, 
    lockOrgPrivateKey, 
    isKeyUnlocked, 
    unlockedPrivateKeys,
    vaultRecords 
  } = useCrypto();

  const currentOrg = organizations.find(o => o.id === currentUser?.organizationId) || organizations[1]; // default ACSS
  const isUnlocked = isKeyUnlocked(currentOrg.id);

  const [passphrase, setPassphrase] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  // Rotate Key Pair
  const handleRotateKeys = async () => {
    setIsProcessing(true);
    setErrorMsg('');
    try {
      const newKeys = await createOrgEccKeyPair(
        currentOrg.id,
        currentUser?.name,
        passphrase || 'rso-secret-passphrase'
      );
      updateOrganization(currentOrg.id, {
        publicKeyJwk: newKeys.publicKeyJwk,
        eccKeyId: newKeys.keyId,
        eccKeyStatus: 'ACTIVE'
      });
      setSuccessMsg(`New ECC Key Pair (${newKeys.keyId}) generated and vaulted successfully!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Key rotation failed: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Unlock Vault
  const handleUnlock = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg('');
    try {
      await unlockOrgPrivateKey(currentOrg.id, passphrase || 'rso-secret-passphrase', currentUser?.name);
      setSuccessMsg('Private key vault unlocked in secure session memory.');
      setPassphrase('');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg('Failed to unlock vault: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Lock Vault
  const handleLock = () => {
    lockOrgPrivateKey(currentOrg.id, currentUser?.name);
    setSuccessMsg('Session memory wiped. Private key is locked.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const copyPublicKey = () => {
    if (currentOrg.publicKeyJwk) {
      navigator.clipboard.writeText(JSON.stringify(currentOrg.publicKeyJwk, null, 2));
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              End-to-End Cryptographic Governance
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {currentOrg.shortCode} ECC Key Vault & Privacy Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Manage your organization's Elliptic Curve Cryptography (NIST P-256) keys. 
              Only authorized officers can access decrypted feedback.
            </p>
          </div>

          <button
            onClick={handleRotateKeys}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
            Rotate ECC Key Pair
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
          {errorMsg}
        </div>
      )}

      {/* Grid: Public Key vs Private Vault */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organization Public Key Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Active Organization Public Key
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Distributed to participants to encrypt evaluations.</p>
            </div>
            <button
              onClick={copyPublicKey}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey ? 'Copied' : 'Copy JWK'}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono border border-slate-800 overflow-x-auto">
            <pre className="text-emerald-400 text-[11px] leading-tight">
              {JSON.stringify(currentOrg.publicKeyJwk || { status: 'Generated on rotation' }, null, 2)}
            </pre>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Cryptographic Curve:</span>
              <span className="font-bold text-slate-900">NIST P-256 (prime256v1)</span>
            </div>
            <div className="flex justify-between">
              <span>Algorithm Scheme:</span>
              <span className="font-bold text-slate-900">ECDH Key Agreement + AES-GCM-256</span>
            </div>
            <div className="flex justify-between">
              <span>Key Identifier:</span>
              <span className="font-mono font-bold text-indigo-700">{currentOrg.eccKeyId || 'ecc_acss_2026'}</span>
            </div>
          </div>
        </div>

        {/* Private Key Vault Status Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-500" />
                Officer Session Key Vault
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Protected with PBKDF2 (100,000 iterations) + AES-GCM.</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
              isUnlocked ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {isUnlocked ? 'UNLOCKED IN SESSION' : 'LOCKED (PROTECTED)'}
            </span>
          </div>

          {isUnlocked ? (
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
                  <Unlock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">Private Key Active in Browser Memory</h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    You can inspect and decrypt all authorized student evaluations for {currentOrg.shortCode} inline.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleLock}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Lock Session & Zero Memory
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUnlock} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500 text-white">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Unlock Organization Vault</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enter the organization officer passphrase to load the private key into session memory.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Passphrase (Demo Default: <span className="font-mono text-indigo-600">rso-secret-passphrase</span>)
                </label>
                <input
                  type="password"
                  placeholder="Enter secret passphrase..."
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
              >
                {isProcessing ? 'Verifying...' : 'Unlock Private Key Vault'}
              </button>
            </form>
          )}

          {/* Institutional Compliance Notice */}
          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Strict Privacy Standard:</strong> Private keys are never stored as plaintext database records. University administrators cannot bypass this lock or decrypt feedback without the organization's verified private key.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
