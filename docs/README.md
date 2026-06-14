# ShopHub - 3D E-Commerce Landing Page for Pakistan

A modern, beautiful 3D landing page for Shopify stores with focus on Pakistani market. Features stunning animations, interactive 3D backgrounds, and integrated payment gateways popular in Pakistan.

## 🌟 Features

### 🎨 Design & UX
- **3D Animated Background** - Interactive Three.js 3D scene with floating particles and rotating geometric shapes
- **Smooth Animations** - GSAP-powered scroll animations and hover effects
- **Responsive Design** - Mobile-first approach, works seamlessly on all devices
- **Modern Gradient UI** - Beautiful color palette with purple, indigo, and pink gradients
- **Glassmorphism Effects** - Modern frosted glass UI elements with backdrop blur

### 📱 Product Categories
1. **Home Appliances** - Refrigerators, washing machines, microwaves, etc.
2. **Electronics & Gadgets** - Smartphones, laptops, accessories
3. **Cosmetics & Beauty** - Skincare, makeup, personal care products
4. **Wearables** - Smartwatches, fitness trackers, smart rings

### 💳 Pakistani Payment Methods
- **JazzCash** - Mobile wallet payments
- **Easypaisa** - Mobile money service with "Buy Now, Pay Later"
- **HBL Card** - Habib Bank debit/credit cards
- **UBL Card** - United Bank with EMI options
- **Bank Transfer** - Direct deposit from all Pakistani banks
- **Stripe** - International card payments
- **Cryptocurrency** - Bitcoin and stablecoin support

### ✨ Interactive Elements
- Smooth scroll navigation
- 3D tilt effects on cards
- Hover animations and transitions
- Scroll-to-top button
- Notification system
- Real-time scroll effects

## 📂 File Structure

```
ShopHub/
├── index.html          # Main HTML file with page structure
├── styles.css          # Complete styling with animations
├── script.js           # JavaScript for 3D, animations, and interactions
├── payment-setup.js    # Payment gateway integration (optional)
├── README.md           # This file
└── PAYMENT_SETUP.md    # Detailed payment integration guide
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Basic understanding of HTML/CSS/JavaScript
- Shopify store account (for actual integration)

### Installation

1. **Clone or Download Files**
```bash
# Clone the repository
git clone https://github.com/yourusername/shophub.git
cd shophub
```

2. **Open Locally**
```bash
# Simply open index.html in your browser
# Or use a local server
python -m http.server 8000
# Then visit http://localhost:8000
```

3. **Deploy to Shopify**
   - Log in to your Shopify admin
   - Go to Online Store > Themes
   - Click "Add theme" and upload custom theme files
   - Or use Shopify CLI for development

## 🎯 Customization

### Change Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary: #6366f1;        /* Main brand color */
    --secondary: #8b5cf6;      /* Secondary color */
    --accent: #ec4899;         /* Accent color */
    --dark: #0f172a;           /* Dark background */
}
```

### Update Store Name
Replace "ShopHub" with your store name in:
- `index.html` - Logo and title
- `styles.css` - If using custom branding

### Modify Product Categories
Edit category cards in `index.html`:
```html
<div class="category-card" data-category="your-category">
    <!-- Your category content -->
</div>
```

### Add Your Logo
Replace the SVG logo in the navbar with your own image:
```html
<div class="logo">
    <img src="your-logo.png" alt="ShopHub">
    <span>Your Store Name</span>
</div>
```

## 💳 Payment Gateway Setup

### Quick Setup Guide

#### 1. **JazzCash Integration**
```javascript
// Add JazzCash merchant account
const jazzCashConfig = {
    merchantID: 'YOUR_MERCHANT_ID',
    password: 'YOUR_PASSWORD',
    returnURL: 'https://yourstore.com/payment-confirmation'
};
```

#### 2. **Easypaisa Integration**
```javascript
const easypaisaConfig = {
    storeId: 'YOUR_STORE_ID',
    authToken: 'YOUR_AUTH_TOKEN',
    callbackURL: 'https://yourstore.com/payment-callback'
};
```

#### 3. **HBL/UBL (MULA) Integration**
```javascript
const muleConfig = {
    merchantID: 'YOUR_MERCHANT_ID',
    terminalID: 'YOUR_TERMINAL_ID',
    encryptionKey: 'YOUR_ENCRYPTION_KEY'
};
```

#### 4. **Stripe Integration**
```javascript
const stripeConfig = {
    publicKey: 'pk_live_YOUR_PUBLIC_KEY',
    secretKey: 'sk_live_YOUR_SECRET_KEY' // Keep secure on backend
};
```

See `PAYMENT_SETUP.md` for detailed integration steps.

## 🔧 Technologies Used

- **Three.js** - 3D graphics and animations
- **GSAP (GreenSock Animation Platform)** - Advanced animations
- **Vanilla JavaScript** - No framework dependencies
- **CSS3** - Modern styling with Grid, Flexbox, and transforms
- **ScrollTrigger Plugin** - Scroll-based animations

## 📊 Performance Optimization

- Lazy loading of 3D assets
- Optimized particle count based on device
- Debounced resize events
- GPU-accelerated animations
- Efficient DOM manipulation

## 🌐 Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Edge | ✅ Full |
| Opera | ✅ Full |
| IE 11 | ❌ Not supported |

## 📱 Responsive Breakpoints

- **Mobile** - < 480px
- **Tablet** - 480px - 768px
- **Desktop** - > 768px

## 🔒 Security Considerations

1. **Payment Data**
   - Never store credit card data on frontend
   - Use tokenization for payment processing
   - Implement PCI DSS compliance

2. **API Keys**
   - Store sensitive keys in backend environment variables
   - Use HTTPS for all transactions
   - Implement CSRF protection

3. **Data Validation**
   - Validate all user inputs
   - Sanitize form data
   - Implement rate limiting

## 📈 SEO Optimization

The landing page includes:
- Meta tags for search engines
- Open Graph tags for social sharing
- Structured data markup ready
- Fast loading times
- Mobile-friendly design

## 🐛 Troubleshooting

### 3D Background Not Showing
- Check if Three.js library is loading correctly
- Ensure browser supports WebGL
- Check browser console for errors

### Animations Not Working
- Verify GSAP library is loaded
- Check if JavaScript is enabled
- Ensure ScrollTrigger plugin is registered

### Payment Gateway Not Loading
- Verify API credentials are correct
- Check network tab for failed requests
- Ensure CORS is configured properly

## 📧 Support & Contact

For issues or questions:
- Email: support@shophub.com
- Website: https://shophub.com
- GitHub: https://github.com/shophub

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Three.js community for 3D graphics library
- GreenSock for GSAP animation library
- Shopify for e-commerce platform
- Pakistani payment providers for gateway integration

## 🚀 Future Enhancements

- [ ] Product search functionality
- [ ] User authentication system
- [ ] Shopping cart integration
- [ ] Customer reviews and ratings
- [ ] Live chat support
- [ ] Email newsletter subscription
- [ ] Multi-language support (Urdu/English)
- [ ] Dark mode toggle
- [ ] Advanced analytics dashboard

## 📞 Quick Start Commands

```bash
# Install dependencies (if using Node.js based build)
npm install

# Run local development server
npm start

# Build for production
npm run build

# Deploy to Shopify
shopify theme push

# Run tests
npm test
```

---

**Made with ❤️ for Pakistani e-commerce businesses**

Last Updated: 2026-06-14
Version: 1.0.0
