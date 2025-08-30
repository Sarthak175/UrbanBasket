import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, Truck, Download, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatPriceSimple } from '@/utils/currency';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // Get order details from URL params or localStorage
  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    const transactionId = searchParams.get('transactionId');
    
    if (!orderId || !amount || !transactionId) {
      // If no valid payment params, redirect to home
      navigate('/');
      return;
    }

    // Mock order details - in a real app, you'd fetch this from API
    setOrderDetails({
      orderId,
      amount: parseFloat(amount),
      transactionId,
      orderDate: new Date().toLocaleDateString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      trackingNumber: `TRK${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    });
  }, [searchParams, navigate]);

  if (!orderDetails) {
    return null; // or loading spinner
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-green-600 mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thank you for your order! Your payment has been processed successfully and your order is confirmed.
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="shadow-lg mb-6">
          <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardTitle className="text-2xl">Order Confirmation</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-mono">{orderDetails.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-mono">{orderDetails.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span>{orderDetails.orderDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-green-600">
                        {formatPriceSimple(orderDetails.amount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Customer Information</h3>
                  <div className="text-sm">
                    <p className="text-gray-600">Account: {user?.username}</p>
                    <p className="text-gray-600">Email: {user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Delivery Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tracking Number:</span>
                      <span className="font-mono">{orderDetails.trackingNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Delivery:</span>
                      <span>{orderDetails.estimatedDelivery}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Truck className="w-5 h-5" />
                    <span className="font-medium">Order Processing</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    Your order is being prepared for shipment
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold mb-2">Track Your Order</h3>
              <p className="text-sm text-gray-600 mb-4">
                Monitor your order status and delivery progress
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Track Order
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Download className="w-8 h-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold mb-2">Download Receipt</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get a PDF copy of your order receipt
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Download PDF
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Truck className="w-8 h-8 mx-auto mb-3 text-purple-600" />
              <h3 className="font-semibold mb-2">Delivery Updates</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get SMS/Email updates on delivery status
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Enable Alerts
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg" className="w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Browse Products
            </Button>
          </Link>
        </div>

        {/* Thank You Message */}
        <div className="text-center mt-12 p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You for Shopping with ShopEase!</h3>
          <p className="text-gray-600">
            We appreciate your business and hope you enjoy your purchase. 
            If you have any questions, our customer support team is here to help.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

