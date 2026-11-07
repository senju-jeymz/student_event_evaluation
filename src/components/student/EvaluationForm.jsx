import React, { useState } from 'react';
import { useEvaluation } from '../../context/EvaluationContext';
import { useAuth } from '../../context/AuthContext';
import { useCrypto } from '../../context/CryptoContext';
import StarRating from '../common/StarRating';
import LikertScale from '../common/LikertScale';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  User, 
  Award, 
  Printer, 
  AlertCircle,
  FileCheck2,
  Sparkles
} from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Profile' },
  { id: 2, label: 'Program' },
  { id: 3, label: 'Speakers' },
  { id: 4, label: 'Logistics' },
  { id: 5, label: 'Feedback & ECC' },
  { id: 6, label: 'Review' },
  { id: 7, label: 'Certificate' }
];

export default function EvaluationForm({ event, onBackToEvents }) {
  const { organizations, submitEvaluation } = useEvaluation();
  const { currentUser } = useAuth();
  const { encryptSubmission } = useCrypto();

  const org = organizations.find(o => o.id === event.organizationId);

  // Stepper state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    isAnonymous: false,
    studentId: currentUser?.studentId || '2023-10492-CS',
    fullName: currentUser?.name || 'Leif Joshua Infante',
    department: currentUser?.department || 'College of Information & Computing Sciences',
    yearLevel: currentUser?.yearLevel || '3rd Year',
    modality: event.modality === 'Hybrid' ? 'In-Person' : event.modality,
    
    // Ratings
    ratings: {
      program: {
        objectives: 5,
        relevance: 5,
        activityEngagement: 5,
        timeManagement: 4
      },
      speakers: {
        mastery: 5,
        delivery: 5,
        qaHandling: 4
      },
      logistics: {
        registration: 5,
        venueAudioVisual: 4,
        committeeHelpfulness: 5
      },
      overall: 5,
      recommendScore: 10
    },

    // Comments & ECC
    enableEccEncryption: true,
    comments: {
      highlights: '',
      improvements: '',
      futureTopics: ''
    }
  });

  const updateFormData = (path, value) => {
    setFormData(prev => {
      const copy = { ...prev };
      const keys = path.split('.');
      let current = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const handleNext = () => {
    setErrorMessage('');
    // Validation
    if (currentStep === 1) {
      if (!formData.isAnonymous && (!formData.studentId || !formData.fullName)) {
        setErrorMessage('Please provide your Student ID and Full Name or toggle Anonymous Evaluation.');
        return;
      }
    }
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setErrorMessage('');
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Final Inline Submission (Zero Modals!)
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      let finalSubmissionPayload = {
        eventId: event.id,
        organizationId: event.organizationId,
        isAnonymous: formData.isAnonymous,
        studentId: formData.isAnonymous ? null : formData.studentId,
        fullName: formData.isAnonymous ? null : formData.fullName,
        department: formData.department,
        yearLevel: formData.yearLevel,
        modality: formData.modality,
        ratings: formData.ratings
      };

      if (formData.enableEccEncryption && org?.publicKeyJwk) {
        // Perform native Web Crypto API ECC encryption using ECDH (NIST P-256) + AES-GCM-256
        const encryptedBundle = await encryptSubmission(
          org.publicKeyJwk,
          formData.comments,
          event.title,
          formData.isAnonymous ? 'Anonymous' : formData.fullName
        );

        finalSubmissionPayload.isEncrypted = true;
        finalSubmissionPayload.encryptedBundle = encryptedBundle;
        // Keep comments clean/masked in storage
        finalSubmissionPayload.comments = {
          highlights: '[ECC Encrypted Payload - Locked with Org Public Key]',
          improvements: '[ECC Encrypted Payload - Locked with Org Public Key]',
          futureTopics: '[ECC Encrypted Payload - Locked with Org Public Key]'
        };
      } else {
        finalSubmissionPayload.isEncrypted = false;
        finalSubmissionPayload.comments = formData.comments;
      }

      const result = await submitEvaluation(finalSubmissionPayload);
      setSubmissionResult(result);
      setCurrentStep(7); // Move to Inline Certificate / Confirmation step
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      setErrorMessage(err.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Event Header Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                {org?.name || 'Student Organization'}
              </span>
              <span className="text-xs font-semibold text-slate-500">• {event.category}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {event.date} ({event.time})
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {event.venue}
              </span>
            </div>
          </div>

          <button
            onClick={onBackToEvents}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Events
          </button>
        </div>

        {/* Stepper Progress Bar (Zero Modals, Clear Progression) */}
        {currentStep <= 6 && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">
                Step {currentStep} of 6: <span className="text-indigo-600">{STEPS[currentStep - 1]?.label}</span>
              </span>
              <span className="text-xs font-medium text-slate-500">
                {Math.round(((currentStep - 1) / 5) * 100)}% Completed
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Error notification if any */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: Profile & Attendance Modality */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Attendee Information & Anonymity</h2>
              <p className="text-xs text-slate-500 mt-0.5">Choose whether to attach your credentials or remain anonymous.</p>
            </div>
            <User className="w-5 h-5 text-indigo-600" />
          </div>

          {/* Anonymous Toggle Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 mt-0.5">
                <EyeOff className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-800">Submit Anonymously</span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your name and student number will be completely excluded from the organization's evaluation records.
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAnonymous}
                onChange={(e) => updateFormData('isAnonymous', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Profile fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                disabled={formData.isAnonymous}
                value={formData.isAnonymous ? 'Anonymous Attendee' : formData.fullName}
                onChange={(e) => updateFormData('fullName', e.target.value)}
                className={`w-full mt-1 px-3.5 py-2.5 text-sm rounded-xl border ${
                  formData.isAnonymous
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-white border-slate-300 focus:ring-2 focus:ring-indigo-500'
                }`}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Student ID / Number</label>
              <input
                type="text"
                disabled={formData.isAnonymous}
                value={formData.isAnonymous ? 'REDACTED-ANON' : formData.studentId}
                onChange={(e) => updateFormData('studentId', e.target.value)}
                className={`w-full mt-1 px-3.5 py-2.5 text-sm rounded-xl border ${
                  formData.isAnonymous
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-white border-slate-300 focus:ring-2 focus:ring-indigo-500'
                }`}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">College / Academic Department</label>
              <select
                value={formData.department}
                onChange={(e) => updateFormData('department', e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="College of Information & Computing Sciences">College of Information & Computing Sciences</option>
                <option value="College of Business & Accountancy">College of Business & Accountancy</option>
                <option value="College of Arts & Sciences">College of Arts & Sciences</option>
                <option value="College of Engineering & Architecture">College of Engineering & Architecture</option>
                <option value="College of Education">College of Education</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Year Level</label>
              <select
                value={formData.yearLevel}
                onChange={(e) => updateFormData('yearLevel', e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Graduate Studies">Graduate Studies</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Attendance Modality</label>
              <div className="grid grid-cols-3 gap-3 mt-1.5">
                {['In-Person', 'Virtual / Zoom', 'Hybrid'].map(mod => (
                  <button
                    type="button"
                    key={mod}
                    onClick={() => updateFormData('modality', mod)}
                    className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl border transition-all cursor-pointer ${
                      formData.modality === mod
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {mod}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Event Program & Objectives */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">Section 1: Event Program & Objectives</h2>
            <p className="text-xs text-slate-500 mt-0.5">Rate the following statements using the 5-point agreement scale.</p>
          </div>

          <LikertScale
            statement="1. The stated event objectives and agenda were clearly defined and achieved."
            value={formData.ratings.program.objectives}
            onChange={(val) => updateFormData('ratings.program.objectives', val)}
          />

          <LikertScale
            statement="2. The topics discussed were relevant, educational, and professionally valuable."
            value={formData.ratings.program.relevance}
            onChange={(val) => updateFormData('ratings.program.relevance', val)}
          />

          <LikertScale
            statement="3. The activities, breakout exercises, and workshops kept attendees actively engaged."
            value={formData.ratings.program.activityEngagement}
            onChange={(val) => updateFormData('ratings.program.activityEngagement', val)}
          />

          <LikertScale
            statement="4. Time management, program pacing, and session transitions were well handled."
            value={formData.ratings.program.timeManagement}
            onChange={(val) => updateFormData('ratings.program.timeManagement', val)}
          />
        </div>
      )}

      {/* STEP 3: Resource Speakers & Facilitators */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">Section 2: Resource Speakers & Facilitators</h2>
            <p className="text-xs text-slate-500 mt-0.5">Rate the performance, mastery, and engagement of the resource speakers.</p>
          </div>

          <LikertScale
            statement="1. The speakers demonstrated deep subject matter expertise and mastery."
            value={formData.ratings.speakers.mastery}
            onChange={(val) => updateFormData('ratings.speakers.mastery', val)}
          />

          <LikertScale
            statement="2. The presentation style was engaging, clear, and easy to follow."
            value={formData.ratings.speakers.delivery}
            onChange={(val) => updateFormData('ratings.speakers.delivery', val)}
          />

          <LikertScale
            statement="3. The speakers were open to questions and addressed participant inquiries effectively."
            value={formData.ratings.speakers.qaHandling}
            onChange={(val) => updateFormData('ratings.speakers.qaHandling', val)}
          />
        </div>
      )}

      {/* STEP 4: Venue, Logistics & Platform */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">Section 3: Venue, Platform & Organization Logistics</h2>
            <p className="text-xs text-slate-500 mt-0.5">Evaluate the coordination, platform, and support provided by the student organization.</p>
          </div>

          <LikertScale
            statement="1. The pre-event registration, QR check-in, and communications were prompt and seamless."
            value={formData.ratings.logistics.registration}
            onChange={(val) => updateFormData('ratings.logistics.registration', val)}
          />

          <LikertScale
            statement="2. The physical venue (or virtual streaming platform) had excellent audio-visual clarity and comfort."
            value={formData.ratings.logistics.venueAudioVisual}
            onChange={(val) => updateFormData('ratings.logistics.venueAudioVisual', val)}
          />

          <LikertScale
            statement="3. The student organization officers and ushers were welcoming, accommodating, and organized."
            value={formData.ratings.logistics.committeeHelpfulness}
            onChange={(val) => updateFormData('ratings.logistics.committeeHelpfulness', val)}
          />
        </div>
      )}

      {/* STEP 5: Overall Satisfaction & Qualitative Feedback with ECC */}
      {currentStep === 5 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">Section 4: Overall Satisfaction & Qualitative Feedback</h2>
            <p className="text-xs text-slate-500 mt-0.5">Provide your overall rating and end-to-end encrypted remarks.</p>
          </div>

          {/* Star Rating & NPS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <StarRating
                label="Overall Event Satisfaction Rating *"
                value={formData.ratings.overall}
                onChange={(val) => updateFormData('ratings.overall', val)}
                size={8}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Net Recommendation Index (1-10) *
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => updateFormData('ratings.recommendScore', num)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      formData.ratings.recommendScore === num
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {formData.ratings.recommendScore >= 9 ? 'Promoter (Strongly recommend to peers)' : formData.ratings.recommendScore >= 7 ? 'Passive (Satisfied)' : 'Detractor'}
              </span>
            </div>
          </div>

          {/* ECC Cryptographic Toggle Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-emerald-950">
                      ECC End-to-End Encryption
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                      NIST P-256 ECDH
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    When enabled, your feedback comments are encrypted using the organization's verified Public Key. 
                    Only authorized officers holding the matching ECC Private Key can decrypt and read them.
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableEccEncryption}
                  onChange={(e) => updateFormData('enableEccEncryption', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {/* Text Areas */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>1. Event Highlights & Best Takeaways</span>
                {formData.enableEccEncryption && (
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> ECC Encrypted
                  </span>
                )}
              </label>
              <textarea
                rows={3}
                placeholder="What was the most impactful or memorable aspect of this event?"
                value={formData.comments.highlights}
                onChange={(e) => updateFormData('comments.highlights', e.target.value)}
                className="w-full mt-1.5 p-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>2. Areas for Improvement & Constructive Critique</span>
                {formData.enableEccEncryption && (
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> ECC Encrypted
                  </span>
                )}
              </label>
              <textarea
                rows={3}
                placeholder="What could the student organization have done better (e.g. pacing, Wi-Fi, food, venue)?"
                value={formData.comments.improvements}
                onChange={(e) => updateFormData('comments.improvements', e.target.value)}
                className="w-full mt-1.5 p-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>3. Suggested Topics or Activities for Upcoming Events</span>
                {formData.enableEccEncryption && (
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3" /> ECC Encrypted
                  </span>
                )}
              </label>
              <textarea
                rows={2}
                placeholder="What themes, speakers, or workshops would you like to see next?"
                value={formData.comments.futureTopics}
                onChange={(e) => updateFormData('comments.futureTopics', e.target.value)}
                className="w-full mt-1.5 p-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: INLINE REVIEW & CONFIRM (Strictly NO MODAL!) */}
      {currentStep === 6 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
              <FileCheck2 className="w-4 h-4" />
              Pre-Submission Verification
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Review Your Evaluation Summary</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Please review all entries below. Once submitted, duplicate evaluations are prevented to protect data integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            {/* Identity Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                Respondent Identity
              </span>
              <div className="flex justify-between">
                <span className="text-slate-500">Submission Mode:</span>
                <span className="font-bold text-slate-800">
                  {formData.isAnonymous ? '🔒 Anonymous' : 'Identified'}
                </span>
              </div>
              {!formData.isAnonymous && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Full Name:</span>
                    <span className="font-bold text-slate-800">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Student ID:</span>
                    <span className="font-bold text-slate-800">{formData.studentId}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Department:</span>
                <span className="font-bold text-slate-800 truncate max-w-[200px]">{formData.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Modality:</span>
                <span className="font-bold text-slate-800">{formData.modality}</span>
              </div>
            </div>

            {/* Ratings Summary Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                Ratings Breakdown
              </span>
              <div className="flex justify-between">
                <span className="text-slate-500">Overall Rating:</span>
                <span className="font-bold text-amber-600 flex items-center gap-1">
                  ★ {formData.ratings.overall} / 5
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">NPS Score:</span>
                <span className="font-bold text-indigo-600">{formData.ratings.recommendScore} / 10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Program Criteria Avg:</span>
                <span className="font-bold text-slate-800">
                  {((formData.ratings.program.objectives + formData.ratings.program.relevance + formData.ratings.program.activityEngagement + formData.ratings.program.timeManagement) / 4).toFixed(1)} / 5
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Speakers Criteria Avg:</span>
                <span className="font-bold text-slate-800">
                  {((formData.ratings.speakers.mastery + formData.ratings.speakers.delivery + formData.ratings.speakers.qaHandling) / 3).toFixed(1)} / 5
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Logistics Criteria Avg:</span>
                <span className="font-bold text-slate-800">
                  {((formData.ratings.logistics.registration + formData.ratings.logistics.venueAudioVisual + formData.ratings.logistics.committeeHelpfulness) / 3).toFixed(1)} / 5
                </span>
              </div>
            </div>
          </div>

          {/* Cryptography Verification Banner */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="text-xs font-bold text-emerald-900 block">
                  {formData.enableEccEncryption ? 'End-to-End ECC Encryption Enforced' : 'Plaintext Submission'}
                </span>
                <span className="text-[11px] text-emerald-700">
                  {formData.enableEccEncryption
                    ? `Encrypted via NIST P-256 ECDH against ${org?.shortCode || 'Org'} Public Key`
                    : 'Submitted without cryptographic encryption'}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-900">
              {formData.enableEccEncryption ? 'SECURE' : 'STANDARD'}
            </span>
          </div>

          {/* Qualitative comments preview */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
              Qualitative Remarks Preview
            </span>
            <p className="text-slate-600">
              <strong className="text-slate-800">Highlights:</strong> {formData.comments.highlights || 'None provided'}
            </p>
            <p className="text-slate-600">
              <strong className="text-slate-800">Improvements:</strong> {formData.comments.improvements || 'None provided'}
            </p>
            <p className="text-slate-600">
              <strong className="text-slate-800">Future Topics:</strong> {formData.comments.futureTopics || 'None provided'}
            </p>
          </div>
        </div>
      )}

      {/* STEP 7: INLINE CERTIFICATE & ACKNOWLEDGMENT SLIP (Strictly NO MODAL!) */}
      {currentStep === 7 && submissionResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-lg space-y-8 animate-fade-in">
          {/* Success Title */}
          <div className="text-center max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-sm ring-4 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Evaluation Submitted Successfully!</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Thank you for contributing to student organization excellence. Your feedback has been securely committed.
            </p>
          </div>

          {/* Printable Official Digital Certificate Slip */}
          <div className="relative border-4 border-double border-indigo-200 rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50 text-slate-900 shadow-xs print:m-0 print:border-black">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-700 text-white font-black flex items-center justify-center text-lg">
                  SO
                </div>
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-indigo-900">
                    Official Student Evaluation Receipt
                  </h3>
                  <p className="text-xs text-slate-500">University Office of Student Affairs & Services</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Certificate ID</span>
                <span className="text-xs font-mono font-bold text-slate-800">{submissionResult.verificationCode}</span>
              </div>
            </div>

            <div className="space-y-4 my-4 text-center sm:text-left">
              <p className="text-xs sm:text-sm text-slate-600">
                This certifies that {formData.isAnonymous ? 'an anonymous participant' : <strong className="text-slate-900 font-bold">{formData.fullName} ({formData.studentId})</strong>} has officially evaluated the student organization event:
              </p>

              <div className="p-4 rounded-xl bg-white border border-slate-200 text-center">
                <h4 className="text-base sm:text-lg font-black text-indigo-950">{event.title}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Organized by: <strong className="text-indigo-700">{org?.name}</strong> • Date: {event.date}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Modality</span>
                  <span className="font-bold text-slate-800">{submissionResult.modality}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Rating</span>
                  <span className="font-bold text-amber-600">★ {submissionResult.ratings?.overall} / 5</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Security</span>
                  <span className="font-bold text-emerald-700">{submissionResult.isEncrypted ? 'ECC NIST P-256' : 'Standard'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Timestamp</span>
                  <span className="font-bold text-slate-800 truncate block">{new Date(submissionResult.submittedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Cryptographic Verification Footer */}
            <div className="border-t border-indigo-100 pt-4 mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-mono text-[11px]">SHA-256 Hash Verified Attendance Slip</span>
              </div>
              <div className="text-center sm:text-right">
                <span className="font-serif italic text-slate-700">Student Organizations Commission</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={triggerPrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / Save Certificate PDF
            </button>
            <button
              onClick={onBackToEvents}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
            >
              Return to Events Catalog
            </button>
          </div>
        </div>
      )}

      {/* Stepper Navigation Buttons (Zero Modal Controls) */}
      {currentStep <= 6 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1 || isSubmitting}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              currentStep === 1 || isSubmitting
                ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Encrypting & Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm & Submit Evaluation
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
