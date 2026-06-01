#!/bin/bash

################################################################################
# Evolved Floors "Get Started" Form — Deployment Commands
# 
# Run these commands in order to deploy the form and worker.
# Copy and paste each command carefully.
################################################################################

echo "═══════════════════════════════════════════════════════════════════════════"
echo "Evolved Floors Get Started Form — Deployment"
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""

# ============================================================================
# PART 1: Deploy Form Page
# ============================================================================

echo "STEP 1: Deploy Form Page"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "Copy the form to your live site:"
echo ""
echo "  cp /home/rich/.openclaw/workspace/evolved-site/get-started/index.html \\"
echo "     /path/to/live/site/get-started/index.html"
echo ""
echo "Then verify it's accessible at: https://evolvedfloors.com.au/get-started/"
echo ""
read -p "Press enter once form page is deployed..."

# ============================================================================
# PART 2: Set Up Cloudflare Worker Prerequisites
# ============================================================================

echo ""
echo "STEP 2: Create KV Namespace in Cloudflare Dashboard"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "1. Go to: https://dash.cloudflare.com/?"
echo "2. Select your domain (evolvedfloors.com)"
echo "3. Navigate to: Storage → KV Namespaces"
echo "4. Click: Create Namespace"
echo "5. Name it: form-codes"
echo "6. Copy the Namespace ID"
echo "7. Copy the Preview ID"
echo ""
echo "You'll need these IDs for the next step."
echo ""
read -p "Press enter once you've created the KV namespace..."

# ============================================================================
# PART 3: Get Cloudflare Account Details
# ============================================================================

echo ""
echo "STEP 3: Get Your Cloudflare Account Details"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "1. Account ID:"
echo "   Dashboard → Workers & Pages → Settings → Account ID"
echo ""
echo "2. Zone ID:"
echo "   Dashboard → Overview (for evolvedfloors.com) → Zone ID"
echo ""
echo "3. KV Namespace ID and Preview ID:"
echo "   Storage → KV Namespaces → Click 'form-codes' → Copy IDs"
echo ""
echo "Write these down, you'll need them next."
echo ""
read -p "Press enter once you have all the IDs..."

# ============================================================================
# PART 4: Update wrangler.toml
# ============================================================================

echo ""
echo "STEP 4: Update wrangler.toml with Your IDs"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "Edit this file:"
echo "  /home/rich/.openclaw/workspace/evolved-site/worker/wrangler.toml"
echo ""
echo "Replace these placeholders with your IDs:"
echo ""
echo "  account_id = \"YOUR_CLOUDFLARE_ACCOUNT_ID\"      # ← Replace this"
echo "  zone_id = \"YOUR_CLOUDFLARE_ZONE_ID\"            # ← Replace this"
echo ""
echo "  [[kv_namespaces]]"
echo "  binding = \"FORM_CODES\""
echo "  id = \"YOUR_KV_NAMESPACE_ID\"                    # ← Replace this"
echo "  preview_id = \"YOUR_KV_NAMESPACE_PREVIEW_ID\"    # ← Replace this"
echo ""
read -p "Press enter once wrangler.toml is updated..."

# ============================================================================
# PART 5: Install wrangler CLI
# ============================================================================

echo ""
echo "STEP 5: Install wrangler CLI (if not already installed)"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "Run this command:"
echo ""
echo "  npm install -g wrangler"
echo ""
read -p "Press enter once wrangler is installed..."

# ============================================================================
# PART 6: Authenticate with Cloudflare
# ============================================================================

echo ""
echo "STEP 6: Authenticate with Cloudflare"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "Run this command:"
echo ""
echo "  wrangler login"
echo ""
echo "This will open a browser window to authorize access to your Cloudflare account."
echo "After you approve, the terminal will confirm you're logged in."
echo ""
read -p "Press enter once authentication is complete..."

# ============================================================================
# PART 7: Deploy the Worker
# ============================================================================

echo ""
echo "STEP 7: Deploy the Cloudflare Worker"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "Run these commands:"
echo ""
echo "  cd /home/rich/.openclaw/workspace/evolved-site/worker"
echo "  wrangler deploy"
echo ""
echo "Expected output:"
echo "  ✔ Uploaded get-started-worker.js"
echo "  ✔ Deployed to https://get-started.evolved-floors.workers.dev"
echo ""
read -p "Press enter once the worker is deployed..."

# ============================================================================
# PART 8: Test the Worker
# ============================================================================

echo ""
echo "STEP 8: Test the Worker with a Curl Command"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "Run this command to test the /submit endpoint:"
echo ""
cat << 'EOF'
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
EOF
echo ""
echo "Expected response:"
echo '  { "success": true, "contactId": "xxxxx" }'
echo ""
read -p "Press enter once you've tested the worker..."

# ============================================================================
# PART 9: Update GHL SMS Number
# ============================================================================

echo ""
echo "STEP 9: Update GHL SMS Number"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "Once Rich has purchased a GHL SMS number:"
echo ""
echo "1. Edit: /home/rich/.openclaw/workspace/evolved-site/worker/get-started-worker.js"
echo ""
echo "2. Find this line (around line 12):"
echo "   const VERIFY_NUMBER_PLACEHOLDER = '+1800VERIFY';"
echo ""
echo "3. Replace with your actual GHL number:"
echo "   const VERIFY_NUMBER_PLACEHOLDER = '+YOUR_ACTUAL_GHL_NUMBER';"
echo ""
echo "4. Redeploy:"
echo "   cd /home/rich/.openclaw/workspace/evolved-site/worker"
echo "   wrangler deploy"
echo ""
read -p "Press enter once GHL number is updated and worker redeployed..."

# ============================================================================
# PART 10: Full End-to-End Test
# ============================================================================

echo ""
echo "STEP 10: Full End-to-End Test in Browser"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "1. Open: https://evolvedfloors.com.au/get-started/"
echo ""
echo "2. Go through all 6 steps:"
echo "   Step 1: Select 'Supply + Install'"
echo "   Step 2: Enter 'Broadbeach' or postcode '4218'"
echo "   Step 3: Select 'Timber Flooring'"
echo "   Step 4: Check 'Living/Dining' and enter '45' m²"
echo "   Step 5: Select 'ASAP (within 4 weeks)'"
echo "   Step 6: Enter your name, email, and phone number, then submit"
echo ""
echo "3. You should receive an SMS with a 6-digit code (or check SMS in GHL)"
echo ""
echo "4. Enter the code in the verification screen"
echo ""
echo "5. You should see: 'Your estimate is on its way to [email]'"
echo ""
echo "6. Check GHL Dashboard → Contacts to verify lead was created"
echo ""
read -p "Press enter once end-to-end test is complete..."

# ============================================================================
# PART 11: Set Up GHL Workflow (Susan's task)
# ============================================================================

echo ""
echo "STEP 11: Request GHL Estimate Email Workflow"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "Susan needs to create a GHL workflow that:"
echo ""
echo "1. Trigger: When contact is tagged 'web-verified'"
echo ""
echo "2. Actions:"
echo "   - Pull custom fields: flooring_type, area_sqm, suburb, service_type, timeline"
echo "   - Calculate price: area_sqm × PRICING[flooring_type] × ±15% range"
echo "   - Send email to contact.email with estimate and price range"
echo "   - Include call-to-action to book consultation"
echo ""
echo "Pricing rates (hardcoded in worker):"
echo "  - Timber:     $159.99/m²"
echo "  - Hybrid:     $76.99/m²"
echo "  - Carpet:     $76.99/m²"
echo "  - Vinyl:      $76.99/m²"
echo "  - Laminate:   $76.99/m²"
echo "  - Supply Only: 60% of above (no install/underlay)"
echo ""
echo "Once Susan builds the workflow, estimates will be sent automatically."
echo ""
read -p "Press enter once GHL workflow is set up..."

# ============================================================================
# FINAL: Summary
# ============================================================================

echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
echo "✅ Deployment Complete!"
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""
echo "Your Evolved Floors Get Started form is now live!"
echo ""
echo "📍 Form URL:"
echo "   https://evolvedfloors.com.au/get-started/"
echo ""
echo "📍 Worker URL:"
echo "   https://get-started.evolved-floors.workers.dev"
echo ""
echo "🔍 Monitor:"
echo "   View worker logs: wrangler tail"
echo "   Check GHL contacts: GHL Dashboard → Contacts (filter by 'web-verified')"
echo "   View errors: Cloudflare Dashboard → Workers → get-started-worker"
echo ""
echo "📊 Metrics:"
echo "   - Daily form submissions"
echo "   - Verified leads per market"
echo "   - Average area size"
echo ""
echo "📞 Support:"
echo "   - Form issues? Check: /get-started/index.html"
echo "   - Worker issues? Check: worker/get-started-worker.js"
echo "   - Deployment help? Read: DEPLOYMENT.md"
echo "   - Testing? See: TEST.md"
echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
