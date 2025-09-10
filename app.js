// VibeCheck AI - Main Application Logic
class VibeCheckAI {
    constructor() {
        this.vibeTribes = [
            {
                id: 'aesthetic',
                name: 'Aesthetic Kid',
                emoji: '✨',
                description: 'VSCO vibes, soft colors, sunset content',
                color: '#8b5cf6',
                keywords: ['aesthetic', 'vsco', 'soft', 'sunset', 'pastel', 'mood', 'vibe']
            },
            {
                id: 'maincharacter',
                name: 'Main Character',
                emoji: '🎭',
                description: 'Wants to go viral, loves trends, main character energy',
                color: '#ec4899',
                keywords: ['main character', 'viral', 'trend', 'energy', 'iconic', 'slay']
            },
            {
                id: 'studytok',
                name: 'StudyTok',
                emoji: '🧠',
                description: 'Productivity, learning, academic motivation',
                color: '#06b6d4',
                keywords: ['study', 'productivity', 'learning', 'academic', 'motivation', 'tips']
            },
            {
                id: 'glowup',
                name: 'Glow Up',
                emoji: '💅',
                description: 'Self-improvement, skincare, lifestyle content',
                color: '#10b981',
                keywords: ['glow up', 'skincare', 'self improvement', 'lifestyle', 'routine', 'transformation']
            },
            {
                id: 'gamer',
                name: 'Gamer',
                emoji: '🎮',
                description: 'Gaming, memes, internet culture',
                color: '#f59e0b',
                keywords: ['gaming', 'gamer', 'meme', 'internet', 'culture', 'funny', 'epic']
            },
            {
                id: 'eco',
                name: 'Eco Warrior',
                emoji: '🌱',
                description: 'Sustainability, activism, conscious living',
                color: '#10b981',
                keywords: ['eco', 'sustainable', 'environment', 'activism', 'conscious', 'green']
            },
            {
                id: 'hustle',
                name: 'Hustle',
                emoji: '💸',
                description: 'Side hustles, money tips, entrepreneurship',
                color: '#ef4444',
                keywords: ['hustle', 'money', 'business', 'entrepreneur', 'side hustle', 'grind']
            },
            {
                id: 'music',
                name: 'Music Head',
                emoji: '🎵',
                description: 'Discovers new music, concert content, artist stanning',
                color: '#8b5cf6',
                keywords: ['music', 'concert', 'artist', 'song', 'album', 'stan', 'discover']
            }
        ];

        this.currentContent = null;
        this.analysisResults = null;
        this.userProfile = {
            totalAnalyses: 0,
            averageScore: 0,
            topTribe: null,
            analyses: [],
            isInstagramConnected: false
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateExamples();
        this.showSection('upload-section');
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('trends-btn').addEventListener('click', () => this.showSection('trending-section'));
        document.getElementById('leaderboard-btn').addEventListener('click', () => this.showSection('leaderboard-section'));
        document.getElementById('profile-btn').addEventListener('click', () => this.showSection('profile-section'));
        document.getElementById('upload-btn').addEventListener('click', () => this.showSection('upload-section'));

        // Upload functionality
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');
        const fileInputBtn = document.getElementById('file-input-btn');
        const captionInput = document.getElementById('caption-input');
        const analyzeBtn = document.getElementById('analyze-btn');

        // File upload
        fileInputBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFileUpload(e);
        });

        // Caption input
        captionInput.addEventListener('input', () => this.updateAnalyzeButton());
        
        // Analyze button
        analyzeBtn.addEventListener('click', () => this.analyzeContent());

        // Share buttons
        document.getElementById('share-instagram-story').addEventListener('click', () => this.shareToInstagram('story'));
        document.getElementById('share-instagram-post').addEventListener('click', () => this.shareToInstagram('post'));
        document.getElementById('share-tweet').addEventListener('click', () => this.shareResults('tweet'));
        document.getElementById('copy-link').addEventListener('click', () => this.shareResults('link'));

        // Instagram connection
        document.getElementById('connect-instagram').addEventListener('click', () => this.showInstagramModal());
        document.getElementById('connect-instagram-profile').addEventListener('click', () => this.showInstagramModal());
        document.getElementById('instagram-oauth').addEventListener('click', () => this.connectInstagram());

        // Modal controls
        document.getElementById('close-modal').addEventListener('click', () => this.hideModal('instagram-modal'));
        document.getElementById('close-share-modal').addEventListener('click', () => this.hideModal('share-modal'));

        // Share modal
        document.getElementById('confirm-share').addEventListener('click', () => this.confirmInstagramShare());
        document.getElementById('download-template').addEventListener('click', () => this.downloadTemplate());

        // Recommendation tabs
        document.querySelectorAll('.rec-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchRecommendationTab(e.target.dataset.tab));
        });

        // Hashtag actions
        document.getElementById('copy-hashtags').addEventListener('click', () => this.copyHashtags());
        document.getElementById('generate-more-hashtags').addEventListener('click', () => this.generateMoreHashtags());

        // Song actions
        document.getElementById('preview-songs').addEventListener('click', () => this.previewSongs());
        document.getElementById('find-similar-songs').addEventListener('click', () => this.findSimilarSongs());

        // Timing actions
        document.getElementById('set-reminder').addEventListener('click', () => this.setReminder());
        document.getElementById('schedule-post').addEventListener('click', () => this.schedulePost());
    }

    populateExamples() {
        const examples = [
            'POV: you found THE skincare routine that actually works',
            '5 AI tools that will change your life (no cap)',
            'Study with me: productive day in my life',
            'This aesthetic is everything ✨',
            'Main character energy activated',
            'New music discovery that hits different'
        ];

        const examplesContainer = document.getElementById('examples');
        examples.forEach(example => {
            const chip = document.createElement('div');
            chip.className = 'chip';
            chip.textContent = example;
            chip.addEventListener('click', () => {
                document.getElementById('caption-input').value = example;
                this.updateAnalyzeButton();
            });
            examplesContainer.appendChild(chip);
        });
    }

    showSection(sectionId) {
        // Hide all sections
        const sections = ['upload-section', 'results-section', 'trending-section', 'leaderboard-section'];
        sections.forEach(id => {
            document.getElementById(id).style.display = 'none';
        });

        // Show selected section
        document.getElementById(sectionId).style.display = 'block';

        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        if (sectionId === 'upload-section') {
            document.getElementById('upload-btn').classList.add('active');
        } else if (sectionId === 'trending-section') {
            document.getElementById('trends-btn').classList.add('active');
        } else if (sectionId === 'leaderboard-section') {
            document.getElementById('leaderboard-btn').classList.add('active');
        } else if (sectionId === 'profile-section') {
            document.getElementById('profile-btn').classList.add('active');
            this.updateProfile();
        }
    }

    handleFileUpload(event) {
        const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
        if (files.length > 0) {
            const file = files[0];
            this.currentContent = {
                type: file.type.startsWith('video/') ? 'video' : 'image',
                file: file,
                name: file.name
            };
            this.updateAnalyzeButton();
            this.showFilePreview(file);
        }
    }

    showFilePreview(file) {
        const uploadArea = document.getElementById('upload-area');
        const reader = new FileReader();
        
        reader.onload = (e) => {
            uploadArea.innerHTML = `
                <div class="file-preview">
                    <img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 8px;">
                    <p>${file.name}</p>
                </div>
            `;
        };
        
        if (file.type.startsWith('image/')) {
            reader.readAsDataURL(file);
        }
    }

    updateAnalyzeButton() {
        const captionInput = document.getElementById('caption-input');
        const analyzeBtn = document.getElementById('analyze-btn');
        const hasContent = this.currentContent || captionInput.value.trim();
        
        analyzeBtn.disabled = !hasContent;
    }

    async analyzeContent() {
        const captionInput = document.getElementById('caption-input');
        const content = captionInput.value.trim();
        
        if (!this.currentContent && !content) return;

        // Show loading overlay
        this.showLoadingOverlay();

        // Simulate AI analysis
        await this.simulateAnalysis(content);

        // Hide loading and show results
        this.hideLoadingOverlay();
        this.showResults();
        this.updateUserProfile();
    }

    showLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        const loadingText = document.getElementById('loading-text');
        
        const messages = [
            'Checking with vibe tribes...',
            'Analyzing aesthetic potential...',
            'Calculating viral probability...',
            'Generating optimization tips...',
            'Almost done...'
        ];

        let messageIndex = 0;
        loadingText.textContent = messages[messageIndex];
        
        const messageInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % messages.length;
            loadingText.textContent = messages[messageIndex];
        }, 1000);

        overlay.style.display = 'flex';
        overlay.messageInterval = messageInterval;
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay.messageInterval) {
            clearInterval(overlay.messageInterval);
        }
        overlay.style.display = 'none';
    }

    async simulateAnalysis(content) {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Generate mock analysis results
        this.analysisResults = {
            overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
            tribes: this.vibeTribes.map(tribe => {
                const baseScore = Math.floor(Math.random() * 40) + 30; // 30-70
                const keywordBoost = this.calculateKeywordBoost(content, tribe.keywords);
                const finalScore = Math.min(100, baseScore + keywordBoost);
                
                return {
                    ...tribe,
                    score: finalScore,
                    feedback: this.generateFeedback(tribe, finalScore, content)
                };
            }),
            suggestions: this.generateSuggestions(content)
        };

        // Sort tribes by score
        this.analysisResults.tribes.sort((a, b) => b.score - a.score);
    }

    calculateKeywordBoost(content, keywords) {
        if (!content) return 0;
        
        const contentLower = content.toLowerCase();
        let boost = 0;
        
        keywords.forEach(keyword => {
            if (contentLower.includes(keyword.toLowerCase())) {
                boost += 15;
            }
        });
        
        return Math.min(boost, 30); // Max 30 point boost
    }

    generateFeedback(tribe, score, content) {
        const feedbacks = {
            aesthetic: [
                'This has major VSCO potential! ✨',
                'The aesthetic vibes are strong with this one',
                'Perfect for sunset golden hour content',
                'Soft colors and moody vibes detected'
            ],
            maincharacter: [
                'Main character energy ACTIVATED! 🎭',
                'This is about to go viral, no cap',
                'Iconic main character moment incoming',
                'The confidence is radiating through the screen'
            ],
            studytok: [
                'StudyTok would eat this up! 📚',
                'Productivity queen/king energy',
                'Perfect for motivation Monday content',
                'Academic excellence vibes detected'
            ],
            glowup: [
                'Glow up transformation incoming! 💅',
                'Self-improvement goals right here',
                'Skincare routine worthy content',
                'Lifestyle upgrade in progress'
            ],
            gamer: [
                'Gamer approved! 🎮',
                'This hits different for the gaming community',
                'Epic gamer moment captured',
                'Internet culture at its finest'
            ],
            eco: [
                'Eco warrior approved! 🌱',
                'Sustainable living goals',
                'Conscious consumer vibes',
                'Environmental impact positive'
            ],
            hustle: [
                'Hustle culture approved! 💸',
                'Entrepreneur energy detected',
                'Side hustle motivation incoming',
                'Business mindset activated'
            ],
            music: [
                'Music head approved! 🎵',
                'This song hits different',
                'Concert energy captured perfectly',
                'New music discovery vibes'
            ]
        };

        const tribeFeedbacks = feedbacks[tribe.id] || ['Interesting content detected'];
        return tribeFeedbacks[Math.floor(Math.random() * tribeFeedbacks.length)];
    }

    generateSuggestions(content) {
        const suggestions = [
            {
                icon: '✨',
                title: 'Add trending hashtags',
                description: 'Include #fyp #viral #trending to boost discoverability'
            },
            {
                icon: '🎵',
                title: 'Use trending audio',
                description: 'Add popular sounds that match your vibe tribe'
            },
            {
                icon: '⏰',
                title: 'Post at optimal time',
                description: '7-9 PM EST gets the best engagement for your content type'
            },
            {
                icon: '📱',
                title: 'Optimize for mobile',
                description: 'Make sure text is readable on phone screens'
            }
        ];

        // Add content-specific suggestions
        if (content.toLowerCase().includes('pov')) {
            suggestions.push({
                icon: '🎭',
                title: 'POV is trending!',
                description: 'You\'re already using a viral format - keep it up!'
            });
        }

        if (content.toLowerCase().includes('aesthetic')) {
            suggestions.push({
                icon: '✨',
                title: 'Aesthetic content alert',
                description: 'Consider adding soft filters and pastel colors'
            });
        }

        return suggestions.slice(0, 4); // Return top 4 suggestions
    }

    showResults() {
        this.showSection('results-section');
        this.populateResults();
    }

    populateResults() {
        // Update overall score
        document.getElementById('overall-score').textContent = this.analysisResults.overallScore;

        // Populate vibe tribes
        const tribesContainer = document.getElementById('vibe-tribes');
        tribesContainer.innerHTML = '';

        this.analysisResults.tribes.forEach(tribe => {
            const tribeElement = document.createElement('div');
            tribeElement.className = 'vibe-tribe';
            tribeElement.innerHTML = `
                <div class="tribe-header">
                    <div class="tribe-emoji">${tribe.emoji}</div>
                    <div class="tribe-info">
                        <h4>${tribe.name}</h4>
                        <p>${tribe.description}</p>
                    </div>
                </div>
                <div class="tribe-score">
                    <div class="score-bar">
                        <div class="score-fill" style="width: ${tribe.score}%"></div>
                    </div>
                    <div class="score-value">${tribe.score}</div>
                </div>
                <div class="tribe-feedback">${tribe.feedback}</div>
            `;
            tribesContainer.appendChild(tribeElement);
        });

        // Populate suggestions
        const suggestionsContainer = document.getElementById('suggestion-list');
        suggestionsContainer.innerHTML = '';

        this.analysisResults.suggestions.forEach(suggestion => {
            const suggestionElement = document.createElement('div');
            suggestionElement.className = 'suggestion-item';
            suggestionElement.innerHTML = `
                <div class="suggestion-icon">${suggestion.icon}</div>
                <div class="suggestion-content">
                    <h5>${suggestion.title}</h5>
                    <p>${suggestion.description}</p>
                </div>
            `;
            suggestionsContainer.appendChild(suggestionElement);
        });

        // Populate recommendations
        this.populateRecommendations();
    }

    shareResults(platform) {
        const score = this.analysisResults.overallScore;
        const topTribe = this.analysisResults.tribes[0];
        
        const shareText = `Just got a ${score} vibe score on VibeCheck AI! My top tribe is ${topTribe.name} ${topTribe.emoji} Check it out: vibecheck-ai.com`;
        
        switch (platform) {
            case 'story':
                // For Instagram Story
                this.copyToClipboard(shareText);
                this.showNotification('Copied to clipboard! Paste in your story 📱');
                break;
            case 'tweet':
                // For Twitter
                const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
                window.open(tweetUrl, '_blank');
                break;
            case 'link':
                this.copyToClipboard(shareText);
                this.showNotification('Link copied to clipboard! 🔗');
                break;
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        });
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--gradient-primary);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Instagram Integration Methods
    showInstagramModal() {
        document.getElementById('instagram-modal').style.display = 'flex';
    }

    hideModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    connectInstagram() {
        // Simulate Instagram OAuth
        this.showLoadingOverlay();
        
        setTimeout(() => {
            this.hideLoadingOverlay();
            this.userProfile.isInstagramConnected = true;
            this.hideModal('instagram-modal');
            this.updateInstagramStatus();
            this.showNotification('Instagram connected successfully! 📸');
        }, 2000);
    }

    updateInstagramStatus() {
        const statusElement = document.getElementById('instagram-status');
        const connectionStatus = document.getElementById('connection-status');
        
        if (this.userProfile.isInstagramConnected) {
            statusElement.innerHTML = `
                <p>✅ Instagram connected! You can now share directly to your stories and posts.</p>
                <button class="connect-btn" id="disconnect-instagram">Disconnect</button>
            `;
            
            connectionStatus.innerHTML = `
                <div class="status-connected">
                    <div class="status-icon">✅</div>
                    <div class="status-text">
                        <h4>Connected</h4>
                        <p>Share vibe scores directly to your Instagram stories and posts</p>
                    </div>
                    <button class="connect-btn" id="disconnect-instagram-profile">Disconnect</button>
                </div>
            `;
        }
    }

    shareToInstagram(type) {
        if (!this.userProfile.isInstagramConnected) {
            this.showInstagramModal();
            return;
        }
        
        this.showShareModal(type);
    }

    showShareModal(type) {
        const modal = document.getElementById('share-modal');
        const previewScore = document.getElementById('preview-score');
        const previewTribe = document.getElementById('preview-tribe');
        const previewFeedback = document.getElementById('preview-feedback');
        
        previewScore.textContent = this.analysisResults.overallScore;
        previewTribe.textContent = this.analysisResults.tribes[0].name;
        previewFeedback.textContent = this.analysisResults.tribes[0].feedback;
        
        // Set default share type
        document.querySelector(`input[name="share-type"][value="${type}"]`).checked = true;
        
        modal.style.display = 'flex';
    }

    confirmInstagramShare() {
        const shareType = document.querySelector('input[name="share-type"]:checked').value;
        const caption = document.getElementById('share-caption').value;
        
        this.showLoadingOverlay();
        
        setTimeout(() => {
            this.hideLoadingOverlay();
            this.hideModal('share-modal');
            this.showNotification(`Shared to Instagram ${shareType}! 🎉`);
        }, 2000);
    }

    downloadTemplate() {
        // Create a canvas to generate the template
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 1080;
        canvas.height = 1920;
        
        // Draw the template
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 80px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.analysisResults.overallScore, canvas.width/2, canvas.height/2 - 100);
        
        ctx.font = '40px Arial';
        ctx.fillText('Vibe Score', canvas.width/2, canvas.height/2 - 20);
        
        ctx.font = '60px Arial';
        ctx.fillText(this.analysisResults.tribes[0].name, canvas.width/2, canvas.height/2 + 100);
        
        // Download
        const link = document.createElement('a');
        link.download = 'vibe-score-template.png';
        link.href = canvas.toDataURL();
        link.click();
        
        this.showNotification('Template downloaded! 📱');
    }

    // Recommendation Methods
    populateRecommendations() {
        this.populateHashtags();
        this.populateSongs();
        this.populateTiming();
    }

    populateHashtags() {
        const hashtagGrid = document.getElementById('hashtag-grid');
        const topTribe = this.analysisResults.tribes[0];
        
        const hashtags = this.getHashtagsForTribe(topTribe.id);
        
        hashtagGrid.innerHTML = '';
        hashtags.forEach((hashtag, index) => {
            const hashtagElement = document.createElement('div');
            hashtagElement.className = `hashtag-item ${index < 3 ? 'trending' : ''}`;
            hashtagElement.innerHTML = `
                <div class="hashtag-text">#${hashtag.tag}</div>
                <div class="hashtag-count">${hashtag.count} posts</div>
            `;
            hashtagElement.addEventListener('click', () => {
                this.copyToClipboard(`#${hashtag.tag}`);
                this.showNotification(`Copied #${hashtag.tag}! 📋`);
            });
            hashtagGrid.appendChild(hashtagElement);
        });
    }

    getHashtagsForTribe(tribeId) {
        const hashtagDatabase = {
            aesthetic: [
                { tag: 'aesthetic', count: '2.3M' },
                { tag: 'vsco', count: '1.8M' },
                { tag: 'soft', count: '1.2M' },
                { tag: 'sunset', count: '950K' },
                { tag: 'pastel', count: '780K' },
                { tag: 'mood', count: '650K' },
                { tag: 'vibe', count: '520K' },
                { tag: 'softaesthetic', count: '420K' }
            ],
            maincharacter: [
                { tag: 'maincharacter', count: '1.9M' },
                { tag: 'viral', count: '1.5M' },
                { tag: 'trending', count: '1.2M' },
                { tag: 'energy', count: '980K' },
                { tag: 'iconic', count: '750K' },
                { tag: 'slay', count: '680K' },
                { tag: 'maincharactermoment', count: '540K' },
                { tag: 'viralcontent', count: '420K' }
            ],
            studytok: [
                { tag: 'studytok', count: '1.7M' },
                { tag: 'productivity', count: '1.3M' },
                { tag: 'study', count: '1.1M' },
                { tag: 'learning', count: '890K' },
                { tag: 'academic', count: '720K' },
                { tag: 'motivation', count: '650K' },
                { tag: 'studytips', count: '580K' },
                { tag: 'productivitytips', count: '450K' }
            ],
            glowup: [
                { tag: 'glowup', count: '2.1M' },
                { tag: 'skincare', count: '1.6M' },
                { tag: 'selfimprovement', count: '1.2M' },
                { tag: 'lifestyle', count: '950K' },
                { tag: 'routine', count: '820K' },
                { tag: 'transformation', count: '680K' },
                { tag: 'selfcare', count: '590K' },
                { tag: 'glowuptips', count: '480K' }
            ],
            gamer: [
                { tag: 'gaming', count: '2.5M' },
                { tag: 'gamer', count: '1.9M' },
                { tag: 'meme', count: '1.4M' },
                { tag: 'internet', count: '1.1M' },
                { tag: 'culture', count: '850K' },
                { tag: 'funny', count: '720K' },
                { tag: 'epic', count: '650K' },
                { tag: 'gamingmemes', count: '520K' }
            ],
            eco: [
                { tag: 'eco', count: '1.2M' },
                { tag: 'sustainable', count: '980K' },
                { tag: 'environment', count: '850K' },
                { tag: 'activism', count: '720K' },
                { tag: 'conscious', count: '650K' },
                { tag: 'green', count: '580K' },
                { tag: 'ecofriendly', count: '520K' },
                { tag: 'sustainability', count: '450K' }
            ],
            hustle: [
                { tag: 'hustle', count: '1.8M' },
                { tag: 'money', count: '1.4M' },
                { tag: 'business', count: '1.2M' },
                { tag: 'entrepreneur', count: '950K' },
                { tag: 'sidehustle', count: '820K' },
                { tag: 'grind', count: '720K' },
                { tag: 'hustleculture', count: '650K' },
                { tag: 'moneytips', count: '580K' }
            ],
            music: [
                { tag: 'music', count: '2.2M' },
                { tag: 'concert', count: '1.5M' },
                { tag: 'artist', count: '1.3M' },
                { tag: 'song', count: '1.1M' },
                { tag: 'album', count: '850K' },
                { tag: 'stan', count: '720K' },
                { tag: 'discover', count: '650K' },
                { tag: 'newmusic', count: '580K' }
            ]
        };
        
        return hashtagDatabase[tribeId] || hashtagDatabase.aesthetic;
    }

    populateSongs() {
        const songsGrid = document.getElementById('songs-grid');
        const topTribe = this.analysisResults.tribes[0];
        
        const songs = this.getSongsForTribe(topTribe.id);
        
        songsGrid.innerHTML = '';
        songs.forEach((song, index) => {
            const songElement = document.createElement('div');
            songElement.className = `song-item ${index < 2 ? 'trending' : ''}`;
            songElement.innerHTML = `
                <div class="song-header">
                    <div class="song-cover">🎵</div>
                    <div class="song-info">
                        <h5>${song.title}</h5>
                        <p>${song.artist}</p>
                    </div>
                </div>
                <div class="song-stats">
                    <span class="song-trend">+${song.trend}%</span>
                    <span class="song-duration">${song.duration}</span>
                </div>
                <div class="song-actions">
                    <button class="song-play-btn">▶️ Play</button>
                    <button class="song-add-btn">➕ Add</button>
                </div>
            `;
            songsGrid.appendChild(songElement);
        });
    }

    getSongsForTribe(tribeId) {
        const songDatabase = {
            aesthetic: [
                { title: 'Sunset Dreams', artist: 'Lofi Girl', trend: 45, duration: '2:30' },
                { title: 'Soft Vibes', artist: 'Chill Beats', trend: 38, duration: '3:15' },
                { title: 'Pastel Memories', artist: 'Dreamy Sounds', trend: 32, duration: '2:45' },
                { title: 'Golden Hour', artist: 'Ambient Music', trend: 28, duration: '4:20' }
            ],
            maincharacter: [
                { title: 'Main Character Energy', artist: 'Viral Hits', trend: 67, duration: '2:15' },
                { title: 'Iconic Moment', artist: 'Trending Now', trend: 54, duration: '1:45' },
                { title: 'Slay Queen', artist: 'Pop Hits', trend: 48, duration: '2:30' },
                { title: 'Viral Vibes', artist: 'TikTok Sounds', trend: 42, duration: '1:30' }
            ],
            studytok: [
                { title: 'Study Mode', artist: 'Focus Music', trend: 52, duration: '3:00' },
                { title: 'Productivity Boost', artist: 'Motivation Mix', trend: 41, duration: '2:45' },
                { title: 'Academic Excellence', artist: 'Study Beats', trend: 35, duration: '4:15' },
                { title: 'Learning Flow', artist: 'Concentration', trend: 29, duration: '3:30' }
            ],
            glowup: [
                { title: 'Glow Up Anthem', artist: 'Self Love', trend: 58, duration: '2:20' },
                { title: 'Skincare Routine', artist: 'Wellness Vibes', trend: 44, duration: '1:50' },
                { title: 'Transformation', artist: 'Growth Music', trend: 37, duration: '3:10' },
                { title: 'Self Care Sunday', artist: 'Relaxation', trend: 31, duration: '4:00' }
            ],
            gamer: [
                { title: 'Epic Gaming', artist: 'Gamer Anthems', trend: 61, duration: '2:45' },
                { title: 'Meme Music', artist: 'Internet Culture', trend: 49, duration: '1:20' },
                { title: 'Gaming Vibes', artist: 'Player One', trend: 43, duration: '3:25' },
                { title: 'Funny Moments', artist: 'Comedy Beats', trend: 36, duration: '2:10' }
            ],
            eco: [
                { title: 'Earth Song', artist: 'Nature Sounds', trend: 39, duration: '3:45' },
                { title: 'Sustainable Living', artist: 'Green Vibes', trend: 33, duration: '2:55' },
                { title: 'Conscious Choice', artist: 'Eco Music', trend: 27, duration: '4:10' },
                { title: 'Green Future', artist: 'Environmental', trend: 24, duration: '3:20' }
            ],
            hustle: [
                { title: 'Hustle Hard', artist: 'Motivation Mix', trend: 55, duration: '2:30' },
                { title: 'Money Moves', artist: 'Success Music', trend: 47, duration: '2:15' },
                { title: 'Business Mindset', artist: 'Entrepreneur', trend: 41, duration: '3:00' },
                { title: 'Grind Mode', artist: 'Work Hard', trend: 35, duration: '2:45' }
            ],
            music: [
                { title: 'New Discovery', artist: 'Fresh Sounds', trend: 63, duration: '2:40' },
                { title: 'Concert Energy', artist: 'Live Music', trend: 51, duration: '3:15' },
                { title: 'Artist Stan', artist: 'Fan Music', trend: 45, duration: '2:25' },
                { title: 'Album Drop', artist: 'New Release', trend: 38, duration: '3:50' }
            ]
        };
        
        return songDatabase[tribeId] || songDatabase.aesthetic;
    }

    populateTiming() {
        const timingContainer = document.getElementById('timing-recommendations');
        const topTribe = this.analysisResults.tribes[0];
        
        const timings = this.getTimingForTribe(topTribe.id);
        
        timingContainer.innerHTML = '';
        timings.forEach((timing, index) => {
            const timingElement = document.createElement('div');
            timingElement.className = `timing-item ${index === 0 ? 'optimal' : ''}`;
            timingElement.innerHTML = `
                <div class="timing-time">${timing.time}</div>
                <div class="timing-day">${timing.day}</div>
                <div class="timing-engagement">${timing.engagement}</div>
                <div class="timing-audience">${timing.audience}</div>
            `;
            timingContainer.appendChild(timingElement);
        });
    }

    getTimingForTribe(tribeId) {
        const timingDatabase = {
            aesthetic: [
                { time: '7:00 PM', day: 'Sunday', engagement: '+47% engagement', audience: 'Peak aesthetic time' },
                { time: '6:30 PM', day: 'Friday', engagement: '+42% engagement', audience: 'Weekend vibes' },
                { time: '8:00 PM', day: 'Wednesday', engagement: '+38% engagement', audience: 'Midweek mood' },
                { time: '7:30 PM', day: 'Saturday', engagement: '+35% engagement', audience: 'Relaxed weekend' }
            ],
            maincharacter: [
                { time: '8:00 PM', day: 'Friday', engagement: '+52% engagement', audience: 'Main character energy' },
                { time: '7:30 PM', day: 'Saturday', engagement: '+48% engagement', audience: 'Weekend vibes' },
                { time: '9:00 PM', day: 'Thursday', engagement: '+44% engagement', audience: 'Pre-weekend energy' },
                { time: '8:30 PM', day: 'Sunday', engagement: '+41% engagement', audience: 'Sunday main character' }
            ],
            studytok: [
                { time: '7:00 PM', day: 'Monday', engagement: '+45% engagement', audience: 'Monday motivation' },
                { time: '6:30 PM', day: 'Tuesday', engagement: '+42% engagement', audience: 'Study motivation' },
                { time: '8:00 PM', day: 'Wednesday', engagement: '+39% engagement', audience: 'Midweek focus' },
                { time: '7:30 PM', day: 'Thursday', engagement: '+36% engagement', audience: 'Pre-weekend study' }
            ],
            glowup: [
                { time: '8:30 PM', day: 'Sunday', engagement: '+49% engagement', audience: 'Sunday self-care' },
                { time: '7:00 PM', day: 'Friday', engagement: '+45% engagement', audience: 'Weekend glow-up' },
                { time: '8:00 PM', day: 'Saturday', engagement: '+42% engagement', audience: 'Saturday routine' },
                { time: '7:30 PM', day: 'Wednesday', engagement: '+38% engagement', audience: 'Midweek glow' }
            ],
            gamer: [
                { time: '9:00 PM', day: 'Friday', engagement: '+54% engagement', audience: 'Gaming weekend' },
                { time: '8:30 PM', day: 'Saturday', engagement: '+51% engagement', audience: 'Saturday gaming' },
                { time: '10:00 PM', day: 'Thursday', engagement: '+47% engagement', audience: 'Late night gaming' },
                { time: '9:30 PM', day: 'Sunday', engagement: '+44% engagement', audience: 'Sunday gaming' }
            ],
            eco: [
                { time: '6:00 PM', day: 'Tuesday', engagement: '+41% engagement', audience: 'Eco awareness' },
                { time: '7:00 PM', day: 'Thursday', engagement: '+38% engagement', audience: 'Sustainable living' },
                { time: '5:30 PM', day: 'Monday', engagement: '+35% engagement', audience: 'Green Monday' },
                { time: '6:30 PM', day: 'Wednesday', engagement: '+32% engagement', audience: 'Midweek eco' }
            ],
            hustle: [
                { time: '7:00 AM', day: 'Monday', engagement: '+48% engagement', audience: 'Monday motivation' },
                { time: '6:30 AM', day: 'Tuesday', engagement: '+45% engagement', audience: 'Early hustle' },
                { time: '8:00 AM', day: 'Wednesday', engagement: '+42% engagement', audience: 'Midweek grind' },
                { time: '7:30 AM', day: 'Thursday', engagement: '+39% engagement', audience: 'Pre-weekend hustle' }
            ],
            music: [
                { time: '8:00 PM', day: 'Friday', engagement: '+51% engagement', audience: 'Music discovery' },
                { time: '7:30 PM', day: 'Saturday', engagement: '+48% engagement', audience: 'Weekend music' },
                { time: '9:00 PM', day: 'Thursday', engagement: '+44% engagement', audience: 'Pre-weekend vibes' },
                { time: '8:30 PM', day: 'Sunday', engagement: '+41% engagement', audience: 'Sunday sounds' }
            ]
        };
        
        return timingDatabase[tribeId] || timingDatabase.aesthetic;
    }

    // Recommendation Tab Methods
    switchRecommendationTab(tabName) {
        // Update tabs
        document.querySelectorAll('.rec-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update content
        document.querySelectorAll('.rec-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}-content`).classList.add('active');
    }

    // Hashtag Actions
    copyHashtags() {
        const hashtagItems = document.querySelectorAll('.hashtag-text');
        const hashtags = Array.from(hashtagItems).map(item => item.textContent).join(' ');
        this.copyToClipboard(hashtags);
        this.showNotification('All hashtags copied! 📋');
    }

    generateMoreHashtags() {
        this.showLoadingOverlay();
        setTimeout(() => {
            this.hideLoadingOverlay();
            this.populateHashtags();
            this.showNotification('New hashtags generated! ✨');
        }, 1500);
    }

    // Song Actions
    previewSongs() {
        this.showNotification('Song previews coming soon! 🎧');
    }

    findSimilarSongs() {
        this.showLoadingOverlay();
        setTimeout(() => {
            this.hideLoadingOverlay();
            this.populateSongs();
            this.showNotification('Similar songs found! 🔍');
        }, 2000);
    }

    // Timing Actions
    setReminder() {
        this.showNotification('Reminder set! ⏰');
    }

    schedulePost() {
        this.showNotification('Post scheduled! 📅');
    }

    // Profile Methods
    updateUserProfile() {
        this.userProfile.totalAnalyses++;
        this.userProfile.analyses.push({
            score: this.analysisResults.overallScore,
            topTribe: this.analysisResults.tribes[0].name,
            timestamp: new Date()
        });
        
        // Calculate average score
        const totalScore = this.userProfile.analyses.reduce((sum, analysis) => sum + analysis.score, 0);
        this.userProfile.averageScore = Math.round(totalScore / this.userProfile.analyses.length);
        
        // Find most common tribe
        const tribeCounts = {};
        this.userProfile.analyses.forEach(analysis => {
            tribeCounts[analysis.topTribe] = (tribeCounts[analysis.topTribe] || 0) + 1;
        });
        this.userProfile.topTribe = Object.keys(tribeCounts).reduce((a, b) => 
            tribeCounts[a] > tribeCounts[b] ? a : b
        );
    }

    updateProfile() {
        document.getElementById('total-analyses').textContent = this.userProfile.totalAnalyses;
        document.getElementById('avg-score').textContent = this.userProfile.averageScore;
        document.getElementById('top-tribe').textContent = this.userProfile.topTribe || '-';
        
        this.updateInstagramStatus();
        this.populateRecentAnalyses();
    }

    populateRecentAnalyses() {
        const analysesList = document.getElementById('analyses-list');
        
        if (this.userProfile.analyses.length === 0) {
            analysesList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📱</div>
                    <p>No analyses yet. Upload some content to get started!</p>
                </div>
            `;
            return;
        }
        
        analysesList.innerHTML = '';
        this.userProfile.analyses.slice(-5).reverse().forEach(analysis => {
            const analysisElement = document.createElement('div');
            analysisElement.className = 'analysis-item';
            analysisElement.innerHTML = `
                <div class="analysis-score">${analysis.score}</div>
                <div class="analysis-tribe">${analysis.topTribe}</div>
                <div class="analysis-date">${analysis.timestamp.toLocaleDateString()}</div>
            `;
            analysesList.appendChild(analysisElement);
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VibeCheckAI();
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
