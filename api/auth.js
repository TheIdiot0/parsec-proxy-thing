export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Change to your frontend domain in production
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    console.error(`Invalid method: ${req.method}`);
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    console.log('Proxy auth request body:', req.body);

    // Construct headers
    const headers = {
      'Content-Type': 'application/json',
    };

    // Optionally add Authorization if available
    if (process.env.PARSEC_API_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.PARSEC_API_TOKEN}`;
    }

    console.log('Sending headers:', headers);

    const response = await fetch('https://parsecgaming.com/v1/auth', {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body),
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonError) {
      console.warn('Response is not valid JSON:', jsonError);
      data = text;
    }

    console.log('Response status:', response.status);
    console.log('Response data:', data);

    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy request failed:', error);
    res.status(500).json({ error: 'Proxy request failed', details: error.message });
  }
}
