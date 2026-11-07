import React, { useState } from 'react';
import { 
  generateEccKeyPair, 
  encryptFeedbackWithEcc, 
  decryptFeedbackWithEcc 
} from '../../utils/cryptoUtils';
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  Unlock, 
  Cpu, 
  RefreshCw, 
  Copy, 
  Check, 
  Code2, 
  Terminal 
} from 'lucide-react';

export default function EccPlayground() {
  const [keyPair, setKeyPair] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [plaintextInput, setPlaintextInput] = useState('The workshop was deeply informative, but the venue air conditioning was very cold.');
  const [encryptedBundle, setEncryptedBundle] = useState(null);
  const [decryptedResult, setDecryptedResult] = useState(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Generate on demand
  const handleGenerateKeys = async () => {
    setIsGenerating(true);
    setErrorMsg('');
    try {
      const keys = await generateEccKeyPair();
      setKeyPair(keys);
      setEncryptedBundle(null);
      setDecryptedResult(null);
    } catch (err) {
      setErrorMsg('Failed to generate key pair: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Encrypt with generated public key
  const handleEncrypt = async () => {
    if (!keyPair) {
      setErrorMsg('Please generate an ECC key pair first.');
      return;
    }
    setErrorMsg('');
    try {
      const bundle = await encryptFeedbackWithEcc(keyPair.publicKeyJwk, {
        message: plaintextInput,
        studentGrade: 'A+',
        timestamp: new Date().toISOString()
      });
      setEncryptedBundle(bundle);
      setDecryptedResult(null);
    } catch (err) {
      setErrorMsg('Encryption error: ' + err.message);
    }
  };

  // Decrypt with generated private key
  const handleDecrypt = async () => {
    if (!keyPair || !encryptedBundle) return;
    setErrorMsg('');
    try {
      const plain = await decryptFeedbackWithEcc(keyPair.privateKeyJwk, encryptedBundle);
      setDecryptedResult(plain);
    } catch (err) {
      setErrorMsg('Decryption error: ' + err.message);
    }
  };

  const copyPublicKey = () => {
    if (keyPair?.publicKeyJwk) {
      navigator.clipboard.writeText(JSON.stringify(keyPair.publicKeyJwk, null, 2));
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="flex items-center gap-2.5 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Terminal className="w-4 h-4" />
          Native Web Cryptography API • NIST P-256 ECIES
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">
          Elliptic Curve Cryptography (ECC) Laboratory
        </h1>
        <p className="mt-2 text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
          Explore and verify the mathematical public-key cryptography safeguarding student evaluations.
          We use <strong>ECDH (Elliptic Curve Diffie-Hellman)</strong> on the <strong>P-256 (prime256v1)</strong> curve to establish an ephemeral shared secret, deriving a 256-bit symmetric key for <strong>AES-GCM</strong> authenticated encryption.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Step 1: Key Generation Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-600" />
              1. Organization ECC Key Pair Generation
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Generates an asymmetric NIST P-256 ECDH key pair in your local browser's crypto subsystem.
            </p>
          </div>
          <button
            onClick={handleGenerateKeys}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            {keyPair ? 'Rotate & Regenerate Keys' : 'Generate Key Pair'}
          </button>
        </div>

        {keyPair ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs font-mono">
            {/* Public Key Display */}
            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 overflow-hidden">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] font-sans">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Public Key (JWK) — Safe to Publish
                </span>
                <button
                  onClick={copyPublicKey}
                  className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="overflow-x-auto text-[11px] text-emerald-300/90 leading-tight">
                {JSON.stringify(keyPair.publicKeyJwk, null, 2)}
              </pre>
            </div>

            {/* Private Key Display */}
            <div className="p-4 rounded-xl bg-slate-950 text-slate-300 border border-slate-800 overflow-hidden">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] font-sans">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Private Key (JWK) — Kept in Secure Memory Vault
                </span>
                <span className="text-[10px] text-amber-500 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  CONFIDENTIAL
                </span>
              </div>
              <pre className="overflow-x-auto text-[11px] text-amber-200/80 leading-tight">
                {JSON.stringify({ ...keyPair.privateKeyJwk, d: '[PROTECTED_PRIVATE_EXPONENT]' }, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Cpu className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs text-slate-500">
              Click "Generate Key Pair" above to initialize a cryptographic pair.
            </p>
          </div>
        )}
      </div>

      {/* Step 2: Encrypting Remarks Card */}
      {keyPair && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              2. Ephemeral Key Agreement & Hybrid Encryption
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulates the student submitting feedback. A client-side ephemeral key derives a shared AES-GCM-256 key with the Organization Public Key.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Plaintext Student Feedback:</label>
            <input
              type="text"
              value={plaintextInput}
              onChange={(e) => setPlaintextInput(e.target.value)}
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={handleEncrypt}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            Encrypt with ECC Public Key
          </button>

          {/* Ciphertext Output */}
          {encryptedBundle && (
            <div className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono space-y-2 border border-slate-800">
              <div className="flex items-center justify-between text-emerald-400 font-sans font-bold text-[11px] pb-1 border-b border-slate-800">
                <span>Ciphertext & Cryptographic Initialization Vector</span>
                <span className="text-[10px] text-slate-400">Authenticated 128-bit Tag Included</span>
              </div>
              <div className="space-y-1 text-[11px] pt-1">
                <div>
                  <span className="text-slate-400 font-sans">IV (Base64): </span>
                  <span className="text-indigo-300">{encryptedBundle.iv}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">Ciphertext Payload: </span>
                  <span className="text-emerald-400 break-all">{encryptedBundle.ciphertext}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Decrypting with Private Key */}
      {encryptedBundle && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Unlock className="w-4 h-4 text-indigo-600" />
              3. Organization Authorized Decryption
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulates the authorized RSO officer unlocking the response using the Organization Private Key.
            </p>
          </div>

          <button
            onClick={handleDecrypt}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Unlock className="w-3.5 h-3.5" />
            Decrypt with Organization Private Key
          </button>

          {decryptedResult && (
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-2 animate-fade-in">
              <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs">
                <Check className="w-4 h-4 text-emerald-600" />
                Plaintext Successfully Decrypted & Authenticated:
              </div>
              <pre className="text-xs font-mono text-indigo-950 bg-white p-3 rounded-lg border border-indigo-100 overflow-x-auto">
                {JSON.stringify(decryptedResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
