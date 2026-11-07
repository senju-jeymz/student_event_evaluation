/**
 * System Data Store: Organizations, Users, Roles, Events, Pre-generated ECC Keys, and Seed Responses
 */

export const ROLES = {
  ADMIN: 'ADMIN',             // University Admin (Office of Student Affairs)
  UACSC: 'UACSC_OFFICER',      // University of the Assumption Central Student Council
  RSO: 'RSO_OFFICER',          // Recognized Student Organization Officer
  STUDENT: 'STUDENT'           // Student Participant
};

export const MOCK_USERS = [
  {
    id: 'usr_admin',
    name: 'Ms. Precious Bernadette Estrada',
    email: 'admin.osa@university.edu.ph',
    role: ROLES.ADMIN,
    organizationId: null,
    avatar: '👩‍🏫',
    title: 'Director of Student Affairs & Services'
  },
  {
    id: 'usr_uacsc',
    name: 'Garnett Tolentino',
    email: 'president.uacsc@university.edu.ph',
    role: ROLES.UACSC,
    organizationId: 'org_uacsc',
    avatar: '🏛️',
    title: 'UACSC President'
  },
  {
    id: 'usr_cs_officer',
    name: 'Hanna Samantha Lising',
    email: 'lead.acss@university.edu.ph',
    role: ROLES.RSO,
    organizationId: 'org_acss',
    avatar: '💻',
    title: 'SSITE President'
  },
  {
    id: 'usr_jml_officer',
    name: 'James Marc Infante',
    email: 'lead.jml@university.edu.ph',
    role: ROLES.RSO,
    organizationId: 'org_jml',
    avatar: '📈',
    title: 'JML Vice President for Events'
  },
  {
    id: 'usr_student_1',
    name: 'Leif Joshua Infante',
    email: 'leif.infante@student.university.edu.ph',
    role: ROLES.STUDENT,
    studentId: '2023-10492-CS',
    department: 'College of Information & Computing Sciences',
    yearLevel: '3rd Year',
    avatar: '🎓'
  },
  {
    id: 'usr_student_2',
    name: 'Bea Clarisse Mendoza',
    email: 'bea.mendoza@student.university.edu.ph',
    role: ROLES.STUDENT,
    studentId: '2024-08215-BA',
    department: 'College of Business & Accountancy',
    yearLevel: '2nd Year',
    avatar: '🎒'
  }
];

export const MOCK_ORGANIZATIONS = [
  {
    id: 'org_uacsc',
    name: 'University of the Assumption Central Student Council (UACSC)',
    shortCode: 'UACSC',
    category: 'Apex University Student Council',
    college: 'University-Wide',
    president: 'Marc Dominic Reyes',
    status: 'ACTIVE',
    color: 'from-amber-500 to-orange-600',
    description: 'The supreme governing student council representing the collective student body of the University.',
    eccKeyStatus: 'ACTIVE',
    eccKeyId: 'ecc_uacsc_2026',
    // Pre-generated P-256 Public Key (JWK) for UACSC
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'e1l_W3U0w7z0-gLqF6zX1gN1p5f5eY1m9P6m3K5j9w0',
      y: 'h4j8P2m9N1k3L5j7H9f1D3s5A7d9F1g3H5j7K9l1M3o'
    }
  },
  {
    id: 'org_acss',
    name: 'Association of Computing Science Students',
    shortCode: 'SSITE',
    category: 'Academic RSO',
    college: 'College of Information & Computing Sciences',
    president: 'Chloe Marie Villanueva',
    status: 'ACTIVE',
    color: 'from-indigo-600 to-blue-700',
    description: 'Premier student organization fostering software engineering, AI, and cybersecurity initiatives.',
    eccKeyStatus: 'ACTIVE',
    eccKeyId: 'ecc_acss_2026',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'f4h7J2l9N1m3P5q7S9u1W3y5A7c9E1g3I5k7M9o1Q3s',
      y: 'u6w8Y1a3C5e7G9i1K3m5O7q9S1u3W5y7A9c1E3g5I7k'
    }
  },
  {
    id: 'org_jml',
    name: 'Junior Marketing & Business Leaders',
    shortCode: 'JML',
    category: 'Academic RSO',
    college: 'College of Business & Accountancy',
    president: 'Joshua Aaron Lim',
    status: 'ACTIVE',
    color: 'from-emerald-600 to-teal-700',
    description: 'Empowering future marketing strategists, brand directors, and entrepreneurs through masterclasses.',
    eccKeyStatus: 'ACTIVE',
    eccKeyId: 'ecc_jml_2026',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'k2m4O6q8S1u3W5y7A9c1E3g5I7k9M1o3Q5s7U9w1Y3a',
      y: 'c5e7G9i1K3m5O7q9S1u3W5y7A9c1E3g5I7k9M1o3Q5s'
    }
  },
  {
    id: 'org_syl',
    name: 'Society of Young Leaders & Public Servants',
    shortCode: 'SYL',
    category: 'Socio-Civic RSO',
    college: 'College of Arts & Sciences',
    president: 'Danielle Ramos',
    status: 'ACTIVE',
    color: 'from-purple-600 to-indigo-800',
    description: 'Devoted to community outreach, ethical leadership, and policy advocacy seminars.',
    eccKeyStatus: 'ACTIVE',
    eccKeyId: 'ecc_syl_2026',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'w2y4A6c8E1g3I5k7M9o1Q3s5U7w9Y1a3C5e7G9i1K3m',
      y: 'o7q9S1u3W5y7A9c1E3g5I7k9M1o3Q5s7U9w1Y3a5C7e'
    }
  }
];

export const MOCK_EVENTS = [
  {
    id: 'evt_acss_hackflow',
    organizationId: 'org_acss',
    title: 'HackFlow 2026: University Fullstack & AI Hackathon',
    category: 'Competitions & Workshops',
    date: '2026-11-04',
    time: '08:00 AM - 06:00 PM',
    venue: 'CICS Innovation Hub, 4th Floor & Zoom Hybrid',
    modality: 'Hybrid',
    speakers: ['Engr. Rafael Gomez (Tech Lead, Google)', 'Sophia Lee (AI Researcher)'],
    description: 'A 24-hour collegiate challenge addressing local sustainability through web technologies and intelligent agents.',
    evaluationOpen: true,
    expectedAttendees: 150,
    eccEncryptionRequired: true,
    tags: ['Coding', 'AI', 'Fullstack']
  },
  {
    id: 'evt_jml_brandcraft',
    organizationId: 'org_jml',
    title: 'BrandCraft Summit: Generative Marketing in the Digital Age',
    category: 'Conferences & Seminars',
    date: '2026-10-28',
    time: '01:00 PM - 05:00 PM',
    venue: 'University Grand Auditorium',
    modality: 'In-Person',
    speakers: ['Patricia Tan (Brand Architect, Ogilvy)', 'Marco Rivera (Creative Strategist)'],
    description: 'Annual flagship symposium unveiling viral storytelling frameworks and customer engagement metrics.',
    evaluationOpen: true,
    expectedAttendees: 220,
    eccEncryptionRequired: true,
    tags: ['Marketing', 'Strategy', 'Branding']
  },
  {
    id: 'evt_uacsc_leadership',
    organizationId: 'org_uacsc',
    title: 'Apex Vanguard: University-Wide Student Leaders Congress',
    category: 'Leadership & Governance',
    date: '2026-10-15',
    time: '09:00 AM - 04:30 PM',
    venue: 'Student Activities Pavilion',
    modality: 'In-Person',
    speakers: ['Atty. Miguel Soriano', 'Hon. Maria Clara Santos'],
    description: 'Constitutional summit uniting all recognized student organizations and class representatives.',
    evaluationOpen: true,
    expectedAttendees: 300,
    eccEncryptionRequired: true,
    tags: ['Leadership', 'Governance', 'Student Rights']
  },
  {
    id: 'evt_syl_advocacy',
    organizationId: 'org_syl',
    title: 'Community Uplift: Youth Action on Coastal Preservation',
    category: 'Outreach & Civic Action',
    date: '2026-11-12',
    time: '07:30 AM - 02:00 PM',
    venue: 'Coastal Barangay Outreach Zone',
    modality: 'In-Person',
    speakers: ['Dr. Aris Castillo (Marine Ecologist)'],
    description: 'Field civic activity mobilizing student volunteers for biodiversity assessment and cleanup.',
    evaluationOpen: false, // Upcoming
    expectedAttendees: 100,
    eccEncryptionRequired: true,
    tags: ['Environment', 'Outreach', 'Civic Action']
  }
];

export const MOCK_RESPONSES = [
  {
    id: 'resp_101',
    eventId: 'evt_acss_hackflow',
    organizationId: 'org_acss',
    studentId: '2023-10492-CS',
    fullName: 'Leif Joshua Infante',
    department: 'College of Information & Computing Sciences',
    yearLevel: '3rd Year',
    modality: 'In-Person',
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
    // Plaintext qualitative comments (or unencrypted)
    comments: {
      highlights: 'The hands-on AI prototyping session was phenomenal. Mentors were readily accessible and gave practical architectural advice.',
      improvements: 'Wi-Fi bandwidth stalled slightly during peak model downloads around 2 PM. More ethernet drops would be great.',
      futureTopics: 'Distributed systems, micro-frontends, and Rust for web backend.'
    },
    isEncrypted: false,
    verificationCode: 'ACSS-EVAL-88FA21',
    submittedAt: '2026-11-04T18:15:20Z',
    actionPlanStatus: 'IN_REVIEW' // IN_REVIEW, ADDRESSED, ARCHIVED
  },
  {
    id: 'resp_102',
    eventId: 'evt_acss_hackflow',
    organizationId: 'org_acss',
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
    // Simulated ECC Encrypted Payload
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
      previewHint: '🔒 ECC Encrypted Qualitative Remarks (Protected with Organization Public Key)'
    },
    // Fallback unencrypted representation when officer unlocks with private key
    decryptedSample: {
      highlights: 'The live coding demos were spot on and inspired me to build open-source tools.',
      improvements: 'The afternoon schedule ran 45 minutes late due to setup technicalities.',
      futureTopics: 'Cloud-native Kubernetes for collegiate projects.'
    },
    verificationCode: 'ACSS-EVAL-39B072',
    submittedAt: '2026-11-04T18:42:10Z',
    actionPlanStatus: 'ADDRESSED'
  },
  {
    id: 'resp_103',
    eventId: 'evt_jml_brandcraft',
    organizationId: 'org_jml',
    studentId: '2024-08215-BA',
    fullName: 'Bea Clarisse Mendoza',
    department: 'College of Business & Accountancy',
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
      highlights: 'Patricia Tan’s case study on cultural storytelling was the highlight of the semester! High energy and very professional.',
      improvements: 'The registration line was slightly crowded during the 12:30 PM entry rush.',
      futureTopics: 'Influencer marketing ethics and algorithmic ROI analysis.'
    },
    isEncrypted: false,
    verificationCode: 'JML-EVAL-91CC44',
    submittedAt: '2026-10-28T17:10:05Z',
    actionPlanStatus: 'ADDRESSED'
  },
  {
    id: 'resp_104',
    eventId: 'evt_uacsc_leadership',
    organizationId: 'org_uacsc',
    studentId: '2023-10492-CS',
    fullName: 'Leif Joshua Infante',
    department: 'College of Information & Computing Sciences',
    yearLevel: '3rd Year',
    modality: 'In-Person',
    isAnonymous: false,
    ratings: {
      program: {
        objectives: 4,
        relevance: 4,
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
        venueAudioVisual: 4,
        committeeHelpfulness: 4
      },
      overall: 4,
      recommendScore: 8
    },
    comments: {
      highlights: 'Important insights on student representation in university committees.',
      improvements: 'Provide digital copies of the presentation decks earlier for active reading.',
      futureTopics: 'Budget transparency and mental health resolution drafting.'
    },
    isEncrypted: false,
    verificationCode: 'UACSC-EVAL-7721F9',
    submittedAt: '2026-10-15T16:45:00Z',
    actionPlanStatus: 'IN_REVIEW'
  }
];

export const MOCK_AUDIT_LOGS = [
  {
    id: 'aud_001',
    action: 'ECC_KEY_GENERATION',
    severity: 'INFO',
    actor: 'Chloe Marie Villanueva (ACSS)',
    actorRole: 'RSO_OFFICER',
    organizationId: 'org_acss',
    details: 'Generated and published NIST P-256 ECC Public Key for academic year 2026-2027.',
    timestamp: '2026-10-01T08:00:00Z'
  },
  {
    id: 'aud_002',
    action: 'EVENT_CREATION',
    severity: 'INFO',
    actor: 'Chloe Marie Villanueva (ACSS)',
    actorRole: 'RSO_OFFICER',
    organizationId: 'org_acss',
    details: 'Published event "HackFlow 2026" with ECC end-to-end encryption enforced.',
    timestamp: '2026-10-10T14:30:00Z'
  },
  {
    id: 'aud_003',
    action: 'AUTHORIZED_DECRYPTION',
    severity: 'NOTICE',
    actor: 'Chloe Marie Villanueva (ACSS)',
    actorRole: 'RSO_OFFICER',
    organizationId: 'org_acss',
    details: 'Successfully decrypted anonymous student response (ID: resp_102) using verified Org Private Key.',
    timestamp: '2026-11-04T19:00:15Z'
  },
  {
    id: 'aud_004',
    action: 'ACCESS_CONTROL_ENFORCEMENT',
    severity: 'SECURITY',
    actor: 'System Firewall / RBAC Guard',
    actorRole: 'SYSTEM',
    organizationId: 'org_jml',
    details: 'Blocked cross-tenant evaluation read attempt: ACSS officer unauthorized to access JML private records.',
    timestamp: '2026-11-05T09:12:44Z'
  }
];

export const MOCK_ACTION_PLANS = [
  {
    id: 'act_001',
    organizationId: 'org_acss',
    eventId: 'evt_acss_hackflow',
    title: 'Dedicated Gigabit Ethernet Drop for Hackathon Venue',
    status: 'IN_PROGRESS',
    assignedTo: 'Logistics Committee (ACSS)',
    dueDate: '2026-11-20',
    originFeedback: 'Wi-Fi bandwidth stalled during peak model downloads around 2 PM.'
  },
  {
    id: 'act_002',
    organizationId: 'org_jml',
    eventId: 'evt_jml_brandcraft',
    title: 'Dual-Lane QR Check-in Counters for Auditorium Entrance',
    status: 'COMPLETED',
    assignedTo: 'Secretariat Committee (JML)',
    dueDate: '2026-11-01',
    originFeedback: 'Registration line was crowded during the 12:30 PM entry rush.'
  }
];

export const MOCK_FORM_TEMPLATES = [
  {
    id: 'tmpl_university_standard',
    title: 'Institutional Student Org Event Evaluation Standard (v2.2)',
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
