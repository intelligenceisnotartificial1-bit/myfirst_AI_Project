# ShopHub - Complete Deployment & Setup Guide

A comprehensive guide for deploying your 3D e-commerce landing page to production with Pakistani payment gateway integration.

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Shopify Theme Integration](#shopify-theme-integration)
3. [Payment Gateway Setup](#payment-gateway-setup)
4. [Deployment Options](#deployment-options)
5. [Performance Optimization](#performance-optimization)
6. [Security Checklist](#security-checklist)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- Git for version control
- A code editor (VS Code recommended)
- Shopify CLI (for Shopify integration)

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/shophub.git
cd shophub

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Step 2: Run Development Server

```bash
# For static file serving
npx http-server -p 8000

# Or using Node.js with Express (if you have a server.js)
npm start

# Or using Shopify CLI
shopify theme dev
```

### Step 3: Access the Site

Open your browser and navigate to:
```
http://localhost:8000
```

### Step 4: Test Payment Integrations

Each payment gateway should be tested with sandbox credentials:

```javascript
// Test with sandbox environment
const testConfig = {
    jazzcash: { isProduction: false },
    easypaisa: { baseURL: 'https://sandbox.easypaisa.com.pk/' },
    stripe: { publicKey: 'pk_test_...' },
    crypto: { baseURL: 'https://api.commerce.coinbase.com/' }
};
```

---

## Shopify Theme Integration

### Step 1: Prepare Theme Files

```bash
# Create Shopify theme structure
mkdir -p theme/assets theme/sections theme/templates theme/config

# Copy ShopHub files to theme
cp index.html theme/templates/landing-page.liquid
cp styles.css theme/assets/shophub.css
cp script.js theme/assets/shophub.js
cp payment-integration.js theme/assets/payment-integration.js
```

### Step 2: Create Liquid Template

**theme/templates/landing-page.liquid**

```liquid
{% section 'shophub-landing' %}
```

### Step 3: Create Shopify Section

**theme/sections/shophub-landing.liquid**

```liquid
{{ 'shophub.css' | asset_url | stylesheet_tag }}

<nav class="navbar">
  <div class="container">
    <div class="logo">
      {{ shop.name }}
    </div>
    <!-- Navigation Links -->
  </div>
</nav>

<!-- Include your HTML structure here -->

<script src="{{ 'shophub.js' | asset_url }}"></script>
<script src="{{ 'payment-integration.js' | asset_url }}"></script>

<script>
  // Initialize payment gateway
  const paymentConfig = {
    jazzcash: {
      merchantID: '{{ section.settings.jazzcash_merchant_id }}',
      password: '{{ section.settings.jazzcash_password }}'
    },
    // ... other gateways
  };

  const gateway = new PaymentGateway(paymentConfig);
</script>

{% schema %}
{
  "name": "ShopHub Landing Page",
  "settings": [
    {
      "type": "text",
      "id": "jazzcash_merchant_id",
      "label": "JazzCash Merchant ID"
    },
    {
      "type": "text",
      "id": "jazzcash_password",
      "label": "JazzCash Password"
    }
  ]
}
{% endschema %}
```

### Step 4: Push to Shopify

```bash
# Using Shopify CLI
shopify theme push -d

# Or upload manually via Shopify Admin
# Settings > Apps and sales channels > Online Store > Themes
```

---

## Payment Gateway Setup

### Step 1: JazzCash Setup

```bash
# 1. Register at https://www.jazzcash.com.pk/
# 2. Complete merchant verification
# 3. Get credentials and update .env

JAZZCASH_MERCHANT_ID=your_merchant_id
JAZZCASH_PASSWORD=your_password
JAZZCASH_BASE_URL=https://secure.jazzcash.com.pk/
JAZZCASH_IS_PRODUCTION=false # Set to true for production
```

### Step 2: Easypaisa Setup

```bash
# 1. Register at https://business.easypaisa.com.pk/
# 2. Enable payment gateway
# 3. Get credentials and update .env

EASYPAISA_STORE_ID=your_store_id
EASYPAISA_AUTH_TOKEN=your_auth_token
EASYPAISA_BASE_URL=https://sandbox.easypaisa.com.pk/
```

### Step 3: Stripe Setup

```bash
# 1. Create account at https://stripe.com
# 2. Get API keys from Dashboard
# 3. Update .env

STRIPE_PUBLIC_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
```

### Step 4: HBL/UBL Setup

Contact your bank representative to get:
- Merchant ID
- Terminal ID
- Encryption Key

Update `.env`:
```bash
HBL_MERCHANT_ID=your_merchant_id
HBL_TERMINAL_ID=your_terminal_id
HBL_ENCRYPTION_KEY=your_encryption_key
```

---

## Deployment Options

### Option 1: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variables
vercel env add JAZZCASH_MERCHANT_ID
vercel env add JAZZCASH_PASSWORD
# ... add other variables

# Deploy to production
vercel --prod
```

### Option 2: Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy

# Configure environment variables in Netlify UI
# Site settings > Build & deploy > Environment
```

### Option 3: Deploy to AWS

```bash
# Using AWS Amplify
npm i -g @aws-amplify/cli

amplify init
amplify publish

# Or using S3 + CloudFront
aws s3 sync . s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Option 4: Traditional Server (VPS)

```bash
# SSH into your server
ssh user@your-server.com

# Clone repository
git clone https://github.com/yourusername/shophub.git
cd shophub

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with production values

# Install PM2 for process management
npm i -g pm2

# Start application
pm2 start npm --name "shophub" -- start

# Save PM2 configuration
pm2 save

# Setup auto-restart on reboot
pm2 startup
```

### Option 5: Docker Deployment

**Dockerfile**

```dockerfile
FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start application
CMD ["npm", "start"]
```

**docker-compose.yml**

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - JAZZCASH_MERCHANT_ID=${JAZZCASH_MERCHANT_ID}
      - EASYPAISA_STORE_ID=${EASYPAISA_STORE_ID}
      - STRIPE_PUBLIC_KEY=${STRIPE_PUBLIC_KEY}
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
    depends_on:
      - app
```

Deploy with Docker:
```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f app
```

---

## Performance Optimization

### 1. Asset Optimization

```bash
# Minify CSS
npm i -g cssnano
cssnano styles.css > styles.min.css

# Minify JavaScript
npm i -g terser
terser script.js -o script.min.js

# Optimize images
npm i -g imagemin-cli
imagemin img/**/* --out-dir=img-optimized
```

### 2. Enable Caching

**nginx.conf**

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Enable Gzip Compression

```nginx
gzip on;
gzip_types text/plain text/css text/javascript application/json;
gzip_min_length 1000;
gzip_comp_level 6;
```

### 4. Implement CDN

```javascript
// Update asset URLs to use CDN
const CDN_URL = 'https://cdn.shophub.com';

const styleLink = document.createElement('link');
styleLink.href = `${CDN_URL}/styles.css`;
```

### 5. Lazy Load 3D Assets

```javascript
// Load Three.js only when needed
function load3DBackground() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => init3DBackground();
    document.head.appendChild(script);
}

// Trigger on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY < 100) {
        load3DBackground();
    }
}, { once: true });
```

---

## Security Checklist

### Before Production Deployment

- [ ] **SSL/TLS Certificate**
  ```bash
  # Using Let's Encrypt
  certbot certonly --standalone -d yourdomain.com
  ```

- [ ] **Environment Variables**
  - [ ] All sensitive data in `.env`
  - [ ] `.env` file in `.gitignore`
  - [ ] Never commit secrets to repository

- [ ] **HTTPS Redirect**
  ```nginx
  server {
      listen 80;
      return 301 https://$server_name$request_uri;
  }
  ```

- [ ] **Security Headers**
  ```nginx
  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header Referrer-Policy "no-referrer-when-downgrade" always;
  add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com;" always;
  ```

- [ ] **Payment Data Protection**
  - [ ] No credit card data stored on frontend
  - [ ] Use tokenization
  - [ ] PCI DSS compliance
  - [ ] Data encryption in transit (HTTPS only)

- [ ] **Rate Limiting**
  ```bash
  # Using nginx
  limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
  limit_req zone=api burst=20 nodelay;
  ```

- [ ] **CORS Configuration**
  ```javascript
  // Only allow your domain
  app.use(cors({
      origin: 'https://yourdomain.com',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
  }));
  ```

- [ ] **Input Validation**
  ```javascript
  const validateEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
  };

  const validateAmount = (amount) => {
      return !isNaN(amount) && amount > 0 && amount < 1000000;
  };
  ```

- [ ] **CSRF Protection**
  ```javascript
  const csrf = require('csurf');
  const csrfProtection = csrf({ cookie: true });
  app.post('/api/payment', csrfProtection, (req, res) => {
      // Handle payment
  });
  ```

---

## Monitoring & Maintenance

### 1. Setup Monitoring

```javascript
// Using Sentry for error tracking
import * as Sentry from "@sentry/node";

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0
});

app.use(Sentry.Handlers.errorHandler());
```

### 2. Log Rotation

**logrotate configuration**

```bash
/var/log/shophub/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

### 3. Backup Strategy

```bash
# Daily database backup
0 2 * * * /usr/bin/mysqldump -u root -p$MYSQL_PASSWORD shophub_db > /backups/shophub_$(date +\%Y\%m\%d).sql

# Upload to S3
30 2 * * * aws s3 sync /backups/ s3://your-backup-bucket/
```

### 4. Health Check Endpoint

```javascript
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date(),
        uptime: process.uptime(),
        database: checkDatabase(),
        paymentGateways: checkPaymentGateways()
    });
});
```

### 5. Automated Testing

```bash
# Run tests before deployment
npm test

# Load testing
npm install -g artillery
artillery quick --count 100 --num 10 https://yourdomain.com
```

---

## Troubleshooting

### Issue: 3D Background Not Loading

```javascript
// Check WebGL support
function checkWebGL() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return gl !== null;
}

if (!checkWebGL()) {
    console.warn('WebGL not supported, disabling 3D background');
    document.getElementById('3d-canvas').style.display = 'none';
}
```

### Issue: Payment Gateway Timeout

```javascript
// Implement retry logic
async function retryPayment(fn, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
    }
}
```

### Issue: High Memory Usage

```javascript
// Monitor memory
const memUsage = process.memoryUsage();
console.log(`Memory usage: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`);

// Implement memory cleanup
setInterval(() => {
    if (global.gc) {
        global.gc();
    }
}, 60000);
```

### Issue: Slow Page Load

```javascript
// Measure performance
const perfObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        console.log(`${entry.name}: ${entry.duration}ms`);
    }
});

perfObserver.observe({ entryTypes: ['navigation', 'resource', 'measure'] });
```

---

## Post-Deployment Checklist

- [ ] Verify all payment methods working
- [ ] Test email notifications
- [ ] Check analytics tracking
- [ ] Monitor error logs
- [ ] Verify SSL certificate
- [ ] Test on multiple browsers/devices
- [ ] Check Core Web Vitals
- [ ] Backup database
- [ ] Document deployment procedures
- [ ] Setup monitoring alerts
- [ ] Create incident response plan
- [ ] Schedule regular security audits

---

## Support & Resources

- **Shopify Documentation**: https://shopify.dev/
- **Three.js Documentation**: https://threejs.org/docs/
- **GSAP Documentation**: https://greensock.com/docs/
- **Stripe API**: https://stripe.com/docs/api
- **Pakistan Payment Providers**:
  - JazzCash: https://www.jazzcash.com.pk/
  - Easypaisa: https://www.easypaisa.com.pk/
  - HBL: https://www.hbl.com/
  - UBL: https://www.ubl.com.pk/

---

**Last Updated**: 2026-06-14
**Version**: 1.0.0
**Maintainer**: ShopHub Development Team

🚀 **Happy Deploying!**
