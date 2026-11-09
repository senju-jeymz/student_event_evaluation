import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { INITIAL_ORGANIZATIONS, INITIAL_EVENTS } from '../../src/config/organizationConfig.js';
import { MOCK_RESPONSES, MOCK_ACTION_PLANS, MOCK_AUDIT_LOGS, MOCK_FORM_TEMPLATES } from '../../src/data/mockData.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Organizations
  console.log('Seeding organizations...');
  for (const org of INITIAL_ORGANIZATIONS) {
    await prisma.organization.upsert({
      where: { id: org.id },
      update: {
        name: org.name,
        shortCode: org.shortCode,
        category: org.category,
        college: org.college,
        president: org.president,
        adviser: org.adviser || '',
        paletteKey: org.paletteKey || 'GRAY',
        palette: JSON.stringify(org.palette || {}),
        color: org.color || '',
        status: org.status || 'ACTIVE',
        eccKeyStatus: org.eccKeyStatus || 'ACTIVE',
        eccKeyId: org.eccKeyId || null,
        publicKeyJwk: org.publicKeyJwk ? JSON.stringify(org.publicKeyJwk) : null
      },
      create: {
        id: org.id,
        name: org.name,
        shortCode: org.shortCode,
        category: org.category,
        college: org.college,
        president: org.president,
        adviser: org.adviser || '',
        paletteKey: org.paletteKey || 'GRAY',
        palette: JSON.stringify(org.palette || {}),
        color: org.color || '',
        status: org.status || 'ACTIVE',
        eccKeyStatus: org.eccKeyStatus || 'ACTIVE',
        eccKeyId: org.eccKeyId || null,
        publicKeyJwk: org.publicKeyJwk ? JSON.stringify(org.publicKeyJwk) : null
      }
    });
  }

  // 2. Seed Users
  console.log('Seeding users & credentials...');
  const defaultPassword = await bcrypt.hash('password123', 10);

  const usersToSeed = [
    {
      id: 'usr_admin',
      username: 'osa.admin',
      name: 'Ms. Precious Bernadette Estrada',
      email: 'admin.osa@ua.edu.ph',
      password: defaultPassword,
      role: 'ADMIN',
      organizationId: null,
      avatar: '👩‍🏫',
      title: 'Director of Student Affairs & Services (OSA)'
    },
    {
      id: 'usr_uacsc',
      username: 'uacsc.president',
      name: 'Garnett G. Tolentino',
      email: 'president.uacsc@ua.edu.ph',
      password: defaultPassword,
      role: 'UACSC_OFFICER',
      organizationId: 'org_uacsc',
      avatar: '🏛️',
      title: 'UACSC President',
      adviser: 'Dax Nathaniel Bondoc, MPA'
    },
    {
      id: 'usr_aaa_officer',
      username: 'aviane.delrosario',
      name: 'Aviane Del Rosario',
      email: 'lead.aaa@ua.edu.ph',
      password: defaultPassword,
      role: 'RSO_OFFICER',
      organizationId: 'org_aaa',
      avatar: '📐',
      title: 'AAA President',
      adviser: 'Ar. Rhoel Q. Pineda'
    },
    {
      id: 'usr_bacc_officer',
      username: 'bacc.president',
      name: 'Marian Alexis C. Mercado',
      email: 'lead.bacc@ua.edu.ph',
      password: defaultPassword,
      role: 'RSO_OFFICER',
      organizationId: 'org_bacc',
      avatar: '📈',
      title: 'BACC President',
      adviser: 'Fidela R. Balajadia'
    },
    {
      id: 'org_bhs_phs',
      username: 'bhs.president',
      name: 'Steve Jake M. Regala',
      email: 'lead.bhs@ua.edu.ph',
      password: defaultPassword,
      role: 'RSO_OFFICER',
      organizationId: 'org_bhs_phs',
      avatar: '🩺',
      title: 'BHS President',
      adviser: 'Amir N. Canlas, MAGC, RPM, RGC'
    },
    {
      id: 'org_batas',
      username: 'batas.president',
      name: 'Tricia Aika G. Hernandez',
      email: 'lead.batas@ua.edu.ph',
      password: defaultPassword,
      role: 'RSO_OFFICER',
      organizationId: 'org_batas',
      avatar: '⚖️',
      title: 'Batas President',
      adviser: 'John Peter B. Adriano, RCrim, PhDC'
    },
    {
      id: 'org_charms',
      username: 'charms.president',
      name: 'Justine Luigi G. Vitangcul',
      email: 'lead.charms@ua.edu.ph',
      password: defaultPassword,
      role: 'RSO_OFFICER',
      organizationId: 'org_charms',
      avatar: '🛎️',
      title: 'CHARMS President',
      adviser: 'Ms. Donna Marie P. Simbulan'
    },
    {
      id: 'org_create',
      username: 'create.president',
      name: 'Shamel Marie S. Dantes',
      email: 'lead.create@ua.edu.ph',
      password: defaultPassword,
      role: 'RSO_OFFICER',
      organizationId: 'org_create',
      avatar: '🏗️',
      title: 'CREATE President',
      adviser: 'Engr. June C. Musngi'
    },
    {
      id: 'org_icep',
      username: 'icep.president',
      name: 'Meldion Elijah P. Torres',
      email: 'lead.icep@ua.edu.ph',
      password: defaultPassword,
      role: 'RSO_OFFICER',
      organizationId: 'org_icep',
      avatar: '⚡',
      title: 'ICEP President',
      adviser: 'Engr. Ian Kenneth B. Yalung'
    },
    {
      id: 'org_jpia',
      username: 'jpia.president',
      name: 'Jedidiah P. Laxamana',
      email: 'lead.jpia@ua.edu.ph',
      password: defaultPassword,
      role: 'RSO_OFFICER',
      organizationId: 'org_jpia',
      avatar: '📊',
      title: 'JPIA President',
      adviser: 'Rosalinda E. Perez'
    },
    {
      id: 'org_jppha',
      username: 'jppha.president',
      name: 'Venice Krystel T. Punla',
      email: 'lead.jppha@ua.edu.ph',
      password: defaultPassword,
      role: 'RSO_OFFICER',
      organizationId: 'org_jppha',
      avatar: '💊',
      title: 'JPPhA President',
      adviser: 'Pauline Lyzell G. Francisco'
    },
    {
      id: 'org_lead',
      username: 'lead.president',
      name: 'Jerald F. Caballero',
      email: 'lead.lead@ua.edu.ph',
      password: defaultPassword,
      role: 'RSO_OFFICER',
      organizationId: 'org_lead',
      avatar: '🌱',
      title: 'LEAD President',
      adviser: 'Steffy Jean T. Sengson, LPT'
    },
    {
      id: 'org_ltsp',
      username: 'ltsp.president',
      name: 'Jeanelle Bianca C. Dionicio',
      email: 'lead.ltsp@ua.edu.ph',
      password: defaultPassword,
      role: 'RSO_OFFICER',
      organizationId: 'org_ltsp',
      avatar: '✈️',
      title: 'LTSP President',
      adviser: 'Denzelle Kayla P. Sabado, MBA'
    },
    {
      id: 'org_mcsa',
      username: 'mcsa.president',
      name: 'Yshine Marie S. Mapilisan',
      email: 'lead.mcsa@ua.edu.ph',
      password: defaultPassword,
      role: 'RSO_OFFICER',
      organizationId: 'org_mcsa',
      avatar: '🎙️',
      title: 'MCSA President',
      adviser: 'Mr. Dax Nathaniel M. Bondoc, MPA'
    },
    {
      id: 'org_nsc',
      username: 'nsc.president',
      name: 'Aiona D. Mungcal',
      email: 'lead.nsc@ua.edu.ph',
      password: defaultPassword,
      role: 'RSO_OFFICER',
      organizationId: 'org_nsc',
      avatar: '🔬',
      title: 'NSC President',
      adviser: 'Cherry B. Lazatin RN, RPh, MAN, LPT'
    },
    {
      id: 'org_pice',
      username: 'pice.president',
      name: 'Aislhandear M. Alfonso',
      email: 'lead.pice@ua.edu.ph',
      password: defaultPassword,
      role: 'RSO_OFFICER',
      organizationId: 'org_pice',
      avatar: '🌉',
      title: 'PICE-UA President',
      adviser: 'Engr. Kris Roan B. Simbulan'
    },
    {
      id: 'org_piie',
      username: 'piie.president',
      name: 'Paul Ian S. Arcega',
      email: 'lead.piie@ua.edu.ph',
      password: defaultPassword,
      role: 'RSO_OFFICER',
      organizationId: 'org_piie',
      avatar: '⚙️',
      title: 'PIIE President',
      adviser: 'Engr. Annie R. Balajadia'
    },
    {
      id: 'org_psychsoc',
      username: 'psychsoc.president',
      name: 'Steiven Codie P. Gonzales',
      email: 'lead.psychsoc@ua.edu.ph',
      password: defaultPassword,
      role: 'RSO_OFFICER',
      organizationId: 'org_psychsoc',
      avatar: '🧠',
      title: 'PsychSoc President',
      adviser: 'Mr. Noli D. Franco, MMCJ, RPm'
    },
    {
      id: 'org_ssite',
      username: 'ssite.president',
      name: 'Hannah Samantha Lising',
      email: 'lead.ssite@ua.edu.ph',
      password: defaultPassword,
      role: 'RSO_OFFICER',
      organizationId: 'org_ssite',
      avatar: '💻',
      title: 'SSITE President',
      adviser: 'Mark Anthony Madalipay'
    },
    {
      id: 'usr_student_1',
      username: 'student.leif',
      name: 'Leif Joshua Infante',
      email: 'leif.infante@student.ua.edu.ph',
      password: defaultPassword,
      role: 'STUDENT',
      studentId: '2023-10492-CS',
      department: 'College of Information & Computing Sciences',
      yearLevel: '3rd Year',
      avatar: '🎓'
    },
    {
      id: 'usr_student_2',
      username: 'student.bea',
      name: 'Bea Clarisse Mendoza',
      email: 'bea.mendoza@student.ua.edu.ph',
      password: defaultPassword,
      role: 'STUDENT',
      studentId: '2024-08215-BA',
      department: 'College of Business Administration',
      yearLevel: '2nd Year',
      avatar: '🎒'
    }
  ];

  for (const user of usersToSeed) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: user,
      create: user
    });
  }

  // 3. Seed Events
  console.log('Seeding events...');
  for (const evt of INITIAL_EVENTS) {
    await prisma.event.upsert({
      where: { id: evt.id },
      update: {
        organizationId: evt.organizationId,
        title: evt.title,
        category: evt.category || 'General',
        date: evt.date,
        time: evt.time || '01:00 PM - 05:00 PM',
        venue: evt.venue,
        modality: evt.modality || 'In-Person',
        speakers: JSON.stringify(evt.speakers || []),
        tags: JSON.stringify(evt.tags || []),
        description: evt.description || '',
        expectedAttendees: evt.expectedAttendees || 100,
        evaluationOpen: evt.evaluationOpen !== undefined ? evt.evaluationOpen : true,
        eccEncryptionRequired: evt.eccEncryptionRequired !== undefined ? evt.eccEncryptionRequired : true,
        status: evt.status || 'ACTIVE'
      },
      create: {
        id: evt.id,
        organizationId: evt.organizationId,
        title: evt.title,
        category: evt.category || 'General',
        date: evt.date,
        time: evt.time || '01:00 PM - 05:00 PM',
        venue: evt.venue,
        modality: evt.modality || 'In-Person',
        speakers: JSON.stringify(evt.speakers || []),
        tags: JSON.stringify(evt.tags || []),
        description: evt.description || '',
        expectedAttendees: evt.expectedAttendees || 100,
        evaluationOpen: evt.evaluationOpen !== undefined ? evt.evaluationOpen : true,
        eccEncryptionRequired: evt.eccEncryptionRequired !== undefined ? evt.eccEncryptionRequired : true,
        status: evt.status || 'ACTIVE'
      }
    });
  }

  // 4. Seed Evaluations
  console.log('Seeding initial evaluations...');
  for (const resp of MOCK_RESPONSES) {
    await prisma.evaluation.upsert({
      where: { id: resp.id },
      update: {
        eventId: resp.eventId,
        organizationId: resp.organizationId,
        studentId: resp.studentId || null,
        fullName: resp.fullName || null,
        department: resp.department || '',
        yearLevel: resp.yearLevel || '',
        modality: resp.modality || 'In-Person',
        isAnonymous: resp.isAnonymous || false,
        ratings: JSON.stringify(resp.ratings || {}),
        isEncrypted: resp.isEncrypted || false,
        comments: typeof resp.comments === 'object' ? JSON.stringify(resp.comments) : (resp.comments || ''),
        encryptedBundle: resp.encryptedBundle ? JSON.stringify(resp.encryptedBundle) : null,
        decryptedSample: resp.decryptedSample ? JSON.stringify(resp.decryptedSample) : null,
        verificationCode: resp.verificationCode,
        signature: resp.signature,
        actionPlanStatus: resp.actionPlanStatus || 'IN_REVIEW',
        submittedAt: new Date(resp.submittedAt)
      },
      create: {
        id: resp.id,
        eventId: resp.eventId,
        organizationId: resp.organizationId,
        studentId: resp.studentId || null,
        fullName: resp.fullName || null,
        department: resp.department || '',
        yearLevel: resp.yearLevel || '',
        modality: resp.modality || 'In-Person',
        isAnonymous: resp.isAnonymous || false,
        ratings: JSON.stringify(resp.ratings || {}),
        isEncrypted: resp.isEncrypted || false,
        comments: typeof resp.comments === 'object' ? JSON.stringify(resp.comments) : (resp.comments || ''),
        encryptedBundle: resp.encryptedBundle ? JSON.stringify(resp.encryptedBundle) : null,
        decryptedSample: resp.decryptedSample ? JSON.stringify(resp.decryptedSample) : null,
        verificationCode: resp.verificationCode,
        signature: resp.signature,
        actionPlanStatus: resp.actionPlanStatus || 'IN_REVIEW',
        submittedAt: new Date(resp.submittedAt)
      }
    });
  }

  // 5. Seed Action Plans
  console.log('Seeding action plans...');
  for (const plan of MOCK_ACTION_PLANS) {
    await prisma.actionPlan.upsert({
      where: { id: plan.id },
      update: {
        organizationId: plan.organizationId,
        eventId: plan.eventId || null,
        title: plan.title,
        originFeedback: plan.originFeedback || '',
        assignedTo: plan.assignedTo || '',
        dueDate: plan.dueDate || '',
        status: plan.status || 'IN_PROGRESS'
      },
      create: {
        id: plan.id,
        organizationId: plan.organizationId,
        eventId: plan.eventId || null,
        title: plan.title,
        originFeedback: plan.originFeedback || '',
        assignedTo: plan.assignedTo || '',
        dueDate: plan.dueDate || '',
        status: plan.status || 'IN_PROGRESS'
      }
    });
  }

  // 6. Seed Audit Logs
  console.log('Seeding audit logs...');
  for (const log of MOCK_AUDIT_LOGS) {
    await prisma.auditLog.upsert({
      where: { id: log.id },
      update: {
        action: log.action,
        severity: log.severity,
        actor: log.actor,
        actorRole: log.actorRole,
        organizationId: log.organizationId,
        details: log.details,
        timestamp: new Date(log.timestamp)
      },
      create: {
        id: log.id,
        action: log.action,
        severity: log.severity,
        actor: log.actor,
        actorRole: log.actorRole,
        organizationId: log.organizationId,
        details: log.details,
        timestamp: new Date(log.timestamp)
      }
    });
  }

  console.log('✅ Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

