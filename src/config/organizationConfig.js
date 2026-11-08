/**
 * Centralized Organization & System Configuration
 * University of the Assumption — Student Organizations Event Evaluation System
 * Motto: "biasa, maganaca, mayap"
 *
 * This file serves as the single source of truth for:
 * 1. University details & Office of Student Affairs (OSA)
 * 2. All 18 Recognized Student Organizations & Councils (Name, shortCode, President, Adviser, Color Palettes)
 * 3. Seed Events (Done, Upcoming, Active)
 */

export const UNIVERSITY_CONFIG = {
  name: 'University of the Assumption',
  shortName: 'UA',
  motto: 'biasa, maganaca, mayap',
  location: 'City of San Fernando, Pampanga',
  osa: {
    office: 'Office of Student Affairs (OSA)',
    director: 'Precious Bernadette Estrada',
    title: 'OSA Director',
    email: 'admin.osa@ua.edu.ph'
  }
};

/**
 * Color Palette mapping for all organizations:
 * Includes Tailwind classes, hex colors for badges, backgrounds, borders, and gradients.
 */
export const COLOR_PALETTES = {
  RED: {
    name: 'Red',
    primary: '#DC2626',
    primaryHover: '#B91C1C',
    light: '#FEF2F2',
    border: '#FECACA',
    text: '#991B1B',
    badge: 'bg-red-50 text-red-700 border-red-200',
    gradient: 'from-red-600 to-rose-700',
    accent: '#EF4444'
  },
  LIGHT_RED: {
    name: 'Light Red',
    primary: '#F87171',
    primaryHover: '#EF4444',
    light: '#FFF1F2',
    border: '#FFE4E6',
    text: '#BE123C',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    gradient: 'from-rose-500 to-red-600',
    accent: '#FB7185'
  },
  YELLOW: {
    name: 'Yellow',
    primary: '#EAB308',
    primaryHover: '#CA8A04',
    light: '#FEFCE8',
    border: '#FEF08A',
    text: '#854D0E',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
    gradient: 'from-amber-500 to-yellow-600',
    accent: '#F59E0B'
  },
  LIGHT_VIOLET: {
    name: 'Light Violet',
    primary: '#A78BFA',
    primaryHover: '#8B5CF6',
    light: '#F5F3FF',
    border: '#DDD6FE',
    text: '#6D28D9',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    gradient: 'from-purple-500 to-violet-600',
    accent: '#C4B5FD'
  },
  VIOLET: {
    name: 'Violet',
    primary: '#7C3AED',
    primaryHover: '#6D28D9',
    light: '#F5F3FF',
    border: '#DDD6FE',
    text: '#5B21B6',
    badge: 'bg-violet-50 text-violet-800 border-violet-200',
    gradient: 'from-violet-600 to-purple-800',
    accent: '#8B5CF6'
  },
  LIGHT_BLUE: {
    name: 'Light Blue',
    primary: '#38BDF8',
    primaryHover: '#0EA5E9',
    light: '#F0F9FF',
    border: '#BAE6FD',
    text: '#0369A1',
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
    gradient: 'from-sky-400 to-blue-500',
    accent: '#7DD3FC'
  },
  SKY_BLUE: {
    name: 'Sky Blue',
    primary: '#0284C7',
    primaryHover: '#0369A1',
    light: '#F0F9FF',
    border: '#BAE6FD',
    text: '#075985',
    badge: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    gradient: 'from-cyan-500 to-blue-600',
    accent: '#38BDF8'
  },
  BLUE: {
    name: 'Blue',
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    light: '#EFF6FF',
    border: '#BFDBFE',
    text: '#1E40AF',
    badge: 'bg-blue-50 text-blue-800 border-blue-200',
    gradient: 'from-blue-600 to-indigo-700',
    accent: '#3B82F6'
  },
  DARK_BLUE: {
    name: 'Dark Blue',
    primary: '#1E3A8A',
    primaryHover: '#172554',
    light: '#EFF6FF',
    border: '#BFDBFE',
    text: '#1E3A8A',
    badge: 'bg-blue-100 text-blue-900 border-blue-300',
    gradient: 'from-blue-900 to-indigo-950',
    accent: '#1D4ED8'
  },
  LIGHT_PINK: {
    name: 'Light Pink',
    primary: '#F472B6',
    primaryHover: '#EC4899',
    light: '#FDF2F8',
    border: '#FBCFE8',
    text: '#9D174D',
    badge: 'bg-pink-50 text-pink-700 border-pink-200',
    gradient: 'from-pink-400 to-rose-500',
    accent: '#F9A8D4'
  },
  PINK: {
    name: 'Pink',
    primary: '#DB2777',
    primaryHover: '#BE185D',
    light: '#FDF2F8',
    border: '#FBCFE8',
    text: '#831843',
    badge: 'bg-pink-50 text-pink-800 border-pink-300',
    gradient: 'from-pink-600 to-fuchsia-700',
    accent: '#EC4899'
  },
  LIGHT_ORANGE: {
    name: 'Light Orange',
    primary: '#FB923C',
    primaryHover: '#F97316',
    light: '#FFF7ED',
    border: '#FFEDD5',
    text: '#9A3412',
    badge: 'bg-orange-50 text-orange-700 border-orange-200',
    gradient: 'from-orange-400 to-amber-500',
    accent: '#FDBA74'
  },
  DARK_ORANGE: {
    name: 'Dark Orange',
    primary: '#C2410C',
    primaryHover: '#9A3412',
    light: '#FFF7ED',
    border: '#FFEDD5',
    text: '#7C2D12',
    badge: 'bg-orange-100 text-orange-900 border-orange-300',
    gradient: 'from-orange-700 to-red-800',
    accent: '#EA580C'
  },
  GREEN: {
    name: 'Green',
    primary: '#16A34A',
    primaryHover: '#15803D',
    light: '#F0FDF4',
    border: '#BBF7D0',
    text: '#166534',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    gradient: 'from-emerald-600 to-green-700',
    accent: '#22C55E'
  },
  LIGHT_GREEN: {
    name: 'Light Green',
    primary: '#4ADE80',
    primaryHover: '#22C55E',
    light: '#F0FDF4',
    border: '#BBF7D0',
    text: '#15803D',
    badge: 'bg-green-50 text-green-700 border-green-200',
    gradient: 'from-green-400 to-emerald-500',
    accent: '#86EFAC'
  },
  GRAY: {
    name: 'Gray',
    primary: '#4B5563',
    primaryHover: '#374151',
    light: '#F3F4F6',
    border: '#E5E7EB',
    text: '#1F2937',
    badge: 'bg-slate-100 text-slate-800 border-slate-300',
    gradient: 'from-slate-700 to-gray-800',
    accent: '#6B7280'
  },
  AMBER: {
    name: 'Amber',
    primary: '#D97706',
    primaryHover: '#B45309',
    light: '#FFFBEB',
    border: '#FDE68A',
    text: '#92400E',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    gradient: 'from-amber-500 to-orange-600',
    accent: '#F59E0B'
  }
};

/**
 * All 18 Organizations with complete information & color palettes
 */
export const INITIAL_ORGANIZATIONS = [
  {
    id: 'org_uacsc',
    shortCode: 'UACSC',
    name: 'University of the Assumption Central Student Council',
    president: 'Garnett G. Tolentino',
    adviser: 'Dax Nathaniel Bondoc, MPA',
    college: 'University-Wide',
    category: 'Apex University Student Council',
    status: 'ACTIVE',
    paletteKey: 'AMBER',
    palette: COLOR_PALETTES.AMBER,
    color: 'from-amber-500 to-orange-600',
    description: 'The supreme governing student council representing the collective student body of the University of the Assumption.',
    eccKeyStatus: 'ACTIVE',
    eccKeyId: 'ecc_uacsc_2026',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'e1l_W3U0w7z0-gLqF6zX1gN1p5f5eY1m9P6m3K5j9w0',
      y: 'h4j8P2m9N1k3L5j7H9f1D3s5A7d9F1g3H5j7K9l1M3o'
    }
  },
  {
    id: 'org_aaa',
    shortCode: 'AAA',
    name: 'Architecture Association of Assumption',
    president: 'Aviane Del Rosario',
    adviser: 'Ar. Rhoel Q. Pineda',
    college: 'College of Engineering and Architecture',
    category: 'Academic RSO',
    status: 'ACTIVE',
    paletteKey: 'RED',
    palette: COLOR_PALETTES.RED,
    color: 'from-red-600 to-rose-700',
    description: 'Promoting architectural excellence, spatial innovation, and design leadership among Assumptionist architecture students.',
    eccKeyStatus: 'ACTIVE',
    eccKeyId: 'ecc_aaa_2026',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'x1_aaa_U0w7z0gLqF6zX1gN1p5f5eY1m9P6m3K5j9w0',
      y: 'y1_aaa_P2m9N1k3L5j7H9f1D3s5A7d9F1g3H5j7K9l1M3o'
    }
  },
  {
    id: 'org_bacc',
    shortCode: 'BACC',
    name: 'Business Administration College Council',
    president: 'Marian Alexis C. Mercado',
    adviser: 'Fidela R. Balajadia',
    college: 'College of Business Administration',
    category: 'College Council',
    status: 'ACTIVE',
    paletteKey: 'YELLOW',
    palette: COLOR_PALETTES.YELLOW,
    color: 'from-amber-500 to-yellow-600',
    description: 'Uniting business administration leaders through strategic management, ethical enterprise, and student empowerment.',
    eccKeyStatus: 'ACTIVE',
    eccKeyId: 'ecc_bacc_2026',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'x2_bacc_U0w7z0gLqF6zX1gN1p5f5eY1m9P6m3K5j9w0',
      y: 'y2_bacc_P2m9N1k3L5j7H9f1D3s5A7d9F1g3H5j7K9l1M3o'
    }
  },
  {
    id: 'org_bhs_phs',
    shortCode: 'BHS-PHS',
    name: 'Bachelor in Human Services - Peer Helpers Society',
    president: 'Steve Jake M. Regala',
    adviser: 'Amir N. Canlas, MAGC, RPM, RGC',
    college: 'College of Arts and Sciences',
    category: 'Academic & Civic RSO',
    status: 'ACTIVE',
    paletteKey: 'LIGHT_VIOLET',
    palette: COLOR_PALETTES.LIGHT_VIOLET,
    color: 'from-purple-500 to-violet-600',
    description: 'Providing student counseling support, mental health awareness, and peer companionship across all year levels.',
    eccKeyStatus: 'ACTIVE',
    eccKeyId: 'ecc_bhs_2026',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'x3_bhs_U0w7z0gLqF6zX1gN1p5f5eY1m9P6m3K5j9w0',
      y: 'y3_bhs_P2m9N1k3L5j7H9f1D3s5A7d9F1g3H5j7K9l1M3o'
    }
  },
  {
    id: 'org_batas',
    shortCode: 'BATAS',
    name: 'Brave Advocates for Truth And Service',
    president: 'Tricia Aika G. Hernandez',
    adviser: 'John Peter B. Adriano, RCrim, PhD',
    college: 'College of Criminology and Social Sciences',
    category: 'Academic RSO',
    status: 'ACTIVE',
    paletteKey: 'LIGHT_BLUE',
    palette: COLOR_PALETTES.LIGHT_BLUE,
    color: 'from-sky-400 to-blue-500',
    description: 'Championing justice, ethical law enforcement principles, social truth, and community crime prevention.',
    eccKeyStatus: 'ACTIVE',
    eccKeyId: 'ecc_batas_2026',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'x4_batas_U0w7z0gLqF6zX1gN1p5f5eY1m9P6m3K5j9w0',
      y: 'y4_batas_P2m9N1k3L5j7H9f1D3s5A7d9F1g3H5j7K9l1M3o'
    }
  },
  {
    id: 'org_charms',
    shortCode: 'CHARMS',
    name: 'Council of Hotel And Restaurant Management Students',
    president: 'Justine Luigi G. Vitangcul',
    adviser: 'Ms. Donna Marie P. Simbulan',
    college: 'College of Hospitality & Tourism Management',
    category: 'Academic RSO',
    status: 'ACTIVE',
    paletteKey: 'LIGHT_PINK',
    palette: COLOR_PALETTES.LIGHT_PINK,
    color: 'from-pink-400 to-rose-500',
    description: 'Cultivating world-class culinary arts, hospitable leadership, and tourism service excellence.',
    eccKeyStatus: 'ACTIVE',
    eccKeyId: 'ecc_charms_2026',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'x5_charms_U0w7z0gLqF6zX1gN1p5f5eY1m9P6m3K5j9w0',
      y: 'y5_charms_P2m9N1k3L5j7H9f1D3s5A7d9F1g3H5j7K9l1M3o'
    }
  },
  {
    id: 'org_create',
    shortCode: 'CREATE',
    name: 'College Representatives of Engineering and Architecture Towards Excellence',
    president: 'Shamel Marie S. Dantes',
    adviser: 'Engr. June C. Musngi',
    college: 'College of Engineering and Architecture',
    category: 'College Council',
    status: 'ACTIVE',
    paletteKey: 'LIGHT_ORANGE',
    palette: COLOR_PALETTES.LIGHT_ORANGE,
    color: 'from-orange-400 to-amber-500',
    description: 'Unifying engineering disciplines and architecture toward technical innovation and academic rigor.',
    eccKeyStatus: 'ACTIVE',
    eccKeyId: 'ecc_create_2026',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'x6_create_U0w7z0gLqF6zX1gN1p5f5eY1m9P6m3K5j9w0',
      y: 'y6_create_P2m9N1k3L5j7H9f1D3s5A7d9F1g3H5j7K9l1M3o'
    }
  },
  {
    id: 'org_icep',
    shortCode: 'ICEP',
    name: 'Institute of Computer Engineers of the Philippines',
    president: 'Meldion Elijah P. Torres',
    adviser: 'Engr. Ian Kenneth B. Yalung',
    college: 'College of Engineering and Architecture',
    category: 'Academic RSO',
    status: 'ACTIVE',
    paletteKey: 'SKY_BLUE',
    palette: COLOR_PALETTES.SKY_BLUE,
    color: 'from-cyan-500 to-blue-600',
    description: 'Advancing hardware systems, embedded engineering, microelectronics, and computer architecture mastery.',
    eccKeyStatus: 'ACTIVE',
    eccKeyId: 'ecc_icep_2026',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'x7_icep_U0w7z0gLqF6zX1gN1p5f5eY1m9P6m3K5j9w0',
      y: 'y7_icep_P2m9N1k3L5j7H9f1D3s5A7d9F1g3H5j7K9l1M3o'
    }
  },
  {
    id: 'org_jpia',
    shortCode: 'JPIA',
    name: 'Junior Philippine Institute of Accountants',
    president: 'Jedidiah P. Laxamana',
    adviser: 'Rosalinda E. Perez',
    college: 'College of Business Administration',
    category: 'Academic RSO',
    status: 'ACTIVE',
    paletteKey: 'BLUE',
    palette: COLOR_PALETTES.BLUE,
    color: 'from-blue-600 to-indigo-700',
    description: 'Fostering accounting excellence, financial governance, CPA board readiness, and fiscal integrity.',
    eccKeyStatus: 'ACTIVE',
    eccKeyId: 'ecc_jpia_2026',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'x8_jpia_U0w7z0gLqF6zX1gN1p5f5eY1m9P6m3K5j9w0',
      y: 'y8_jpia_P2m9N1k3L5j7H9f1D3s5A7d9F1g3H5j7K9l1M3o'
    }
  },
  {
    id: 'org_jppha',
    shortCode: 'JPPhA',
    name: 'Junior Philippine Pharmacists Association',
    president: 'Venice Krystel T. Punla',
    adviser: 'Pauline Lyzell G. Francisco',
    college: 'College of Nursing and Allied Medical Sciences',
    category: 'Academic RSO',
    status: 'ACTIVE',
    paletteKey: 'VIOLET',
    palette: COLOR_PALETTES.VIOLET,
    color: 'from-violet-600 to-purple-800',
    description: 'Promoting pharmacology precision, pharmaceutical research, patient care ethics, and drug discovery awareness.',
    eccKeyStatus: 'ACTIVE',
    eccKeyId: 'ecc_jppha_2026',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'x9_jppha_U0w7z0gLqF6zX1gN1p5f5eY1m9P6m3K5j9w0',
      y: 'y9_jppha_P2m9N1k3L5j7H9f1D3s5A7d9F1g3H5j7K9l1M3o'
    }
  },
  {
    id: 'org_lead',
    shortCode: 'LEAD',
    name: 'League of Educators Advocating for Development',
    president: 'Jerald F. Caballero',
    adviser: 'Steffy Jean T. Sengson, LPT',
    college: 'College of Education',
    category: 'Academic RSO',
    status: 'ACTIVE',
    paletteKey: 'DARK_BLUE',
    palette: COLOR_PALETTES.DARK_BLUE,
    color: 'from-blue-900 to-indigo-950',
    description: 'Shaping future visionary teachers, transformative pedagogy, literacy advocacies, and classroom excellence.',
    eccKeyStatus: 'ACTIVE',
    eccKeyId: 'ecc_lead_2026',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'x10_lead_U0w7z0gLqF6zX1gN1p5f5eY1m9P6m3K5j9w0',
      y: 'y10_lead_P2m9N1k3L5j7H9f1D3s5A7d9F1g3H5j7K9l1M3o'
    }
  },
  {
    id: 'org_ltsp',
    shortCode: 'LTSP',
    name: 'League of Tourism Students of the Philippines',
    president: 'Jeanelle Bianca C. Dionicio',
    adviser: 'Denzelle Kayla P. Sabado, MBA',
    college: 'College of Hospitality & Tourism Management',
    category: 'Academic RSO',
    status: 'ACTIVE',
    paletteKey: 'PINK',
    palette: COLOR_PALETTES.PINK,
    color: 'from-pink-600 to-fuchsia-700',
    description: 'Empowering eco-tourism champions, travel management innovators, and cultural heritage ambassadors.',
    eccKeyStatus: 'ACTIVE',
    eccKeyId: 'ecc_ltsp_2026',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'x11_ltsp_U0w7z0gLqF6zX1gN1p5f5eY1m9P6m3K5j9w0',
      y: 'y11_ltsp_P2m9N1k3L5j7H9f1D3s5A7d9F1g3H5j7K9l1M3o'
    }
  },
  {
    id: 'org_mcsa',
    shortCode: 'MCSA',
    name: 'Mass Communication Students Association',
    president: 'Yshine Marie S. Mapilisan',
    adviser: 'Mr. Dax Nathaniel M. Bondoc, MPA',
    college: 'College of Arts and Sciences',
    category: 'Academic RSO',
    status: 'ACTIVE',
    paletteKey: 'LIGHT_RED',
    palette: COLOR_PALETTES.LIGHT_RED,
    color: 'from-rose-500 to-red-600',
    description: 'Championing responsible journalism, broadcast media arts, digital storytelling, and media ethics.',
    eccKeyStatus: 'ACTIVE',
    eccKeyId: 'ecc_mcsa_2026',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'x12_mcsa_U0w7z0gLqF6zX1gN1p5f5eY1m9P6m3K5j9w0',
      y: 'y12_mcsa_P2m9N1k3L5j7H9f1D3s5A7d9F1g3H5j7K9l1M3o'
    }
  },
  {
    id: 'org_nsc',
    shortCode: 'NSC',
    name: 'Nursing Student Council',
    president: 'Aiona D. Mungcal',
    adviser: 'Cherry B. Lazatin RN, RPh, MAN, LPT',
    college: 'College of Nursing and Allied Medical Sciences',
    category: 'College Council',
    status: 'ACTIVE',
    paletteKey: 'GREEN',
    palette: COLOR_PALETTES.GREEN,
    color: 'from-emerald-600 to-green-700',
    description: 'Promoting compassionate health care, clinical mastery, patient advocacy, and nursing leadership.',
    eccKeyStatus: 'ACTIVE',
    eccKeyId: 'ecc_nsc_2026',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'x13_nsc_U0w7z0gLqF6zX1gN1p5f5eY1m9P6m3K5j9w0',
      y: 'y13_nsc_P2m9N1k3L5j7H9f1D3s5A7d9F1g3H5j7K9l1M3o'
    }
  },
  {
    id: 'org_pice',
    shortCode: 'PICE-UA',
    name: 'Philippine Institute of Civil Engineers - UA Student Chapter',
    president: 'Aislhandear M. Alfonso',
    adviser: 'Engr. Kris Roan B. Simbulan',
    college: 'College of Engineering and Architecture',
    category: 'Academic RSO',
    status: 'ACTIVE',
    paletteKey: 'DARK_ORANGE',
    palette: COLOR_PALETTES.DARK_ORANGE,
    color: 'from-orange-700 to-red-800',
    description: 'Building structural mastery, sustainable infrastructure design, geotechnical expertise, and civil engineering ethics.',
    eccKeyStatus: 'ACTIVE',
    eccKeyId: 'ecc_pice_2026',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'x14_pice_U0w7z0gLqF6zX1gN1p5f5eY1m9P6m3K5j9w0',
      y: 'y14_pice_P2m9N1k3L5j7H9f1D3s5A7d9F1g3H5j7K9l1M3o'
    }
  },
  {
    id: 'org_piie',
    shortCode: 'PIIE',
    name: 'Philippine Institute of Industrial Engineers',
    president: 'Paul Ian S. Arcega',
    adviser: 'Engr. Annie R. Balajadia',
    college: 'College of Engineering and Architecture',
    category: 'Academic RSO',
    status: 'ACTIVE',
    paletteKey: 'LIGHT_GREEN',
    palette: COLOR_PALETTES.LIGHT_GREEN,
    color: 'from-green-400 to-emerald-500',
    description: 'Optimizing industrial workflows, lean supply chains, operations research, and ergonomic engineering systems.',
    eccKeyStatus: 'ACTIVE',
    eccKeyId: 'ecc_piie_2026',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'x15_piie_U0w7z0gLqF6zX1gN1p5f5eY1m9P6m3K5j9w0',
      y: 'y15_piie_P2m9N1k3L5j7H9f1D3s5A7d9F1g3H5j7K9l1M3o'
    }
  },
  {
    id: 'org_psychsoc',
    shortCode: 'PsychSoc',
    name: 'Psychology Society',
    president: 'Steiven Codie P. Gonzales',
    adviser: 'Mr. Noli D. Franco, MMCJ, RPm',
    college: 'College of Arts and Sciences',
    category: 'Academic RSO',
    status: 'ACTIVE',
    paletteKey: 'SKY_BLUE',
    palette: COLOR_PALETTES.SKY_BLUE,
    color: 'from-cyan-500 to-blue-600',
    description: 'Advancing psychological research, behavioral insights, mental wellness campaigns, and community psychosocial support.',
    eccKeyStatus: 'ACTIVE',
    eccKeyId: 'ecc_psychsoc_2026',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'x16_psych_U0w7z0gLqF6zX1gN1p5f5eY1m9P6m3K5j9w0',
      y: 'y16_psych_P2m9N1k3L5j7H9f1D3s5A7d9F1g3H5j7K9l1M3o'
    }
  },
  {
    id: 'org_ssite',
    shortCode: 'SSITE',
    name: 'Student Society on Information Technology Education',
    president: 'Hannah Samantha Lising',
    adviser: 'Mark Anthony Madalipay',
    college: 'College of Information & Computing Sciences',
    category: 'Academic RSO',
    status: 'ACTIVE',
    paletteKey: 'GRAY',
    palette: COLOR_PALETTES.GRAY,
    color: 'from-slate-700 to-gray-800',
    description: 'Premier student organization fostering software engineering, cybersecurity, AI innovation, and IT education.',
    eccKeyStatus: 'ACTIVE',
    eccKeyId: 'ecc_ssite_2026',
    publicKeyJwk: {
      kty: 'EC',
      crv: 'P-256',
      x: 'f4h7J2l9N1m3P5q7S9u1W3y5A7c9E1g3I5k7M9o1Q3s',
      y: 'u6w8Y1a3C5e7G9i1K3m5O7q9S1u3W5y7A9c1E3g5I7k'
    }
  }
];

/**
 * Initial Events — seeded with UACSC events and flagship events for all RSOs
 */
export const INITIAL_EVENTS = [
  // --- UACSC Events (Completed & Upcoming) ---
  {
    id: 'evt_uacsc_pamuklat',
    organizationId: 'org_uacsc',
    title: 'Pamuklat 2026: UANexus',
    category: 'University Assembly',
    status: 'COMPLETED',
    evaluationOpen: false,
    date: '2026-08-20',
    time: '08:00 AM - 04:00 PM',
    venue: 'University Gymnasium & Quadrangle',
    modality: 'In-Person',
    speakers: ['Rev. Fr. Joselito Henson (University President)', 'Garnett G. Tolentino (UACSC President)'],
    description: 'Flagship welcoming assembly reuniting all college departments, introducing student leaders, and kicking off the academic year.',
    expectedAttendees: 1200,
    eccEncryptionRequired: true,
    tags: ['Tradition', 'Assembly', 'Welcome']
  },
  {
    id: 'evt_uacsc_induction',
    organizationId: 'org_uacsc',
    title: 'UACSC and RSO Induction Ceremony',
    category: 'Leadership & Governance',
    status: 'COMPLETED',
    evaluationOpen: false,
    date: '2026-09-05',
    time: '09:00 AM - 12:00 PM',
    venue: 'University Grand Auditorium',
    modality: 'In-Person',
    speakers: ['Ms. Precious Bernadette Estrada (OSA Director)', 'Dax Nathaniel Bondoc, MPA'],
    description: 'Formal turnover rites and oath-taking ceremony for elected UACSC officers and recognized student organization leaders.',
    expectedAttendees: 250,
    eccEncryptionRequired: true,
    tags: ['Leadership', 'Governance', 'Oath-Taking']
  },
  {
    id: 'evt_uacsc_teachers_day',
    organizationId: 'org_uacsc',
    title: 'Teachers Day Celebration: Pasasalamat at Parangal',
    category: 'Community Celebration',
    status: 'COMPLETED',
    evaluationOpen: false,
    date: '2026-10-05',
    time: '01:00 PM - 05:00 PM',
    venue: 'Cardinal Santos Auditorium',
    modality: 'In-Person',
    speakers: ['Garnett G. Tolentino', 'Faculty Representative Keynote'],
    description: 'Heartfelt university-wide tribute honoring dedicated educators through cultural performances and recognitions.',
    expectedAttendees: 600,
    eccEncryptionRequired: true,
    tags: ['Celebration', 'Gratitude', 'Faculty']
  },
  {
    id: 'evt_uacsc_religare',
    organizationId: 'org_uacsc',
    title: 'Religare 2026: Faith & Student Solidarity Retreat',
    category: 'Spiritual Formation',
    status: 'COMPLETED',
    evaluationOpen: false,
    date: '2026-10-22',
    time: '07:30 AM - 04:30 PM',
    venue: 'UA Chapel & Pastoral Center',
    modality: 'In-Person',
    speakers: ['Campus Ministry Team', 'Guest Retreat Facilitators'],
    description: 'Annual spiritual journey of prayer, mindfulness, and reflection reinforcing the Catholic identity of Assumptionists.',
    expectedAttendees: 400,
    eccEncryptionRequired: true,
    tags: ['Faith', 'Spiritual', 'Assumptionist']
  },
  {
    id: 'evt_uacsc_capascuan',
    organizationId: 'org_uacsc',
    title: 'Capascuan 2026: Christmas Festival of Lights',
    category: 'Cultural & Holiday',
    status: 'UPCOMING',
    evaluationOpen: true, // Open for early feedback and registration evaluation
    date: '2026-11-13',
    time: '05:00 PM - 10:00 PM',
    venue: 'University Grounds & Athletic Field',
    modality: 'In-Person',
    speakers: ['UACSC Executive Board', 'Campus Ministry'],
    description: 'The premier Christmas festival featuring giant lantern lighting, departmental carol competitions, and community fellowship.',
    expectedAttendees: 1500,
    eccEncryptionRequired: true,
    tags: ['Christmas', 'Festival', 'Tradition']
  },
  {
    id: 'evt_uacsc_synodality',
    organizationId: 'org_uacsc',
    title: 'Synodality: Walking Together in Truth and Dialogue',
    category: 'Institutional Dialogue',
    status: 'UPCOMING',
    evaluationOpen: false,
    date: '2026-11-26',
    time: '01:00 PM - 04:30 PM',
    venue: 'University Grand Auditorium',
    modality: 'Hybrid',
    speakers: ['Archdiocesan Representatives', 'Student Leadership Council'],
    description: 'University-wide consultative forum engaging students, administration, and faculty in collaborative institutional synodality.',
    expectedAttendees: 500,
    eccEncryptionRequired: true,
    tags: ['Dialogue', 'Synodality', 'Leadership']
  },

  // --- AAA Events ---
  {
    id: 'evt_aaa_event_1',
    organizationId: 'org_aaa',
    title: 'ArchVisions: Sustainable Tropical Architecture Summit',
    category: 'Academic Symposium',
    status: 'ACTIVE',
    evaluationOpen: true,
    date: '2026-11-18',
    time: '09:00 AM - 03:00 PM',
    venue: 'Architecture Design Studio 3',
    modality: 'In-Person',
    speakers: ['Ar. Rhoel Q. Pineda (AAA Adviser)', 'Guest Urban Planner'],
    description: 'Hands-on symposium exploring vernacular materials, climate-resilient blueprints, and BIM modeling.',
    expectedAttendees: 120,
    eccEncryptionRequired: true,
    tags: ['Architecture', 'Design', 'Sustainability']
  },
  {
    id: 'evt_aaa_event_2',
    organizationId: 'org_aaa',
    title: 'Scale & Structure: Architectural Drafting Workshop',
    category: 'Technical Workshop',
    status: 'UPCOMING',
    evaluationOpen: false,
    date: '2026-12-02',
    time: '01:00 PM - 05:00 PM',
    venue: 'CICS CAD Laboratory',
    modality: 'In-Person',
    speakers: ['Aviane Del Rosario (AAA President)', 'Senior Drafting Guild'],
    description: 'Advanced masterclass on physical modeling, scale precision, and portfolio rendering techniques.',
    expectedAttendees: 80,
    eccEncryptionRequired: true,
    tags: ['Drafting', 'Workshop', 'Portfolio']
  },

  // --- BACC Events ---
  {
    id: 'evt_bacc_event_1',
    organizationId: 'org_bacc',
    title: 'BizCon 2026: Future of Entrepreneurial Strategy & Fintech',
    category: 'Business Conference',
    status: 'ACTIVE',
    evaluationOpen: true,
    date: '2026-11-20',
    time: '08:30 AM - 03:30 PM',
    venue: 'University Grand Auditorium',
    modality: 'In-Person',
    speakers: ['Marian Alexis C. Mercado (BACC President)', 'Fidela R. Balajadia (BACC Adviser)'],
    description: 'Flagship business conference featuring startup pitches, modern corporate finance, and e-commerce analytics.',
    expectedAttendees: 200,
    eccEncryptionRequired: true,
    tags: ['Business', 'Finance', 'Strategy']
  },
  {
    id: 'evt_bacc_event_2',
    organizationId: 'org_bacc',
    title: 'Corporate Leadership & Case Study Challenge',
    category: 'Competition',
    status: 'UPCOMING',
    evaluationOpen: false,
    date: '2026-12-05',
    time: '01:00 PM - 05:00 PM',
    venue: 'BBA Case Room',
    modality: 'In-Person',
    speakers: ['Top Corporate Mentors'],
    description: 'Inter-year case analysis competition solving real-world supply chain and branding crises.',
    expectedAttendees: 100,
    eccEncryptionRequired: true,
    tags: ['Competition', 'CaseStudy', 'Leadership']
  },

  // --- SSITE Events ---
  {
    id: 'evt_ssite_event_1',
    organizationId: 'org_ssite',
    title: 'HackFlow 2026: Cryptography, Web3 & AI Hackathon',
    category: 'Hackathon & Tech',
    status: 'ACTIVE',
    evaluationOpen: true,
    date: '2026-11-15',
    time: '08:00 AM - 06:00 PM',
    venue: 'CICS Innovation Hub & Online',
    modality: 'Hybrid',
    speakers: ['Hannah Samantha Lising (SSITE President)', 'Mark Anthony Madalipay (SSITE Adviser)'],
    description: '24-hour innovation challenge building decentralized, privacy-first web applications using Elliptic Curve Cryptography.',
    expectedAttendees: 180,
    eccEncryptionRequired: true,
    tags: ['Tech', 'Hackathon', 'ECC', 'Cybersecurity']
  },
  {
    id: 'evt_ssite_event_2',
    organizationId: 'org_ssite',
    title: 'Cloud Architectures & DevOps Bootcamp',
    category: 'Technical Workshop',
    status: 'UPCOMING',
    evaluationOpen: false,
    date: '2026-12-10',
    time: '01:00 PM - 05:00 PM',
    venue: 'CICS Lab 4',
    modality: 'In-Person',
    speakers: ['Certified AWS Solutions Architect'],
    description: 'Intensive hands-on lab deploying scalable containers, CI/CD pipelines, and serverless backends.',
    expectedAttendees: 90,
    eccEncryptionRequired: true,
    tags: ['Cloud', 'DevOps', 'Containers']
  }
];
