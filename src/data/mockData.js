/**
 * System Data Store: Organizations, Users, Roles, Events, Pre-generated ECC Keys, and Seed Responses
 * Fully synchronized with University of the Assumption & OSA structure
 */

import { INITIAL_ORGANIZATIONS, INITIAL_EVENTS, UNIVERSITY_CONFIG, COLOR_PALETTES } from '../config/organizationConfig.js';

export const ROLES = {
  ADMIN: 'ADMIN',             // University Admin (Office of Student Affairs - OSA)
  UACSC: 'UACSC_OFFICER',      // University of the Assumption Central Student Council
  RSO: 'RSO_OFFICER',          // Recognized Student Organization Officer
  STUDENT: 'STUDENT'           // Student Participant
};

export const MOCK_USERS = [
  {
    id: 'usr_admin',
    name: 'Ms. Precious Bernadette Estrada',
    email: 'admin.osa@ua.edu.ph',
    role: ROLES.ADMIN,
    organizationId: null,
    avatar: '👩‍🏫',
    title: 'Director of Student Affairs & Services (OSA)'
  },
  {
    id: 'usr_uacsc',
    name: 'Garnett G. Tolentino',
    email: 'president.uacsc@ua.edu.ph',
    role: ROLES.UACSC,
    organizationId: 'org_uacsc',
    avatar: '🏛️',
    title: 'UACSC President',
    adviser: 'Dax Nathaniel Bondoc, MPA'
  },
  {
    id: 'usr_aaa_officer',
    name: 'Aviane Del Rosario',
    email: 'lead.aaa@ua.edu.ph',
    role: ROLES.RSO,
    organizationId: 'org_aaa',
    avatar: '📐',
    title: 'AAA President',
    adviser: 'Ar. Rhoel Q. Pineda'
  },
  {
    id: 'usr_bacc_officer',
    name: 'Marian Alexis C. Mercado',
    email: 'lead.bacc@ua.edu.ph',
    role: ROLES.RSO,
    organizationId: 'org_bacc',
    avatar: '📈',
    title: 'BACC President',
    adviser: 'Fidela R. Balajadia'
  },
  {
    id: 'org_bhs_phs',
    name: 'Steve Jake M. Regala',
    email: 'lead.bhs@ua.edu.ph',
    role: ROLES.RSO,
    organizationId: 'org_bhs_phs',
    avatar: '',
    title: 'BHS President',
    adviser: 'Amir N. Canlas, MAGC, RPM, RGC'
  },
  {
    id: 'org_batas',
    name: 'Tricia Aika G. Hernandez',
    email: 'lead.batas@ua.edu.ph',
    role: ROLES.RSO,
    organizationId: 'org_batas',
    avatar: '',
    title: 'Batas President',
    adviser: 'John Peter B. Adriano, RCrim, PhDC'
  },
  {
    id: 'org_charms',
    name: 'Justine Luigi G. Vitangcul',
    email: 'lead.charms@ua.edu.ph',
    role: ROLES.RSO,
    organizationId: 'org_charms',
    avatar: '',
    title: 'CHARMS President',
    adviser: 'Ms. Donna Marie P. Simbulan'
  },
  {
    id: 'org_create',
    name: 'Shamel Marie S. Dantes',
    email: 'lead.create@ua.edu.ph',
    role: ROLES.RSO,
    organizationId: 'org_create',
    avatar: '',
    title: 'CREATE President',
    adviser: 'Engr. June C. Musngi'
  },
  {
    id: 'org_icep',
    name: 'Meldion Elijah P. Torres',
    email: 'lead.icep@ua.edu.ph',
    role: ROLES.RSO,
    organizationId: 'org_icep',
    avatar: '',
    title: 'CREATE President',
    adviser: 'Engr. Ian Kenneth B. Yalung'
  },
  {
    id: 'org_jpia',
    name: 'Jedidiah P. Laxamana',
    email: 'lead.jpia@ua.edu.ph',
    role: ROLES.RSO,
    organizationId: 'org_jpia',
    avatar: '',
    title: 'JPIA President',
    adviser: 'Rosalinda E. Perez'
  },
  {
    id: 'org_jppha',
    name: 'Venice Krystel T. Punla',
    email: 'lead.jppha@ua.edu.ph',
    role: ROLES.RSO,
    organizationId: 'org_jppha',
    avatar: '',
    title: 'JPPhA President',
    adviser: 'Pauline Lyzell G. Francisco'
  },
  {
    id: 'org_lead',
    name: 'Jerald F. Caballero',
    email: 'lead.lead@ua.edu.ph',
    role: ROLES.RSO,
    organizationId: 'org_lead',
    avatar: '',
    title: 'LEAD President',
    adviser: 'Steffy Jean T. Sengson, LPT'
  },
  {
    id: 'org_ltsp',
    name: 'Jeanelle Bianca C. Dionicio',
    email: 'lead.ltsp@ua.edu.ph',
    role: ROLES.RSO,
    organizationId: 'org_ltsp',
    avatar: '',
    title: 'LTSP President',
    adviser: 'Denzelle Kayla P. Sabado, MBA'
  },
  {
    id: 'org_mcsa',
    name: 'Yshine Marie S. Mapilisan',
    email: 'lead.mcsa@ua.edu.ph',
    role: ROLES.RSO,
    organizationId: 'org_mcsa',
    avatar: '',
    title: 'MCSA President',
    adviser: 'Mr. Dax Nathaniel M. Bondoc, MPA'
  },
  {
    id: 'org_nsc',
    name: 'Aiona D. Mungcal',
    email: 'lead.nsc@ua.edu.ph',
    role: ROLES.RSO,
    organizationId: 'org_nsc',
    avatar: '',
    title: 'NSC President',
    adviser: 'Cherry B. Lazatin RN, RPh, MAN, LPT'
  },
  {
    id: 'org_pice',
    name: 'Aislhandear M. Alfonso',
    email: 'lead.pice@ua.edu.ph',
    role: ROLES.RSO,
    organizationId: 'org_pice',
    avatar: '',
    title: 'PICE-UA President',
    adviser: 'Engr. Kris Roan B. Simbulan'
  },
  {
    id: 'org_piie',
    name: 'Paul Ian S. Arcega',
    email: 'lead.piie@ua.edu.ph',
    role: ROLES.RSO,
    organizationId: 'org_piie',
    avatar: '',
    title: 'PIIE President',
    adviser: 'Engr. Annie R. Balajadia'
  },
  {
    id: 'org_psychsoc',
    name: 'Steiven Codie P. Gonzales',
    email: 'lead.psychsoc@ua.edu.ph',
    role: ROLES.RSO,
    organizationId: 'org_psychsoc',
    avatar: '',
    title: 'PsychSoc President',
    adviser: 'Mr. Noli D. Franco, MMCJ, RPm'
  },
  {
    id: 'org_ssite',
    name: 'Hannah Samantha Lising',
    email: 'lead.ssite@ua.edu.ph',
    role: ROLES.RSO,
    organizationId: 'org_ssite',
    avatar: '',
    title: 'SSITE President',
    adviser: 'Mark Anthony Madalipay'
  },
  {
    id: 'usr_student_1',
    name: 'Leif Joshua Infante',
    email: 'leif.infante@student.ua.edu.ph',
    role: ROLES.STUDENT,
    studentId: '2023-10492-CS',
    department: 'College of Information & Computing Sciences',
    yearLevel: '3rd Year',
    avatar: '🎓'
  },
  {
    id: 'usr_student_2',
    name: 'Bea Clarisse Mendoza',
    email: 'bea.mendoza@student.ua.edu.ph',
    role: ROLES.STUDENT,
    studentId: '2024-08215-BA',
    department: 'College of Business Administration',
    yearLevel: '2nd Year',
    avatar: '🎒'
  }
];

export const MOCK_ORGANIZATIONS = INITIAL_ORGANIZATIONS;
export const MOCK_EVENTS = INITIAL_EVENTS;

export const MOCK_RESPONSES = [
  {
    id: 'resp_101',
    eventId: 'evt_ssite_event_1',
    organizationId: 'org_ssite',
    studentId: '2023-10492-CS',
    fullName: 'Leif Joshua Infante',
    department: 'College of Information & Computing Sciences',
    yearLevel: '3rd Year',
    modality: 'Hybrid',
    isAnonymous: false,
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
    comments: {
      highlights: 'The hands-on AI and Elliptic Curve Cryptography prototyping was phenomenal! Mentors were accessible and gave practical architectural advice.',
      improvements: 'Wi-Fi bandwidth stalled slightly during peak model downloads around 2 PM.',
      futureTopics: 'Zero-knowledge proofs, distributed systems, and WebAssembly.'
    },
    isEncrypted: false,
    verificationCode: 'SSITE-EVAL-88FA21',
    submittedAt: '2026-11-04T18:15:20Z',
    actionPlanStatus: 'IN_REVIEW',
    signature: 'SIG_SSITE_EVAL_88FA21_ECC_P256_VERIFIED'
  },
  {
    id: 'resp_102',
    eventId: 'evt_ssite_event_1',
    organizationId: 'org_ssite',
    studentId: null,
    fullName: null,
    department: 'College of Information & Computing Sciences',
    yearLevel: '2nd Year',
    modality: 'Hybrid',
    isAnonymous: true,
    ratings: {
      program: {
        objectives: 4,
        relevance: 5,
        activityEngagement: 4,
        timeManagement: 3
      },
      speakers: {
        mastery: 5,
        delivery: 4,
        qaHandling: 4
      },
      logistics: {
        registration: 4,
        venueAudioVisual: 3,
        committeeHelpfulness: 4
      },
      overall: 4,
      recommendScore: 8
    },
    isEncrypted: true,
    encryptedBundle: {
      scheme: 'ECDH-P256-AES-GCM-256',
      ephemeralPublicKeyJwk: {
        kty: 'EC',
        crv: 'P-256',
        x: 'm6o8Q1s3U5w7Y9a1C3e5G7i9K1m3O5q7S9u1W3y5A7c',
        y: 'b4d6F8h1J3l5N7p9R1t3V5x7Z9b1D3f5H7j9L1n3P5r'
      },
      iv: 'sL2P+qW8xR4vKm7Z',
      ciphertext: '3vK1hP9mLk28Fq09/VzY0q+aO6xH8jK2nM9w1Z4pL6eR7uX9a1C3e5G7i9K1m3O5q7S9u1W3y5A7c==',
      previewHint: '🔒 ECC Encrypted Qualitative Remarks (Protected with SSITE Public Key)'
    },
    decryptedSample: {
      highlights: 'The live coding demos and cryptography explanations were super clear.',
      improvements: 'The afternoon schedule ran 30 minutes late due to setup technicalities.',
      futureTopics: 'Cloud-native Kubernetes deployment and cryptographic key lifecycles.'
    },
    verificationCode: 'SSITE-EVAL-39B072',
    submittedAt: '2026-11-04T18:42:10Z',
    actionPlanStatus: 'ADDRESSED',
    signature: 'SIG_SSITE_EVAL_39B072_ECC_P256_VERIFIED'
  },
  {
    id: 'resp_103',
    eventId: 'evt_uacsc_pamuklat',
    organizationId: 'org_uacsc',
    studentId: '2024-08215-BA',
    fullName: 'Bea Clarisse Mendoza',
    department: 'College of Business Administration',
    yearLevel: '2nd Year',
    modality: 'In-Person',
    isAnonymous: false,
    ratings: {
      program: {
        objectives: 5,
        relevance: 5,
        activityEngagement: 5,
        timeManagement: 5
      },
      speakers: {
        mastery: 5,
        delivery: 5,
        qaHandling: 5
      },
      logistics: {
        registration: 5,
        venueAudioVisual: 5,
        committeeHelpfulness: 5
      },
      overall: 5,
      recommendScore: 10
    },
    comments: {
      highlights: 'Pamuklat 2026: UANexus brought so much energy and pride to Assumptionists! Fantastic stage design and opening ceremonies.',
      improvements: 'Hydration stations ran out of water cups during the midday assembly.',
      futureTopics: 'More cross-departmental fellowship games and student leadership grants.'
    },
    isEncrypted: false,
    verificationCode: 'UACSC-EVAL-91CC44',
    submittedAt: '2026-08-20T17:10:05Z',
    actionPlanStatus: 'ADDRESSED',
    signature: 'SIG_UACSC_EVAL_91CC44_ECC_P256_VERIFIED'
  }
];

export const MOCK_AUDIT_LOGS = [
  {
    id: 'aud_001',
    action: 'ECC_KEY_GENERATION',
    severity: 'INFO',
    actor: 'Hannah Samantha Lising (SSITE)',
    actorRole: 'RSO_OFFICER',
    organizationId: 'org_ssite',
    details: 'Generated and published NIST P-256 ECC Public Key for academic year 2026-2027.',
    timestamp: '2026-10-01T08:00:00Z'
  },
  {
    id: 'aud_002',
    action: 'EVENT_CREATION',
    severity: 'INFO',
    actor: 'Garnett G. Tolentino (UACSC)',
    actorRole: 'UACSC_OFFICER',
    organizationId: 'org_uacsc',
    details: 'Published upcoming event "Capascuan 2026: Christmas Festival of Lights" (Scheduled: Nov 13, 2026).',
    timestamp: '2026-10-25T14:30:00Z'
  },
  {
    id: 'aud_003',
    action: 'AUTHORIZED_DECRYPTION',
    severity: 'NOTICE',
    actor: 'Hannah Samantha Lising (SSITE)',
    actorRole: 'RSO_OFFICER',
    organizationId: 'org_ssite',
    details: 'Successfully decrypted anonymous student response (ID: resp_102) using verified Org Private Key.',
    timestamp: '2026-11-04T19:00:15Z'
  }
];

export const MOCK_ACTION_PLANS = [
  {
    id: 'act_001',
    organizationId: 'org_ssite',
    eventId: 'evt_ssite_event_1',
    title: 'Dedicated Gigabit Ethernet Drop for Hackathon Lab',
    status: 'IN_PROGRESS',
    assignedTo: 'Logistics Committee (SSITE)',
    dueDate: '2026-11-20',
    originFeedback: 'Wi-Fi bandwidth stalled during peak model downloads around 2 PM.'
  },
  {
    id: 'act_002',
    organizationId: 'org_uacsc',
    eventId: 'evt_uacsc_pamuklat',
    title: 'Eco-Friendly Hydration Refill Stations for University Events',
    status: 'COMPLETED',
    assignedTo: 'Student Welfare Committee (UACSC)',
    dueDate: '2026-09-01',
    originFeedback: 'Hydration stations ran out of cups during the midday assembly.'
  }
];

export const MOCK_FORM_TEMPLATES = [
  {
    id: 'tmpl_ua_standard',
    title: 'University of the Assumption Institutional Event Evaluation Standard (v2.2)',
    description: 'Mandatory evaluation schema approved by the Office of Student Affairs for all collegiate organizations.',
    criteria: [
      { category: 'Program & Objectives', weight: '30%', items: 4 },
      { category: 'Resource Speakers & Facilitators', weight: '30%', items: 3 },
      { category: 'Logistics, Venue & Support', weight: '25%', items: 3 },
      { category: 'Overall Impact & Recommendation', weight: '15%', items: 2 }
    ],
    status: 'ACTIVE_DEFAULT',
    lastUpdated: '2026-09-15'
  }
];

export { UNIVERSITY_CONFIG, COLOR_PALETTES };
