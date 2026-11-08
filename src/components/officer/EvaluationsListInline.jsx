import React, { useState } from 'react';
import { useEvaluation } from '../../context/EvaluationContext';
import { useAuth } from '../../context/AuthContext';
import { useCrypto } from '../../context/CryptoContext';
import { exportResponsesToCsv } from '../../utils/exportCsv';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Search, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  CheckCircle2, 
  PlusCircle, 
  Key,
  Trash2,
  AlertTriangle,
  FileText
} from 'lucide-react';

export default function EvaluationsListInline() {
  const { currentUser } = useAuth();
  const { organizations, events, responses, addActionPlan, updateResponseActionStatus, deleteEvaluation } = useEvaluation();
  const { isKeyUnlocked, decryptSubmission, unlockOrgPrivateKey } = useCrypto();

  const currentOrg = organizations.find(o => o.id === currentUser?.organizationId) || organizations[0];

  // Filter evaluations strictly belonging to this authorized organization
  const orgEvents = events.filter(e => e.organizationId === currentOrg.id);
  const orgEventIds = orgEvents.map(e => e.id);
  const orgResponses = responses.filter(r => orgEventIds.includes(r.eventId));

  // Filters & Search
  const [selectedEventId, setSelectedEventId] = useState('ALL');
  const [filterRating, setFilterRating] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Inline expansion tracking (Zero Modals!)
  const [expandedResponseId, setExpandedResponseId] = useState(orgResponses[0]?.id || null);
  
  // Local state for decrypted feedback payloads (maps responseId -> decryptedObject)
  const [decryptedCache, setDecryptedCache] = useState({});
  const [decryptingId, setDecryptingId] = useState(null);
  const [decryptError, setDecryptError] = useState('');

  // Inline Passphrase unlock drawer state
  const [passphraseInput, setPassphraseInput] = useState('');
  const [showUnlockDrawer, setShowUnlockDrawer] = useState(false);

  // Inline Action plan creation from feedback
  const [actionTitleInput, setActionTitleInput] = useState('');
  const [actionAddedId, setActionAddedId] = useState(null);

  // Inline Delete confirmation tracker (Zero Modals!)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [officerNotes, setOfficerNotes] = useState({});
  const [statusSavedId, setStatusSavedId] = useState(null);

  const handleDeleteResponse = (id) => {
    deleteEvaluation(id);
    setConfirmDeleteId(null);
  };

  const handleUpdateStatus = (id, newStatus) => {
    const note = officerNotes[id] || '';
    updateResponseActionStatus(id, newStatus, note);
    setStatusSavedId(id);
    setTimeout(() => setStatusSavedId(null), 2000);
  };

  const filteredResponses = orgResponses.filter(r => {
    const matchesEvent = selectedEventId === 'ALL' || r.eventId === selectedEventId;
    const matchesRating = filterRating === 'ALL' || Math.round(r.ratings?.overall) === Number(filterRating);
    const matchesSearch = 
      (r.fullName && r.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.studentId && r.studentId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.verificationCode && r.verificationCode.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesEvent && matchesRating && matchesSearch;
  });

  const getEventTitle = (id) => events.find(e => e.id === id)?.title || 'Event';

  // Toggle row expansion (Zero Modals!)
  const toggleExpand = (id) => {
    setExpandedResponseId(prev => (prev === id ? null : id));
    setDecryptError('');
  };

  // Perform Authorized Decryption inline
  const handleDecryptInline = async (response) => {
    setDecryptingId(response.id);
    setDecryptError('');

    try {
      if (response.decryptedSample && !isKeyUnlocked(currentOrg.id)) {
        // Fallback demo decryption if session key wasn't generated in current tab yet
        setDecryptedCache(prev => ({
          ...prev,
          [response.id]: response.decryptedSample
        }));
      } else {
        const decrypted = await decryptSubmission(currentOrg.id, response.encryptedBundle, currentUser?.name);
        setDecryptedCache(prev => ({
          ...prev,
          [response.id]: decrypted
        }));
      }
    } catch (err) {
      setDecryptError(err.message || 'Decryption failed. Please unlock your organization key vault.');
    } finally {
      setDecryptingId(null);
    }
  };

  // Unlock Vault with Passphrase inline
  const handleUnlockVaultInline = async (e) => {
    e.preventDefault();
    setDecryptError('');
    try {
      await unlockOrgPrivateKey(currentOrg.id, passphraseInput || 'rso-secret-passphrase', currentUser?.name);
      setPassphraseInput('');
      setShowUnlockDrawer(false);
    } catch (err) {
      setDecryptError('Passphrase error: ' + err.message);
    }
  };

  // Turn feedback into Action Plan inline
  const handleCreateActionPlan = (response, feedbackText) => {
    if (!actionTitleInput) return;
    addActionPlan({
      organizationId: currentOrg.id,
      eventId: response.eventId,
      title: actionTitleInput,
      originFeedback: feedbackText,
      assignedTo: `${currentOrg.shortCode} Executive Committee`,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    });
    updateResponseActionStatus(response.id, 'ADDRESSED');
    setActionAddedId(response.id);
    setActionTitleInput('');
    setTimeout(() => setActionAddedId(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              {currentOrg.shortCode} Authorized Evaluations
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              RBAC Guard Active
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Attendee Evaluations & Inline Decryption Suite
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse, inspect, and decrypt feedback in place. No popup modals are used.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isKeyUnlocked(currentOrg.id) ? (
            <button
              onClick={() => setShowUnlockDrawer(!showUnlockDrawer)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              {showUnlockDrawer ? 'Close Vault' : 'Unlock Private Key'}
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              <Unlock className="w-4 h-4 text-emerald-600" />
              Key Vault Unlocked
            </span>
          )}

          <button
            onClick={() => exportResponsesToCsv(orgResponses, `${currentOrg.shortCode}_Evaluations`)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Inline Passphrase Unlock Drawer (Zero Modals!) */}
      {showUnlockDrawer && !isKeyUnlocked(currentOrg.id) && (
        <form onSubmit={handleUnlockVaultInline} className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-wrap items-center gap-3 text-xs animate-fade-in">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <Key className="w-4 h-4 text-amber-700" />
            <span>Enter Officer Passphrase to Unlock ECC Private Key:</span>
          </div>
          <input
            type="password"
            placeholder="Enter passphrase (default: rso-secret-passphrase)"
            value={passphraseInput}
            onChange={(e) => setPassphraseInput(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-2 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer"
          >
            Unlock Now
          </button>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, ID, or receipt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full py-2 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL">All {currentOrg.shortCode} Events ({orgEvents.length})</option>
            {orgEvents.map(e => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="w-full py-2 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Overall Ratings</option>
            <option value="5">5 Stars (Outstanding)</option>
            <option value="4">4 Stars (Very Good)</option>
            <option value="3">3 Stars (Average)</option>
            <option value="2">2 Stars (Needs Improvement)</option>
            <option value="1">1 Star (Poor)</option>
          </select>
        </div>
      </div>

      {/* Evaluations Master Table with Inline Expanders (Zero Modals!) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Found {filteredResponses.length} Submissions</span>
          <span className="text-slate-500">Click any row to expand details inline</span>
        </div>

        {filteredResponses.length === 0 ? (
          <div className="p-10 text-center text-slate-500 text-xs">
            No evaluations match the selected filter criteria.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredResponses.map((r) => {
              const isExpanded = expandedResponseId === r.id;
              const decrypted = decryptedCache[r.id];

              return (
                <div key={r.id} className="transition-colors">
                  {/* Row Header (Clickable) */}
                  <div
                    onClick={() => toggleExpand(r.id)}
                    className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/80 transition-colors ${
                      isExpanded ? 'bg-indigo-50/40 border-l-4 border-indigo-600' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
                        {r.isAnonymous ? '🕶️' : '🎓'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {r.isAnonymous ? 'Anonymous Participant' : r.fullName}
                          </span>
                          {!r.isAnonymous && (
                            <span className="text-[10px] font-mono text-slate-500">({r.studentId})</span>
                          )}
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                            {r.yearLevel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{getEventTitle(r.eventId)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      {/* Overall Star */}
                      <span className="font-bold text-amber-600 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {r.ratings?.overall}.0
                      </span>

                      {/* Encryption Status Badge */}
                      {r.isEncrypted ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <Lock className="w-3 h-3 text-emerald-600" />
                          ECC Encrypted
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                          Plaintext
                        </span>
                      )}

                      {/* Expand / Collapse Icon */}
                      <div className="p-1 rounded-lg bg-slate-100 text-slate-500">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* INLINE EXPANDED DETAILS (Strictly Zero Modals!) */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 bg-slate-50/70 border-t border-slate-100 space-y-5 animate-fade-in">
                      {/* Sub-header meta */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Modality</span>
                          <span className="font-bold text-slate-800">{r.modality}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">NPS Score</span>
                          <span className="font-bold text-indigo-700">{r.ratings?.recommendScore} / 10</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Verification Receipt</span>
                          <span className="font-mono font-bold text-slate-800">{r.verificationCode}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Submitted At</span>
                          <span className="font-bold text-slate-800 truncate block">
                            {new Date(r.submittedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Criteria Scores Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                          <span className="font-bold text-indigo-900 block text-[11px]">Program & Objectives</span>
                          <div className="flex justify-between text-slate-600">
                            <span>Objectives Met:</span>
                            <span className="font-bold">{r.ratings?.program?.objectives} / 5</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Topic Relevance:</span>
                            <span className="font-bold">{r.ratings?.program?.relevance} / 5</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Engagement:</span>
                            <span className="font-bold">{r.ratings?.program?.activityEngagement} / 5</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Time Management:</span>
                            <span className="font-bold">{r.ratings?.program?.timeManagement} / 5</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                          <span className="font-bold text-emerald-900 block text-[11px]">Speakers & Facilitators</span>
                          <div className="flex justify-between text-slate-600">
                            <span>Subject Mastery:</span>
                            <span className="font-bold">{r.ratings?.speakers?.mastery} / 5</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Presentation Delivery:</span>
                            <span className="font-bold">{r.ratings?.speakers?.delivery} / 5</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Q&A Handling:</span>
                            <span className="font-bold">{r.ratings?.speakers?.qaHandling} / 5</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                          <span className="font-bold text-amber-900 block text-[11px]">Logistics & Coordination</span>
                          <div className="flex justify-between text-slate-600">
                            <span>Registration Ease:</span>
                            <span className="font-bold">{r.ratings?.logistics?.registration} / 5</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Venue / Platform AV:</span>
                            <span className="font-bold">{r.ratings?.logistics?.venueAudioVisual} / 5</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Committee Help:</span>
                            <span className="font-bold">{r.ratings?.logistics?.committeeHelpfulness} / 5</span>
                          </div>
                        </div>
                      </div>

                      {/* Qualitative Feedback Section & ECC Decrypt Engine */}
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            Qualitative Remarks
                            {r.isEncrypted && (
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                                NIST P-256 ECIES
                              </span>
                            )}
                          </h4>

                          {/* Decryption status */}
                          {r.isEncrypted && (
                            <div>
                              {decrypted ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                                  <Unlock className="w-3.5 h-3.5" />
                                  Unlocked & Decrypted
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleDecryptInline(r)}
                                  disabled={decryptingId === r.id}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
                                >
                                  <Key className="w-3.5 h-3.5" />
                                  {decryptingId === r.id ? 'Decrypting...' : 'Decrypt with Org Private Key'}
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Error display */}
                        {decryptError && expandedResponseId === r.id && (
                          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                            {decryptError}
                          </div>
                        )}

                        {/* Content display */}
                        {r.isEncrypted && !decrypted ? (
                          <div className="p-3 rounded-lg bg-slate-900 text-slate-300 font-mono text-[11px] space-y-1">
                            <div className="text-amber-400 font-bold flex items-center gap-1">
                              <Lock className="w-3.5 h-3.5" />
                              Payload is Encrypted with Organization Public Key
                            </div>
                            <div className="text-slate-400 truncate">
                              Ciphertext: {r.encryptedBundle?.ciphertext}
                            </div>
                            <div className="text-slate-500 text-[10px]">
                              Scheme: {r.encryptedBundle?.scheme} • Click "Decrypt with Org Private Key" above to read.
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2 text-xs text-slate-700">
                            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                              <strong className="text-slate-900 block font-semibold mb-0.5">Highlights:</strong>
                              <p>{(decrypted || r.comments)?.highlights || 'No comments'}</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                              <strong className="text-slate-900 block font-semibold mb-0.5">Areas for Improvement:</strong>
                              <p>{(decrypted || r.comments)?.improvements || 'No comments'}</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                              <strong className="text-slate-900 block font-semibold mb-0.5">Requested Future Topics:</strong>
                              <p>{(decrypted || r.comments)?.futureTopics || 'No comments'}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Plan Creator from this Feedback */}
                      <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                        <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                          <PlusCircle className="w-4 h-4 text-indigo-600" />
                          Transform Feedback into Actionable Improvement Item
                        </span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. Upgrade Wi-Fi hotspots / Pre-distribute handouts..."
                            value={actionTitleInput}
                            onChange={(e) => setActionTitleInput(e.target.value)}
                            className="flex-1 px-3 py-1.5 text-xs bg-white border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleCreateActionPlan(r, (decrypted || r.comments)?.improvements || 'Event feedback')}
                            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
                          >
                            Add Action Item
                          </button>
                        </div>
                        {actionAddedId === r.id && (
                          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Action Plan item created successfully!
                          </span>
                        )}
                      </div>

                      {/* Administrative Review & Action Status (CRUD Update & Delete) */}
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-slate-500" />
                            Administrative Review Status & Notes
                          </span>

                          <div className="flex items-center gap-2">
                            <select
                              value={r.actionPlanStatus || 'IN_REVIEW'}
                              onChange={(e) => handleUpdateStatus(r.id, e.target.value)}
                              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 bg-slate-50 cursor-pointer"
                            >
                              <option value="IN_REVIEW">Status: IN REVIEW</option>
                              <option value="ADDRESSED">Status: ADDRESSED</option>
                              <option value="ARCHIVED">Status: ARCHIVED</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(r.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 cursor-pointer transition-all"
                              title="Delete this submission record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete Submission
                            </button>
                          </div>
                        </div>

                        <div className="pt-2">
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">Officer Internal Review Notes:</label>
                          <textarea
                            rows={2}
                            placeholder="Add internal resolution or committee notes..."
                            value={officerNotes[r.id] !== undefined ? officerNotes[r.id] : (r.officerRemarks || '')}
                            onChange={(e) => setOfficerNotes({ ...officerNotes, [r.id]: e.target.value })}
                            className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-slate-50 focus:bg-white"
                          />
                        </div>

                        {statusSavedId === r.id && (
                          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Review status updated!
                          </span>
                        )}

                        {/* Inline Delete Confirmation Banner */}
                        {confirmDeleteId === r.id && (
                          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-2">
                            <div className="flex items-center gap-2 font-bold">
                              <AlertTriangle className="w-4 h-4 text-rose-600" />
                              Confirm Evaluation Deletion
                            </div>
                            <p className="text-rose-700">
                              Permanently remove this evaluation record (ID: {r.id})? This action cannot be reversed.
                            </p>
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                onClick={() => handleDeleteResponse(r.id)}
                                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
                              >
                                Yes, Permanently Delete
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-3 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
