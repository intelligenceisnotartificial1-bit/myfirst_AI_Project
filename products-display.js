// =============================================
// PRODUCT DISPLAY & RENDERING MODULE
// =============================================

class ProductDisplayManager {
    constructor() {
        this.cart = [];
        this.currentCategory = null;
        this.filteredProducts = [];
        this.sortBy = 'popularity';
    }

    // Initialize product display on page load
    initProductDisplay() {
        this.renderCategoryProducts();
        this.setupCategoryFilters();
        this.setupProductModal();
        this.setupCartFunctionality();
    }

    // Render products for each category
    renderCategoryProducts() {
        const categoryCards = document.querySelectorAll('.category-card');

        categoryCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const products = getProductsByCategory(category);

            // Add product preview to category card
            if (products.length > 0) {
                const previewHTML = this.createCategoryPreview(products, category);
                const cardContent = card.querySelector('p');
                if (cardContent) {
                    cardContent.insertAdjacentHTML('afterend', previewHTML);
                }
            }
        });
    }

    // Create preview for category
    createCategoryPreview(products, category) {
        const topProducts = products.slice(0, 3);
        let html = `<div class="products-preview" data-category="${category}">`;

        topProducts.forEach((product, index) => {
            const discount = calculateDiscount(product);
            html += `
                <div class="product-preview-item" onclick="productManager.showProductModal('${product.id}')">
                    <div class="product-thumb">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                        ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
                    </div>
                    <div class="product-info-mini">
                        <p class="product-name-mini">${product.name}</p>
                        <div class="price-mini">
                            <span class="current-price">Rs ${product.price.toLocaleString()}</span>
                            ${product.originalPrice > product.price ? `<span class="original-price">Rs ${product.originalPrice.toLocaleString()}</span>` : ''}
                        </div>
                        <div class="rating-mini">
                            <span class="stars">★${product.rating.toFixed(1)}</span>
                            <span class="reviews">(${product.reviews})</span>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
            <div class="view-all-link">
                <a href="#" onclick="productManager.showCategoryProducts('${category}'); return false;">
                    View All ${products.length} Products →
                </a>
            </div>
        </div>`;

        return html;
    }

    // Show all products for a category
    showCategoryProducts(category) {
        const products = getProductsByCategory(category);
        this.currentCategory = category;
        this.filteredProducts = products;

        const modal = this.createCategoryModal(category, products);
        document.body.appendChild(modal);

        gsap.from(modal, {
            duration: 0.3,
            opacity: 0,
            y: 50,
            ease: 'back.out'
        });
    }

    // Create category modal
    createCategoryModal(category, products) {
        const modal = document.createElement('div');
        modal.className = 'products-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.closest('.products-modal').remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${category.replace('-', ' ').toUpperCase()}</h2>
                    <button class="close-btn" onclick="this.closest('.products-modal').remove()">✕</button>
                </div>

                <div class="modal-filters">
                    <select class="sort-select" onchange="productManager.sortProducts(this.value)">
                        <option value="popularity">Popularity</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rating</option>
                        <option value="newest">Newest</option>
                    </select>
                </div>

                <div class="modal-products-grid" id="products-grid">
                    ${this.createProductsGrid(products)}
                </div>
            </div>
        `;

        return modal;
    }

    // Create products grid
    createProductsGrid(products) {
        let html = '';

        products.forEach(product => {
            const discount = calculateDiscount(product);
            html += `
                <div class="product-card" onclick="productManager.showProductModal('${product.id}')">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                        <div class="product-badges">
                            ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
                            <span class="demand-badge ${product.demand.toLowerCase().replace(' ', '-')}">${product.demand}</span>
                        </div>
                        <button class="add-to-cart-btn" onclick="event.stopPropagation(); productManager.addToCart('${product.id}')">
                            Add to Cart
                        </button>
                    </div>

                    <div class="product-details">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${product.description}</p>

                        <div class="product-rating">
                            <div class="stars">
                                ${this.createStars(product.rating)}
                                <span class="rating-value">${product.rating.toFixed(1)}</span>
                            </div>
                            <span class="review-count">${product.reviews} reviews</span>
                        </div>

                        <div class="product-price">
                            <span class="current-price">Rs ${product.price.toLocaleString()}</span>
                            ${product.originalPrice > product.price ? `
                                <span class="original-price">Rs ${product.originalPrice.toLocaleString()}</span>
                                <span class="savings">Save Rs ${(product.originalPrice - product.price).toLocaleString()}</span>
                            ` : ''}
                        </div>

                        <div class="product-stock">
                            <span class="stock-status ${product.stock > 10 ? 'in-stock' : 'low-stock'}">
                                ${product.stock > 10 ? `✓ ${product.stock} in stock` : `Only ${product.stock} left!`}
                            </span>
                        </div>

                        <ul class="product-features">
                            ${product.features.map(feature => `<li>• ${feature}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        });

        return html;
    }

    // Show detailed product modal
    showProductModal(productId) {
        const product = getProductById(productId);
        if (!product) return;

        const modal = document.createElement('div');
        modal.className = 'product-detail-modal';
        const discount = calculateDiscount(product);

        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.closest('.product-detail-modal').remove()"></div>
            <div class="product-detail-content">
                <button class="close-btn" onclick="this.closest('.product-detail-modal').remove()">✕</button>

                <div class="product-detail-grid">
                    <div class="product-image-section">
                        <img src="${product.image}" alt="${product.name}">
                        ${discount > 0 ? `<span class="discount-badge large">-${discount}%</span>` : ''}
                    </div>

                    <div class="product-info-section">
                        <div class="product-header">
                            <h1>${product.name}</h1>
                            <p class="product-description">${product.description}</p>
                        </div>

                        <div class="product-ratings">
                            <div class="stars-large">
                                ${this.createStars(product.rating)}
                                <span class="rating-value">${product.rating.toFixed(1)}</span>
                            </div>
                            <span class="review-count">${product.reviews} verified reviews</span>
                        </div>

                        <div class="product-pricing">
                            <span class="current-price">Rs ${product.price.toLocaleString()}</span>
                            ${product.originalPrice > product.price ? `
                                <span class="original-price">Rs ${product.originalPrice.toLocaleString()}</span>
                                <span class="savings">You save: Rs ${(product.originalPrice - product.price).toLocaleString()}</span>
                            ` : ''}
                        </div>

                        <div class="product-features-list">
                            <h3>Key Features</h3>
                            <ul>
                                ${product.features.map(feature => `<li>✓ ${feature}</li>`).join('')}
                            </ul>
                        </div>

                        <div class="product-availability">
                            <span class="stock-status ${product.stock > 10 ? 'in-stock' : 'low-stock'}">
                                ${product.stock > 10 ? `In Stock (${product.stock} available)` : `Low Stock (Only ${product.stock} left!)`}
                            </span>
                        </div>

                        <div class="quantity-selector">
                            <label>Quantity:</label>
                            <div class="quantity-input">
                                <button onclick="this.nextElementSibling.value = Math.max(1, parseInt(this.nextElementSibling.value) - 1)">-</button>
                                <input type="number" value="1" min="1" max="${product.stock}">
                                <button onclick="this.previousElementSibling.value = Math.min(${product.stock}, parseInt(this.previousElementSibling.value) + 1)">+</button>
                            </div>
                        </div>

                        <div class="product-actions">
                            <button class="btn-primary btn-large add-to-cart" onclick="
                                const qty = this.closest('.product-detail-content').querySelector('.quantity-input input').value;
                                productManager.addToCart('${product.id}', parseInt(qty));
                                this.closest('.product-detail-modal').remove();
                            ">
                                Add to Cart
                            </button>
                            <button class="btn-secondary btn-large" onclick="this.closest('.product-detail-modal').remove()">
                                Continue Shopping
                            </button>
                        </div>

                        <div class="product-guarantee">
                            <p>✓ Authentic Product</p>
                            <p>✓ Secure Payment</p>
                            <p>✓ 30-Day Returns</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        gsap.from(modal.querySelector('.product-detail-content'), {
            duration: 0.3,
            opacity: 0,
            scale: 0.95,
            ease: 'back.out'
        });
    }

    // Create star rating display
    createStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars += '★';
            } else if (i - rating < 1) {
                stars += '⯨';
            } else {
                stars += '☆';
            }
        }
        return stars;
    }

    // Add to cart functionality
    addToCart(productId, quantity = 1) {
        const product = getProductById(productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                ...product,
                quantity: quantity
            });
        }

        showNotification(`${product.name} added to cart!`);
        this.updateCartCount();
    }

    // Update cart count display
    updateCartCount() {
        const cartBadge = document.querySelector('.cart-badge');
        if (cartBadge) {
            const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartBadge.textContent = count;
            cartBadge.style.display = count > 0 ? 'block' : 'none';
        }
    }

    // Setup cart functionality
    setupCartFunctionality() {
        // Cart button in navbar
        const navbar = document.querySelector('.navbar');
        if (navbar && !navbar.querySelector('.cart-button')) {
            const cartHTML = `
                <div class="cart-button" onclick="productManager.showCart()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span class="cart-badge">0</span>
                </div>
            `;
            navbar.appendChild(document.createRange().createContextualFragment(cartHTML));
        }
    }

    // Show cart modal
    showCart() {
        if (this.cart.length === 0) {
            showNotification('Your cart is empty', 'error');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'cart-modal';

        let cartHTML = '<div class="modal-overlay" onclick="this.closest(\'.cart-modal\').remove()"></div>';
        cartHTML += '<div class="cart-content">';
        cartHTML += '<div class="cart-header"><h2>Shopping Cart</h2><button class="close-btn" onclick="this.closest(\'.cart-modal\').remove()">✕</button></div>';
        cartHTML += '<div class="cart-items">';

        let total = 0;

        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            cartHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>Rs ${item.price.toLocaleString()}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button onclick="productManager.updateCartQuantity('${item.id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="productManager.updateCartQuantity('${item.id}', 1)">+</button>
                    </div>
                    <div class="cart-item-total">Rs ${itemTotal.toLocaleString()}</div>
                    <button class="remove-btn" onclick="productManager.removeFromCart('${item.id}')">✕</button>
                </div>
            `;
        });

        cartHTML += '</div>';
        cartHTML += `
            <div class="cart-footer">
                <div class="cart-total">
                    <strong>Total: Rs ${total.toLocaleString()}</strong>
                </div>
                <button class="btn-primary btn-large" onclick="productManager.proceedToCheckout()">
                    Proceed to Checkout
                </button>
            </div>
        </div>`;

        modal.innerHTML = cartHTML;
        document.body.appendChild(modal);
    }

    // Update cart quantity
    updateCartQuantity(productId, change) {
        const item = this.cart.find(i => i.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.showCart();
                this.updateCartCount();
            }
        }
    }

    // Remove from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateCartCount();
        showNotification('Item removed from cart');
        if (this.cart.length > 0) {
            this.showCart();
        }
    }

    // Proceed to checkout
    proceedToCheckout() {
        const cartTotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        showNotification(`Processing checkout for Rs ${cartTotal.toLocaleString()}`);

        // Scroll to payment section
        gsap.to(window, {
            duration: 1,
            scrollTo: {
                y: document.querySelector('#payment'),
                offsetY: 100
            },
            ease: 'power2.inOut'
        });

        document.querySelector('.cart-modal').remove();
    }

    // Sort products
    sortProducts(sortType) {
        let sorted = [...this.filteredProducts];

        switch (sortType) {
            case 'price-low':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case 'popularity':
            default:
                sorted.sort((a, b) => b.reviews - a.reviews);
        }

        this.filteredProducts = sorted;
        const grid = document.getElementById('products-grid');
        if (grid) {
            grid.innerHTML = this.createProductsGrid(sorted);
        }
    }

    // Setup category filters
    setupCategoryFilters() {
        const exploreButtons = document.querySelectorAll('.btn-explore');
        exploreButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const category = button.closest('.category-card').getAttribute('data-category');
                this.showCategoryProducts(category);
            });
        });
    }

    // Setup product modal
    setupProductModal() {
        // This is handled by onclick attributes in the HTML
    }
}

// Initialize product manager
const productManager = new ProductDisplayManager();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Three.js to initialize
    setTimeout(() => {
        productManager.initProductDisplay();
    }, 500);
});
