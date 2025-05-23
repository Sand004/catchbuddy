# CatchSmart Equipment Upload Setup Guide

## 🔧 Complete Setup Instructions

This guide will help you set up the image upload and Google Vision API integration for equipment recognition.

## 📋 Prerequisites

Before starting, make sure you have:
- Supabase project created and configured
- Google Cloud account (for Vision API)
- Brave Search API account (optional, for product images)

## 🔐 Required Credentials

### 1. Supabase Configuration

Already set up from the auth guide, but ensure you have:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Google Cloud Vision API

#### Step 1: Enable Vision API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable the Vision API:
   - Go to "APIs & Services" → "Library"
   - Search for "Cloud Vision API"
   - Click on it and press "Enable"

#### Step 2: Create API Key
1. Go to "APIs & Services" → "Credentials"
2. Click "+ CREATE CREDENTIALS" → "API key"
3. Copy the API key
4. (Optional) Restrict the key:
   - Click on the API key name
   - Under "API restrictions", select "Restrict key"
   - Select "Cloud Vision API"
   - Save

#### Step 3: Add to Environment
```env
GOOGLE_CLOUD_API_KEY=your-api-key-here
```

### 3. Brave Search API (Optional)

For automatic product image search:

1. Go to [Brave Search API](https://api.search.brave.com/)
2. Sign up for an account
3. Get your API key from the dashboard
4. Add to environment:
```env
BRAVE_SEARCH_API_KEY=your-brave-api-key
```

### 4. Supabase Storage Bucket

The storage bucket should already exist from the database migrations, but verify:

1. Go to your Supabase dashboard
2. Navigate to Storage
3. Ensure these buckets exist:
   - `equipment-images` (public)
   - `catch-photos` (public)
   - `receipts` (private)

If not, create them manually with the same names and permissions.

## 🚀 Testing the Setup

### 1. Start the Development Server
```bash
cd apps/web
pnpm dev
```

### 2. Navigate to Equipment Page
- Go to http://localhost:3000/de/equipment
- You'll be redirected to the management page

### 3. Test Upload Modes

#### Single Lure Photo:
1. Click "Equipment hinzufügen"
2. Select "Einzelnen Köder fotografieren"
3. Upload or take a photo of a fishing lure
4. The system should extract:
   - Product name
   - Brand (if visible)
   - Size/color (if detectable)
   - Automatically search for product image

#### Receipt/Order Upload:
1. Click "Equipment hinzufügen"
2. Select "Bestellung/Quittung hochladen"
3. Upload a receipt with fishing equipment
4. The system should:
   - Extract multiple products
   - Show prices (if visible)
   - Allow bulk import

### 4. Camera Support
- **Mobile**: Uses device camera
- **Desktop/Laptop**: Uses webcam
- **File Upload**: Standard file picker

## 🔍 Troubleshooting

### "Unauthorized" Error
- Check that you're logged in
- Verify Supabase credentials are correct
- Check browser console for specific auth errors

### Google Vision Not Working
- Verify API key is correct
- Check that Vision API is enabled in Google Cloud Console
- Look for quota/billing issues in Google Cloud Console
- The app will fall back to mock data if Vision API fails

### No Product Images Found
- This is normal - Brave Search may not find images for all products
- You can manually add images later
- Check Brave API key if no images ever appear

### Camera Not Working
- **Desktop**: Allow browser to access webcam when prompted
- **Mobile**: Check app permissions for camera access
- **Note**: Some browsers require HTTPS for camera access (use ngrok for testing)

## 📊 API Limits & Costs

### Google Vision API
- **Free Tier**: 1,000 units/month
- **Pricing**: ~$1.50 per 1,000 images after free tier
- **Our Usage**: 4 features per image (text, labels, logos, objects)

### Brave Search API
- **Free Tier**: 2,000 queries/month
- **Pricing**: Varies by plan
- **Our Usage**: 1 query per extracted product

### Recommendations
- Start with free tiers
- Monitor usage in dashboards
- Set up billing alerts
- Consider caching product images

## 🛡️ Security Notes

1. **API Keys**: Never commit API keys to git
2. **CORS**: Vision API is called from server-side only
3. **File Validation**: Only images under 10MB accepted
4. **Rate Limiting**: Consider adding rate limits for production

## 🎯 Next Steps

1. Test with real fishing equipment photos
2. Fine-tune extraction patterns for German products
3. Add more fishing brands to recognition list
4. Implement caching for product images
5. Add progress indicators for bulk imports

## 📝 Development Tips

### Testing Without APIs
The app works without API keys by using mock data:
- Google Vision: Returns mock product "Rapala Original Floater F11"
- Brave Search: Returns no images

### Adding More Brands
Edit the `extractBrand` function in `/api/vision/process/route.ts` to add more brands.

### Improving Recognition
The system looks for these patterns:
- Sizes: Numbers followed by cm, mm, g, etc.
- Colors: Common color names in German and English
- Prices: Numbers with decimal points (on receipts)
- Keywords: Fishing-related terms to filter products

---

For more help, check the [main documentation](./README.md) or open an issue on GitHub.
