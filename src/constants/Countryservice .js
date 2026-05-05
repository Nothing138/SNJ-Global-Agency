// ─────────────────────────────────────────────────────────────────────────────
// countryService.js
//
// HOW TO USE:
//   Option A — Express backend route (recommended, keeps API key secret):
//     Copy the `getCountryDetailsHandler` function into your Express server.
//     Then call it from your React app via fetch('/api/country-details').
//
//   Option B — If you already have an Anthropic-proxied backend,
//     just use the `fetchCountryDetails` function from your React component.
// ─────────────────────────────────────────────────────────────────────────────

// ── BUILD THE PROMPT ──────────────────────────────────────────────────────────
export const buildCountryPrompt = (countryName) => `
You are an expert travel and immigration advisor for SNJ Global, a company that provides
work visas, visit visas, flight booking, and travel packages to people worldwide.

Write a comprehensive and easy-to-understand guide about ${countryName} for someone from
South Asia (like Bangladesh, India, Pakistan) who is considering visiting or working there
through SNJ Global.

Respond ONLY in this exact JSON format — no markdown, no backticks, no preamble:
{
  "tagline": "A short exciting tagline about ${countryName} (max 8 words)",
  "overview": "2-3 sentences: where ${countryName} is, its capital city, population, and what makes it unique. Write like you are excitedly explaining to a friend.",
  "whyFamous": "2-3 sentences about what ${countryName} is globally known for — culture, food, landmarks, tech, economy, lifestyle. Be specific.",
  "mustSee": ["Famous landmark 1", "Famous place 2", "Famous place 3", "Famous place 4", "Famous place 5"],
  "economy": "2 sentences: main industries, average salary levels, and what kind of skills are in demand.",
  "workVisaInfo": "3 clear simple sentences: what visa categories exist, how difficult to get, typical processing time.",
  "inDemandJobs": ["In-demand job 1", "In-demand job 2", "In-demand job 3", "In-demand job 4"],
  "snjServices": "3 sentences: how SNJ Global helps with work visa, employer recruitment, visit visa, flights, and travel packages for ${countryName}. Sound helpful and trustworthy.",
  "whyChoose": ["Compelling reason 1", "Compelling reason 2", "Compelling reason 3", "Compelling reason 4"],
  "tips": "2-3 very practical first-timer tips: cultural norms, what to bring, important things to know."
}
`.trim();

// ── REACT FETCH (calls YOUR backend, not Anthropic directly) ─────────────────
// Use this in your React component. Point it to your own backend endpoint.
export const fetchCountryDetails = async (countryName) => {
  const response = await fetch('/api/country-details', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ country: countryName }),
  });

  if (!response.ok) throw new Error('Network error');

  const data = await response.json();
  return data; // already parsed JSON from backend
};

// ── EXPRESS BACKEND HANDLER (paste this into your server/index.js) ────────────
//
// const Anthropic = require('@anthropic-ai/sdk');   // npm install @anthropic-ai/sdk
// const { buildCountryPrompt } = require('./countryService');
//
// const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
//
// app.post('/api/country-details', async (req, res) => {
//   try {
//     const { country } = req.body;
//     if (!country) return res.status(400).json({ error: 'Country name required' });
//
//     const message = await anthropic.messages.create({
//       model: 'claude-sonnet-4-20250514',
//       max_tokens: 1200,
//       messages: [{ role: 'user', content: buildCountryPrompt(country) }],
//     });
//
//     let text = message.content.map(b => b.text || '').join('');
//     text = text.replace(/```json|```/g, '').trim();
//     const parsed = JSON.parse(text);
//     res.json(parsed);
//   } catch (err) {
//     console.error('Country details error:', err);
//     res.status(500).json({ error: 'Failed to get country details' });
//   }
// });