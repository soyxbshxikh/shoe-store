'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/app/cart/page';

// Helper function to trigger cart update notification
const notifyCartUpdated = () => {
  // Dispatch a custom event that the navbar can listen for
  window.dispatchEvent(new Event('cartUpdated'));
};

export default function CartItems() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [subtotal, setSubtotal] = useState(0);
  const shipping = 499;
  const [paymentMethod, setPaymentMethod] = useState<string>('stripe');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });
  const [gPayLoading, setGPayLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Add merchant UPI ID as a constant
  const MERCHANT_UPI_ID = "soyxbshxikh@okhdfcbank";
  // Order ID for transaction reference
  const [orderId, setOrderId] = useState<string>("");
  // Card networks for validating card number
  const [cardNetwork, setCardNetwork] = useState<string>("");
  // Transaction data for receipt
  const [transactionData, setTransactionData] = useState<{
    id: string;
    amount: number;
    timestamp: string;
    method: string;
    status: string;
    extraInfo?: {
      pincode: string;
      estimatedDelivery: string;
    };
  } | null>(null);

  // Load cart items from localStorage when component mounts
  useEffect(() => {
    const loadCartItems = () => {
      try {
        const storedItems = localStorage.getItem('cartItems');
        if (storedItems) {
          const items = JSON.parse(storedItems);
          setItems(items);
          calculateTotals(items);
        }
      } catch (error) {
        // Remove console.error for production
        // console.error('Error loading cart items:', error);
      }
    };

    loadCartItems();
    
    // Add event listener for storage events from other tabs
    window.addEventListener('storage', loadCartItems);
    
    return () => {
      window.removeEventListener('storage', loadCartItems);
    };
  }, []);

  // Generate a unique order ID
  useEffect(() => {
    if (!orderId) {
      // Generate a random order ID with format STEP-XXXX-XXXX
      const newOrderId = `STEP-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderId(newOrderId);
    }
  }, [orderId]);

  // Detect card network based on card number
  useEffect(() => {
    const cardNum = cardDetails.cardNumber.replace(/\s/g, '');
    
    if (cardNum.startsWith('4')) {
      setCardNetwork('Visa');
    } else if (/^5[1-5]/.test(cardNum)) {
      setCardNetwork('Mastercard');
    } else if (/^3[47]/.test(cardNum)) {
      setCardNetwork('American Express');
    } else if (/^6(?:011|5)/.test(cardNum)) {
      setCardNetwork('Discover');
    } else if (cardNum.length > 6) {
      setCardNetwork('Unknown');
    } else {
      setCardNetwork('');
    }
  }, [cardDetails.cardNumber]);

  // Get the correct image path based on product ID
  const getImagePath = (item: CartItem) => {
    // Define the mapping of product IDs to file formats
    const productFormats: Record<number, string> = {
      1: '.jpeg',
      2: '.webp',
      3: '.webp',
      4: '.webp',
      5: '.webp',
      6: '.webp',
      7: '.webp',
      8: '.webp',
      9: '.webp',
      16: '.jpeg',
      17: '.png',
      18: '.jpg',
      19: '.jpeg',
      20: '.png',
    };
    
    // Get the format for the current product or use default
    const format = productFormats[item.id] || '.jpg';
    
    return `${item.imagePath}/HomeProduct${format}`;
  };

  const handleImageError = (imagePath: string) => {
    setFailedImages(prev => ({ ...prev, [imagePath]: true }));
  };

  const handleRemoveItem = (itemToRemove: CartItem) => {
    // Remove the item from the cart
    const updatedItems = items.filter(item => 
      !(item.id === itemToRemove.id && 
        item.selectedSize === itemToRemove.selectedSize)
    );
    
    // Update localStorage
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    
    // Update state
    setItems(updatedItems);
    setSubtotal(updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity, 
      0
    ));

    // Notify about cart update
    notifyCartUpdated();
  };

  const handleQuantityChange = (itemToUpdate: CartItem, newQuantity: number) => {
    if (newQuantity < 1) {
      return handleRemoveItem(itemToUpdate);
    }
    
    // Update the quantity
    const updatedItems = items.map(item => {
      if (item.id === itemToUpdate.id && 
          item.selectedSize === itemToUpdate.selectedSize) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    // Update localStorage
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
    
    // Update state
    setItems(updatedItems);
    setSubtotal(updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity, 
      0
    ));

    // Notify about cart update
    notifyCartUpdated();
  };

  // Payment method handlers
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    
    // Reset error message when changing payment method
    setErrorMessage('');
    
    // Reset payment status
    setPaymentStatus('idle');
  };

  // Validate card details with enhanced validation
  const validateCardDetails = () => {
    const { cardNumber, expiryDate, cvv, name } = cardDetails;
    
    // Check card number format and length
    const cardNumberClean = cardNumber.replace(/\s/g, '');
    if (cardNumberClean.length < 15 || cardNumberClean.length > 16) {
      setErrorMessage('Please enter a valid card number');
      return false;
    }
    
    // Check if card is expired
    if (expiryDate.length < 5) {
      setErrorMessage('Please enter a valid expiry date (MM/YY)');
      return false;
    } else {
      const [month, year] = expiryDate.split('/');
      const expiryMonth = parseInt(month, 10);
      const expiryYear = parseInt(`20${year}`, 10);
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();
      
      if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
        setErrorMessage('Your card has expired');
        return false;
      }
      
      if (expiryMonth < 1 || expiryMonth > 12) {
        setErrorMessage('Invalid expiry month');
        return false;
      }
    }
    
    // Validate CVV length based on card type
    if (cardNetwork === 'American Express' && cvv.length !== 4) {
      setErrorMessage('American Express cards require a 4-digit CVV');
      return false;
    } else if (cardNetwork !== 'American Express' && cvv.length !== 3) {
      setErrorMessage('Please enter a valid 3-digit CVV');
      return false;
    }
    
    // Validate name
    if (name.length < 3) {
      setErrorMessage('Please enter the cardholder name');
      return false;
    }
    
    return true;
  };

  // Card-specific payment processing with enhanced visual feedback
  const processCardPayment = () => {
    if (!validateCardDetails()) return;
    
    setPaymentStatus('processing');
    setErrorMessage(`Processing ${cardNetwork} ending in ${cardDetails.cardNumber.slice(-4)}...`);
    
    // Transaction timestamp
    const timestamp = new Date().toISOString();
    
    // Create transaction ID with card format
    const txnId = `CRD${Math.floor(100000000 + Math.random() * 900000000)}`;
    
    // Process payment in stages
    setTimeout(() => {
      setErrorMessage('Verifying card details...');
      
      setTimeout(() => {
        setErrorMessage('Authorizing payment...');
        
        setTimeout(() => {
          // 95% success rate for simulation
          const isSuccess = Math.random() < 0.95;
          
          if (isSuccess) {
            setPaymentStatus('success');
            setErrorMessage('');
            
            // Update transaction data
            setTransactionData({
              id: txnId,
              amount: subtotal + shipping,
              timestamp: timestamp,
              method: `${cardNetwork} Card (****${cardDetails.cardNumber.slice(-4)})`,
              status: 'successful'
            });
            
            setTimeout(() => {
              setOrderComplete(true);
              // Clear cart
              localStorage.setItem('cartItems', JSON.stringify([]));
              notifyCartUpdated();
            }, 1500);
          } else {
            setPaymentStatus('failed');
            
            // Update transaction data
            setTransactionData({
              id: txnId,
              amount: subtotal + shipping,
              timestamp: timestamp,
              method: `${cardNetwork} Card (****${cardDetails.cardNumber.slice(-4)})`,
              status: 'failed'
            });
            
            // More specific error for card failures
            if (Math.random() > 0.5) {
              setErrorMessage(`${cardNetwork} declined. Please check your details or try another payment method.`);
            } else {
              setErrorMessage('Payment gateway error. Please try again later.');
            }
          }
        }, 600);
      }, 800);
    }, 600);
  };

  // Google Pay specific processing with enhanced app simulation
  const processGooglePayment = () => {
    setGPayLoading(true);
    setErrorMessage('Connecting to Mobile Wallet...');
    
    // Simulate Google Pay opening
    setTimeout(() => {
      setGPayLoading(false);
      setPaymentStatus('processing');
      setErrorMessage(`Opening secure payment window...`);
      
      // Transaction timestamp
      const timestamp = new Date().toISOString();
      
      // Create transaction ID with GPay format
      const txnId = `GPAY${Math.floor(100000000 + Math.random() * 900000000)}`;
      
      setTimeout(() => {
        setErrorMessage(`Authorizing transfer of ₹${subtotal + shipping} to ${MERCHANT_UPI_ID}...`);
        
        // Save transaction data
        setTransactionData({
          id: txnId,
          amount: subtotal + shipping,
          timestamp: timestamp,
          method: 'Mobile Wallet',
          status: 'processing'
        });
        
        // Simulate slightly faster processing for Google Pay
        setTimeout(() => {
          // Higher success rate for Google Pay (97%)
          const isSuccess = Math.random() < 0.97;
          
          if (isSuccess) {
            setPaymentStatus('success');
            setErrorMessage('');
            
            // Update transaction data
            setTransactionData(prev => {
              if (prev) {
                return {
                  ...prev,
                  status: 'successful'
                };
              }
              return null;
            });
            
            setTimeout(() => {
              setOrderComplete(true);
              // Clear cart
              localStorage.setItem('cartItems', JSON.stringify([]));
              notifyCartUpdated();
            }, 1500);
          } else {
            setPaymentStatus('failed');
            
            // Update transaction data
            setTransactionData(prev => {
              if (prev) {
                return {
                  ...prev,
                  status: 'failed'
                };
              }
              return null;
            });
            
            setErrorMessage('Mobile Wallet transaction failed. The payment app returned an error code. Please try again.');
          }
        }, 1000);
      }, 800);
    }, 1200);
  };

  // Get estimated delivery date (3-7 days from now)
  const getEstimatedDeliveryDate = () => {
    const today = new Date();
    const deliveryDays = 3 + Math.floor(Math.random() * 5); // 3-7 days
    const estimatedDate = new Date(today);
    estimatedDate.setDate(today.getDate() + deliveryDays);
    return estimatedDate.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Cash on Delivery processing with enhanced verification
  const processCODPayment = () => {
    if (!deliveryAddress.trim()) {
      setErrorMessage('Please enter your delivery address');
      return;
    }
    
    // Check for basic address validity
    if (deliveryAddress.length < 10) {
      setErrorMessage('Please enter a complete delivery address');
      return;
    }
    
    // Check if address contains a pincode (6 digits)
    const pincodeMatch = deliveryAddress.match(/\b\d{6}\b/);
    if (!pincodeMatch) {
      setErrorMessage('Please include a valid 6-digit pincode in your address');
      return;
    }
    
    setPaymentStatus('processing');
    setErrorMessage('Verifying delivery address...');
    
    // Create transaction ID for COD with format
    const txnId = `COD${Math.floor(100000000 + Math.random() * 900000000)}`;
    
    // Save transaction data
    setTransactionData({
      id: txnId,
      amount: subtotal + shipping,
      timestamp: new Date().toISOString(),
      method: 'Cash on Delivery',
      status: 'processing'
    });
    
    // Simulate address verification
    setTimeout(() => {
      setErrorMessage('Checking delivery availability...');
      
      // Extract pincode for simulated availability check
      const pincode = pincodeMatch[0];
      
      setTimeout(() => {
        setErrorMessage('Placing order...');
        
        // COD processing is slightly faster
        setTimeout(() => {
          // Very high success rate for COD (99%)
          const isSuccess = Math.random() < 0.99;
          
          if (isSuccess) {
            setPaymentStatus('success');
            setErrorMessage('');
            
            // Update transaction data
            setTransactionData(prev => {
              if (prev) {
                return {
                  ...prev,
                  status: 'confirmed',
                  extraInfo: {
                    pincode,
                    estimatedDelivery: getEstimatedDeliveryDate()
                  }
                };
              }
              return null;
            });
            
            setTimeout(() => {
              setOrderComplete(true);
              // Clear cart
              localStorage.setItem('cartItems', JSON.stringify([]));
              notifyCartUpdated();
            }, 1500);
          } else {
            setPaymentStatus('failed');
            
            // Update transaction data
            setTransactionData(prev => {
              if (prev) {
                return {
                  ...prev,
                  status: 'failed'
                };
              }
              return null;
            });
            
            setErrorMessage('Unable to place a Cash on Delivery order for your address. Please verify your address or try a different payment method.');
          }
        }, 600);
      }, 800);
    }, 800);
  };

  // Update handleCheckout to use specific payment methods
  const handleCheckout = () => {
    // If an order is already complete, reset the cart
    if (orderComplete) {
      setItems([]);
      setOrderComplete(false);
      setPaymentStatus('idle');
      return;
    }
    
    // Reset any previous errors
    setErrorMessage('');
    
    // Handle different payment methods
    switch(paymentMethod) {
      case 'stripe':
        // For credit card payments
        if (paymentStatus === 'idle') {
          processCardPayment();
        }
        break;
        
      case 'gpay':
        // For Google Pay
        if (paymentStatus === 'idle') {
          processGooglePayment();
        }
        break;
        
      case 'cod':
        if (paymentStatus === 'idle') {
          processCODPayment();
        }
        break;
        
      default:
        setErrorMessage('Please select a payment method');
    }
  };

  // Reset payment form
  const resetPaymentStatus = () => {
    setPaymentStatus('idle');
    setErrorMessage('');
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim()
      .slice(0, 19);
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1/$2')
      .slice(0, 5);
  };

  // If cart is empty, show empty state
  if (items.length === 0) {
    return (
      <div className="mt-4 sm:mt-8 text-center">
        <div className="mb-4 sm:mb-6 flex justify-center">
          <Image 
            src="/images/Empty-cart.jpg" 
            alt="Empty cart" 
            width={200} 
            height={200} 
            className="object-contain max-w-[150px] sm:max-w-[200px]" 
          />
        </div>
        <p className="mb-3 sm:mb-4 text-base sm:text-lg text-gray-600">Your cart is empty</p>
        <Link 
          href="/products" 
          className="rounded-full bg-black px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-white transition-opacity hover:opacity-90"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="rounded-lg border border-gray-200 bg-white">
          {items.map((item, index) => {
            const imagePath = getImagePath(item);
            
            return (
              <div key={`${item.id}-${item.selectedSize}-${index}`} className="flex flex-col border-b border-gray-200 p-4 last:border-b-0 sm:flex-row">
                <div className="relative mb-4 h-32 w-32 flex-shrink-0 sm:mb-0">
                  <Image 
                    src={failedImages[imagePath] ? '/images/Empty-cart.jpg' : imagePath}
                    alt={item.name} 
                    fill 
                    className="object-contain"
                    onError={() => handleImageError(imagePath)}
                  />
                </div>
                <div className="flex flex-1 flex-col sm:ml-4">
                  <div className="mb-2 flex justify-between">
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <span className="font-bold">₹{item.price}</span>
                  </div>
                  <div className="mb-2 text-sm text-gray-600">
                    {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button 
                        className="px-3 py-1 text-gray-500 hover:bg-gray-100"
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="px-3 py-1">{item.quantity}</span>
                      <button 
                        className="px-3 py-1 text-gray-500 hover:bg-gray-100"
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button 
                      className="text-sm text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveItem(item)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
        <div className="mb-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹{shipping}</span>
          </div>
        </div>
        <div className="mb-6 border-t border-gray-200 pt-4">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹{subtotal + shipping}</span>
          </div>
        </div>
        
        {/* Payment Methods Section */}
        <div className="mb-6">
          <h3 className="mb-3 text-md font-semibold">Payment Method</h3>
          
          {!orderComplete && (
            <div className="space-y-3">
              {/* Credit Card */}
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="stripe" 
                  checked={paymentMethod === 'stripe'} 
                  onChange={() => {
                    handlePaymentMethodChange('stripe');
                    resetPaymentStatus();
                  }} 
                  className="h-4 w-4 text-indigo-600"
                  disabled={paymentStatus === 'processing'}
                />
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                  </svg>
                  <span className="ml-2">Credit Card</span>
                </div>
              </label>
              
              {/* Stripe Card Form */}
              {paymentMethod === 'stripe' && paymentStatus === 'idle' && (
                <div className="mt-3 p-3 border border-gray-200 rounded-md space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="cardNumber" 
                        value={cardDetails.cardNumber}
                        onChange={(e) => {
                          // Only allow numbers and limit to 16 digits + spaces
                          const value = e.target.value.replace(/[^\d\s]/g, '');
                          if (value.replace(/\s/g, '').length <= 16) {
                            setCardDetails({...cardDetails, cardNumber: formatCardNumber(value)});
                          }
                        }}
                        placeholder="XXXX XXXX XXXX XXXX"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm pr-10"
                        maxLength={19}
                      />
                      {cardNetwork && (
                        <div className="absolute right-3 top-2">
                          {cardNetwork === 'Visa' && (
                            <span className="font-bold text-blue-600">VISA</span>
                          )}
                          {cardNetwork === 'Mastercard' && (
                            <span className="font-bold text-red-600">MC</span>
                          )}
                          {cardNetwork === 'American Express' && (
                            <span className="font-bold text-blue-800">AMEX</span>
                          )}
                          {cardNetwork === 'Discover' && (
                            <span className="font-bold text-orange-600">DISC</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                      <input 
                        type="text" 
                        name="expiryDate" 
                        value={cardDetails.expiryDate}
                        onChange={(e) => {
                          const value = e.target.value;
                          setCardDetails({...cardDetails, expiryDate: formatExpiryDate(value)});
                        }}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          name="cvv" 
                          value={cardDetails.cvv}
                          onChange={(e) => {
                            // Only allow numbers and limit to 3-4 digits
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 4) {
                              setCardDetails({...cardDetails, cvv: value});
                            }
                          }}
                          placeholder="XXX"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          maxLength={4}
                        />
                        <div className="absolute right-3 top-2 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                      placeholder="Name on card"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div className="text-xs text-gray-500 flex items-center mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Your payment information is encrypted and secure</span>
                  </div>
                </div>
              )}
              
              {/* Google Pay */}
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="gpay" 
                  checked={paymentMethod === 'gpay'} 
                  onChange={() => {
                    handlePaymentMethodChange('gpay');
                    resetPaymentStatus();
                  }} 
                  className="h-4 w-4 text-indigo-600"
                  disabled={paymentStatus === 'processing'}
                />
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                  <span className="ml-2">Online Payment</span>
                </div>
              </label>
              
              {/* GPay Loading Indicator */}
              {paymentMethod === 'gpay' && gPayLoading && (
                <div className="mt-2 p-3 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <div className="animate-spin rounded-full h-7 w-7 border-2 border-green-500 border-t-transparent"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Opening Mobile Wallet...</p>
                    <p className="text-xs text-gray-500">Don't see the payment window? Check your notifications.</p>
                  </div>
                </div>
              )}
              
              {/* Cash on Delivery */}
              <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="cod" 
                  checked={paymentMethod === 'cod'} 
                  onChange={() => {
                    handlePaymentMethodChange('cod');
                    resetPaymentStatus();
                  }} 
                  className="h-4 w-4 text-indigo-600"
                  disabled={paymentStatus === 'processing'}
                />
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-amber-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                  <span className="ml-2">Cash on Delivery</span>
                </div>
              </label>
              
              {/* COD Address field */}
              {paymentMethod === 'cod' && paymentStatus === 'idle' && (
                <div className="mt-2 px-5 py-3 border border-gray-200 rounded-md">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                      <span className="text-xs text-gray-500">* Required fields</span>
                    </div>
                    <textarea 
                      value={deliveryAddress} 
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter your full address with pincode" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Include your 6-digit pincode for faster delivery
                    </p>
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Cash payment will be collected on delivery</span>
                        <span className="text-xs font-medium text-green-600">₹{subtotal + shipping}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Error Message */}
          {errorMessage && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}
          
          {/* Payment Processing Status */}
          {paymentStatus === 'processing' && (
            <div className="mt-4 p-3 border border-blue-100 bg-blue-50 rounded-md">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                <p className="text-sm font-medium text-blue-800">Processing your payment...</p>
              </div>
              <p className="text-xs text-blue-600 text-center">{errorMessage}</p>
              <div className="w-full bg-blue-100 h-1.5 mt-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full animate-pulse-width"></div>
              </div>
            </div>
          )}
          
          {/* Payment Success */}
          {paymentStatus === 'success' && (
            <div className="mt-4 p-3 border border-green-100 bg-green-50 rounded-md">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-green-800">Payment successful!</p>
              </div>
              
              {transactionData && (
                <div className="text-xs text-gray-600 bg-white p-2 rounded border border-gray-200">
                  <div className="flex justify-between mb-1 border-b pb-1">
                    <span>Transaction ID:</span>
                    <span className="font-mono">{transactionData.id}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Amount:</span>
                    <span>₹{transactionData.amount}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Paid via:</span>
                    <span>{transactionData.method}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Merchant:</span>
                    <span className="font-mono text-xs">{MERCHANT_UPI_ID}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{new Date(transactionData.timestamp).toLocaleString()}</span>
                  </div>
                  {transactionData.extraInfo && transactionData.extraInfo.estimatedDelivery && (
                    <div className="flex justify-between mt-1 pt-1 border-t border-gray-100">
                      <span>Est. Delivery:</span>
                      <span>{transactionData.extraInfo.estimatedDelivery}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {/* Payment Failed */}
          {paymentStatus === 'failed' && (
            <div className="mt-4 p-3 border border-red-100 bg-red-50 rounded-md">
              <div className="flex items-center justify-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-sm text-red-800">{errorMessage || 'Payment failed. Please try again.'}</p>
              </div>
              <div className="mt-2 text-center">
                <button 
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={resetPaymentStatus}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
          
          {/* Order Complete */}
          {orderComplete && (
            <div className="mt-4 p-4 border border-green-100 bg-green-50 rounded-md text-center">
              <div className="mb-3 flex justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Placed Successfully!</h3>
              <p className="text-sm text-gray-600 mb-2">Thank you for your purchase. Your order will be processed shortly.</p>
              
              {transactionData && (
                <div className="mb-4 bg-white border border-gray-200 rounded p-3 text-left">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Order Details</h4>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-mono">{orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment:</span>
                      <span className="text-green-600">{transactionData.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <span>{transactionData.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span>₹{transactionData.amount}</span>
                    </div>
                    
                    {paymentMethod === 'cod' ? (
                      <div className="pt-1 mt-1 border-t border-gray-100">
                        <div className="text-xs text-gray-700 font-medium">Delivery Address:</div>
                        <p className="text-xs text-gray-600">{deliveryAddress}</p>
                        {transactionData.extraInfo && transactionData.extraInfo.estimatedDelivery && (
                          <div className="mt-1 text-xs">
                            <span className="text-gray-700 font-medium">Estimated Delivery: </span>
                            <span className="text-gray-600">{transactionData.extraInfo.estimatedDelivery}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex justify-between pt-1 mt-1 border-t border-gray-100">
                        <span className="text-gray-600">Paid to:</span>
                        <span className="font-mono text-xs">{MERCHANT_UPI_ID}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <Link 
                href="/products" 
                className="inline-block rounded-full bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
        
        {!orderComplete && (
          <button 
            className={`w-full rounded-full py-3 font-medium text-white transition-opacity ${
              paymentStatus === 'processing' 
                ? 'bg-gray-400 cursor-not-allowed'
                : paymentStatus === 'success'
                  ? 'bg-green-600 hover:opacity-90'
                  : 'bg-black hover:opacity-90'
            }`}
            onClick={handleCheckout}
            disabled={paymentStatus === 'processing'}
          >
            {paymentStatus === 'processing' ? 'Processing...' :
             paymentStatus === 'success' ? 'Order Placed' :
             'Checkout'}
          </button>
        )}
        
        {!orderComplete && (
          <Link 
            href="/products" 
            className="mt-4 block text-center text-sm text-gray-600 hover:text-black"
          >
            Continue Shopping
          </Link>
        )}
      </div>
    </div>
  );
} 