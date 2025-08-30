import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatPriceSimple } from '@/utils/currency';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const { isAuthenticated } = useAuth();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="py-16">
            <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/products">
              <Button size="lg" className="px-8 py-6 text-lg shadow-button hover:shadow-card-hover transition-all duration-300 hover:scale-105">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Shopping Cart</h1>
          <Button
            variant="outline"
            onClick={clearCart}
            className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
          >
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="hover:shadow-card-hover transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-32 h-32 bg-muted rounded-lg overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold line-clamp-2">{item.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {item.description}
                          </p>
                          <p className="text-lg font-bold text-primary mt-2">
                            {formatPriceSimple(item.price)}
                          </p>
                        </div>
                        
                        <div className="flex flex-col sm:items-end gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                              className="w-20 text-center"
                              min="1"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Items ({totalItems})</span>
                  <span>{formatPriceSimple(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatPriceSimple(totalPrice)}</span>
                  </div>
                </div>
                
                <div className="space-y-3 pt-4">
                  {isAuthenticated ? (
                    <Link to="/payment" className="block">
                      <Button size="lg" className="w-full shadow-button hover:shadow-card-hover transition-all duration-300">
                        Proceed to Checkout
                      </Button>
                    </Link>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-3">
                        Please log in to continue
                      </p>
                      <Link to="/login" className="block">
                        <Button size="lg" className="w-full shadow-button hover:shadow-card-hover transition-all duration-300">
                          Login to Checkout
                        </Button>
                      </Link>
                    </div>
                  )}
                  
                  <Link to="/products">
                    <Button variant="outline" size="lg" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;