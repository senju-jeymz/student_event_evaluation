import http from 'http';
import { spawn } from 'child_process';

const serverProcess = spawn('node', ['server/src/server.js'], {
  stdio: 'inherit'
});

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function request(path, options = {}) {
  const url = `http://localhost:5000${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

async function runTests() {
  console.log('⏳ Waiting for server to initialize...');
  await delay(2000);

  try {
    // 1. Health check
    console.log('TEST 1: Health check');
    const health = await request('/api/health');
    console.log('Health status:', health.status, health.data?.system);
    if (health.status !== 200) throw new Error('Health check failed');

    // 2. Login - Aviane Del Rosario (AAA President)
    console.log('\nTEST 2: Login - Aviane Del Rosario (AAA President)');
    const loginAaa = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'aviane.delrosario', password: 'password123' })
    });
    console.log('AAA Login response status:', loginAaa.status);
    console.log('User Name:', loginAaa.data?.user?.name);
    console.log('User Role:', loginAaa.data?.user?.role);
    console.log('User Organization:', loginAaa.data?.user?.organizationId);
    if (loginAaa.data?.user?.organizationId !== 'org_aaa') throw new Error('AAA Org ID mismatch');
    const aaaToken = loginAaa.data?.token;

    // 3. Login - Ms. Precious Bernadette Estrada (OSA Admin)
    console.log('\nTEST 3: Login - Ms. Precious Bernadette Estrada (OSA Admin)');
    const loginAdmin = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'osa.admin', password: 'password123' })
    });
    console.log('OSA Admin Login status:', loginAdmin.status);
    console.log('Admin Name:', loginAdmin.data?.user?.name);
    console.log('Admin Role:', loginAdmin.data?.user?.role);
    if (loginAdmin.data?.user?.role !== 'ADMIN') throw new Error('Admin role mismatch');
    const adminToken = loginAdmin.data?.token;

    // 4. Login - Garnett G. Tolentino (UACSC President)
    console.log('\nTEST 4: Login - Garnett G. Tolentino (UACSC President)');
    const loginUacsc = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'uacsc.president', password: 'password123' })
    });
    console.log('UACSC Login status:', loginUacsc.status);
    console.log('UACSC Role:', loginUacsc.data?.user?.role);
    if (loginUacsc.data?.user?.role !== 'UACSC_OFFICER') throw new Error('UACSC role mismatch');

    // 5. Test Invalid Login
    console.log('\nTEST 5: Invalid Login (Wrong Password)');
    const loginFail = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'aviane.delrosario', password: 'wrongpassword' })
    });
    console.log('Invalid login status:', loginFail.status, '(Expected 401)');
    if (loginFail.status !== 401) throw new Error('Invalid login was not rejected');

    // 6. Test Organizations list
    console.log('\nTEST 6: Organizations List');
    const orgs = await request('/api/organizations');
    console.log('Fetched organizations count:', orgs.data?.length);
    if (!orgs.data || orgs.data.length < 18) throw new Error('Expected at least 18 organizations');

    // 7. Test Events list and Event creation
    console.log('\nTEST 7: Events List & Creation');
    const events = await request('/api/events');
    console.log('Initial events count:', events.data?.length);

    const newEvt = await request('/api/events', {
      method: 'POST',
      headers: { Authorization: `Bearer ${aaaToken}` },
      body: JSON.stringify({
        title: 'AAA Annual Architecture Blueprint Expo 2026',
        organizationId: 'org_aaa',
        category: 'Exhibition & Seminar',
        date: '2026-11-25',
        venue: 'San Guillermo Hall Gallery',
        modality: 'In-Person',
        speakers: ['Ar. Rhoel Q. Pineda', 'Aviane Del Rosario'],
        tags: ['Architecture', 'Design', 'AAA']
      })
    });
    console.log('Event created:', newEvt.data?.id, newEvt.data?.title);
    if (newEvt.status !== 201) throw new Error('Event creation failed');

    // 8. Test Evaluation submission & verification
    console.log('\nTEST 8: Evaluation Submission & Digital Verification Slip');
    const evalSubmission = await request('/api/evaluations', {
      method: 'POST',
      body: JSON.stringify({
        eventId: newEvt.data.id,
        organizationId: 'org_aaa',
        studentId: '2023-99999-AR',
        fullName: 'Juan Dela Cruz',
        department: 'College of Architecture & Fine Arts',
        yearLevel: '4th Year',
        modality: 'In-Person',
        isAnonymous: false,
        ratings: {
          program: { objectives: 5, relevance: 5, activityEngagement: 5, timeManagement: 5 },
          speakers: { mastery: 5, delivery: 5, qaHandling: 5 },
          logistics: { registration: 5, venueAudioVisual: 5, committeeHelpfulness: 5 },
          overall: 5,
          recommendScore: 10
        },
        isEncrypted: false,
        comments: {
          highlights: 'Incredible architectural models and design critiques.',
          improvements: 'More seating near the 3D printer booths.',
          futureTopics: 'Parametric design & sustainable urban planning.'
        }
      })
    });
    console.log('Evaluation submitted ID:', evalSubmission.data?.id);
    console.log('Verification Code:', evalSubmission.data?.verificationCode);
    console.log('ECDSA Signature:', evalSubmission.data?.signature);
    if (evalSubmission.status !== 201) throw new Error('Evaluation submission failed');

    // Verify Certificate
    const verifyResult = await request(`/api/evaluations/verify/${evalSubmission.data.verificationCode}`);
    console.log('Certificate Verification Result:', verifyResult.data?.valid, verifyResult.data?.message);
    if (!verifyResult.data?.valid) throw new Error('Certificate verification failed');

    // 9. Test Action Plan creation
    console.log('\nTEST 9: Action Plan Creation');
    const actionPlan = await request('/api/action-plans', {
      method: 'POST',
      headers: { Authorization: `Bearer ${aaaToken}` },
      body: JSON.stringify({
        organizationId: 'org_aaa',
        eventId: newEvt.data.id,
        title: 'Add auxiliary power benches and extra seating for scale models',
        assignedTo: 'AAA Logistics Committee',
        dueDate: '2026-12-05',
        originFeedback: 'More seating near the 3D printer booths.'
      })
    });
    console.log('Action plan created:', actionPlan.data?.id, actionPlan.data?.title);
    if (actionPlan.status !== 201) throw new Error('Action plan creation failed');

    // 10. Test Audit Logs
    console.log('\nTEST 10: Security Audit Logs');
    const logs = await request('/api/crypto/audit-logs');
    console.log('Audit logs recorded:', logs.data?.length);

    console.log('\n🎉 ALL BACKEND TESTS PASSED SUCCESSFULLY! 100% OPERATIONAL.');
  } catch (err) {
    console.error('\n❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    serverProcess.kill();
  }
}

runTests();

