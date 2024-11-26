const { google } = require('googleapis');

async function checkQuota() {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });

  const service = google.serviceusage({ version: 'v1', auth });

  try {
    const projectId = await auth.getProjectId();
    const res = await service.services.list({
      parent: `projects/${projectId}`,
    });

    const services = res.data.services || [];
    services.forEach(service => {
      console.log(`Service: ${service.config.name}`);
      console.log(`State: ${service.state}`);
      console.log('---');
    });
  } catch (err) {
    console.error('Error checking quota:', err);
  }
}

checkQuota();
