// =============================================
// UNIFIED PAYMENT GATEWAY INTEGRATION
// =============================================

/**
 * ShopHub Payment Integration Module
 * Handles all Pakistani payment methods
 * Supports: JazzCash, Easypaisa, HBL, UBL, Bank Transfer, Stripe, Crypto
 */

class PaymentGateway {
    constructor(config) {
        this.config = config;
        this.paymentMethods = {};
        this.initializePaymentMethods();
    }

    initializePaymentMethods() {
        this.paymentMethods = {
            jazzcash: new JazzCashPayment(this.config.jazzcash),
            easypaisa: new EasypaisaPayment(this.config.easypaisa),
            hbl: new HBLPayment(this.config.hbl),
            ubl: new UBLPayment(this.config.ubl),
            bankTransfer: new BankTransferPayment(this.config.bankTransfer),
            stripe: new StripePayment(this.config.stripe),
            crypto: new CryptoPayment(this.config.crypto)
        };
    }

    async initiatePayment(method, paymentData) {
        const gateway = this.paymentMethods[method];
        if (!gateway) {
            throw new Error(`Payment method ${method} not supported`);
        }
        return await gateway.initiatePayment(paymentData);
    }

    async verifyPayment(method, verificationData) {
        const gateway = this.paymentMethods[method];
        if (!gateway) {
            throw new Error(`Payment method ${method} not supported`);
        }
        return await gateway.verifyPayment(verificationData);
    }

    getAvailableMethods() {
        return Object.keys(this.paymentMethods);
    }

    getMethodDetails(method) {
        return {
            name: method,
            enabled: !!this.paymentMethods[method],
            config: this.config[method]
        };
    }
}

// =============================================
// JAZZCASH PAYMENT CLASS
// =============================================

class JazzCashPayment {
    constructor(config) {
        this.merchantID = config.merchantID;
        this.password = config.password;
        this.merchantName = config.merchantName;
        this.baseURL = config.baseURL || 'https://sandbox.jazzcash.com.pk/';
        this.isProduction = config.isProduction || false;
    }

    async initiatePayment(paymentData) {
        const { amount, orderId, customerEmail, customerPhone, description } = paymentData;

        try {
            const timestamp = this.getTimestamp();
            const requestData = {
                pp_merchant_id: this.merchantID,
                pp_language: 'en',
                pp_password: this.password,
                pp_amount: (amount * 100).toString(),
                pp_bill_reference: orderId,
                pp_description: description || 'ShopHub Purchase',
                pp_return_url: paymentData.returnUrl || 'https://yourstore.com/payment/confirmation',
                pp_notify_url: paymentData.notifyUrl || 'https://yourstore.com/api/payment/callback',
                pp_customer_email: customerEmail,
                pp_customer_mobile: customerPhone,
                pp_request_id: `${orderId}-${timestamp}`,
                pp_is_recurring: '0',
                pp_recurring_cycle: 'O'
            };

            return {
                success: true,
                method: 'jazzcash',
                data: requestData,
                redirectUrl: `${this.baseURL}ProcessRequest`,
                timestamp: timestamp
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async verifyPayment(verificationData) {
        const { pp_Status, pp_merchant_id, pp_bill_reference, pp_Amount } = verificationData;

        try {
            if (pp_Status === '2') {
                return {
                    success: true,
                    status: 'completed',
                    orderId: pp_bill_reference,
                    amount: pp_Amount / 100
                };
            } else if (pp_Status === '3') {
                return {
                    success: false,
                    status: 'failed',
                    orderId: pp_bill_reference
                };
            } else {
                return {
                    success: false,
                    status: 'cancelled',
                    orderId: pp_bill_reference
                };
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    getTimestamp() {
        return new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    }
}

// =============================================
// EASYPAISA PAYMENT CLASS
// =============================================

class EasypaisaPayment {
    constructor(config) {
        this.storeId = config.storeId;
        this.authToken = config.authToken;
        this.baseURL = config.baseURL || 'https://sandbox.easypaisa.com.pk/';
        this.apiEndpoint = config.apiEndpoint || 'api/payment/create';
    }

    async initiatePayment(paymentData) {
        const { amount, orderId, customerEmail, customerPhone, description } = paymentData;

        try {
            const payload = {
                StoreId: this.storeId,
                AuthToken: this.authToken,
                Amount: amount.toString(),
                OrderId: orderId,
                OrderDetails: description || 'ShopHub Purchase',
                CustomerName: paymentData.customerName || 'Customer',
                CustomerEmail: customerEmail,
                CustomerPhone: customerPhone,
                ReturnUrl: paymentData.returnUrl || 'https://yourstore.com/payment/confirmation',
                OrderExpiryDate: new Date(Date.now() + 24*60*60*1000).toISOString()
            };

            const response = await fetch(`${this.baseURL}${this.apiEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            return {
                success: result.status === 'SUCCESS',
                method: 'easypaisa',
                data: result.data,
                redirectUrl: result.data?.PaymentURL,
                orderId: result.data?.OrderId
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async verifyPayment(verificationData) {
        const { OrderId, Status, Amount } = verificationData;

        try {
            if (Status === 'SUCCESS') {
                return {
                    success: true,
                    status: 'completed',
                    orderId: OrderId,
                    amount: Amount
                };
            } else {
                return {
                    success: false,
                    status: 'failed',
                    orderId: OrderId
                };
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// =============================================
// HBL PAYMENT CLASS
// =============================================

class HBLPayment {
    constructor(config) {
        this.merchantId = config.merchantId;
        this.terminalId = config.terminalId;
        this.encryptionKey = config.encryptionKey;
        this.baseURL = config.baseURL || 'https://payment.hbl.com.pk/';
    }

    async initiatePayment(paymentData) {
        const { amount, orderId, description } = paymentData;

        try {
            const transactionData = {
                merchant_id: this.merchantId,
                terminal_id: this.terminalId,
                order_id: orderId,
                amount: amount,
                currency: 'PKR',
                timestamp: Date.now(),
                description: description || 'ShopHub Purchase',
                return_url: paymentData.returnUrl || 'https://yourstore.com/payment/confirmation',
                cancel_url: paymentData.cancelUrl || 'https://yourstore.com/payment/cancelled'
            };

            return {
                success: true,
                method: 'hbl',
                data: transactionData,
                redirectUrl: `${this.baseURL}payment`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async verifyPayment(verificationData) {
        try {
            const { order_id, status, amount } = verificationData;

            if (status === 'SUCCESS' || status === '00') {
                return {
                    success: true,
                    status: 'completed',
                    orderId: order_id,
                    amount: amount
                };
            } else {
                return {
                    success: false,
                    status: 'failed',
                    orderId: order_id
                };
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// =============================================
// UBL PAYMENT CLASS
// =============================================

class UBLPayment {
    constructor(config) {
        this.merchantId = config.merchantId;
        this.terminalId = config.terminalId;
        this.encryptionKey = config.encryptionKey;
        this.baseURL = config.baseURL || 'https://payment.ubl.com.pk/';
    }

    async initiatePayment(paymentData) {
        const { amount, orderId, description } = paymentData;

        try {
            const transactionData = {
                merchant_id: this.merchantId,
                terminal_id: this.terminalId,
                order_id: orderId,
                amount: amount,
                currency: 'PKR',
                timestamp: Date.now(),
                description: description || 'ShopHub Purchase',
                return_url: paymentData.returnUrl || 'https://yourstore.com/payment/confirmation',
                cancel_url: paymentData.cancelUrl || 'https://yourstore.com/payment/cancelled'
            };

            return {
                success: true,
                method: 'ubl',
                data: transactionData,
                redirectUrl: `${this.baseURL}payment`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async verifyPayment(verificationData) {
        try {
            const { order_id, status, amount } = verificationData;

            if (status === 'SUCCESS' || status === '00') {
                return {
                    success: true,
                    status: 'completed',
                    orderId: order_id,
                    amount: amount
                };
            } else {
                return {
                    success: false,
                    status: 'failed',
                    orderId: order_id
                };
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// =============================================
// BANK TRANSFER CLASS
// =============================================

class BankTransferPayment {
    constructor(config) {
        this.bankAccounts = config.bankAccounts || [];
    }

    async initiatePayment(paymentData) {
        const { amount, orderId, description } = paymentData;

        try {
            const transferData = {
                orderId: orderId,
                amount: amount,
                currency: 'PKR',
                reference: `ShopHub-${orderId}`,
                bankAccounts: this.bankAccounts,
                expiryTime: new Date(Date.now() + 24*60*60*1000).toISOString(),
                description: description || 'ShopHub Purchase'
            };

            return {
                success: true,
                method: 'bankTransfer',
                data: transferData,
                requiresManualVerification: true
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async verifyPayment(verificationData) {
        try {
            return {
                success: true,
                status: 'pending',
                message: 'Payment will be verified within 24 hours'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    getBankDetails() {
        return this.bankAccounts;
    }
}

// =============================================
// STRIPE PAYMENT CLASS
// =============================================

class StripePayment {
    constructor(config) {
        this.publicKey = config.publicKey;
        this.secretKey = config.secretKey; // Backend only
        this.baseURL = config.baseURL || 'https://api.stripe.com/v1/';
    }

    async initiatePayment(paymentData) {
        const { amount, orderId, customerEmail, description } = paymentData;

        try {
            const paymentIntent = {
                amount: amount * 100,
                currency: 'pkr',
                description: description || 'ShopHub Purchase',
                metadata: {
                    orderId: orderId,
                    email: customerEmail
                }
            };

            return {
                success: true,
                method: 'stripe',
                data: paymentIntent,
                requiresClientSecret: true
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async verifyPayment(verificationData) {
        try {
            const { status, amount, currency } = verificationData;

            if (status === 'succeeded') {
                return {
                    success: true,
                    status: 'completed',
                    amount: amount / 100,
                    currency: currency
                };
            } else {
                return {
                    success: false,
                    status: status
                };
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// =============================================
// CRYPTOCURRENCY PAYMENT CLASS
// =============================================

class CryptoPayment {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseURL = config.baseURL || 'https://api.commerce.coinbase.com/';
        this.supportedCoins = config.supportedCoins || ['BTC', 'ETH', 'USDC', 'USDT'];
    }

    async initiatePayment(paymentData) {
        const { amount, orderId, description } = paymentData;

        try {
            const chargeData = {
                name: 'ShopHub Purchase',
                description: description || `Order ${orderId}`,
                pricing_type: 'fixed_price',
                local_price: {
                    amount: amount.toString(),
                    currency: 'PKR'
                },
                metadata: {
                    orderId: orderId
                },
                redirect_url: paymentData.returnUrl || 'https://yourstore.com/payment/confirmation',
                cancel_url: paymentData.cancelUrl || 'https://yourstore.com/payment/cancelled'
            };

            return {
                success: true,
                method: 'crypto',
                data: chargeData,
                supportedCoins: this.supportedCoins
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async verifyPayment(verificationData) {
        try {
            const { status, amount, received } = verificationData;

            if (status === 'COMPLETED') {
                return {
                    success: true,
                    status: 'completed',
                    amount: amount,
                    received: received
                };
            } else if (status === 'PENDING') {
                return {
                    success: false,
                    status: 'pending',
                    message: 'Awaiting payment confirmation'
                };
            } else {
                return {
                    success: false,
                    status: status
                };
            }
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    getSupportedCoins() {
        return this.supportedCoins;
    }
}

// =============================================
// PAYMENT HANDLER UTILITY
// =============================================

class PaymentHandler {
    constructor(gateway) {
        this.gateway = gateway;
    }

    async processPayment(method, paymentData) {
        try {
            // Validate payment data
            this.validatePaymentData(paymentData);

            // Initiate payment
            const result = await this.gateway.initiatePayment(method, paymentData);

            if (!result.success) {
                throw new Error(result.error);
            }

            // Log transaction
            this.logTransaction({
                method: method,
                orderId: paymentData.orderId,
                amount: paymentData.amount,
                timestamp: new Date().toISOString(),
                status: 'initiated'
            });

            return result;
        } catch (error) {
            console.error('Payment processing error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    validatePaymentData(data) {
        if (!data.orderId) throw new Error('Order ID is required');
        if (!data.amount || data.amount <= 0) throw new Error('Valid amount is required');
        if (!data.customerEmail) throw new Error('Customer email is required');
    }

    logTransaction(transaction) {
        if (typeof console !== 'undefined') {
            console.log('Transaction logged:', transaction);
        }
    }

    async handleCallback(method, callbackData) {
        try {
            const verification = await this.gateway.verifyPayment(method, callbackData);

            if (verification.success) {
                this.logTransaction({
                    orderId: verification.orderId,
                    status: verification.status,
                    timestamp: new Date().toISOString()
                });
            }

            return verification;
        } catch (error) {
            console.error('Callback handling error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// =============================================
// EXPORT FOR USE
// =============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PaymentGateway,
        PaymentHandler,
        JazzCashPayment,
        EasypaisaPayment,
        HBLPayment,
        UBLPayment,
        BankTransferPayment,
        StripePayment,
        CryptoPayment
    };
}

// =============================================
// USAGE EXAMPLE
// =============================================

/*
// Frontend Usage
const paymentConfig = {
    jazzcash: {
        merchantID: 'YOUR_MERCHANT_ID',
        password: 'YOUR_PASSWORD',
        merchantName: 'ShopHub'
    },
    easypaisa: {
        storeId: 'YOUR_STORE_ID',
        authToken: 'YOUR_AUTH_TOKEN'
    },
    hbl: {
        merchantId: 'YOUR_MERCHANT_ID',
        terminalId: 'YOUR_TERMINAL_ID',
        encryptionKey: 'YOUR_ENCRYPTION_KEY'
    },
    stripe: {
        publicKey: 'pk_live_YOUR_PUBLIC_KEY'
    },
    crypto: {
        apiKey: 'YOUR_API_KEY'
    },
    bankTransfer: {
        bankAccounts: [
            {
                bankName: 'Habib Bank Limited',
                accountHolder: 'ShopHub (Pvt) Ltd',
                accountNumber: '1234567890123',
                iban: 'PK36HABLC0123456789012345'
            }
        ]
    }
};

const gateway = new PaymentGateway(paymentConfig);
const handler = new PaymentHandler(gateway);

// Process payment
const result = await handler.processPayment('jazzcash', {
    orderId: 'ORDER-001',
    amount: 5000,
    customerEmail: 'customer@example.com',
    customerPhone: '03001234567',
    description: 'Purchase from ShopHub'
});

if (result.success) {
    // Redirect to payment gateway
    window.location.href = result.redirectUrl;
}
*/
