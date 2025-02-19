# AI Image Generator

This is a simple AI image generator that uses OpenAI (DALL·E) and Anthropic (Claude) to generate images from text prompts.

## 📌 Features
- Input a text prompt
- Select AI provider (OpenAI or Anthropic)
- Generate an AI-created image
- Display token usage per request

## 🚀 Setup & Run
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start development server:
   ```sh
   npm start
   ```
3. Deploy to Cloudflare Pages when ready!

## 🌐 Deployment
This app is designed to work with a Cloudflare Worker that connects to OpenAI and Anthropic. Set your Cloudflare Worker URL in a **.env** file:

```sh
REACT_APP_WORKER_URL=your-cloudflare-worker-url
```

Then, build and deploy:

```sh
npm run build
```

Enjoy AI-powered image generation! 🚀
