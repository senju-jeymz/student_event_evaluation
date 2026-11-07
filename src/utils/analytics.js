/**
 * Analytics and Statistical Computations for Event Evaluations
 */

export function computeEventStats(responses = [], eventId = null) {
  const filtered = eventId ? responses.filter(r => r.eventId === eventId) : responses;
  const total = filtered.length;

  if (total === 0) {
    return {
      total: 0,
      overallAverage: 0,
      nps: 0,
      promoters: 0,
      passives: 0,
      detractors: 0,
      categoryAverages: {
        program: 0,
        speakers: 0,
        logistics: 0
      },
      starDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      modalityBreakdown: {},
      yearLevelBreakdown: {},
      encryptedCount: 0
    };
  }

  let totalOverall = 0;
  let totalProgram = 0;
  let totalSpeakers = 0;
  let totalLogistics = 0;
  let promoters = 0;
  let passives = 0;
  let detractors = 0;
  let encryptedCount = 0;

  const starDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const modalityBreakdown = {};
  const yearLevelBreakdown = {};

  filtered.forEach(r => {
    if (r.isEncrypted) encryptedCount++;

    const overall = r.ratings?.overall || 0;
    totalOverall += overall;

    const roundedStar = Math.min(5, Math.max(1, Math.round(overall)));
    starDistribution[roundedStar] = (starDistribution[roundedStar] || 0) + 1;

    // NPS calculation (Score 0-10 or 1-10)
    const recScore = r.ratings?.recommendScore || overall * 2;
    if (recScore >= 9) promoters++;
    else if (recScore >= 7) passives++;
    else detractors++;

    // Modality
    const mod = r.modality || 'In-Person';
    modalityBreakdown[mod] = (modalityBreakdown[mod] || 0) + 1;

    // Year level
    const yl = r.yearLevel || 'Not Specified';
    yearLevelBreakdown[yl] = (yearLevelBreakdown[yl] || 0) + 1;

    // Category averages
    if (r.ratings?.program) {
      const p = r.ratings.program;
      const pAvg = ((p.objectives || 0) + (p.relevance || 0) + (p.activityEngagement || 0) + (p.timeManagement || 0)) / 4;
      totalProgram += pAvg;
    }
    if (r.ratings?.speakers) {
      const s = r.ratings.speakers;
      const sAvg = ((s.mastery || 0) + (s.delivery || 0) + (s.qaHandling || 0)) / 3;
      totalSpeakers += sAvg;
    }
    if (r.ratings?.logistics) {
      const l = r.ratings.logistics;
      const lAvg = ((l.registration || 0) + (l.venueAudioVisual || 0) + (l.committeeHelpfulness || 0)) / 3;
      totalLogistics += lAvg;
    }
  });

  const nps = Math.round(((promoters - detractors) / total) * 100);

  return {
    total,
    overallAverage: Number((totalOverall / total).toFixed(2)),
    nps,
    promoters,
    passives,
    detractors,
    categoryAverages: {
      program: Number((totalProgram / total).toFixed(2)),
      speakers: Number((totalSpeakers / total).toFixed(2)),
      logistics: Number((totalLogistics / total).toFixed(2))
    },
    starDistribution,
    modalityBreakdown,
    yearLevelBreakdown,
    encryptedCount
  };
}

export function computeCrossOrgRankings(organizations = [], events = [], responses = []) {
  return organizations.map(org => {
    const orgEvents = events.filter(e => e.organizationId === org.id);
    const orgEventIds = orgEvents.map(e => e.id);
    const orgResponses = responses.filter(r => orgEventIds.includes(r.eventId));
    const stats = computeEventStats(orgResponses);

    return {
      organizationId: org.id,
      name: org.name,
      shortCode: org.shortCode,
      category: org.category,
      totalEvents: orgEvents.length,
      totalResponses: stats.total,
      overallAverage: stats.overallAverage,
      nps: stats.nps,
      eccKeyStatus: org.eccKeyStatus
    };
  }).sort((a, b) => b.overallAverage - a.overallAverage);
}
