# Evolved Floors "Get Started" Form — Deployment Guide

## Overview
This deployment covers two components:
1. **Form page** (`/get-started/index.html`) — Static HTML with client-side form logic
2. **Cloudflare Worker** (`worker/get-started-worker.js`) — Backend for SMS verification and GHL integration

---

## Part 1: Deploy the Form Page

### Step 1: Copy form to live site
```bash
cp /home/rich/.openclaw/workspace/evolved-site/get-started/index.html /path/to/live/site/get-started/index.html
```

Or if using a static site generator:
1. Place the HTML file in your pages directory
2. Ensure it's available at `https://evolvedfloors.com.au/get-started/`

### Step 2: Verify form loads
- Navigate to `https://evolvedfloors.com.au/get-started/`
- Check that the form renders correctly
- Test that the progress bar works

### Configuration needed in the form
The form currently calls:
```javascript
const WORKER_URL = 'https://get-started.evolved-floors.workers.dev';
```

Update this URL after deploying the worker (see Part 2).

---

## Part 2: Deploy Cloudflare Worker

### Prerequisites
1. **Cloudflare account** with Workers enabled
2. **wrangler CLI** installed:
   ```bash
   npm install -g wrangler
   ```
3. **GHL API credentials** (already in worker):
   - API Key: `pit-09c2b531-b9e2-416f-89c4-edeefd913e68` ✓
   - Location ID: `1cvFdmlQAU5WpfaQwhB9` ✓

### Step 1: Create KV Namespace for SMS codes

In Cloudflare Dashboard:
1. Go to **Storage → KV Namespaces**
2. Click **Create Namespace**
3. Name it: `form-codes` (or your preference)
4. Note the Namespace ID and Preview ID

### Step 2: Update wrangler.toml

Edit `worker/wrangler.toml`:

```toml
account_id = "YOUR_CLOUDFLARE_ACCOUNT_ID"  # Find in Cloudflare Dashboard → Workers → Settings
zone_id = "YOUR_CLOUDFLARE_ZONE_ID"        # Find in Cloudflare Dashboard → Overview (for evolvedfloors.com)

[[kv_namespaces]]
binding = "FORM_CODES"
id = "YOUR_KV_NAMESPACE_ID"
preview_id = "YOUR_KV_NAMESPACE_PREVIEW_ID"
```

Get your IDs:
- **Account ID**: Cloudflare Dashboard → Workers → Settings → Account ID
- **Zone ID**: Cloudflare Dashboard → Overview (Domain) → Zone ID
- **KV Namespace ID**: Cloudflare Dashboard → Storage → KV Namespaces → (click your namespace)

### Step 3: Authenticate wrangler

```bash
wrangler login
```

This opens a browser to authenticate. After approval, you're ready to deploy.

### Step 4: Deploy the worker

```bash
cd /home/rich/.openclaw/workspace/evolved-site/worker
wrangler deploy
```

Expected output:
```
✔ Uploaded get-started-worker.js
✔ Deployed to https://get-started.evolved-floors.workers.dev
```

### Step 5: Verify deployment

Test the worker endpoints:

```bash
# Test /submit
curl -X POST https://get-started.evolved-floors.workers.dev/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+61412345678",
    "suburb": "Broadbeach",
    "postcode": 4218,
    "flooring_type": "timber",
    "area_sqm": 50,
    "timeline": "asap",
    "service_type": "supply_install",
    "market": "Gold Coast"
  }'
```

Expected response:
```json
{ "success": true, "contactId": "xxxxx" }
```

### Step 6: Update GHL SMS number

In `worker/get-started-worker.js`, replace:
```javascript
const VERIFY_NUMBER_PLACEHOLDER = '+1800VERIFY';
```

With your actual GHL number once purchased. Then redeploy:
```bash
wrangler deploy
```

---

## Part 3: Connect Form to Worker

### Update form WORKER_URL

In `/get-started/index.html`, update line 2:
```javascript
const WORKER_URL = 'https://get-started.evolved-floors.workers.dev';
```

(This should already be correct if deployed to the standard worker domain)

### Enable CORS

The form calls the worker from the evolvedfloors.com.au domain. The worker has CORS headers configured:
```javascript
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
};
```

If you get CORS errors in the browser console, check:
1. Worker is deployed and responding to requests
2. CORS headers are being returned by the worker
3. The form URL matches the origin making the request

---

## Part 4: GHL Workflow Trigger

When a lead is verified (POST /verify succeeds), the contact in GHL is:
- Tagged: `web-verified`, `{market}`, `{timeline_tag}`
- Opportunity created in the correct pipeline

Susan will build a GHL workflow to send the estimate email when:
- Contact is tagged `web-verified`
- Opportunity is created
- Use the custom fields in the contact/opportunity for the estimate calculation

---

## Testing Checklist

### Form Page
- [ ] Page loads at `/get-started/`
- [ ] Progress bar updates (1-6)
- [ ] Step 1: Select service type → advances to Step 2
- [ ] Step 2: Invalid postcode → error message
- [ ] Step 2: Valid postcode (e.g., 4218 for Broadbeach) → detects market
- [ ] Step 3: Select flooring type → advances
- [ ] Step 4: Add rooms and areas → total updates
- [ ] Step 4: Total <20m² → shows warning
- [ ] Step 5: Select timeline → advances
- [ ] Step 6: Enter name, email, phone → form validates
- [ ] Step 6: Phone validation (04XX or +614XX) ✓
- [ ] Step 6: Submit → shows verification screen
- [ ] Verification: 6 code boxes, auto-advance ✓
- [ ] Verification: Wrong code → error, can retry ✓
- [ ] Verification: Correct code → success message ✓
- [ ] Resend: Available after 60 seconds ✓

### Worker
- [ ] `POST /submit` creates contact in GHL
- [ ] `POST /submit` sends SMS via GHL
- [ ] SMS contains 6-digit code
- [ ] `POST /verify` validates code
- [ ] `POST /verify` updates contact: adds "web-verified" tag
- [ ] `POST /verify` creates opportunity in correct pipeline
- [ ] `POST /resend` resends code (same code if <8 min old)
- [ ] `POST /resend` generates new code if >8 min old
- [ ] KV entries expire after 10 minutes

### GHL Integration
- [ ] Contact created in GHL with correct tags
- [ ] Contact custom fields populated: flooring_type, area_sqm, suburb, service_type, timeline
- [ ] Opportunity created in correct pipeline (SE QLD for Gold Coast/Brisbane, Byron Bay for Byron Bay)
- [ ] Opportunity has correct title format: "{flooring_type} - {area_sqm}m² - {suburb}"

### Email Workflow (Susan's task)
- [ ] Workflow triggered when contact tagged "web-verified"
- [ ] Estimate email sent with calculated price range
- [ ] Email goes to contact's email address

---

## Pricing Configuration

Rates are hardcoded in the worker (lines 20-41). These are used by GHL workflows to calculate the estimate.

If pricing changes, update:
```javascript
const PRICING = {
    'timber': { total: 159.99 },
    'hybrid': { total: 76.99 },
    'carpet': { total: 76.99 },
    'vinyl': { total: 76.99 },
    'laminate': { total: 76.99 }
};
```

Then redeploy:
```bash
wrangler deploy
```

---

## Troubleshooting

### Form doesn't submit
1. Check browser console for errors
2. Verify `WORKER_URL` matches deployed worker domain
3. Test worker directly with curl (see Step 5 above)

### SMS not sending
1. Check GHL number is correct: `VERIFY_NUMBER_PLACEHOLDER`
2. Check GHL API key is valid
3. Check contact phone number format: must be `+614XX XXX XXX`

### Code verification fails
1. Check KV namespace is bound correctly in wrangler.toml
2. Check code generation in worker (should be 6 digits)
3. Verify KV expiry is set to 600 seconds (10 minutes)

### Opportunity not created
1. Check pipeline IDs are correct:
   - Gold Coast/Brisbane: `mrLmP8Kc2pEByZ9kN94C`
   - Byron Bay: `oT3rDFVUMRfuJGWSkrT2`
2. Check market detection in form (Step 2)
3. Check GHL API response for errors

---

## Post-Launch Checklist

- [ ] Update `VERIFY_NUMBER_PLACEHOLDER` with real GHL SMS number
- [ ] Test full end-to-end flow (form → SMS → verification → GHL contact/opp)
- [ ] Monitor worker logs: `wrangler tail`
- [ ] Monitor KV usage: Cloudflare Dashboard → Storage → KV → Metrics
- [ ] Confirm Susan has set up GHL estimate email workflow
- [ ] Notify sales team that leads are flowing to GHL

---

## Monitoring

### View worker logs
```bash
wrangler tail
```

### Check KV usage
Cloudflare Dashboard → Storage → KV Namespaces → form-codes → Metrics

### Monitor GHL contacts
GHL Dashboard → Contacts → Filter by tag `web-verified`

---

## Rollback

If needed, revert to a previous worker version:

```bash
wrangler deployments list
wrangler rollback --deployment-id <deployment_id>
```

---

## Support

For issues:
1. Check worker logs: `wrangler tail`
2. Check browser console for form errors
3. Check GHL API responses in worker logs
4. Test worker endpoints directly with curl
