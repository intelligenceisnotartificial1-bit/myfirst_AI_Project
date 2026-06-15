# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ShopHub** is a 3D-animated e-commerce landing page with integrated payment processing for Pakistani markets. The application is a frontend-focused single-page application (~2,450 lines of code) with no build step—files run directly in the browser.

**Status:** Production-ready with 24 products across 4 categories, 7 payment methods integrated, and complete documentation.

## Architecture

The codebase is organized as a modular frontend application with three main systems:

### 1. **3D Graphics & UI Layer** (`script.js`, `styles.css`)
- Three.js scene with animated particle system and rotating geometric shapes
- GSAP-powered scroll animations and transitions
- Responsive mobile-first design with CSS Grid/Flexbox
- Single-page navigation with smooth scrolling

**Key patterns:**
- 3D renderer initializes on page load in `init3DBackground()`
- Window resize handler updates Three.js camera/renderer
- GSAP animations trigger via scroll events
- CSS variables in `:root` control all colors and spacing

### 2. **Product Management System** (`products-data.js`, `products-display.js`)
- **Data layer** (`products-data.js`): `productsDatabase` object with 24 products organized by category (home-appliances, electronics, cosmetics, wearables)
- **Display layer** (`products-display.js`): `ProductDisplayManager` class handles UI rendering, modal dialogs, cart state, filtering, and sorting
- Products have properties: `id`, `name`, `price`, `originalPrice`, `rating`, `reviews`, `image`, `stock`, `badge`, `features`, `demand`
- Cart is stored in memory (in-browser) within the manager instance

**Key patterns:**
- `getProductsByCategory(category)` retrieves all products for a category
- `calculateDiscount(product)` computes percentage discount
- Modals are dynamically created and appended to DOM
- Product rendering uses template literals with `insertAdjacentHTML()`

### 3. **Payment Integration** (`payment-integration.js`)
- Unified `PaymentGateway` class orchestrates 7 payment methods:
  - JazzCash, Easypaisa (Pakistani mobile wallets)
  - HBL Card, UBL Card (Pakistani bank cards)
  - Bank Transfer, Stripe (international), Crypto
- Each payment method is a separate class (`JazzCashPayment`, `EasypaisaPayment`, etc.)
- Async payment flow: `initiatePayment()` → `verifyPayment()`
- Configuration injected at runtime; credentials stored in environment/backend

## Development Workflow

### Running the App
```bash
# Local browser
# Open index.html directly in a web browser

# Or use a simple HTTP server
npm run serve           # Starts http-server on port 8000
python -m http.server   # Python built-in server
```

The app has **no build step**—all code runs directly in the browser. External libraries (Three.js, GSAP) load via CDN from `index.html`.

### Testing & Verification
```bash
npm test               # Jest with coverage (configured in package.json)
npm run lint           # ESLint check
npm run lint:fix       # Auto-fix linting issues
```

**Manual testing entry point:** Open `test-products.html` to see inventory dashboard and verify product data is loading.

### Code Locations for Common Tasks

| Task | File(s) |
|------|---------|
| Add/edit products | `products-data.js` → `productsDatabase` object |
| Customize product UI | `products-display.js` → `ProductDisplayManager` class methods |
| Adjust 3D background | `script.js` → `init3DBackground()`, `createFloatingParticles()` |
| Change colors/spacing | `styles.css` → `:root` CSS variables |
| Add payment method | `payment-integration.js` → create new class, register in `PaymentGateway` |
| Modify cart behavior | `products-display.js` → `setupCartFunctionality()` |

## State Management

- **Products:** Read-only from `productsDatabase` in `products-data.js`
- **Cart:** Stored in `ProductDisplayManager.cart` array (in-memory only; not persisted)
- **UI State:** Managed by individual GSAP animations and DOM state (modals, active tabs)
- **No external state library** (Redux, Vuex, etc.)—keep state local to class instances

### Current Limitations & Future Work
- Cart clears on page refresh (no localStorage or backend persistence)
- Payment methods are wired but require backend endpoint integration (credentials, webhook verification)
- No user authentication or order history
- No inventory sync with backend database

## Styling & Responsive Design

**Breakpoints:**
- Mobile: < 480px
- Tablet: 480px–768px
- Desktop: > 768px

**Color Palette** (defined in `styles.css` `:root`):
- Primary: `#6366f1` (indigo)
- Secondary: `#8b5cf6` (purple)
- Accent: `#ec4899` (pink)
- Dark: `#0f172a` (navy)

**CSS patterns:**
- Glassmorphism: `backdrop-filter: blur()` on modal overlays
- Grid layouts for product cards
- Flexbox for navigation and controls
- GPU-accelerated animations via `transform` and `opacity`

## External Dependencies

Loaded via CDN in `index.html`:
- **Three.js** r128 — 3D graphics and particle system
- **GSAP** 3.12.2 — Animation library with ScrollTrigger plugin

npm packages (in `package.json`):
- Express, Stripe, payment gateway SDKs (for backend integration)
- Jest, ESLint, Prettier (dev tools)
- Webpack, Babel (for optional bundling)

**Note:** The app runs without npm dependencies installed—they're optional for future backend expansion or build optimization.

## Customization Quick Reference

### Add a New Product
Edit `products-data.js`, find the category array (e.g., `'home-appliances'`), and append a product object:
```javascript
{
    id: 'HA007',
    name: 'Your Product',
    category: 'home-appliances',
    price: 29999,
    originalPrice: 39999,
    rating: 4.5,
    reviews: 100,
    image: 'https://...',
    description: 'Description here',
    stock: 50,
    badge: 'New',
    features: ['Feature 1', 'Feature 2'],
    demand: 'High'
}
```

### Update Product Prices
Search `products-data.js` for the product by name, update `price` and `originalPrice`, save. Changes appear on next page load.

### Change Brand Colors
Edit `:root` variables in `styles.css`:
```css
:root {
    --primary: #YOUR_HEX;
    --secondary: #YOUR_HEX;
    ...
}
```

### Configure Payment Credentials
Credentials are injected at runtime via the `PaymentGateway` constructor. For production:
1. Backend API should provide config from secure environment variables
2. Frontend receives config on page init (e.g., via API call)
3. Payment methods instantiate with config; API credentials never exposed in frontend code

## Documentation Navigation

Start with these when exploring:
- **[README](docs/README.md)** — High-level features and overview
- **[IMPLEMENTATION_SUMMARY](docs/IMPLEMENTATION_SUMMARY.md)** — Technical implementation details
- **[PRODUCTS_GUIDE](docs/PRODUCTS_GUIDE.md)** — Product data structure and categories
- **[PAYMENT_SETUP](docs/PAYMENT_SETUP.md)** — Payment integration setup guide
- **[DEPLOYMENT](docs/DEPLOYMENT.md)** — Production deployment steps
- **[TROUBLESHOOTING](docs/TROUBLESHOOTING.md)** — Common issues and fixes

Full index: [INDEX](docs/INDEX.md)
