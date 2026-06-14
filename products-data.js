// =============================================
// PRODUCTS DATABASE - HIGH DEMAND ITEMS
// =============================================

const productsDatabase = {
    'home-appliances': [
        {
            id: 'HA001',
            name: 'Smart Refrigerator 450L',
            category: 'home-appliances',
            price: 89999,
            originalPrice: 119999,
            rating: 4.8,
            reviews: 2456,
            image: 'https://via.placeholder.com/300x300?text=Smart+Refrigerator',
            description: 'Energy-efficient smart refrigerator with WiFi control',
            stock: 45,
            badge: 'Best Seller',
            features: ['WiFi Control', 'Energy Efficient', '10-Year Warranty'],
            demand: 'Very High'
        },
        {
            id: 'HA002',
            name: 'Automatic Washing Machine 8kg',
            category: 'home-appliances',
            price: 34999,
            originalPrice: 49999,
            rating: 4.7,
            reviews: 3102,
            image: 'https://via.placeholder.com/300x300?text=Washing+Machine',
            description: 'Front-load automatic washing machine with AI wash',
            stock: 78,
            badge: 'Hot Deal',
            features: ['AI Wash', 'Energy Star', 'Digital Display'],
            demand: 'Very High'
        },
        {
            id: 'HA003',
            name: 'Air Conditioner 1.5 Ton',
            category: 'home-appliances',
            price: 45999,
            originalPrice: 64999,
            rating: 4.9,
            reviews: 4521,
            image: 'https://via.placeholder.com/300x300?text=Air+Conditioner',
            description: 'Inverter AC with smart cooling technology',
            stock: 62,
            badge: 'Premium',
            features: ['Inverter Tech', 'WiFi Smart', '5-Year Warranty'],
            demand: 'Very High'
        },
        {
            id: 'HA004',
            name: 'Microwave Oven 30L',
            category: 'home-appliances',
            price: 12999,
            originalPrice: 18999,
            rating: 4.6,
            reviews: 1823,
            image: 'https://via.placeholder.com/300x300?text=Microwave+Oven',
            description: 'Digital microwave with convection mode',
            stock: 95,
            badge: 'Popular',
            features: ['Convection Mode', 'Digital Control', 'Child Lock'],
            demand: 'High'
        },
        {
            id: 'HA005',
            name: 'Dishwasher 14 Place',
            category: 'home-appliances',
            price: 54999,
            originalPrice: 79999,
            rating: 4.8,
            reviews: 1256,
            image: 'https://via.placeholder.com/300x300?text=Dishwasher',
            description: 'Fully automatic dishwasher with 14 place setting',
            stock: 38,
            badge: 'Premium',
            features: ['Auto Wash', 'Energy Saving', 'Quiet Operation'],
            demand: 'Very High'
        },
        {
            id: 'HA006',
            name: 'Electric Water Heater 100L',
            category: 'home-appliances',
            price: 16999,
            originalPrice: 24999,
            rating: 4.7,
            reviews: 2134,
            image: 'https://via.placeholder.com/300x300?text=Water+Heater',
            description: 'Energy-efficient electric water heater',
            stock: 82,
            badge: 'Bestseller',
            features: ['Quick Heating', 'Temperature Control', 'Safety Thermostat'],
            demand: 'Very High'
        }
    ],

    'electronics': [
        {
            id: 'EL001',
            name: 'iPhone 15 Pro Max 256GB',
            category: 'electronics',
            price: 449999,
            originalPrice: 559999,
            rating: 4.9,
            reviews: 8934,
            image: 'https://via.placeholder.com/300x300?text=iPhone+15+Pro',
            description: 'Latest iPhone with A17 Pro chip and titanium design',
            stock: 34,
            badge: 'Flagship',
            features: ['A17 Pro Chip', 'Titanium Design', '5G Support'],
            demand: 'Very High'
        },
        {
            id: 'EL002',
            name: 'Samsung Galaxy S24 Ultra',
            category: 'electronics',
            price: 379999,
            originalPrice: 479999,
            rating: 4.8,
            reviews: 6234,
            image: 'https://via.placeholder.com/300x300?text=Samsung+S24',
            description: 'Premium Android flagship with 200MP camera',
            stock: 51,
            badge: 'Premium',
            features: ['200MP Camera', 'Snapdragon 8 Gen 3', '5G'],
            demand: 'Very High'
        },
        {
            id: 'EL003',
            name: 'Sony WH-1000XM5 Headphones',
            category: 'electronics',
            price: 34999,
            originalPrice: 49999,
            rating: 4.9,
            reviews: 5634,
            image: 'https://via.placeholder.com/300x300?text=Sony+Headphones',
            description: 'Industry-leading noise cancelling headphones',
            stock: 127,
            badge: 'Best Seller',
            features: ['ANC Tech', '8hr Battery', 'Premium Sound'],
            demand: 'Very High'
        },
        {
            id: 'EL004',
            name: 'iPad Pro 12.9" M4',
            category: 'electronics',
            price: 189999,
            originalPrice: 249999,
            rating: 4.8,
            reviews: 3456,
            image: 'https://via.placeholder.com/300x300?text=iPad+Pro',
            description: 'Powerful tablet with M4 chip and OLED display',
            stock: 42,
            badge: 'Flagship',
            features: ['M4 Chip', 'OLED Display', 'Pencil Support'],
            demand: 'Very High'
        },
        {
            id: 'EL005',
            name: 'PlayStation 5 Console',
            category: 'electronics',
            price: 74999,
            originalPrice: 99999,
            rating: 4.9,
            reviews: 9876,
            image: 'https://via.placeholder.com/300x300?text=PS5',
            description: 'Next-gen gaming console with ultra HD graphics',
            stock: 28,
            badge: 'Hot Deal',
            features: ['4K Gaming', 'Fast Loading', '825GB SSD'],
            demand: 'Very High'
        },
        {
            id: 'EL006',
            name: 'MacBook Pro 16" M3 Max',
            category: 'electronics',
            price: 449999,
            originalPrice: 549999,
            rating: 4.9,
            reviews: 4234,
            image: 'https://via.placeholder.com/300x300?text=MacBook+Pro',
            description: 'Professional laptop with M3 Max chip',
            stock: 19,
            badge: 'Premium',
            features: ['M3 Max Chip', 'ProMotion Display', 'All-Day Battery'],
            demand: 'High'
        }
    ],

    'cosmetics': [
        {
            id: 'CO001',
            name: 'MAC Fix+ Face Spray',
            category: 'cosmetics',
            price: 3499,
            originalPrice: 4999,
            rating: 4.8,
            reviews: 4567,
            image: 'https://via.placeholder.com/300x300?text=MAC+Fix+Spray',
            description: 'Professional makeup setting spray for long wear',
            stock: 234,
            badge: 'Best Seller',
            features: ['Long-Lasting', 'All-Day Wear', 'Professional Quality'],
            demand: 'Very High'
        },
        {
            id: 'CO002',
            name: 'Maybelline Superstay Lipstick',
            category: 'cosmetics',
            price: 1299,
            originalPrice: 1899,
            rating: 4.7,
            reviews: 7892,
            image: 'https://via.placeholder.com/300x300?text=Maybelline+Lipstick',
            description: 'Long-lasting liquid lipstick with vibrant colors',
            stock: 567,
            badge: 'Popular',
            features: ['24-Hour Wear', 'Waterproof', 'Matte Finish'],
            demand: 'Very High'
        },
        {
            id: 'CO003',
            name: 'Estée Lauder Double Wear',
            category: 'cosmetics',
            price: 5499,
            originalPrice: 7999,
            rating: 4.9,
            reviews: 3245,
            image: 'https://via.placeholder.com/300x300?text=Estee+Lauder',
            description: 'Premium foundation for flawless all-day coverage',
            stock: 156,
            badge: 'Premium',
            features: ['Full Coverage', 'SPF 10', 'Transfer-Resistant'],
            demand: 'Very High'
        },
        {
            id: 'CO004',
            name: 'L\'Oréal Paris Serum',
            category: 'cosmetics',
            price: 2299,
            originalPrice: 3599,
            rating: 4.8,
            reviews: 5634,
            image: 'https://via.placeholder.com/300x300?text=LOreal+Serum',
            description: 'Anti-aging serum with hyaluronic acid',
            stock: 345,
            badge: 'Hot Deal',
            features: ['Hydrating', 'Anti-Aging', 'Dermatologist Tested'],
            demand: 'Very High'
        },
        {
            id: 'CO005',
            name: 'Charlotte Tilbury Luxury Palette',
            category: 'cosmetics',
            price: 8999,
            originalPrice: 12999,
            rating: 4.9,
            reviews: 2134,
            image: 'https://via.placeholder.com/300x300?text=Charlotte+Tilbury',
            description: 'Luxury eyeshadow palette with 12 shades',
            stock: 89,
            badge: 'Premium',
            features: ['12 Shades', 'Blendable', 'Long-Lasting'],
            demand: 'High'
        },
        {
            id: 'CO006',
            name: 'Dove Body Lotion',
            category: 'cosmetics',
            price: 899,
            originalPrice: 1299,
            rating: 4.6,
            reviews: 12456,
            image: 'https://via.placeholder.com/300x300?text=Dove+Lotion',
            description: 'Moisturizing body lotion for soft skin',
            stock: 892,
            badge: 'Best Seller',
            features: ['Moisturizing', 'Dermatologist Tested', 'Gentle Formula'],
            demand: 'Very High'
        }
    ],

    'wearables': [
        {
            id: 'WR001',
            name: 'Apple Watch Ultra 2',
            category: 'wearables',
            price: 89999,
            originalPrice: 119999,
            rating: 4.9,
            reviews: 6234,
            image: 'https://via.placeholder.com/300x300?text=Apple+Watch+Ultra',
            description: 'Premium rugged smartwatch with advanced features',
            stock: 67,
            badge: 'Flagship',
            features: ['Rugged Design', 'Fitness Tracking', '36hr Battery'],
            demand: 'Very High'
        },
        {
            id: 'WR002',
            name: 'Samsung Galaxy Watch 6 Classic',
            category: 'wearables',
            price: 34999,
            originalPrice: 49999,
            rating: 4.8,
            reviews: 4567,
            image: 'https://via.placeholder.com/300x300?text=Galaxy+Watch+6',
            description: 'Classic smartwatch with rotating bezel',
            stock: 92,
            badge: 'Best Seller',
            features: ['AMOLED Display', 'Fitness Tracking', 'Heart Monitor'],
            demand: 'Very High'
        },
        {
            id: 'WR003',
            name: 'Fitbit Charge 6',
            category: 'wearables',
            price: 19999,
            originalPrice: 29999,
            rating: 4.7,
            reviews: 8234,
            image: 'https://via.placeholder.com/300x300?text=Fitbit+Charge+6',
            description: 'Fitness tracker with comprehensive health monitoring',
            stock: 178,
            badge: 'Popular',
            features: ['6-Day Battery', 'ECG App', 'Sleep Tracking'],
            demand: 'Very High'
        },
        {
            id: 'WR004',
            name: 'Garmin Forerunner 965',
            category: 'wearables',
            price: 54999,
            originalPrice: 79999,
            rating: 4.9,
            reviews: 2345,
            image: 'https://via.placeholder.com/300x300?text=Garmin+Forerunner',
            description: 'GPS running watch for serious athletes',
            stock: 45,
            badge: 'Premium',
            features: ['GPS Tracking', 'AMOLED Display', '11-Day Battery'],
            demand: 'High'
        },
        {
            id: 'WR005',
            name: 'Sony WF-1000XM5 Earbuds',
            category: 'wearables',
            price: 24999,
            originalPrice: 34999,
            rating: 4.9,
            reviews: 5634,
            image: 'https://via.placeholder.com/300x300?text=Sony+WF+Earbuds',
            description: 'Wireless earbuds with premium noise cancellation',
            stock: 134,
            badge: 'Best Seller',
            features: ['ANC', '8hr Battery', 'Spatial Audio'],
            demand: 'Very High'
        },
        {
            id: 'WR006',
            name: 'Mi Band 8 Pro',
            category: 'wearables',
            price: 8999,
            originalPrice: 12999,
            rating: 4.6,
            reviews: 9876,
            image: 'https://via.placeholder.com/300x300?text=Mi+Band+8',
            description: 'Budget-friendly fitness band with AMOLED display',
            stock: 456,
            badge: 'Value Deal',
            features: ['AMOLED Display', '14-Day Battery', 'Health Monitoring'],
            demand: 'Very High'
        }
    ]
};

// =============================================
// PRODUCT UTILITY FUNCTIONS
// =============================================

function getProductsByCategory(category) {
    return productsDatabase[category] || [];
}

function getAllProducts() {
    let allProducts = [];
    for (let category in productsDatabase) {
        allProducts = allProducts.concat(productsDatabase[category]);
    }
    return allProducts;
}

function getProductById(productId) {
    const allProducts = getAllProducts();
    return allProducts.find(product => product.id === productId);
}

function getTopSellingProducts(limit = 10) {
    return getAllProducts()
        .sort((a, b) => b.reviews - a.reviews)
        .slice(0, limit);
}

function getDiscountedProducts() {
    return getAllProducts()
        .filter(product => product.price < product.originalPrice)
        .sort((a, b) => {
            const discountA = ((b.originalPrice - b.price) / b.originalPrice) * 100;
            const discountB = ((a.originalPrice - a.price) / a.originalPrice) * 100;
            return discountA - discountB;
        });
}

function getProductsByDemand(demandLevel) {
    return getAllProducts().filter(product => product.demand === demandLevel);
}

function calculateDiscount(product) {
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
}

// =============================================
// EXPORT FOR USE
// =============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        productsDatabase,
        getProductsByCategory,
        getAllProducts,
        getProductById,
        getTopSellingProducts,
        getDiscountedProducts,
        getProductsByDemand,
        calculateDiscount
    };
}
