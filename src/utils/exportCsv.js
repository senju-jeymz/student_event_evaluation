/**
 * CSV and Report Exporters for Evaluation Data
 */

export function exportResponsesToCsv(responses, eventTitle = 'Event_Responses') {
  if (!responses || responses.length === 0) {
    alert('No evaluation records available to export.');
    return;
  }

  const headers = [
    'Response ID',
    'Submitted At',
    'Event ID',
    'Is Anonymous',
    'Student ID',
    'Full Name',
    'Department',
    'Year Level',
    'Modality',
    'Program Objectives (1-5)',
    'Program Relevance (1-5)',
    'Program Engagement (1-5)',
    'Program Time Mgmt (1-5)',
    'Speaker Mastery (1-5)',
    'Speaker Delivery (1-5)',
    'Speaker Q&A (1-5)',
    'Logistics Registration (1-5)',
    'Logistics AV Venue (1-5)',
    'Logistics Committee (1-5)',
    'Overall Rating (1-5)',
    'NPS Recommend Score (1-10)',
    'Is ECC Encrypted',
    'Verification Code',
    'Action Status'
  ];

  const rows = responses.map(r => {
    return [
      `"${r.id}"`,
      `"${r.submittedAt}"`,
      `"${r.eventId}"`,
      r.isAnonymous ? 'YES' : 'NO',
      r.isAnonymous ? '"[REDACTED]"' : `"${r.studentId || ''}"`,
      r.isAnonymous ? '"[ANONYMOUS]"' : `"${r.fullName || ''}"`,
      `"${r.department || ''}"`,
      `"${r.yearLevel || ''}"`,
      `"${r.modality || ''}"`,
      r.ratings?.program?.objectives || '',
      r.ratings?.program?.relevance || '',
      r.ratings?.program?.activityEngagement || '',
      r.ratings?.program?.timeManagement || '',
      r.ratings?.speakers?.mastery || '',
      r.ratings?.speakers?.delivery || '',
      r.ratings?.speakers?.qaHandling || '',
      r.ratings?.logistics?.registration || '',
      r.ratings?.logistics?.venueAudioVisual || '',
      r.ratings?.logistics?.committeeHelpfulness || '',
      r.ratings?.overall || '',
      r.ratings?.recommendScore || '',
      r.isEncrypted ? 'YES (NIST P-256 ECC)' : 'NO',
      `"${r.verificationCode || ''}"`,
      `"${r.actionPlanStatus || 'IN_REVIEW'}"`
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const cleanTitle = eventTitle.replace(/[^a-zA-Z0-9_-]/g, '_');
  link.setAttribute('download', `${cleanTitle}_evaluations_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportAuditLogsToCsv(logs) {
  if (!logs || logs.length === 0) return;

  const headers = ['Log ID', 'Timestamp', 'Severity', 'Action', 'Actor', 'Role', 'Organization', 'Details'];
  const rows = logs.map(l => [
    `"${l.id}"`,
    `"${l.timestamp}"`,
    `"${l.severity}"`,
    `"${l.action}"`,
    `"${l.actor}"`,
    `"${l.actorRole}"`,
    `"${l.organizationId}"`,
    `"${(l.details || '').replace(/"/g, '""')}"`
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `system_audit_logs_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
