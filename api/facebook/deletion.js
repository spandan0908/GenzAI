// Meta (Facebook/Instagram) Data Deletion Callback
// Reference: https://developers.facebook.com/docs/development/build-and-test/data-deletion-callback/
// This endpoint should:
// 1) Accept a signed request or user_id.
// 2) Start deletion and return a confirmation_code and a URL where the user can check status.
// For this static app, we don't persist user data; we return a code and a status URL.

function randomCode() {
    return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

export default async function handler(req, res) {
    try {
        const confirmation_code = randomCode();
        const url = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}/data-deletion.html?code=${confirmation_code}`;
        res.status(200).json({ url, confirmation_code });
    } catch (e) {
        res.status(500).json({ error: 'failed', details: e.message });
    }
}


