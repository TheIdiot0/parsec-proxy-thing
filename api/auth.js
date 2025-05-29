// File: api/auth.js (Vercel Serverless Function)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const response = await fetch('https://parsecgaming.com/v1/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include any additional headers if needed
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy request failed', details: error.message });
  }
}
