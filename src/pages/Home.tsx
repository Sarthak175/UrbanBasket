import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import { ArrowRight, ShoppingCart, CreditCard, Smartphone, Star, Truck, Shield, Headphones, ShoppingBag } from 'lucide-react';
import { products } from '@/data/products';
import heroImage from '@/assets/hero-banner.jpg';
import { useCart } from '@/contexts/CartContext';
import { formatPriceSimple } from '@/utils/currency';
import UPIQRCode from '@/components/UPIQRCode';
import { toast } from 'sonner';

const Home = () => {
  const featuredProducts = products.slice(0, 4);
  const { items, addToCart } = useCart();
  const [showQRDemo, setShowQRDemo] = useState(false);

  const features = [
    {
      icon: ShoppingBag,
      title: 'Easy Shopping',
      description: 'Browse and shop from thousands of products with ease'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Get your orders delivered quickly and safely to your door'
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: 'Your payment information is always safe and secure'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Our customer support team is here to help you anytime'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[70vh] flex items-center justify-center bg-gradient-hero text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(43, 103, 119, 0.8), rgba(82, 171, 152, 0.8)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-bounce-in">
            Welcome to <span className="text-secondary animate-pulse-glow">UrbanBasket</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '0.3s'}}>
            Discover amazing products at unbeatable prices. Your one-stop shop for everything you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{animationDelay: '0.6s'}}>
            <Link to="/products">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Shop Now
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="hero" className="text-lg px-8 py-6">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* QR Code Payment Demo Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Try Our New QR Code Payment
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the future of payments! Scan the QR code with your phone and complete the payment seamlessly.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <Button 
              onClick={() => setShowQRDemo(!showQRDemo)}
              variant={showQRDemo ? "outline" : "default"}
              size="lg"
              className="flex items-center gap-2"
            >
              <Smartphone className="w-5 h-5" />
              {showQRDemo ? 'Hide QR Demo' : 'Show QR Demo'}
            </Button>
          </div>

          {showQRDemo && (
            <div className="max-w-md mx-auto">
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Smartphone className="w-5 h-5 text-primary" />
                    QR Code Payment Demo
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Sample payment of ₹99.00
                  </p>
                </CardHeader>
                <CardContent>
                  <UPIQRCode
                    amount={99.00}
                    merchantId="demo@urbanbasket"
                    merchantName="UrbanBasket Demo"
                    onPaymentSuccess={(transactionId) => {
                      toast.success(`🎉 Demo payment successful! Transaction ID: ${transactionId}`);
                    }}
                    onPaymentFailure={(error) => {
                      toast.error(`❌ Demo payment failed: ${error}`);
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose UrbanBasket?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover-lift bg-gradient-card animate-slide-up" style={{animationDelay: `${index * 0.2}s`}}>
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 hover:rotate-12 animate-float" style={{animationDelay: `${index * 0.5}s`}}>
                    <feature.icon className="w-8 h-8 text-primary-foreground transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 hover:text-primary">{feature.title}</h3>
                  <p className="text-muted-foreground transition-colors duration-300 hover:text-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Check out our most popular products, carefully selected just for you.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" className="px-8 py-6 text-lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-hero text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Join thousands of satisfied customers and discover the UrbanBasket difference today.
          </p>
          <Link to="/products">
            <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">
              Explore Products
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;