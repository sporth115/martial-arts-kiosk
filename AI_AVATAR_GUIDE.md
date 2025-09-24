# AI Avatar Generation Guide

## Overview

The martial arts kiosk now includes AI-powered avatar generation using the Pollinations API. This allows administrators to create unique, custom avatars for students instead of using only emoji icons.

## Features

- **AI-Generated Avatars**: Create custom avatars using text descriptions
- **Preset Prompts**: Quick-start templates for martial arts themed avatars
- **Image Preview**: See generated avatars before applying them
- **Bearer Token Support**: Use your Pollinations token for higher rate limits
- **Fallback Support**: Works without token (with rate limits)

## Setup

### 1. Get a Pollinations Token (Optional but Recommended)

1. Visit [https://pollinations.ai](https://pollinations.ai)
2. Sign up for an account
3. Get your bearer token from the dashboard
4. Add it to your `.env.local` file:

```bash
REACT_APP_POLLINATIONS_TOKEN=your_bearer_token_here
```

### 2. Environment Variables

Add to your `.env.local` file:

```bash
# Required for Supabase
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional for AI Avatar Generation
REACT_APP_POLLINATIONS_TOKEN=your_pollinations_bearer_token
```

## Usage

### For Administrators

1. **Access Admin Panel**: Navigate to `/admin` and sign in
2. **Add/Edit Student**: Click "Add Student" or edit an existing student
3. **Generate AI Avatar**: 
   - Scroll down to the avatar section
   - Click "Generate AI Avatar" button
   - Enter a description or use a preset prompt
   - Click "Generate Avatar"
   - Preview the result
   - Click "Use This Avatar" to apply it

### Preset Prompts

The system includes these martial arts themed prompts:

- `martial arts student, friendly face, dojo uniform, digital art style`
- `karate student, confident expression, white belt, anime style`
- `taekwondo practitioner, smiling face, colorful uniform, cartoon style`
- `kung fu student, peaceful expression, traditional outfit, watercolor style`
- `judo athlete, determined look, white gi, realistic style`
- `mixed martial arts student, energetic pose, modern gear, digital painting`

### Custom Prompts

You can create custom prompts for unique avatars:

**Good prompt examples:**
- `young martial arts student, smiling, wearing white belt, digital art style`
- `karate kid, determined expression, traditional uniform, anime style`
- `teenage taekwondo student, confident pose, colorful dobok, cartoon style`

**Tips for better results:**
- Be specific about age, gender, expression
- Mention martial arts style (karate, taekwondo, kung fu, etc.)
- Include artistic style (anime, cartoon, realistic, digital art)
- Keep descriptions under 100 characters for best results

## API Configuration

### Pollinations API Parameters

The system uses these optimized parameters:

- **Model**: `flux` (best quality)
- **Size**: `512x512` pixels (optimal for avatars)
- **Private**: `true` (images not shown in public feed)
- **No Logo**: `true` (clean images without watermarks)

### Rate Limits

- **Without Token**: 1 concurrent request / 5 sec interval
- **With Token**: Higher limits based on your tier

## Technical Details

### File Structure

```
src/
├── components/
│   ├── AvatarGenerator.tsx     # AI avatar generation modal
│   └── AdminPanel.tsx          # Updated with avatar generator
└── hooks/
    └── useAuth.ts              # Authentication management
```

### Avatar Storage

- **Emoji Avatars**: Stored as Unicode characters (🥋, 🥊, etc.)
- **AI Avatars**: Stored as blob URLs (generated client-side)
- **Database**: Both types stored in the `avatar` field as strings

### Image Handling

- Generated images are converted to blob URLs
- Images are automatically sized to 60x60px in the UI
- Circular cropping applied for consistent appearance
- Images are cached in browser memory

## Troubleshooting

### Common Issues

1. **"Failed to generate avatar"**
   - Check your internet connection
   - Verify the Pollinations API is accessible
   - Try again (rate limit may have been hit)

2. **Slow generation**
   - AI image generation takes 10-30 seconds
   - This is normal behavior
   - Consider using preset prompts for faster workflow

3. **Token not working**
   - Verify token is correctly set in `.env.local`
   - Restart the development server after adding token
   - Check token permissions on Pollinations dashboard

### Rate Limit Handling

- The system automatically handles rate limits
- Users will see error messages if limits are exceeded
- Wait 5 seconds between requests without token
- Higher limits available with valid token

## Best Practices

### For Administrators

1. **Use Preset Prompts**: Start with provided templates
2. **Be Specific**: Include age, style, and martial arts discipline
3. **Test First**: Generate a few options before applying
4. **Keep Consistent**: Use similar styles for a cohesive look

### For Developers

1. **Environment Variables**: Always use environment variables for tokens
2. **Error Handling**: Graceful fallbacks for API failures
3. **User Feedback**: Clear loading states and error messages
4. **Security**: Never expose tokens in client-side code

## Future Enhancements

Potential improvements for future versions:

- **Batch Generation**: Generate multiple avatars at once
- **Avatar Categories**: Pre-defined styles (anime, realistic, cartoon)
- **Custom Uploads**: Allow users to upload their own images
- **Avatar History**: Save and reuse previously generated avatars
- **Style Transfer**: Apply martial arts themes to uploaded photos

## Support

For issues with:
- **Pollinations API**: Contact [Pollinations Support](https://pollinations.ai)
- **Avatar Generation**: Check browser console for error messages
- **Setup Issues**: Refer to the main setup guides in this repository

## License

This feature uses the Pollinations API. Please review their terms of service for commercial usage requirements.
