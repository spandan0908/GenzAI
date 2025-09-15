# Instagram OAuth Setup Guide

## 🔧 **Setup Instructions for Real Instagram Integration**

### **Step 1: Create Instagram App**

1. **Go to Facebook Developers Console**
   - Visit: https://developers.facebook.com/
   - Log in with your Facebook account

2. **Create New App**
   - Click "Create App"
   - Choose "Consumer" or "Other" as app type
   - Fill in app details:
     - App Name: "VibeCheck AI" (or your preferred name)
     - App Contact Email: Your email
     - App Purpose: "Social Media Integration"

3. **Add Instagram Basic Display Product**
   - In your app dashboard, click "Add Product"
   - Find "Instagram Basic Display" and click "Set Up"

### **Step 2: Configure Instagram Basic Display**

1. **Get App Credentials**
   - Copy your **App ID** and **App Secret**
   - These will be used in your environment variables

2. **Add Instagram Testers**
   - Go to Instagram Basic Display > Basic Display
   - Add Instagram accounts as testers
   - Each tester needs to accept the invitation

3. **Configure Valid OAuth Redirect URIs**
   - Add: `https://your-domain.com/auth-callback.html`
   - Add: `http://localhost:8000/auth-callback.html` (for local testing)

### **Step 3: Environment Variables**

Create a `.env` file in your project root:

```env
INSTAGRAM_APP_ID=your_instagram_app_id_here
INSTAGRAM_APP_SECRET=your_instagram_app_secret_here
```

### **Step 4: Update Code**

1. **Update `instagram-auth.js`**
   - Replace `YOUR_INSTAGRAM_APP_ID` with your actual App ID
   - Update redirect URI to match your domain

2. **Deploy Backend API**
   - Deploy the `/api/instagram/token.js` endpoint
   - Make sure environment variables are set

### **Step 5: Test Integration**

1. **Local Testing**
   - Run your app locally
   - Try connecting Instagram
   - Check browser console for any errors

2. **Production Testing**
   - Deploy to your domain
   - Test with real Instagram accounts
   - Verify sharing functionality

## 🚨 **Important Notes**

### **Instagram API Limitations**
- **Instagram Basic Display** only allows access to your own content
- **Instagram Graph API** is required for posting content (requires business account)
- **Stories API** requires Instagram Graph API and business verification

### **Current Implementation**
- ✅ **Authentication**: Real Instagram OAuth
- ✅ **User Profile**: Access to user's basic info
- ✅ **Media Access**: View user's Instagram posts
- ⚠️ **Sharing**: Opens Instagram app/web (due to API limitations)
- ❌ **Direct Posting**: Not available with Basic Display API

### **For Full Posting Capabilities**
To enable direct posting to Instagram, you need:

1. **Instagram Graph API** (not Basic Display)
2. **Facebook Business Account**
3. **Instagram Business Account**
4. **App Review Process** (can take weeks)

## 🔄 **Alternative Sharing Methods**

Since direct posting isn't available with Basic Display API, the current implementation:

1. **Opens Instagram App/Web** with pre-filled content
2. **Downloads Shareable Templates** for manual posting
3. **Copies Text to Clipboard** for easy pasting

## 📱 **Mobile App Integration**

For better Instagram integration, consider:

1. **React Native** with Instagram SDK
2. **Flutter** with Instagram plugins
3. **Native iOS/Android** apps with Instagram integration

## 🛠️ **Troubleshooting**

### **Common Issues**

1. **"Invalid redirect URI"**
   - Check that your redirect URI exactly matches what's configured in Facebook Developer Console

2. **"App not approved"**
   - Make sure you've added testers and they've accepted invitations

3. **"Token exchange failed"**
   - Verify your App Secret is correct
   - Check that your backend API is accessible

4. **"Permission denied"**
   - Ensure the Instagram account is added as a tester
   - Check that the account has accepted the invitation

### **Debug Mode**
Enable debug logging by adding this to your browser console:
```javascript
localStorage.setItem('debug_instagram', 'true');
```

## 📚 **Resources**

- [Instagram Basic Display API Docs](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Facebook Developers Console](https://developers.facebook.com/)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)

## 🎯 **Next Steps**

1. **Set up Instagram App** following the steps above
2. **Update environment variables** with your credentials
3. **Test the integration** locally and in production
4. **Consider upgrading** to Instagram Graph API for full posting capabilities

---

**Note**: This setup provides real Instagram authentication and user data access. For direct content posting, you'll need to upgrade to Instagram Graph API and go through Facebook's app review process.
