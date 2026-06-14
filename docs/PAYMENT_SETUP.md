# Pakistani Payment Gateway Integration Guide

Complete setup guide for integrating Pakistani payment methods into your ShopHub Shopify store.

## Table of Contents
1. [JazzCash Integration](#jazzcash-integration)
2. [Easypaisa Integration](#easypaisa-integration)
3. [HBL/UBL (MULA) Integration](#hblubl-mula-integration)
4. [Bank Transfer Setup](#bank-transfer-setup)
5. [Stripe Integration](#stripe-integration)
6. [Cryptocurrency Payment](#cryptocurrency-payment)
7. [Testing & Deployment](#testing--deployment)

---

## JazzCash Integration

### Step 1: Create Merchant Account
1. Visit [JazzCash Merchant Portal](https://www.jazzcash.com.pk/)
2. Click "Register as Merchant"
3. Fill business details
4. Provide business documents (CNIC, business registration)
5. Wait for approval (2-3 business days)

### Step 2: Get API Credentials
After approval, you'll receive:
- Merchant ID
- Merchant Password
- Merchant Name
- API Endpoint (usually provided in dashboard)

### Step 3: Implementation

**Frontend (JavaScript):**
```javascript
// jazzcash-integration.js

class JazzCashPayment {
    constructor(merchantID, password) {
        this.merchantID = merchantID;
        this.password = password;
        this.baseURL = 'https://secure.jazzcash.com.pk/';
    }

    async initiatePayment(amount, orderId, customerEmail) {
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
        
        const paymentData = {
            pp_merchant_id: this.merchantID,
            pp_language: 'en',
            pp_password: this.password,
            pp_amount: (amount * 100).toString(), // Amount in paisas
            pp_bill_reference: orderId,
            pp_description: 'ShopHub Purchase',
            pp_return_url: 'https://yourstore.com/payment-confirmation',
            pp_notify_url: 'https://yourstore.com/payment-callback',
            pp_customer_email: customerEmail,
            pp_request_id: `${orderId}-${timestamp}`,
            pp_is_recurring: '0',
            pp_recurring_cycle: 'O',
            pp_data_auth: this.generateAuth(orderId, amount, timestamp)
        };

        return paymentData;
    }

    generateAuth(orderId, amount, timestamp) {
        // Implementation of security hash generation
        // Specific to JazzCash API
        const crypto = require('crypto');
        const str = `${this.merchantID}|${orderId}|${amount}|${timestamp}`;
        return crypto.createHash('sha256').update(str + this.password).digest('hex');
    }

    redirectToPayment(paymentData) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = this.baseURL + 'ProcessRequest';

        Object.keys(paymentData).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = paymentData[key];
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
    }
}

// Usage
const jazzCash = new JazzCashPayment('YOUR_MERCHANT_ID', 'YOUR_PASSWORD');
const paymentData = await jazzCash.initiatePayment(5000, 'ORDER-001', 'customer@example.com');
jazzCash.redirectToPayment(paymentData);
```

**Backend (Node.js/Express):**
```javascript
// Routes/jazzcash.js
const express = require('express');
const crypto = require('crypto');
const router = express.Router();

router.post('/pay/jazzcash', async (req, res) => {
    const { amount, orderId, email } = req.body;
    
    try {
        const paymentData = await generateJazzCashPayment(amount, orderId, email);
        res.json({ success: true, data: paymentData });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

router.post('/jazzcash-callback', async (req, res) => {
    // Verify payment callback
    const { pp_Status, pp_merchant_id, pp_bill_reference } = req.body;
    
    if (pp_Status === '2') { // Success
        // Update order status in database
        await updateOrderStatus(pp_bill_reference, 'completed');
        res.json({ success: true, message: 'Payment confirmed' });
    } else {
        await updateOrderStatus(pp_bill_reference, 'failed');
        res.json({ success: false, message: 'Payment failed' });
    }
});

module.exports = router;
```

---

## Easypaisa Integration

### Step 1: Register as Merchant
1. Visit [Easypaisa Business Portal](https://business.easypaisa.com.pk/)
2. Register your business account
3. Complete KYC verification
4. Submit required documents

### Step 2: Activate Payment Gateway
1. Go to "Payment Gateway" section
2. Enable online payments
3. Set up return URL: `https://yourstore.com/payment-confirmation`
4. Get your Store ID and Auth Token

### Step 3: Implementation

```javascript
// easypaisa-integration.js

class EasypaisaPayment {
    constructor(storeId, authToken) {
        this.storeId = storeId;
        this.authToken = authToken;
        this.baseURL = 'https://sandbox.easypaisa.com.pk/'; // Use production URL in production
    }

    async initiatePayment(amount, orderId, phone, email) {
        const timestamp = Date.now();
        
        const payload = {
            StoreId: this.storeId,
            AuthToken: this.authToken,
            Amount: amount.toString(),
            OrderId: orderId,
            OrderDetails: 'ShopHub Purchase',
            CustomerName: 'Customer',
            CustomerEmail: email,
            CustomerPhone: phone,
            ReturnUrl: 'https://yourstore.com/payment-confirmation',
            OrderExpiryDate: new Date(Date.now() + 24*60*60*1000).toISOString(),
            SessionToken: this.generateSessionToken(orderId, amount, timestamp)
        };

        try {
            const response = await fetch(`${this.baseURL}api/payment/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            return {
                success: data.status === 'SUCCESS',
                paymentUrl: data.data?.PaymentURL,
                orderId: data.data?.OrderId
            };
        } catch (error) {
            console.error('Easypaisa payment initiation failed:', error);
            return { success: false, error: error.message };
        }
    }

    generateSessionToken(orderId, amount, timestamp) {
        const crypto = require('crypto');
        const str = `${this.storeId}|${orderId}|${amount}|${timestamp}`;
        return crypto.createHash('sha256').update(str + this.authToken).digest('hex');
    }

    redirectToPayment(paymentUrl) {
        window.location.href = paymentUrl;
    }
}

// Usage
const easypaisa = new EasypaisaPayment('YOUR_STORE_ID', 'YOUR_AUTH_TOKEN');
const result = await easypaisa.initiatePayment(5000, 'ORDER-001', '03001234567', 'customer@example.com');
if (result.success) {
    easypaisa.redirectToPayment(result.paymentUrl);
}
```

---

## HBL/UBL (MULA) Integration

### Step 1: Get Merchant Credentials
1. Contact HBL/UBL Payment Solutions team
2. Complete merchant agreement
3. Receive:
   - Merchant ID
   - Terminal ID
   - Encryption Key

### Step 2: Implementation

```javascript
// mula-integration.js

class MulaPayment {
    constructor(merchantId, terminalId, encryptionKey) {
        this.merchantId = merchantId;
        this.terminalId = terminalId;
        this.encryptionKey = encryptionKey;
        this.baseURL = 'https://payment.mula.pk/'; // Example URL
    }

    async initiatePayment(amount, orderId, currency = 'PKR') {
        const timestamp = new Date().getTime();
        
        const transactionData = {
            merchant_id: this.merchantId,
            terminal_id: this.terminalId,
            order_id: orderId,
            amount: amount,
            currency: currency,
            timestamp: timestamp,
            description: 'ShopHub Purchase',
            return_url: 'https://yourstore.com/payment-confirmation',
            cancel_url: 'https://yourstore.com/payment-cancelled'
        };

        const signature = this.generateSignature(transactionData);
        transactionData.signature = signature;

        return transactionData;
    }

    generateSignature(data) {
        const crypto = require('crypto');
        const signString = `${data.merchant_id}|${data.terminal_id}|${data.order_id}|${data.amount}|${data.currency}`;
        return crypto.createHmac('sha256', this.encryptionKey).update(signString).digest('hex');
    }

    async processPayment(transactionData) {
        try {
            const response = await fetch(`${this.baseURL}api/payment/initiate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(transactionData)
            });

            return await response.json();
        } catch (error) {
            console.error('MULA payment failed:', error);
            return { success: false, error: error.message };
        }
    }
}

// Usage
const mula = new MulaPayment('YOUR_MERCHANT_ID', 'YOUR_TERMINAL_ID', 'YOUR_ENCRYPTION_KEY');
const payment = await mula.initiatePayment(5000, 'ORDER-001');
const result = await mula.processPayment(payment);
```

---

## Bank Transfer Setup

### Implementation

```javascript
// bank-transfer.js

class BankTransferPayment {
    constructor(bankDetails) {
        this.bankDetails = bankDetails; // Array of bank account details
    }

    generateBankTransferInstructions(orderId, amount) {
        return {
            orderId: orderId,
            amount: amount,
            currency: 'PKR',
            bankAccounts: this.bankDetails,
            reference: `ShopHub-${orderId}`,
            expiryTime: new Date(Date.now() + 24*60*60*1000).toISOString(),
            instructions: [
                'Transfer the amount to any of the bank accounts listed below',
                'Use Order ID as reference',
                'You will receive confirmation email within 2 hours'
            ]
        };
    }

    displayBankDetails(orderId, amount) {
        const instructions = this.generateBankTransferInstructions(orderId, amount);
        
        let html = `
            <div class="bank-transfer-modal">
                <h3>Bank Transfer Instructions</h3>
                <p>Order ID: <strong>${instructions.orderId}</strong></p>
                <p>Amount: <strong>PKR ${amount.toLocaleString()}</strong></p>
                
                <div class="bank-accounts">
                    ${instructions.bankAccounts.map(bank => `
                        <div class="bank-card">
                            <h4>${bank.bankName}</h4>
                            <p><strong>Account Holder:</strong> ${bank.accountHolder}</p>
                            <p><strong>Account Number:</strong> ${bank.accountNumber}</p>
                            <p><strong>IBAN:</strong> ${bank.iban}</p>
                            <p><strong>Branch:</strong> ${bank.branchCode}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="important-notes">
                    <h4>Important:</h4>
                    <ul>
                        ${instructions.instructions.map(inst => `<li>${inst}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        return html;
    }
}

// Usage
const bankAccounts = [
    {
        bankName: 'Habib Bank Limited',
        accountHolder: 'ShopHub (Pvt) Ltd',
        accountNumber: '1234567890123',
        iban: 'PK36HABLC0123456789012345',
        branchCode: 'HBKMPKKA'
    },
    {
        bankName: 'United Bank Limited',
        accountHolder: 'ShopHub (Pvt) Ltd',
        accountNumber: '0987654321098',
        iban: 'PK82UBLCASPS0987654321098',
        branchCode: 'UBLEKAHY'
    }
];

const bankTransfer = new BankTransferPayment(bankAccounts);
const instructions = bankTransfer.displayBankDetails('ORDER-001', 5000);
```

---

## Stripe Integration

### Step 1: Setup Stripe Account
1. Create account at [stripe.com](https://stripe.com)
2. Verify business details
3. Get API keys from Dashboard > API Keys

### Step 2: Implementation

```javascript
// stripe-integration.js

class StripePayment {
    constructor(publicKey) {
        this.publicKey = publicKey;
        this.stripe = Stripe(publicKey);
    }

    async initiatePayment(amount, orderId, email) {
        try {
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: amount * 100, // Convert to cents
                    orderId: orderId,
                    email: email,
                    currency: 'pkr'
                })
            });

            const data = await response.json();
            return data.clientSecret;
        } catch (error) {
            console.error('Failed to create payment intent:', error);
            throw error;
        }
    }

    async confirmPayment(clientSecret, paymentMethodId) {
        try {
            const result = await this.stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethodId
            });

            return result;
        } catch (error) {
            console.error('Payment confirmation failed:', error);
            throw error;
        }
    }
}

// Backend (Node.js)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/create-payment-intent', async (req, res) => {
    const { amount, orderId, email, currency } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            metadata: {
                orderId: orderId,
                email: email
            }
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            success: true
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
```

---

## Cryptocurrency Payment

### Step 1: Setup Crypto Wallet
1. Choose payment processor: Coinbase Commerce, BitPay, or BTCPay
2. Create merchant account
3. Generate API keys

### Step 2: Implementation

```javascript
// crypto-integration.js

class CryptoPayment {
    constructor(apiKey, apiSecret) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.baseURL = 'https://api.commerce.coinbase.com/charges';
    }

    async initiatePayment(amount, orderId, email, currency = 'PKR') {
        const payload = {
            name: 'ShopHub Purchase',
            description: `Order ${orderId}`,
            pricing_type: 'fixed_price',
            local_price: {
                amount: amount.toString(),
                currency: currency
            },
            metadata: {
                orderId: orderId,
                email: email
            },
            redirect_url: 'https://yourstore.com/payment-confirmation',
            cancel_url: 'https://yourstore.com/payment-cancelled'
        };

        try {
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CC-Api-Key': this.apiKey
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            return {
                success: data.data?.id ? true : false,
                chargeId: data.data?.id,
                hostedUrl: data.data?.hosted_url,
                paymentAddress: data.data?.address
            };
        } catch (error) {
            console.error('Crypto payment initiation failed:', error);
            return { success: false, error: error.message };
        }
    }

    async checkPaymentStatus(chargeId) {
        try {
            const response = await fetch(`${this.baseURL}/${chargeId}`, {
                method: 'GET',
                headers: {
                    'X-CC-Api-Key': this.apiKey
                }
            });

            const data = await response.json();
            return {
                status: data.data?.timeline[0]?.status,
                amount: data.data?.local_price?.amount,
                received: data.data?.payments
            };
        } catch (error) {
            console.error('Failed to check payment status:', error);
            return { success: false, error: error.message };
        }
    }
}

// Usage
const crypto = new CryptoPayment('YOUR_API_KEY', 'YOUR_API_SECRET');
const payment = await crypto.initiatePayment(5000, 'ORDER-001', 'customer@example.com');
if (payment.success) {
    window.location.href = payment.hostedUrl;
}
```

---

## Testing & Deployment

### Test Environment Setup

```bash
# Set environment variables
export NODE_ENV=development
export JAZZCASH_MERCHANT_ID=test_merchant
export EASYPAISA_STORE_ID=test_store
export STRIPE_PUBLIC_KEY=pk_test_XXXXX
export STRIPE_SECRET_KEY=sk_test_XXXXX
```

### Test Cards for Each Gateway

| Gateway | Test Card | CVV | Exp Date |
|---------|-----------|-----|----------|
| Stripe | 4242 4242 4242 4242 | 424 | 12/25 |
| Stripe | 5555 5555 5555 4444 | 222 | 12/25 |

### Webhook Configuration

```javascript
// webhook-handler.js

app.post('/webhooks/payment', express.json(), async (req, res) => {
    const signature = req.headers['x-signature'];
    const body = req.rawBody;

    // Verify webhook signature
    if (!verifySignature(signature, body)) {
        return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = req.body;

    switch (event.type) {
        case 'payment.completed':
            await handlePaymentCompleted(event.data);
            break;
        case 'payment.failed':
            await handlePaymentFailed(event.data);
            break;
        case 'payment.refunded':
            await handlePaymentRefunded(event.data);
            break;
    }

    res.json({ received: true });
});

function verifySignature(signature, body) {
    const crypto = require('crypto');
    const hash = crypto
        .createHmac('sha256', process.env.WEBHOOK_SECRET)
        .update(body)
        .digest('hex');
    return hash === signature;
}
```

### Production Deployment Checklist

- [ ] Replace test API keys with production keys
- [ ] Enable HTTPS on all endpoints
- [ ] Set up proper error logging
- [ ] Configure payment webhook handlers
- [ ] Test end-to-end payment flow
- [ ] Set up payment reconciliation
- [ ] Configure customer notifications
- [ ] Set up monitoring and alerts
- [ ] Document payment procedures
- [ ] Train support team

---

## Troubleshooting

### Common Issues

**Payment gateway not responding:**
```javascript
// Add retry logic
async function retryPayment(fn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}
```

**Payment callback not received:**
- Verify webhook URL is publicly accessible
- Check firewall/security group settings
- Ensure return URL is configured correctly

**Transaction timeout:**
```javascript
// Implement timeout handling
const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Payment timeout')), 30000)
);

const payment = Promise.race([
    initiatePayment(data),
    timeoutPromise
]);
```

---

**Document Version:** 1.0.0
**Last Updated:** 2026-06-14
**Maintainer:** ShopHub Team
