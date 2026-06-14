# ShopHub - Troubleshooting Guide

Complete troubleshooting for common issues and solutions.

## Table of Contents

1. [Setup & Installation Issues](#setup--installation-issues)
2. [Visual & Display Issues](#visual--display-issues)
3. [Payment Gateway Issues](#payment-gateway-issues)
4. [Performance Issues](#performance-issues)
5. [Deployment Issues](#deployment-issues)
6. [Security Issues](#security-issues)
7. [Mobile Issues](#mobile-issues)
8. [Advanced Debugging](#advanced-debugging)

---

## Setup & Installation Issues

### Issue: "Command not found: npm"

**Problem:** Node.js or npm not installed

**Solution:**

```bash
# Check if Node.js is installed
node --version

# If not installed, download from:
# https://nodejs.org/ (LTS version recommended)

# After installation, verify:
node --version  # Should show v16.x or higher
npm --version   # Should show 8.x or higher
```

### Issue: Git clone fails

**Problem:** Git not installed or repository URL wrong

**Solution:**

```bash
# Check if Git is installed
git --version

# If not installed:
# Windows: Download from https://git-scm.com/
# Mac: brew install git
# Linux: sudo apt-get install git

# Verify repository URL
git clone https://github.com/yourusername/shophub.git
```

### Issue: "Cannot find module 'express'"

**Problem:** Dependencies not installed

**Solution:**

```bash
# Install all dependencies
npm install

# Verify installation
ls node_modules

# If still failing, try:
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 already in use

**Problem:** Another application using port 3000

**Solution:**

```bash
# Find process using port 3000
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
PORT=3001 npm start
```

### Issue: ".env file not working"

**Problem:** Environment variables not loading

**Solution:**

```bash
# Ensure .env exists
ls -la .env

# Verify format (no spaces around =)
CORRECT=value
WRONG = value  # This won't work

# Restart your server after editing .env
npm run dev

# Verify variables are loaded
console.log(process.env.JAZZCASH_MERCHANT_ID);
```

---

## Visual & Display Issues

### Issue: 3D background not showing

**Problem:** Three.js not loaded or WebGL disabled

**Solution:**

```javascript
// 1. Check if Three.js is loaded
console.log(THREE);  // Should show THREE object

// 2. Check WebGL support
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
console.log('WebGL Supported:', !!gl);

// 3. Check browser console for errors
// Press F12 > Console tab
// Look for red error messages

// 4. Enable WebGL in browser
// Chrome: Settings > Advanced > System > Toggle "Use hardware acceleration"
// Firefox: about:config > webgl.disabled = false
```

**Browser Compatibility:**

- ✅ Chrome 33+
- ✅ Firefox 24+
- ✅ Safari 9+
- ✅ Edge 12+
- ❌ Internet Explorer (Use modern browser)

### Issue: Styles not loading (page looks broken)

**Problem:** CSS file not found or path incorrect

**Solution:**

```html
<!-- Check file paths in HTML -->
<!-- CORRECT: -->
<link rel="stylesheet" href="styles.css">

<!-- WRONG: -->
<link rel="stylesheet" href="./styles.css">  <!-- Extra ./ -->
<link rel="stylesheet" href="../styles.css">  <!-- Wrong directory -->

<!-- Verify file exists -->
<!-- styles.css should be in same directory as index.html -->

<!-- Hard refresh browser -->
<!-- Ctrl+Shift+R (Windows/Linux) -->
<!-- Cmd+Shift+R (Mac) -->
```

### Issue: Animations not working

**Problem:** GSAP not loaded or ScrollTrigger not registered

**Solution:**

```javascript
// Check if GSAP is loaded
console.log(gsap);  // Should show GSAP object

// Check if ScrollTrigger is registered
console.log(ScrollTrigger);  // Should show plugin

// If missing, add to HTML:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>

// Clear browser cache
// Ctrl+Shift+Delete (Windows/Linux)
// Cmd+Shift+Delete (Mac)
```

### Issue: Fonts look wrong or different

**Problem:** Custom fonts not loaded

**Solution:**

```css
/* Ensure system fonts work as fallback */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* If using custom fonts */
@font-face {
    font-family: 'CustomFont';
    src: url('fonts/custom-font.woff2') format('woff2');
}

/* Check Network tab (F12) for failed font requests */
```

### Issue: Colors different from what I set

**Problem:** CSS variables not updated or cache

**Solution:**

```css
/* Check if CSS variables are set */
:root {
    --primary: #6366f1;  /* Verify this color */
    --secondary: #8b5cf6;
}

/* Clear browser cache */
/* F12 > Network > Disable cache (while dev tools open) */
/* Or Ctrl+Shift+Delete */

/* Verify in browser */
// Open F12 > Styles > Check computed colors
```

---

## Payment Gateway Issues

### Issue: JazzCash: "Merchant not found"

**Problem:** Incorrect Merchant ID or password

**Solution:**

```bash
# 1. Verify credentials
JAZZCASH_MERCHANT_ID=your_actual_merchant_id
JAZZCASH_PASSWORD=your_actual_password

# 2. Check if sandbox or production
JAZZCASH_BASE_URL=https://sandbox.jazzcash.com.pk/  # Testing
JAZZCASH_BASE_URL=https://secure.jazzcash.com.pk/    # Production

# 3. Verify registration status
# Visit: https://www.jazzcash.com.pk/merchant
# Check merchant status in dashboard

# 4. Test with test merchant (for development)
# JazzCash provides test credentials after registration
```

### Issue: Easypaisa: "Invalid Store ID"

**Problem:** Incorrect Store ID or Auth Token

**Solution:**

```bash
# 1. Get correct credentials from Easypaisa
# Visit: https://business.easypaisa.com.pk/
# Go to: Payment Gateway > API Settings

# 2. Verify credentials
EASYPAISA_STORE_ID=your_store_id
EASYPAISA_AUTH_TOKEN=your_auth_token

# 3. Check API endpoint
EASYPAISA_BASE_URL=https://sandbox.easypaisa.com.pk/  # Testing
# Production URL will be provided by Easypaisa

# 4. Test connection
curl -X POST https://sandbox.easypaisa.com.pk/api/payment/create \
  -H "Content-Type: application/json" \
  -d '{"StoreId":"YOUR_ID","AuthToken":"YOUR_TOKEN"}'
```

### Issue: Stripe: "Invalid API Key"

**Problem:** Wrong API key or missing key

**Solution:**

```bash
# 1. Get correct keys from Stripe Dashboard
# https://dashboard.stripe.com/apikeys

# 2. Use TEST keys for development
STRIPE_PUBLIC_KEY=pk_test_your_public_key
STRIPE_SECRET_KEY=sk_test_your_secret_key

# 3. Use LIVE keys for production
STRIPE_PUBLIC_KEY=pk_live_your_public_key
STRIPE_SECRET_KEY=sk_live_your_secret_key

# 4. Verify key format
# Public key should start with pk_test_ or pk_live_
# Secret key should start with sk_test_ or sk_live_

# 5. Never expose secret key on frontend
# Only public key should be in client-side code
```

### Issue: Payment callback not received

**Problem:** Webhook URL not configured or firewall blocking

**Solution:**

```bash
# 1. Verify webhook URL is public
# Test: curl https://yoursite.com/api/payment/callback
# Should return 200 (not 404 or 500)

# 2. Configure webhook URL in payment gateway dashboard
WEBHOOK_URL=https://yoursite.com/api/payment/callback  # MUST be HTTPS

# 3. Check server is running and accessible
# ping yoursite.com
# Should resolve to your server IP

# 4. Check firewall/security groups
# AWS: Verify port 443 (HTTPS) is open
# VPS: Check iptables or firewall rules

# 5. Log webhook requests
// In backend
app.post('/api/payment/callback', (req, res) => {
    console.log('Webhook received:', req.body);
    console.log('Headers:', req.headers);
    res.json({ received: true });
});

# 6. Test webhook locally
# Use ngrok to expose local server
ngrok http 3000
# Update webhook URL in dashboard to ngrok URL
```

### Issue: "Payment amount mismatch"

**Problem:** Amount format or calculation error

**Solution:**

```javascript
// JazzCash: Amount should be in paisas (multiply by 100)
const amountInPaisas = amount * 100;  // 5000 PKR = 500000 paisas

// Easypaisa: Amount should be in rupees
const amountInRupees = amount;  // 5000 PKR = 5000

// Stripe: Amount should be in smallest currency unit (multiply by 100)
const amountInCents = amount * 100;  // 5000 USD = 500000 cents

// Always verify amount format in payment gateway docs
console.log('Amount to send:', formattedAmount);
```

### Issue: "Payment timeout"

**Problem:** Slow network or gateway not responding

**Solution:**

```javascript
// Implement timeout handling
async function paymentWithTimeout(paymentFn, timeoutMs = 30000) {
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Payment timeout')), timeoutMs)
    );

    try {
        return await Promise.race([
            paymentFn(),
            timeoutPromise
        ]);
    } catch (error) {
        console.error('Payment error:', error.message);
        // Retry logic
        return retryPayment(paymentFn, 3);
    }
}

// Implement retry logic
async function retryPayment(fn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => 
                setTimeout(resolve, 1000 * Math.pow(2, i))
            );
        }
    }
}
```

---

## Performance Issues

### Issue: Page loads slowly

**Problem:** Large assets or unoptimized code

**Solution:**

```bash
# 1. Analyze page with Lighthouse
# https://pagespeed.web.dev/

# 2. Optimize images
npm install -g imagemin-cli
imagemin img/**/* --out-dir=img-optimized

# 3. Minify CSS and JavaScript
npm install -g cssnano terser
cssnano styles.css > styles.min.css
terser script.js -o script.min.js

# 4. Enable caching (nginx)
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# 5. Enable gzip compression
gzip on;
gzip_types text/plain text/css text/javascript application/json;
gzip_min_length 1000;
gzip_comp_level 6;

# 6. Use CDN for static assets
# Update asset URLs:
const CDN = 'https://cdn.example.com';
<link rel="stylesheet" href="${CDN}/styles.css">

# 7. Check Network tab (F12)
# Identify slow-loading resources
# Profile JavaScript (F12 > Performance tab)
```

### Issue: 3D animations lag

**Problem:** Too many particles or low frame rate

**Solution:**

```javascript
// Reduce particle count on mobile
const particleCount = window.innerWidth < 768 ? 50 : 100;

// Disable animations on low-end devices
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
    document.documentElement.style.setProperty('--animation-duration', '0s');
}

// Monitor frame rate
let fps = 0;
let lastTime = performance.now();
function measureFPS() {
    const now = performance.now();
    fps = 1000 / (now - lastTime);
    lastTime = now;
    
    if (fps < 30) {
        console.warn('Low FPS detected:', fps);
        // Reduce animation quality
    }
}

// Use requestAnimationFrame efficiently
let animationFrameId;
function animate() {
    animationFrameId = requestAnimationFrame(animate);
    measureFPS();
    // ... animation logic
}
```

### Issue: Memory leak

**Problem:** Objects not garbage collected

**Solution:**

```javascript
// Monitor memory usage
const memUsage = process.memoryUsage();
console.log('Heap used:', Math.round(memUsage.heapUsed / 1024 / 1024), 'MB');

// Clean up Three.js resources
function dispose3D() {
    // Dispose geometries
    scene.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
    });
    
    // Dispose renderer
    renderer.dispose();
    renderer.forceContextLoss();
}

// Cleanup on page unload
window.addEventListener('beforeunload', dispose3D);

// Remove event listeners
element.removeEventListener('mousemove', handler);

// Clear intervals/timeouts
clearInterval(intervalId);
clearTimeout(timeoutId);
```

---

## Deployment Issues

### Issue: "Deploy failed: No files changed"

**Problem:** Repository doesn't have changes or branch issue

**Solution:**

```bash
# 1. Verify you're on correct branch
git branch
git checkout main

# 2. Make a change and commit
echo "# Updated" >> README.md
git add README.md
git commit -m "Update deployment"

# 3. Push to repository
git push origin main

# 4. Try deploying again
vercel --prod
# or
netlify deploy --prod
```

### Issue: "Vercel deployment: Cannot find module"

**Problem:** Dependencies not installed or missing

**Solution:**

```bash
# 1. Verify package.json exists
ls package.json

# 2. Verify all dependencies listed
cat package.json

# 3. Create package-lock.json
npm install

# 4. Commit files to git
git add package.json package-lock.json
git commit -m "Add dependencies"
git push origin main

# 5. Vercel will auto-install on next deploy
```

### Issue: "Netlify build fails"

**Problem:** Build script error or environment missing

**Solution:**

```bash
# 1. Check build script in package.json
cat package.json | grep '"build"'

# 2. Run build locally to test
npm run build

# 3. Add environment variables in Netlify UI
# Site settings > Build & deploy > Environment

# 4. Check build logs in Netlify dashboard
# Deployments > Click failed build > View log

# 5. Common fixes:
# - Add Node version: netlify.toml
[build]
  command = "npm run build"
  functions = "functions"
  
[build.environment]
  NODE_VERSION = "16"
```

### Issue: "GitHub pages showing 404"

**Problem:** Repository settings or branch configuration

**Solution:**

```bash
# 1. Enable GitHub Pages
# Settings > Pages > Source > Select branch (usually main)

# 2. Verify repository is public
# Settings > Change repository visibility to Public

# 3. Use correct URL format
# https://username.github.io/repository-name/

# 4. Check if index.html exists in root
ls index.html

# 5. CNAME for custom domain
echo "yourdomain.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push origin main
```

---

## Security Issues

### Issue: ".env file committed to git"

**Problem:** Secrets exposed in repository history

**Solution:**

```bash
# 1. IMMEDIATE: Rotate all API keys/secrets
# - Generate new merchant IDs
# - Generate new API keys from payment gateways
# - Update .env with new values

# 2. Remove from git history
git rm --cached .env
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Remove .env from tracking"
git push origin main

# 3. Clean git history (WARNING: Permanent)
git filter-branch --tree-filter 'rm -f .env' HEAD
# OR use git-filter-repo (recommended)

# 4. Invalidate old secrets in payment gateway dashboards
# - JazzCash: Regenerate merchant credentials
# - Stripe: Rotate API keys
# - All others: Regenerate access tokens
```

### Issue: "SSL certificate not working"

**Problem:** HTTPS not enabled or certificate expired

**Solution:**

```bash
# 1. Check SSL certificate
openssl s_client -connect yourdomain.com:443 -showcerts

# 2. Get free SSL from Let's Encrypt
certbot certonly --standalone -d yourdomain.com

# 3. Install certificate on server
# nginx: /etc/nginx/ssl/
# Apache: /etc/apache2/ssl/

# 4. Update web server config
# nginx.conf
server {
    listen 443 ssl http2;
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
}

# 5. Redirect HTTP to HTTPS
server {
    listen 80;
    return 301 https://$server_name$request_uri;
}

# 6. Verify SSL
# https://www.ssllabs.com/ssltest/
```

### Issue: "CORS error: blocked by browser"

**Problem:** Cross-origin request blocked

**Solution:**

```javascript
// Backend (Express)
const cors = require('cors');

// Allow specific origin only
app.use(cors({
    origin: 'https://yourdomain.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Or allow all (NOT RECOMMENDED for production)
app.use(cors());

// Frontend (if backend CORS not available)
// This is a workaround only - fix at backend level
// Use JSONP or proxy
fetch('https://api.example.com/data', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
    credentials: 'include'  // Include cookies
})
```

---

## Mobile Issues

### Issue: "Mobile site looks broken"

**Problem:** Responsive design issues

**Solution:**

```html
<!-- 1. Ensure viewport meta tag exists -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- 2. Test responsive design -->
<!-- F12 > Toggle device toolbar (Ctrl+Shift+M) -->
<!-- Test on multiple screen sizes -->

<!-- 3. Check CSS media queries -->
@media (max-width: 768px) {
    /* Mobile styles */
}

<!-- 4. Use flexible layouts -->
/* Use flexbox instead of floats */
.container {
    display: flex;
    flex-wrap: wrap;
}

/* Use percentage widths */
.column {
    width: 100%;  /* Mobile */
}

@media (min-width: 768px) {
    .column {
        width: 50%;  /* Tablet & up */
    }
}
```

### Issue: "Touch events not working"

**Problem:** Mobile event handlers missing

**Solution:**

```javascript
// Add touch event listeners
element.addEventListener('touchstart', handleTouchStart);
element.addEventListener('touchmove', handleTouchMove);
element.addEventListener('touchend', handleTouchEnd);

// Detect touch support
const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
};

if (isTouchDevice()) {
    console.log('Touch device detected');
    // Enable touch-specific features
}

// Prevent zoom on double tap
document.addEventListener('touchend', (e) => {
    if (e.touches.length === 0) {
        // Handle double tap zoom
    }
});
```

### Issue: "Mobile payment gateway opens wrong view"

**Problem:** Return URL not handling mobile properly

**Solution:**

```bash
# 1. Ensure return URL works on mobile
PAYMENT_RETURN_URL=https://yoursite.com/payment/confirmation

# 2. Test on actual mobile device
# Use ngrok to test locally:
ngrok http 3000
# Update payment gateway with ngrok URL

# 3. Handle mobile/desktop redirect
function getReturnURL() {
    const isMobile = /iPhone|iPad|Android|webOS|BlackBerry/i.test(navigator.userAgent);
    const baseURL = 'https://yoursite.com/payment/confirmation';
    return isMobile ? `${baseURL}?mobile=true` : baseURL;
}

# 4. Verify payment gateway settings
# Each gateway may have different mobile handling
```

---

## Advanced Debugging

### Enable Debug Mode

```bash
# Set environment variables
export DEBUG=*
export NODE_ENV=development
export VERBOSE_LOGGING=true

# Run server with debug logging
DEBUG=* npm run dev
```

### Debug Payment Requests

```javascript
// Intercept and log all payment requests
const originalFetch = window.fetch;
window.fetch = function(...args) {
    console.log('Fetch request:', args);
    return originalFetch.apply(this, args)
        .then(response => {
            console.log('Fetch response:', response);
            return response;
        })
        .catch(error => {
            console.error('Fetch error:', error);
            throw error;
        });
};
```

### Monitor Network Requests

```bash
# Using curl to test endpoints
curl -X POST https://yoursite.com/api/payment/jazzcash \
  -H "Content-Type: application/json" \
  -d '{"amount":5000,"orderId":"TEST001"}' \
  -v

# Using Postman
# Download from postman.com
# Create requests to test endpoints
```

### Check Browser Console

```javascript
// Common console commands
console.log('Log message');
console.error('Error message');
console.warn('Warning message');
console.table(dataObject);

// Debugger breakpoint
debugger;  // Execution pauses here when dev tools open

// Profile performance
console.time('label');
// ... code to profile
console.timeEnd('label');

// Check element
$('selector')  // In DevTools console only
```

### Server Logs

```bash
# Check application logs
tail -f logs/app.log

# Check error logs
tail -f logs/error.log

# Search for specific error
grep "payment error" logs/app.log

# View system logs
# Linux: /var/log/syslog
# Mac: /var/log/system.log
# Windows: Event Viewer
```

---

## Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| Page blank | Hard refresh (Ctrl+Shift+R) |
| 3D not showing | Check WebGL support, try Chrome |
| Payment fails | Verify credentials in .env |
| Slow page | Optimize images, enable caching |
| Styles broken | Check CSS file path |
| Animations lag | Reduce particles, disable on mobile |
| Deploy fails | Check package.json, push to git |
| CORS error | Add origin to backend CORS config |
| Mobile broken | Add viewport meta tag |
| SSL error | Get certificate from Let's Encrypt |

---

## Getting More Help

If you can't find your issue here:

1. **GitHub Issues**: Report bug with reproduction steps
2. **Stack Overflow**: Tag with `shophub`, `shopify`, `javascript`
3. **Payment Provider Support**: Contact their help desk
4. **Community Forums**: Shopify community, Reddit r/shopify
5. **Professional Help**: Hire a developer for custom issues

---

**Last Updated:** 2026-06-14
**Version:** 1.0.0

Good luck! You've got this! 🚀
