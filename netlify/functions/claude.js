const RATE_LIMIT = 10;        // max requests
const WINDOW_MS = 60 * 60 * 1000; // per hour

// In-memory store — resets on function cold start
const ipMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = ipMap.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    ipMap.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT) {
    return true;
  }

  entry.count++;
  return false;
}

function getRetryAfter(ip) {
  const entry = ipMap.get(ip);
  if (!entry) return 0;
  const elapsed = Date.now() - entry.windowStart;
  return Math.ceil((WINDOW_MS - elapsed) / 1000 / 60); // minutes remaining
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Get IP from Netlify headers
  const ip =
    req.headers.get('x-nf-client-connection-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';

  if (isRateLimited(ip)) {
    const retryAfter = getRetryAfter(ip);
    return new Response(
      JSON.stringify({ error: `Rate limit reached. You've used ${RATE_LIMIT} reflections this hour. Try again in ${retryAfter} minute${retryAfter !== 1 ? 's' : ''}.` }),
      {
        status: 429,
        headers: {
          ...CORS,
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter * 60),
        }
      }
    );
  }

  try {
    const body = await req.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        messages: body.messages,
        system: body.system || undefined,
      })
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { ...CORS, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' }
    });
  }
};

export const config = { path: '/api/claude' };
