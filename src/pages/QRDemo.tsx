import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, ArrowLeft, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import UPIQRCode from '@/components/UPIQRCode';
import { toast } from 'sonner';

const QRDemo = () => {
  const [selectedAmount, setSelectedAmount] = useState(99);
  const [showQR, setShowQR] = useState(false);

  const demoAmounts = [
    { value: 99, label: '₹99 - Basic Demo' },
    { value: 199, label: '₹199 - Standard Demo' },
    { value: 499, label: '₹499 - Premium Demo' },
    { value: 999, label: '₹999 - Full Demo' }
  ];

  const handlePaymentSuccess = (transactionId: string) => {
    toast.success(`🎉 Demo payment successful! Transaction ID: ${transactionId}`);
    // You can add additional success logic here
  };

  const handlePaymentFailure = (error: string) => {
    toast.error(`❌ Demo payment failed: ${error}`);
    // You can add additional error handling here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            QR Code Payment Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the future of payments! Test our QR code payment system with different amounts.
            Scan the QR code with any UPI app on your phone.
          </p>
        </div>

        {/* Amount Selection */}
        <Card className="mb-8 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <QrCode className="w-6 h-6 text-primary" />
              Select Demo Amount
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose an amount to test the QR code payment system
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {demoAmounts.map((amount) => (
                <Button
                  key={amount.value}
                  variant={selectedAmount === amount.value ? "default" : "outline"}
                  onClick={() => setSelectedAmount(amount.value)}
                  className="h-auto py-4 px-3 flex flex-col gap-2"
                >
                  <span className="text-lg font-bold">₹{amount.value}</span>
                  <span className="text-xs opacity-80">{amount.label.split(' - ')[1]}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* QR Code Section */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Smartphone className="w-5 h-5 text-primary" />
              QR Code Payment - ₹{selectedAmount}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Scan this QR code with any UPI app on your phone
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-6">
              <Button 
                onClick={() => setShowQR(!showQR)}
                variant={showQR ? "outline" : "default"}
                size="lg"
                className="flex items-center gap-2"
              >
                <Smartphone className="w-5 h-5" />
                {showQR ? 'Hide QR Code' : 'Show QR Code'}
              </Button>
            </div>

            {showQR && (
              <div className="max-w-md mx-auto">
                <UPIQRCode
                  amount={selectedAmount}
                  merchantId="demo@shopease"
                  merchantName="ShopEase Demo"
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentFailure={handlePaymentFailure}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-green-700">Step-by-Step Guide:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Select a demo amount above</li>
                  <li>Click "Show QR Code" to generate the QR code</li>
                  <li>Open any UPI app on your phone (PhonePe, Paytm, GPay, BHIM)</li>
                  <li>Scan the QR code with your UPI app</li>
                  <li>Complete the payment in your UPI app</li>
                  <li>Wait for automatic payment verification</li>
                  <li>See the success message after payment confirmation</li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-blue-700">Supported UPI Apps:</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>PhonePe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Paytm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>Google Pay</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>BHIM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Amazon Pay</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Any other UPI app</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Demo Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <QrCode className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Dynamic QR Codes</h3>
                <p className="text-sm text-gray-600">Unique QR codes generated for each transaction</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Auto-Verification</h3>
                <p className="text-sm text-gray-600">Automatic payment status checking every 3 seconds</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
                </div>
                <h3 className="font-semibold mb-2">Real-time Updates</h3>
                <p className="text-sm text-gray-600">Live payment status with visual indicators</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRDemo;
