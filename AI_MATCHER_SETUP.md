# AI job matcher setup

The portfolio page is static. The Gemini API key must stay in the Cloudflare Worker and must not be added to `recruiter.js` or any other browser code.

## Configure and deploy the Worker

1. Create a Gemini API key in [Google AI Studio](https://aistudio.google.com/apikey). The Gemini API currently offers free usage for selected models, subject to quotas and account/region availability. Check [current Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) before deployment. Google says content submitted on the free tier may be used to improve its products, so recruiters should not paste confidential job descriptions.
2. Install Wrangler if needed and authenticate with Cloudflare:

   ```powershell
   npm install --global wrangler
   wrangler login
   ```

3. In `wrangler.toml`, set `ALLOWED_ORIGIN` to the exact public origin of the portfolio (scheme and hostname only, no path). For GitHub Pages project sites, this is the hostname such as `https://username.github.io`, not the repository path. Keep `compatibility_date` set to a date Cloudflare has already reached.
4. From this repository directory, store the key as a Worker secret and deploy:

   ```powershell
   wrangler secret put GEMINI_API_KEY
   wrangler deploy
   ```

5. In `recruiter.js`, set `MATCHER_API_URL` to the deployed Worker endpoint, for example `https://resume-jd-matcher.<your-account>.workers.dev/api/match`, then publish the static site.

The Worker uses the `gemini-2.5-flash` model by default. To select another available model, set the `GEMINI_MODEL` Worker variable. The Worker limits input length and applies a basic per-IP request limit; Cloudflare's in-memory limit can reset when an isolate restarts and is not a substitute for a Cloudflare rate-limiting rule.
