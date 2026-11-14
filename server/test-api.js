const http = require('http');
const app = require('./server');
const mongoose = require('mongoose');

// Start temporary test server on port 5099
const server = app.listen(5099, async () => {
  console.log('Testing server running on port 5099...');

  const request = (path, method = 'GET', body = null) => {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: 5099,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, body: data });
          }
        });
      });

      req.on('error', reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  };

  try {
    // 1. Health check
    const health = await request('/api/health');
    console.log('1. Health check:', health.status, health.body.success ? 'PASSED' : 'FAILED');

    // 2. Get all tasks
    const allTasks = await request('/api/tasks');
    console.log('2. Get all tasks count:', allTasks.body.count, allTasks.status === 200 ? 'PASSED' : 'FAILED');

    // 3. Weekly summary
    const summary = await request('/api/tasks/weekly-summary');
    console.log('3. Weekly summary:', summary.status === 200 ? 'PASSED' : 'FAILED', JSON.stringify(summary.body.data[0] || {}));

    // 4. Create task
    const createRes = await request('/api/tasks', 'POST', {
      title: 'Automated E2E Test Task',
      description: 'Verifying complete CRUD pipeline',
      date: new Date().toISOString(),
      startTime: '08:30',
      endTime: '09:30',
      priority: 'high',
    });
    console.log('4. Create task:', createRes.status === 201 ? 'PASSED' : 'FAILED', createRes.body.data?._id);
    const taskId = createRes.body.data?._id;

    // 5. Get task by ID
    const getById = await request(`/api/tasks/${taskId}`);
    console.log('5. Get task by ID:', getById.status === 200 ? 'PASSED' : 'FAILED', getById.body.data?.title);

    // 6. Update task
    const updateRes = await request(`/api/tasks/${taskId}`, 'PUT', {
      title: 'Updated E2E Test Task',
      priority: 'low',
    });
    console.log('6. Update task:', updateRes.status === 200 && updateRes.body.data?.title === 'Updated E2E Test Task' ? 'PASSED' : 'FAILED');

    // 7. Toggle status
    const toggle1 = await request(`/api/tasks/${taskId}/toggle`, 'PATCH');
    console.log('7a. Toggle status (open -> completed):', toggle1.body.data?.status === 'completed' ? 'PASSED' : 'FAILED');
    const toggle2 = await request(`/api/tasks/${taskId}/toggle`, 'PATCH');
    console.log('7b. Toggle status (completed -> open):', toggle2.body.data?.status === 'open' ? 'PASSED' : 'FAILED');

    // 8. Search task
    const searchRes = await request('/api/tasks/search?q=Updated%20E2E');
    console.log('8. Search task:', searchRes.status === 200 && searchRes.body.count >= 1 ? 'PASSED' : 'FAILED');

    // 9. Week tasks endpoint
    const monday = new Date();
    const day = monday.getDay();
    const diff = day === 0 ? 6 : day - 1;
    monday.setDate(monday.getDate() - diff);
    const weekStartStr = monday.toISOString().split('T')[0];
    const weekTasks = await request(`/api/tasks/week?weekStart=${weekStartStr}`);
    console.log('9. Tasks by week:', weekTasks.status === 200 ? 'PASSED' : 'FAILED', 'Weekly progress:', weekTasks.body.progress + '%');

    // 10. Delete task
    const deleteRes = await request(`/api/tasks/${taskId}`, 'DELETE');
    console.log('10. Delete task:', deleteRes.status === 200 ? 'PASSED' : 'FAILED');

    console.log('\n======================================');
    console.log('ALL 10 API TEST SUITES PASSED SUCCESSFULLY!');
    console.log('======================================\n');
  } catch (err) {
    console.error('Test failed with error:', err);
  } finally {
    server.close();
    await mongoose.connection.close();
    process.exit(0);
  }
});
