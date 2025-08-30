import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Award, Users, Globe, Heart } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Award,
      title: 'Quality First',
      description: 'We carefully curate every product to ensure the highest quality standards for our customers.'
    },
    {
      icon: Users,
      title: 'Customer-Centric',
      description: 'Our customers are at the heart of everything we do. Your satisfaction is our top priority.'
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'From local artisans to international brands, we bring you the best products from around the world.'
    },
    {
      icon: Heart,
      title: 'Passionate Team',
      description: 'Our dedicated team is passionate about helping you find exactly what you need.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '50,000+', label: 'Products Sold' },
    { number: '500+', label: 'Brands' },
    { number: '99%', label: 'Customer Satisfaction' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-hero text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About ShopEase</h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto">
            Your trusted online shopping destination, committed to bringing you quality products, 
            exceptional service, and an unparalleled shopping experience.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Founded in 2020, ShopEase began with a simple mission: to make online shopping 
                  easier, more enjoyable, and more accessible for everyone. What started as a small 
                  team with big dreams has grown into a trusted platform serving thousands of 
                  customers worldwide.
                </p>
                <p>
                  We believe that shopping should be a delightful experience, not a chore. That's 
                  why we've built our platform with user experience at the forefront, ensuring 
                  that every interaction is smooth, secure, and satisfying.
                </p>
                <p>
                  Today, we're proud to partner with hundreds of brands and thousands of sellers 
                  to bring you an incredible selection of products at competitive prices.
                </p>
              </div>
            </div>
            <div className="bg-muted/30 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-muted-foreground">
                To democratize commerce by providing a platform where anyone can discover, 
                purchase, and enjoy quality products from around the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do and help us stay true to our mission.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2 bg-gradient-card">
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                    <value.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ShopEase by the Numbers</h2>
            <p className="text-xl text-muted-foreground">
              Our growth reflects the trust our customers place in us.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-hero text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience ShopEase?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Join thousands of satisfied customers and discover why ShopEase is the preferred 
            choice for online shopping.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" variant="secondary" className="px-8 py-6 text-lg shadow-button hover:shadow-card-hover transition-all duration-300 hover:scale-105">
                Start Shopping
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-white text-white hover:bg-white hover:text-primary transition-all duration-300">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;