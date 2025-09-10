// Instagram OAuth Token Exchange API
// This is a simple serverless function for handling Instagram OAuth

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { code, redirect_uri } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Authorization code is required' });
    }

    try {
        // Instagram OAuth token exchange
        const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: process.env.INSTAGRAM_APP_ID,
                client_secret: process.env.INSTAGRAM_APP_SECRET,
                grant_type: 'authorization_code',
                redirect_uri: redirect_uri,
                code: code
            })
        });

        if (!tokenResponse.ok) {
            throw new Error('Failed to exchange code for token');
        }

        const tokenData = await tokenResponse.json();

        // Exchange short-lived token for long-lived token
        const longLivedResponse = await fetch(
            `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_APP_SECRET}&access_token=${tokenData.access_token}`
        );

        if (longLivedResponse.ok) {
            const longLivedData = await longLivedResponse.json();
            tokenData.access_token = longLivedData.access_token;
            tokenData.expires_in = longLivedData.expires_in;
        }

        // Return token data
        res.status(200).json({
            access_token: tokenData.access_token,
            expires_in: tokenData.expires_in,
            token_type: tokenData.token_type
        });

    } catch (error) {
        console.error('Instagram token exchange error:', error);
        res.status(500).json({ 
            error: 'Failed to exchange authorization code for access token',
            details: error.message 
        });
    }
}
