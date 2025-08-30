import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatPriceSimple } from '@/utils/currency';

interface Order {
  id: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  status: 'processing' | 'shipped' | 'delivered';
  orderDate: string;
  trackingNumber: string;
  estimatedDelivery: string;
}

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      // Load orders from localStorage
      const savedOrders = localStorage.getItem('user_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        // Mock orders for demo
        const mockOrders: Order[] = [
          {
            id: 'ORDER_1703123456789',
            items: [
              { id: '1', name: 'Wireless Headphones', price: 1990, quantity: 1 },
              { id: '2', name: 'Smart Watch', price: 1000, quantity: 1 }
            ],
            totalAmount: 3527.20,
            status: 'shipped',
            orderDate: '2024-01-15',
            trackingNumber: 'TRK123456789',
            estimatedDelivery: '2024-01-20'
          },
          {
            id: 'ORDER_1703123456790',
            items: [
              { id: '3', name: 'Coffee Maker', price: 3000, quantity: 1 }
            ],
            totalAmount: 3540.00,
            status: 'processing',
            orderDate: '2024-01-16',
            trackingNumber: 'TRK123456790',
            estimatedDelivery: '2024-01-22'
          }
        ];
        setOrders(mockOrders);
        localStorage.setItem('user_orders', JSON.stringify(mockOrders));
      }
    }
  }, [isAuthenticated]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Login Required</h2>
            <p className="text-muted-foreground">Please login to view your orders</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track your orders and delivery status</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
              <p className="text-muted-foreground mb-4">You haven't placed any orders yet</p>
              <Button>Start Shopping</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="shadow-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.orderDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">{formatPriceSimple(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="flex justify-between items-center pt-2 border-t font-semibold">
                    <span>Total Amount</span>
                    <span className="text-primary">{formatPriceSimple(order.totalAmount)}</span>
                  </div>

                  {/* Tracking Info */}
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span>Tracking: {order.trackingNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>Est. Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      Track Order
                    </Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;