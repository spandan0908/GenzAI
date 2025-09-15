// VibeCheck AI Configuration
window.VIBECHECK_CONFIG = {
    // Instagram OAuth Configuration
    instagram: {
        // Replace with your Instagram App ID from Facebook Developer Console
        appId: 'YOUR_INSTAGRAM_APP_ID',
        
        // Redirect URI (should match what's configured in Facebook Developer Console)
        redirectUri: window.location.origin + '/auth-callback.html',
        
        // Permissions to request from Instagram
        scope: 'user_profile,user_media',
        
        // Enable debug logging
        debug: false
    },
    
    // App Configuration
    app: {
        name: 'GenzAI',
        version: '1.0.0',
        description: 'AI-powered content validation for Gen Z creators'
    },
    
    // API Configuration
    api: {
        // Base URL for your backend API
        baseUrl: window.location.origin,
        
        // Instagram token exchange endpoint
        instagramTokenEndpoint: '/api/instagram/token'
    }
};

// Set Instagram App ID globally for InstagramAuth class
window.INSTAGRAM_APP_ID = window.VIBECHECK_CONFIG.instagram.appId;

// Enable debug mode if configured
if (window.VIBECHECK_CONFIG.instagram.debug) {
    localStorage.setItem('debug_instagram', 'true');
}
