# QUICK START GUIDE - ShopHub 3D Landing Page

Get your beautiful 3D e-commerce landing page running in under 5 minutes!

## 🚀 Quick Start (5 Minutes)

### Option 1: Instant Setup (No Backend)

Perfect for testing and immediate deployment.

```bash
# 1. Download files
git clone https://github.com/yourusername/shophub.git
cd shophub

# 2. Open in browser
# Simply open index.html in your web browser
# OR use a simple server:
python -m http.server 8000
# Then visit: http://localhost:8000
```

### Option 2: Full Node.js Setup (With Backend)

For production and payment gateway integration.

```bash
# 1. Clone repository
git clone https://github.com/yourusername/shophub.git
cd shophub

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env and add your payment gateway credentials

# 4. Start development server
npm run dev

# 5. Visit your site
# http://localhost:3000
```

---

## 📋 File Structure Explained

```
shophub/
├── index.html              # Main HTML (structure)
├── styles.css              # All styling & animations
├── script.js               # 3D background & interactions
├── payment-integration.js  # Payment gateway integration
├── package.json            # Dependencies
├── .env.example            # Environment template
├── README.md               # Full documentation
├── PAYMENT_SETUP.md        # Payment integration guide
├── DEPLOYMENT.md           # Deployment instructions
├── QUICK_START.md          # This file
└── docs/                   # Additional documentation
```

---

## 🎨 Customization in 5 Steps

### Step 1: Change Store Name
Edit `index.html` line 1 and replace "ShopHub" with your store name:
```html
<title>Your Store Name - Premium Shopping</title>
```

Update the logo in navbar (line ~60):
```html
<span>Your Store Name</span>
```

### Step 2: Change Colors
Edit `styles.css` lines 8-15:
```css
:root {
    --primary: #6366f1;        /* Change this to your brand color */
    --secondary: #8b5cf6;      /* Secondary color */
    --accent: #ec4899;         /* Highlight color */
}
```

**Popular color combinations:**
- Purple Theme: `#6366f1`, `#8b5cf6`, `#ec4899` (Current)
- Blue Theme: `#0ea5e9`, `#06b6d4`, `#14b8a6`
- Green Theme: `#10b981`, `#059669`, `#0d9488`
- Red Theme: `#ef4444`, `#dc2626`, `#b91c1c`

### Step 3: Add Your Logo
Replace the SVG logo in `index.html` (~line 50) with:
```html
<div class="logo">
    <img src="your-logo.png" alt="Your Store" style="width: 32px; height: 32px;">
    <span>Your Store Name</span>
</div>
```

### Step 4: Update Product Categories
Edit the category cards in `index.html` (~lines 120-180):
```html
<div class="category-card" data-category="your-category">
    <div class="card-image"><!-- SVG icon --></div>
    <h3>Your Category</h3>
    <p>Your description</p>
    <button class="btn-explore">Explore Now</button>
</div>
```

### Step 5: Configure Payment Methods
Edit `payment-integration.js` and set your credentials:
```javascript
const paymentConfig = {
    jazzcash: {
        merchantID: 'YOUR_MERCHANT_ID',
        password: 'YOUR_PASSWORD'
    },
    // ... add other payment methods
};
```

---

## 💳 Quick Payment Setup

### JazzCash (Easiest)

1. Visit: https://www.jazzcash.com.pk/merchant
2. Register your business
3. Get Merchant ID & Password
4. Add to `.env`:
```env
JAZZCASH_MERCHANT_ID=your_id
JAZZCASH_PASSWORD=your_password
```

### Stripe (International)

1. Visit: https://stripe.com
2. Create account & verify business
3. Get API keys from Dashboard
4. Add to `.env`:
```env
STRIPE_PUBLIC_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
```

### Easypaisa

1. Visit: https://business.easypaisa.com.pk/
2. Register and complete KYC
3. Get Store ID & Auth Token
4. Add to `.env`:
```env
EASYPAISA_STORE_ID=your_store_id
EASYPAISA_AUTH_TOKEN=your_token
```

---

## 🌐 Deploy to Production (Choose One)

### 1. Deploy to Vercel (Easiest - 30 seconds)

```bash
npm i -g vercel
vercel login
vercel

# Add environment variables:
vercel env add JAZZCASH_MERCHANT_ID
vercel env add JAZZCASH_PASSWORD
# ... add others

vercel --prod
```

Your site is live at: `your-site.vercel.app`

### 2. Deploy to Netlify

```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod
```

### 3. Deploy to Your Own Server

```bash
# 1. SSH into server
ssh user@your-server.com

# 2. Clone and setup
git clone <repo-url>
cd shophub
npm install
cp .env.example .env
# Edit .env with production values

# 3. Start with PM2
npm i -g pm2
pm2 start npm --name "shophub" -- start
pm2 save

# 4. Setup with Nginx (reverse proxy)
# Configure nginx.conf to point to http://localhost:3000
sudo systemctl restart nginx
```

### 4. Deploy to Shopify Store

```bash
# Install Shopify CLI
npm i -g @shopify/cli @shopify/theme

# Login
shopify login --store your-store-name.myshopify.com

# Start development
shopify theme dev

# Deploy to production
shopify theme push
```

---

## ✅ Testing Your Setup

### Test 3D Background
- Open your site in Chrome/Firefox
- You should see animated 3D shapes in hero section
- If not, check browser console (F12) for errors

### Test Animations
- Scroll down the page
- Cards should animate into view
- Buttons should have hover effects
- Smooth scroll navigation should work

### Test Payment Integration
- Click a "Explore Now" button
- Click payment method card
- You should see confirmation notification
- (Full payment flow requires backend)

### Test Mobile Responsiveness
- Press F12 in browser
- Click device toggle (mobile icon)
- Test on iPhone, iPad, Android sizes
- All content should be readable and clickable

---

## 🐛 Common Issues & Fixes

### Issue: White page, no content

**Solution:**
- Check browser console (F12)
- Ensure you opened from a local server (not file://)
- Try: `python -m http.server 8000`

### Issue: 3D background not showing

**Solution:**
- Your browser may not support WebGL
- Try Chrome or Firefox
- Check if WebGL is enabled in browser settings
- The page still works without 3D (graceful degradation)

### Issue: Styles not loading

**Solution:**
- Ensure `styles.css` is in same directory as `index.html`
- Check file paths in HTML are correct
- Refresh page with Ctrl+Shift+R (hard refresh)

### Issue: Payment buttons not working

**Solution:**
- Add your merchant credentials to `.env`
- Restart server: `npm run dev`
- Check browser console for API errors
- Verify payment gateway credentials are correct

### Issue: Site too slow

**Solution:**
- Check network tab (F12 > Network)
- Large images? Compress them
- Too many requests? Enable caching
- See Performance Optimization in DEPLOYMENT.md

---

## 📱 Mobile Optimization

The site is fully responsive! To test:

```bash
# Test on device
# Connect to same WiFi as development machine
# Find your local IP: ipconfig getifaddr en0 (Mac) or hostname -I (Linux)
# Visit: http://YOUR_IP:8000
```

---

## 🔐 Security Before Going Live

**CRITICAL:**
- [ ] Never commit `.env` file
- [ ] Rotate all API keys before production
- [ ] Use HTTPS (Get free SSL from Let's Encrypt)
- [ ] Add security headers to web server
- [ ] Enable CORS only for your domain

Quick security fix:
```bash
# Generate .env (never commit this!)
cp .env.example .env
# Add to .gitignore:
echo ".env" >> .gitignore
```

---

## 📚 Next Steps

1. **Customize Colors & Content**
   - Edit `styles.css` for colors
   - Edit `index.html` for content
   - Add your logo and product images

2. **Setup Payment Gateways**
   - Register with payment providers
   - Add credentials to `.env`
   - Test in sandbox mode

3. **Add Custom Domain**
   - Buy domain from Namecheap/GoDaddy/etc
   - Point to your deployment platform
   - Setup SSL certificate

4. **Connect to Shopify**
   - See DEPLOYMENT.md for Shopify integration
   - Add theme to your Shopify store
   - Customize in Shopify admin

5. **Monitor & Maintain**
   - Setup error tracking (Sentry)
   - Monitor page performance
   - Regular security audits

---

## 💬 Support & Resources

**Documentation Files:**
- `README.md` - Full feature documentation
- `PAYMENT_SETUP.md` - Detailed payment integration
- `DEPLOYMENT.md` - Production deployment guide
- `QUICK_START.md` - This file

**External Resources:**
- Shopify Docs: https://shopify.dev/
- Three.js Docs: https://threejs.org/docs/
- GSAP Docs: https://greensock.com/docs/
- Stripe API: https://stripe.com/docs/api

**Payment Provider Support:**
- JazzCash: support@jazzcash.com.pk
- Easypaisa: support@easypaisa.com.pk
- Stripe: support@stripe.com

---

## 🎉 Success Checklist

- [ ] Site loads without errors
- [ ] 3D background animates
- [ ] Navigation smooth scrolls
- [ ] Cards have hover effects
- [ ] Buttons are clickable
- [ ] Mobile version looks good
- [ ] Payment methods display correctly
- [ ] Contact form works
- [ ] Site is deployed live
- [ ] SSL certificate installed
- [ ] Payment testing completed

---

## 📊 Performance Targets

After setup, aim for:

- **Page Load Time**: < 3 seconds
- **First Contentful Paint**: < 1 second
- **Largest Contentful Paint**: < 2.5 seconds
- **Cumulative Layout Shift**: < 0.1
- **Mobile Score**: > 90 (Google Lighthouse)

Check with: https://pagespeed.web.dev/

---

## 🚀 You're Ready!

Your professional 3D e-commerce landing page is ready to go live!

**Next:** 
1. Customize your content
2. Setup payment methods
3. Deploy to production
4. Share with customers

Questions? Check the other documentation files or reach out to our support team.

**Made with ❤️ for Pakistani e-commerce**

---

**Last Updated**: 2026-06-14
**Version**: 1.0.0
