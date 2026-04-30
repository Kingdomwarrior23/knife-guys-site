// CF Worker: Knife Guys Form Handler
// Receives form submissions, creates GHL contact, sends email notification

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': 'https://lubbockknifeguys.com',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const data = await request.json();
      const { name, phone, email, interest, message } = data;

      // Validate
      if (!name || !phone) {
        return new Response(JSON.stringify({ error: 'Name and phone required' }), { status: 400 });
      }

      // Create GHL contact
      const ghlResponse = await fetch('https://services.leadconnectorhq.com/contacts/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.GHL_API_KEY}`,
          'Version': '2021-07-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: name.split(' ')[0],
          lastName: name.split(' ').slice(1).join(' ') || '',
          phone: phone,
          email: email || '',
          source: 'Website Contact Form',
          tags: ['website-lead', interest || 'general'],
          locationId: env.GHL_LOCATION_ID,
          customField: [
            { id: 'interest', value: interest || 'Not specified' },
            { id: 'message', value: message || '' },
          ],
        }),
      });

      const ghlResult = await ghlResponse.json();

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Thanks! We\'ll be in touch soon.',
        contactId: ghlResult.contact?.id 
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://lubbockknifeguys.com',
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Something went wrong' }), { status: 500 });
    }
  },
};
