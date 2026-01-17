# ZONE WARNING

A modern and luxurious Cloudflare Management Dashboard. This web application allows you to manage Cloudflare Workers and DNS Zones with a sleek UI.

## Features

- **Authentication**: Secure login using your Cloudflare Email and API Key/Token. Credentials are stored locally.
- **Workers Management**: List existing workers and deploy new ones with a built-in code editor.
- **DNS Management**: View DNS Zones and add new DNS records (A, CNAME, etc.).
- **Modern UI**: Built with Next.js, Tailwind CSS, and Framer Motion for a premium feel.

## Getting Started

### Prerequisites

- Node.js (v18+) or Deno.
- A Cloudflare Account (Email + Global API Key or API Token with Worker/DNS permissions).

### Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

Or with Deno:

```bash
deno task dev
```

### Deployment

This project is built with Next.js and can be deployed to Vercel, Netlify, or **Deno Deploy**.

For Deno Deploy, ensure the build preset is configured for Next.js.

## Security Note

This application stores your Cloudflare API credentials in your browser's Local Storage. While convenient, ensure you are using this on a trusted device. The application proxies requests through its own API routes to avoid CORS issues, but credentials are sent in headers.
