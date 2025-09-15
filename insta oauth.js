// Instagram OAuth Integration for VibeCheck AI
class InstagramAuth {
    constructor() {
        // Get configuration from global config or use defaults
        const config = window.VIBECHECK_CONFIG?.instagram || {};
        
        this.clientId = config.appId || window.INSTAGRAM_APP_ID || 'YOUR_INSTAGRAM_APP_ID';
        this.redirectUri = config.redirectUri || window.location.origin + '/auth-callback.html';
        this.scope = config.scope || 'user_profile,user_media';
        this.accessToken = localStorage.getItem('instagram_access_token');
        this.userProfile = JSON.parse(localStorage.getItem('instagram_user_profile') || 'null');
        this.debugMode = config.debug || localStorage.getItem('debug_instagram') === 'true';
    }

    // Initialize Instagram OAuth
    init() {
        this.log('Instagram Auth initialized');
        
        // Check if we have a valid access token
        if (this.accessToken && this.isTokenValid()) {
            this.log('Valid access token found, triggering auth success');
            this.onAuthSuccess();
        } else {
            this.log('No valid access token found');
        }
    }

    // Check if access token is still valid
    isTokenValid() {
        if (!this.accessToken) return false;
        
        // Check token expiry (Instagram tokens typically last 60 days)
        const tokenData = JSON.parse(localStorage.getItem('instagram_token_data') || '{}');
        const expiresAt = tokenData.expires_at;
        
        if (expiresAt && Date.now() > expiresAt) {
            this.logout();
            return false;
        }
        
        return true;
    }

    // Start Instagram OAuth flow
    async connectInstagram() {
        try {
            // Show loading state
            this.showLoadingState('Connecting to Instagram...');

            // Build Instagram OAuth URL
            const authUrl = this.buildAuthUrl();
            
            // Open Instagram OAuth in popup window
            const popup = window.open(
                authUrl,
                'instagram-auth',
                'width=600,height=700,scrollbars=yes,resizable=yes'
            );

            // Listen for popup messages
            const messageListener = (event) => {
                if (event.origin !== window.location.origin) return;
                
                if (event.data.type === 'INSTAGRAM_AUTH_SUCCESS') {
                    this.handleAuthSuccess(event.data);
                    popup.close();
                    window.removeEventListener('message', messageListener);
                } else if (event.data.type === 'INSTAGRAM_AUTH_ERROR') {
                    this.handleAuthError(event.data.error);
                    popup.close();
                    window.removeEventListener('message', messageListener);
                }
            };

            window.addEventListener('message', messageListener);

            // Check if popup was closed manually
            const checkClosed = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkClosed);
                    window.removeEventListener('message', messageListener);
                    this.hideLoadingState();
                }
            }, 1000);

        } catch (error) {
            console.error('Instagram auth error:', error);
            this.handleAuthError('Failed to connect to Instagram');
        }
    }

    // Build Instagram OAuth URL
    buildAuthUrl() {
        const params = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            scope: this.scope,
            response_type: 'code',
            state: this.generateState()
        });

        return `https://api.instagram.com/oauth/authorize?${params.toString()}`;
    }

    // Generate random state for security
    generateState() {
        const state = Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('instagram_oauth_state', state);
        return state;
    }

    // Handle successful authentication
    async handleAuthSuccess(data) {
        try {
            this.hideLoadingState();
            
            // Store access token and user data
            this.accessToken = data.access_token;
            this.userProfile = data.user;
            
            // Calculate token expiry (60 days from now)
            const expiresAt = Date.now() + (60 * 24 * 60 * 60 * 1000);
            
            // Store in localStorage
            localStorage.setItem('instagram_access_token', this.accessToken);
            localStorage.setItem('instagram_user_profile', JSON.stringify(this.userProfile));
            localStorage.setItem('instagram_token_data', JSON.stringify({
                expires_at: expiresAt,
                created_at: Date.now()
            }));

            // Update UI
            this.onAuthSuccess();
            
            // Show success notification
            this.showNotification('Instagram connected successfully! 📸', 'success');

        } catch (error) {
            console.error('Error handling auth success:', error);
            this.handleAuthError('Failed to save Instagram connection');
        }
    }

    // Handle authentication error
    handleAuthError(error) {
        this.hideLoadingState();
        console.error('Instagram auth error:', error);
        this.showNotification('Failed to connect to Instagram. Please try again.', 'error');
    }

    // Called when authentication is successful
    onAuthSuccess() {
        // Update UI to show connected state
        const event = new CustomEvent('instagramConnected', {
            detail: {
                user: this.userProfile,
                accessToken: this.accessToken
            }
        });
        window.dispatchEvent(event);
    }

    // Disconnect Instagram
    logout() {
        this.accessToken = null;
        this.userProfile = null;
        
        // Clear localStorage
        localStorage.removeItem('instagram_access_token');
        localStorage.removeItem('instagram_user_profile');
        localStorage.removeItem('instagram_token_data');
        
        // Update UI
        const event = new CustomEvent('instagramDisconnected');
        window.dispatchEvent(event);
        
        this.showNotification('Instagram disconnected', 'info');
    }

    // Share content to Instagram
    async shareToInstagram(content, type = 'story') {
        if (!this.accessToken) {
            throw new Error('Instagram not connected');
        }

        try {
            this.showLoadingState(`Sharing to Instagram ${type}...`);

            if (type === 'story') {
                await this.shareToStory(content);
            } else if (type === 'post') {
                await this.shareToPost(content);
            }

            this.hideLoadingState();
            this.showNotification(`Successfully shared to Instagram ${type}! 🎉`, 'success');

        } catch (error) {
            this.hideLoadingState();
            console.error('Instagram share error:', error);
            this.showNotification('Failed to share to Instagram. Please try again.', 'error');
            throw error;
        }
    }

    // Share to Instagram Story
    async shareToStory(content) {
        // Instagram Stories API requires a different approach
        // For now, we'll create a shareable URL that opens Instagram
        const shareUrl = this.createStoryShareUrl(content);
        
        // Open Instagram app or web
        window.open(shareUrl, '_blank');
    }

    // Share to Instagram Post
    async shareToPost(content) {
        // Instagram Posts API also requires special handling
        // For now, we'll create a shareable URL
        const shareUrl = this.createPostShareUrl(content);
        
        // Open Instagram app or web
        window.open(shareUrl, '_blank');
    }

    // Create shareable URL for Instagram Story
    createStoryShareUrl(content) {
        const text = encodeURIComponent(content.text || '');
        const imageUrl = content.imageUrl ? encodeURIComponent(content.imageUrl) : '';
        
        // Instagram doesn't have direct story sharing via URL
        // We'll use a workaround with Instagram's web interface
        return `https://www.instagram.com/create/story/?text=${text}`;
    }

    // Create shareable URL for Instagram Post
    createPostShareUrl(content) {
        const text = encodeURIComponent(content.text || '');
        const imageUrl = content.imageUrl ? encodeURIComponent(content.imageUrl) : '';
        
        // Instagram doesn't have direct post sharing via URL
        // We'll use a workaround
        return `https://www.instagram.com/create/?text=${text}`;
    }

    // Get user's Instagram media
    async getUserMedia(limit = 25) {
        if (!this.accessToken) {
            throw new Error('Instagram not connected');
        }

        try {
            const response = await fetch(
                `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=${limit}&access_token=${this.accessToken}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch Instagram media');
            }

            const data = await response.json();
            return data.data || [];

        } catch (error) {
            console.error('Error fetching Instagram media:', error);
            throw error;
        }
    }

    // Get user profile information
    async getUserProfile() {
        if (!this.accessToken) {
            throw new Error('Instagram not connected');
        }

        try {
            const response = await fetch(
                `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${this.accessToken}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch Instagram profile');
            }

            return await response.json();

        } catch (error) {
            console.error('Error fetching Instagram profile:', error);
            throw error;
        }
    }

    // Show loading state
    showLoadingState(message) {
        const loadingOverlay = document.getElementById('loading-overlay');
        const loadingText = document.getElementById('loading-text');
        
        if (loadingOverlay && loadingText) {
            loadingText.textContent = message;
            loadingOverlay.style.display = 'flex';
        }
    }

    // Hide loading state
    hideLoadingState() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 3000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Check if user is connected
    isConnected() {
        return this.accessToken && this.isTokenValid();
    }

    // Get user profile data
    getUserData() {
        return this.userProfile;
    }

    // Get access token
    getAccessToken() {
        return this.accessToken;
    }

    // Debug logging
    log(message, data = null) {
        if (this.debugMode) {
            console.log(`[Instagram Auth] ${message}`, data || '');
        }
    }
}

// Export for use in other files
window.InstagramAuth = InstagramAuth;
