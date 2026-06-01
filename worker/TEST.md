# Evolved Floors Get Started Form — Testing Guide

## Quick Test: Full End-to-End Flow

### 1. Test Form Submission (POST /submit)

```bash
curl -X POST https://get-started.evolved-floors.workers.dev/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+61412345678",
    "suburb": "Broadbeach",
    "postcode": 4218,
    "flooring_type": "timber",
    "area_sqm": 45.5,
    "timeline": "asap",
    "service_type": "supply_install",
    "market": "Gold Coast"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "contactId": "xxxxxxxxx"
}
```

**What happens:**
- 6-digit SMS code generated
- Data stored in KV (expires in 10 minutes)
- Contact created in GHL with tags: `web-unverified`, `Gold Coast`, `HOT`
- SMS sent with verification code

---

### 2. Verify Code (POST /verify)

Note the 6-digit code from the SMS. Then:

```bash
curl -X POST https://get-started.evolved-flowers.workers.dev/verify \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+61412345678",
    "code": "123456"
  }'
```

**Expected Response (correct code):**
```json
{
  "success": true
}
```

**Expected Response (wrong code):**
```json
{
  "error": "Invalid code"
}
```

**What happens (on success):**
- Code validated
- GHL contact tags updated: remove `web-unverified`, add `web-verified`
- Custom fields stored: flooring_type, area_sqm, suburb, service_type, timeline
- GHL opportunity created in correct pipeline:
  - Gold Coast/Brisbane: `mrLmP8Kc2pEByZ9kN94C` (Tom SE QLD)
  - Byron Bay: `oT3rDFVUMRfuJGWSkrT2` (Luana Byron Bay)
- Opportunity title: `{flooring_type} - {area_sqm}m² - {suburb}`
- KV entry deleted

---

### 3. Resend Code (POST /resend)

```bash
curl -X POST https://get-started.evolved-floors.workers.dev/resend \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+61412345678"
  }'
```

**Expected Response:**
```json
{
  "success": true
}
```

**Behavior:**
- If <8 minutes old: resends same code
- If >8 minutes old: generates new code, updates KV, sends new code

---

## Test Data Sets

### Test 1: Gold Coast Lead (Supply + Install)
```json
{
  "name": "Sarah Mitchell",
  "email": "sarah@example.com",
  "phone": "+61487654321",
  "suburb": "Broadbeach",
  "postcode": 4218,
  "flooring_type": "hybrid",
  "area_sqm": 75.5,
  "timeline": "1-3m",
  "service_type": "supply_install",
  "market": "Gold Coast"
}
```

**Expected GHL tags:** `web-unverified`, `Gold Coast`, `WARM`
**Expected pipeline:** Tom SE QLD

---

### Test 2: Brisbane Commercial Lead (Supply Only)
```json
{
  "name": "Mike Johnson",
  "email": "mike@company.com.au",
  "phone": "+61412123456",
  "suburb": "Fortitude Valley",
  "postcode": 4006,
  "flooring_type": "laminate",
  "area_sqm": 250,
  "timeline": "asap",
  "service_type": "supply_only",
  "market": "Brisbane"
}
```

**Expected GHL tags:** `web-unverified`, `Brisbane`, `HOT`
**Expected pipeline:** Tom SE QLD
**Note:** Supply-only pricing is 60% of normal

---

### Test 3: Byron Bay Residential (Unsure about flooring)
```json
{
  "name": "Emma Wilson",
  "email": "emma@example.com",
  "phone": "+61402345678",
  "suburb": "Byron Bay",
  "postcode": 2481,
  "flooring_type": "unsure",
  "area_sqm": 120,
  "timeline": "3-6m",
  "service_type": "supply_install",
  "market": "Byron Bay"
}
```

**Expected GHL tags:** `web-unverified`, `Byron Bay`, `COOL`
**Expected pipeline:** Luana Byron Bay
**Note:** "unsure" tags as "needs consultation"

---

### Test 4: Out of Service Area (should fail at Step 2)
In browser form, try:
- Suburb: "Newcastle" or Postcode: "2300"
- Expected: Error message "We don't service that area yet"

---

## Phone Number Validation Test Cases

| Input | Valid | Format |
|-------|-------|--------|
| `0412345678` | ✓ | Australian mobile |
| `+61412345678` | ✓ | International |
| `04 1234 5678` | ✓ | With spaces (normalized) |
| `0212345678` | ✗ | Landline (02 prefix) |
| `041234567` | ✗ | Too short |
| `+61212345678` | ✗ | Wrong prefix |

---

## Area Calculator Test Cases

| Rooms | Areas | Total | Valid? | Notes |
|-------|-------|-------|--------|-------|
| Living + Bed1 | 30 + 15 | 45 m² | ✓ | Above 20 m² minimum |
| Hallway | 8 | 8 m² | ✗ | Below 20 m², shows warning |
| Living + Bed1 + Bed2 | 40 + 12 + 12 | 64 m² | ✓ | Multiple rooms |
| (none selected) | N/A | 0 m² | ✗ | Must select at least one |

---

## GHL Contact Verification

### Check contact was created:
1. GHL Dashboard → Contacts
2. Search by phone number: `+61412345678`
3. Verify tags before verification: `web-unverified`, `{market}`, `{timeline_tag}`
4. Verify tags after verification: `web-verified`, `{market}`, `{timeline_tag}`

### Check custom fields stored:
- flooring_type
- area_sqm
- suburb
- service_type
- timeline

### Check opportunity was created:
1. GHL Dashboard → Opportunities
2. Filter by contact
3. Verify title: `{flooring_type} - {area_sqm}m² - {suburb}`
4. Verify correct pipeline (market-based)

---

## Browser Form Testing

### Step 1 — Service Type
- [ ] All 3 tiles clickable
- [ ] Selected tile shows highlight
- [ ] "Continue" button disabled until selection
- [ ] "Just Researching" shows exit message

### Step 2 — Location
- [ ] Input accepts suburb or postcode
- [ ] Invalid input shows error
- [ ] Valid postcode (4218) → Gold Coast market
- [ ] Valid postcode (4006) → Brisbane market
- [ ] Valid postcode (2481) → Byron Bay market
- [ ] Suburb match works (case-insensitive)

### Step 3 — Flooring Type
- [ ] All 6 options clickable with images
- [ ] "Not sure yet" allowed
- [ ] Selected tile shows highlight

### Step 4 — Area Calculator
- [ ] Checkboxes enable/disable area inputs
- [ ] Area values update running total
- [ ] Total displays correctly: "Total area: XX m²"
- [ ] <20 m² shows warning with phone number
- [ ] Back button works

### Step 5 — Timeline
- [ ] All 4 options selectable
- [ ] Emoji/icon displays correctly
- [ ] Timeline tag displays

### Step 6 — Contact Details
- [ ] Name field required
- [ ] Email field validates `@`
- [ ] Phone validates Australian format
- [ ] Checkbox required
- [ ] Submit disabled until all valid
- [ ] Submit shows loading spinner

### Verification Screen
- [ ] Shows masked phone number
- [ ] 6 code input boxes
- [ ] Auto-advance between boxes
- [ ] Correct code → success screen
- [ ] Wrong code → error message
- [ ] Resend button disabled for 60 seconds
- [ ] Resend countdown timer shows

### Success Screen
- [ ] Shows checkmark icon
- [ ] Displays email address
- [ ] Shows phone number to call

---

## Performance Baselines

### API Response Times
- `/submit`: <2 seconds (includes GHL contact creation + SMS)
- `/verify`: <1.5 seconds (includes opportunity creation)
- `/resend`: <1 second

### Form UX
- Page load: <1 second
- Step transition: 0.4 second slide animation
- Form validation: instant

---

## Error Scenarios to Test

1. **Missing required fields:**
   ```bash
   curl -X POST ... -d '{"name": "Test"}'
   # Expected: 400 "Missing required fields"
   ```

2. **Malformed JSON:**
   ```bash
   curl -X POST ... -d '{invalid json}'
   # Expected: 400 or 500 error
   ```

3. **Code expired (>10 min old):**
   - Submit form
   - Wait 11 minutes
   - Try to verify
   - Expected: 400 "Code expired"

4. **Invalid code:**
   - Submit form
   - Enter wrong 6 digits
   - Expected: 400 "Invalid code"

5. **Resend without pending verification:**
   ```bash
   curl -X POST /resend -d '{"phone": "+61412999999"}'
   # Expected: 404 "No pending verification found"
   ```

---

## Debugging Worker Issues

### Enable debug logging
The worker logs errors to the console. View with:
```bash
wrangler tail
```

### Test KV directly
In Cloudflare Dashboard → Storage → KV:
1. Click "form-codes" namespace
2. Should see entries like `+61412345678` during active verification windows

### Check GHL API responses
Worker logs will show:
- GHL contact creation responses
- SMS send results
- Opportunity creation responses

Add logging to worker if needed:
```javascript
console.log('GHL response:', ghlContact);
```

---

## Monitoring in Production

### Real-time logs
```bash
wrangler tail
```

### Check daily metrics
1. Cloudflare Dashboard → Workers → get-started-worker
2. View analytics: requests, errors, duration

### Monitor form submissions
GHL Dashboard → Contacts → Filter by tags `web-verified`
- Daily verified leads count
- Market distribution
- Average area size

---

## Common Issues & Fixes

### "CORS error in browser console"
- Check worker is deployed: `https://get-started.evolved-floors.workers.dev`
- Verify `WORKER_URL` in form HTML matches
- Check CORS headers in worker

### "SMS not received"
- Verify phone number format: `+614XX XXX XXX`
- Check `VERIFY_NUMBER_PLACEHOLDER` is set to real GHL number
- Check GHL account has SMS credits

### "Verification code always wrong"
- Check KV is bound correctly in wrangler.toml
- Verify code generation (should be 6 digits)
- Check phone number is consistent (form normalizes, verify must match)

### "Opportunity not created in GHL"
- Check pipeline ID is correct for market
- Verify contact ID is returned from /submit
- Check GHL API key is valid

---

## Load Testing (Optional)

For stress testing the worker, use Apache Bench:

```bash
# Single request
ab -n 1 -c 1 -p test.json -T application/json https://get-started.evolved-floors.workers.dev/submit

# 100 concurrent requests
ab -n 1000 -c 100 -p test.json -T application/json https://get-started.evolved-floors.workers.dev/submit
```

Monitor with:
```bash
wrangler tail
```

---
