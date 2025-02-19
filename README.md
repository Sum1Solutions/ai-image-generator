# Tracey's Image-inator 

A magical AI image generator that uses both OpenAI (DALL·E) and Anthropic (Claude) to create stunning images from text prompts, showing you results from both providers side by side!

## Features
- Generate images from both DALL·E and Claude simultaneously
- Customize image generation options:
  - Size (1024x1024, 1792x1024 landscape, 1024x1792 portrait)
  - Style (vivid or natural)
  - Quality (standard or HD)
- Save generation history (last 20 generations)
- Download generated images
- View full-size images in new tab
- Beautiful, responsive three-column layout
- Real-time loading states

## Setup & Run
1. Install dependencies:
   ```sh
   npm install
   ```

2. Create a `.env` file with your Cloudflare Worker URL:
   ```sh
   REACT_APP_WORKER_URL=your-cloudflare-worker-url
   ```

3. Start development server:
   ```sh
   npm start
   ```

4. Build for production:
   ```sh
   npm run build
   ```

## Deployment
This app is designed to work with a Cloudflare Worker backend. The frontend is deployed on Cloudflare Pages.

### Environment Variables
- `REACT_APP_WORKER_URL`: URL of your Cloudflare Worker (e.g., https://ai-image-worker.your-subdomain.workers.dev)

### Deployment Steps
1. Push changes to GitHub
2. Cloudflare Pages will automatically build and deploy your changes
3. Your app will be available at your Cloudflare Pages URL

## Local Storage
The app uses localStorage to:
- Save your last 20 image generations
- Preserve them across page reloads
- Store metadata like prompts and generation options

## Security
- CORS is properly configured for production
- API keys are securely stored in Cloudflare Worker secrets
- No sensitive data is stored in localStorage

## Usage
1. Enter a text prompt describing the image you want
2. Customize generation options if desired
3. Click "Generate Images"
4. Wait for both DALL·E and Claude to create their interpretations
5. Download, view full size, or browse your generation history

## Tech Stack
- React
- Create React App
- Cloudflare Pages
- Cloudflare Workers
- OpenAI DALL·E 3
- Anthropic Claude

Enjoy creating magical images! 
