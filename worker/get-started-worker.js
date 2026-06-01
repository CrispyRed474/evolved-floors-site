/**
 * Evolved Floors - Get Started Form Worker
 * 
 * This Cloudflare Worker handles:
 * 1. POST /submit - Create lead, generate SMS code, store in KV
 * 2. POST /verify - Verify code, create GHL contact/opportunity
 * 3. POST /resend - Resend verification code
 */

// Configuration
const VERIFY_NUMBER_PLACEHOLDER = '+1800VERIFY'; // Rich will update this with actual GHL number
const GHL_API_KEY = 'pit-09c2b531-b9e2-416f-89c4-edeefd913e68';
const GHL_LOCATION_ID = '1cvFdmlQAU5WpfaQwhB9';
const GHL_VERSION = '2021-07-28';

// Pricing rates per m²
const PRICING = {
    'timber': {
        supply: 61.43,
        install: 92.86,
        underlay: 5.71,
        total: 159.99
    },
    'hybrid': {
        supply: 25.71,
        install: 38.57,
        underlay: 12.71,
        total: 76.99
    },
    'carpet': {
        supply: 25.71,
        install: 38.57,
        underlay: 12.71,
        total: 76.99
    },
    'vinyl': {
        supply: 25.71,
        install: 38.57,
        underlay: 12.71,
        total: 76.99
    },
    'laminate': {
        supply: 25.71,
        install: 38.57,
        underlay: 12.71,
        total: 76.99
    }
};

// GHL Pipelines
const GHL_PIPELINES = {
    'Gold Coast': 'mrLmP8Kc2pEByZ9kN94C',
    'Brisbane': 'mrLmP8Kc2pEByZ9kN94C',
    'Byron Bay': 'oT3rDFVUMRfuJGWSkrT2'
};

// CORS Headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
};

export default {
    async fetch(request, env, ctx) {
        // CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 200, headers: corsHeaders });
        }

        const url = new URL(request.url);
        const path = url.pathname;

        try {
            if (path === '/submit' && request.method === 'POST') {
                return await handleSubmit(request, env);
            } else if (path === '/verify' && request.method === 'POST') {
                return await handleVerify(request, env);
            } else if (path === '/resend' && request.method === 'POST') {
                return await handleResend(request, env);
            } else {
                return jsonResponse({ error: 'Not found' }, 404);
            }
        } catch (error) {
            console.error('Worker error:', error);
            return jsonResponse({ error: 'Internal server error', details: error.message }, 500);
        }
    }
};

/**
 * POST /submit
 * - Generate 6-digit code
 * - Store in KV with expiry (10 minutes)
 * - Create GHL contact (unverified)
 * - Send SMS with code
 */
async function handleSubmit(request, env) {
    const body = await request.json();
    const { name, email, phone, suburb, postcode, flooring_type, area_sqm, timeline, service_type, market } = body;

    // Validate required fields
    if (!name || !email || !phone || !suburb || !flooring_type || !area_sqm || !timeline || !service_type || !market) {
        return jsonResponse({ error: 'Missing required fields' }, 400);
    }

    // Generate 6-digit code
    const code = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

    // Prepare KV data
    const kvData = {
        code,
        name,
        email,
        phone,
        suburb,
        postcode,
        flooring_type,
        area_sqm,
        timeline,
        service_type,
        market,
        expires: Date.now() + 600000 // 10 minutes
    };

    // Store in KV (key = phone number)
    await env.FORM_CODES.put(phone, JSON.stringify(kvData), {
        expirationTtl: 600 // 10 minutes
    });

    // Create GHL contact
    const ghlContactResponse = await fetch('https://services.msgsndr.com/contacts/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GHL_API_KEY}`,
            'Version': GHL_VERSION,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName: name,
            email: email,
            phone: phone,
            locationId: GHL_LOCATION_ID,
            tags: ['web-unverified', market, getTimelineTag(timeline)]
        })
    });

    if (!ghlContactResponse.ok) {
        const error = await ghlContactResponse.text();
        console.error('GHL contact creation failed:', error);
        return jsonResponse({ error: 'Failed to create contact', details: error }, 500);
    }

    const ghlContact = await ghlContactResponse.json();
    const contactId = ghlContact.contact?.id || ghlContact.id;

    if (!contactId) {
        console.error('No contact ID returned from GHL:', ghlContact);
        return jsonResponse({ error: 'No contact ID from GHL' }, 500);
    }

    // Send SMS via GHL
    const smsMessage = `Your Evolved Floors verification code is: ${code}. Valid for 10 minutes.`;
    const smsResponse = await fetch('https://services.msgsndr.com/conversations/messages', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GHL_API_KEY}`,
            'Version': GHL_VERSION,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: 'SMS',
            contactId: contactId,
            fromNumber: VERIFY_NUMBER_PLACEHOLDER,
            message: smsMessage
        })
    });

    if (!smsResponse.ok) {
        const error = await smsResponse.text();
        console.error('SMS send failed:', error);
        // Don't fail the submission, SMS might fail but contact was created
        console.warn('SMS send failed but continuing with contact creation');
    }

    return jsonResponse({ success: true, contactId });
}

/**
 * POST /verify
 * - Look up KV by phone
 * - Check code matches and not expired
 * - Update GHL contact (remove web-unverified, add web-verified)
 * - Create GHL opportunity
 * - Delete KV entry
 */
async function handleVerify(request, env) {
    const body = await request.json();
    const { phone, code } = body;

    if (!phone || !code) {
        return jsonResponse({ error: 'Missing phone or code' }, 400);
    }

    // Look up in KV
    const kvDataStr = await env.FORM_CODES.get(phone);
    if (!kvDataStr) {
        return jsonResponse({ error: 'Code expired or not found' }, 404);
    }

    const kvData = JSON.parse(kvDataStr);

    // Check code matches
    if (kvData.code !== code) {
        return jsonResponse({ error: 'Invalid code' }, 400);
    }

    // Check not expired
    if (Date.now() > kvData.expires) {
        await env.FORM_CODES.delete(phone);
        return jsonResponse({ error: 'Code expired' }, 400);
    }

    // Get contact from GHL (search by phone)
    const contactsResponse = await fetch(
        `https://services.msgsndr.com/contacts/?phone=${encodeURIComponent(phone)}&locationId=${GHL_LOCATION_ID}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${GHL_API_KEY}`,
                'Version': GHL_VERSION
            }
        }
    );

    let contactId;
    if (contactsResponse.ok) {
        const contacts = await contactsResponse.json();
        contactId = contacts.contacts?.[0]?.id || contacts.contact?.id;
    }

    if (!contactId) {
        console.error('Could not find contact in GHL');
        return jsonResponse({ error: 'Contact not found' }, 500);
    }

    // Update GHL contact: remove web-unverified, add web-verified
    await updateGhlContact(contactId, {
        tags: [kvData.market, getTimelineTag(kvData.timeline), 'web-verified'],
        customFields: {
            'flooring_type': kvData.flooring_type,
            'area_sqm': kvData.area_sqm.toString(),
            'suburb': kvData.suburb,
            'service_type': kvData.service_type,
            'timeline': kvData.timeline
        }
    });

    // Create GHL opportunity
    const pipeline = GHL_PIPELINES[kvData.market] || GHL_PIPELINES['Gold Coast'];
    const oppTitle = `${kvData.flooring_type} - ${kvData.area_sqm}m² - ${kvData.suburb}`;
    
    const oppResponse = await fetch('https://services.msgsndr.com/opportunities/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GHL_API_KEY}`,
            'Version': GHL_VERSION,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contactId: contactId,
            pipelineId: pipeline,
            title: oppTitle,
            status: 'open',
            stageName: 'first', // Will resolve to first stage of pipeline
            customFields: {
                'flooring_type': kvData.flooring_type,
                'area_sqm': kvData.area_sqm.toString(),
                'suburb': kvData.suburb,
                'service_type': kvData.service_type,
                'timeline': kvData.timeline
            }
        })
    });

    if (!oppResponse.ok) {
        const error = await oppResponse.text();
        console.error('GHL opportunity creation failed:', error);
        // Don't fail completely, opportunity might not be critical
    }

    // Delete KV entry
    await env.FORM_CODES.delete(phone);

    return jsonResponse({ success: true });
}

/**
 * POST /resend
 * - Look up existing KV entry
 * - If exists and <8 minutes old: resend same code
 * - If >8 minutes old: generate new code, update KV, send new code
 */
async function handleResend(request, env) {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
        return jsonResponse({ error: 'Missing phone' }, 400);
    }

    const kvDataStr = await env.FORM_CODES.get(phone);
    if (!kvDataStr) {
        return jsonResponse({ error: 'No pending verification found' }, 404);
    }

    const kvData = JSON.parse(kvDataStr);
    const ageMinutes = (Date.now() - (kvData.expires - 600000)) / 60000;

    let codeToSend = kvData.code;

    // If >8 minutes old, generate new code
    if (ageMinutes > 8) {
        codeToSend = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
        kvData.code = codeToSend;
        kvData.expires = Date.now() + 600000;
        await env.FORM_CODES.put(phone, JSON.stringify(kvData), {
            expirationTtl: 600
        });
    }

    // Send SMS
    // First, find the contact
    const contactsResponse = await fetch(
        `https://services.msgsndr.com/contacts/?phone=${encodeURIComponent(phone)}&locationId=${GHL_LOCATION_ID}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${GHL_API_KEY}`,
                'Version': GHL_VERSION
            }
        }
    );

    let contactId;
    if (contactsResponse.ok) {
        const contacts = await contactsResponse.json();
        contactId = contacts.contacts?.[0]?.id || contacts.contact?.id;
    }

    if (contactId) {
        const smsMessage = `Your Evolved Floors verification code is: ${codeToSend}. Valid for 10 minutes.`;
        await fetch('https://services.msgsndr.com/conversations/messages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GHL_API_KEY}`,
                'Version': GHL_VERSION,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 'SMS',
                contactId: contactId,
                fromNumber: VERIFY_NUMBER_PLACEHOLDER,
                message: smsMessage
            })
        }).catch(err => console.error('Resend SMS failed:', err));
    }

    return jsonResponse({ success: true });
}

/**
 * Helper: Update GHL contact with tags and custom fields
 */
async function updateGhlContact(contactId, updates) {
    const response = await fetch(`https://services.msgsndr.com/contacts/${contactId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${GHL_API_KEY}`,
            'Version': GHL_VERSION,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('Failed to update contact:', error);
        throw new Error(`Failed to update contact: ${error}`);
    }

    return await response.json();
}

/**
 * Helper: Get timeline tag based on timeline selection
 */
function getTimelineTag(timeline) {
    const tags = {
        'asap': 'HOT',
        '1-3m': 'WARM',
        '3-6m': 'COOL',
        'planning': 'NURTURE'
    };
    return tags[timeline] || 'NURTURE';
}

/**
 * Helper: Return JSON response with CORS headers
 */
function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: corsHeaders
    });
}
