import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Lock, Smartphone, MapPin } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatPriceSimple } from '@/utils/currency';
import UPIQRCode from '@/components/UPIQRCode';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('address');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  
  // Shared address for both payment methods
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [addressComplete, setAddressComplete] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [paymentVerifying, setPaymentVerifying] = useState(false);
  const [merchantUPI, setMerchantUPI] = useState('');

  const { totalPrice, clearCart, items } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  // Redirect if cart is empty
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formattedValue);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setExpiryDate(value);
  };

  const validateAddress = () => {
    return fullName && phone && address && city && state && zipCode;
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAddress()) {
      setError('Please fill in all address fields');
      return;
    }
    setAddressComplete(true);
    setPaymentMethod('card');
    setError('');
    toast.success('Address saved! Please select payment method.');
  };

  const processPayment = async (method: 'card' | 'upi') => {
    setError('');
    setIsLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      const totalWithTax = totalPrice * 1.18;
      const orderId = `ORDER_${Date.now()}`;
      const transactionId = `TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Show success notification
      toast.success(
        `🎉 Payment Successful!\n💳 Method: ${method.toUpperCase()}\n💰 Amount: ${formatPriceSimple(totalWithTax)}\n📄 Transaction ID: ${transactionId}`,
        { duration: 5000 }
      );

      // Clear cart and redirect
      clearCart();
      navigate(`/payment-success?orderId=${orderId}&amount=${totalWithTax}&transactionId=${transactionId}`);
    } catch (error) {
      setError('Payment processing failed. Please try again.');
      toast.error('❌ Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !expiryDate || !cvv || !cardName) {
      setError('Please fill in all card details');
      return;
    }

    await processPayment('card');
  };

  const generateUPIString = () => {
    const totalWithTax = totalPrice * 1.18;
    const transactionId = `TXN_${Date.now()}`;
    return `upi://pay?pa=${merchantUPI}&pn=ShopEase&am=${totalWithTax.toFixed(2)}&tr=${transactionId}&tn=Payment%20for%20Order&cu=INR`;
  };

  const handleMerchantUPISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantUPI) {
      setError('Please enter your UPI ID to receive payments');
      return;
    }
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    if (!upiRegex.test(merchantUPI)) {
      setError('Please enter a valid UPI ID (e.g., yourname@paytm)');
      return;
    }
    setShowQR(true);
    setError('');
  };



  const handleShowQR = () => {
    setShowQR(true);
    setError('');
  };

  const handleVerifyPayment = async () => {
    setPaymentVerifying(true);
    setError('');
    
    // Simulate payment verification
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 50% success rate for demo - simulates real payment verification
    const isSuccess = Math.random() > 0.5;
    
    if (isSuccess) {
      toast.success('✅ Payment verified successfully!');
      await processPayment('upi');
    } else {
      setError('❌ Payment Failed: No payment detected for this transaction. Please complete the payment in your UPI app and try again.');
      toast.error('❌ Payment Failed: Transaction not found. Please check your UPI app and try again.', {
        duration: 6000
      });
    }
    
    setPaymentVerifying(false);
  };

  const handleUPISubmit = async () => {
    await processPayment('upi');
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Secure Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <Card className="shadow-card-hover">
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="address" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </TabsTrigger>
                  <TabsTrigger value="card" className="flex items-center gap-2" disabled={!addressComplete}>
                    <CreditCard className="w-4 h-4" />
                    Card
                  </TabsTrigger>
                  <TabsTrigger value="upi" className="flex items-center gap-2" disabled={!addressComplete}>
                    <Smartphone className="w-4 h-4" />
                    UPI
                  </TabsTrigger>
                </TabsList>

                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {addressComplete && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✅ Address saved: {fullName}, {address}, {city}, {state} - {zipCode}
                    </p>
                  </div>
                )}

                <TabsContent value="address" className="space-y-4 mt-6">
                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Delivery Address
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="9876543210"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="123 Main Street, Apartment 4B"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Mumbai"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="Maharashtra"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          placeholder="400001"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      <MapPin className="w-4 h-4 mr-2" />
                      Save Address & Continue
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="card" className="space-y-4 mt-6">
                  <form onSubmit={handleCardSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          value={expiryDate}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                          placeholder="123"
                          maxLength={3}
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button 
                        type="submit" 
                        className="w-full" 
                        size="lg"
                        disabled={isLoading}
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        {isLoading ? 'Processing Payment...' : `Pay ${formatPriceSimple(totalPrice * 1.18)}`}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="upi" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      UPI Payment
                    </h3>
                    
                    {!showQR ? (
                      <div className="p-6 border rounded-lg space-y-4">
                        <div className="text-center">
                          <Smartphone className="w-16 h-16 mx-auto text-primary mb-4" />
                          <p className="font-medium text-lg">UPI Payment Setup</p>
                          <p className="text-sm text-muted-foreground">
                            Amount: {formatPriceSimple(totalPrice * 1.18)}
                          </p>
                        </div>
                        
                        <form onSubmit={handleMerchantUPISubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="merchantUPI">Your UPI ID (to receive payment)</Label>
                            <Input
                              id="merchantUPI"
                              value={merchantUPI}
                              onChange={(e) => setMerchantUPI(e.target.value)}
                              placeholder="yourname@paytm"
                              required
                            />
                            <p className="text-xs text-muted-foreground">
                              Enter your UPI ID where you want to receive the payment
                            </p>
                          </div>
                          <Button 
                            type="submit"
                            className="w-full" 
                            size="lg"
                          >
                            Generate QR Code
                          </Button>
                        </form>
                      </div>
                    ) : (
                      <div className="p-6 border rounded-lg text-center space-y-6">
                        <div>
                          <h4 className="font-medium text-lg mb-2">Scan QR Code to Pay</h4>
                          <p className="text-sm text-muted-foreground">
                            Open any UPI app and scan the QR code below
                          </p>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg border-2 border-gray-200 inline-block shadow-sm">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(generateUPIString())}`}
                            alt="UPI QR Code"
                            className="w-52 h-52"
                          />
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-sm space-y-1">
                            <p><strong>Amount:</strong> {formatPriceSimple(totalPrice * 1.18)}</p>
                            <p><strong>Merchant:</strong> ShopEase</p>
                            <p><strong>UPI ID:</strong> {merchantUPI}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                          <span>Supported Apps:</span>
                          <span className="font-medium">PhonePe • Paytm • GPay • BHIM • Amazon Pay</span>
                        </div>
                        
                        <div className="space-y-3">
                          <Button 
                            onClick={handleVerifyPayment} 
                            className="w-full" 
                            size="lg"
                            disabled={paymentVerifying}
                          >
                            {paymentVerifying ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Checking Payment Status...
                              </>
                            ) : (
                              '✓ I have completed the payment'
                            )}
                          </Button>
                          
                          {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <p className="text-red-800 text-sm font-medium mb-2">{error}</p>
                              <div className="space-y-2">
                                <Button 
                                  onClick={handleVerifyPayment} 
                                  variant="outline"
                                  size="sm"
                                  className="w-full border-red-300 text-red-700 hover:bg-red-50"
                                  disabled={paymentVerifying}
                                >
                                  🔄 Retry Payment Verification
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          <Button 
                            onClick={() => {
                              setShowQR(false);
                              setError('');
                            }} 
                            variant="outline"
                            className="w-full" 
                            size="sm"
                          >
                            ← Generate New QR Code
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="shadow-card-hover h-fit">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                Logged in as: {user?.username}
              </div>
              
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2">
                  <div className="flex-1">
                    <h4 className="font-medium line-clamp-1">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatPriceSimple(item.price * item.quantity)}</p>
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPriceSimple(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatPriceSimple(totalPrice * 0.18)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">{formatPriceSimple(totalPrice * 1.18)}</span>
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;