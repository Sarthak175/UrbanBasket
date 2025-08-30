import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/contexts/CartContext';
import { useCart } from '@/contexts/CartContext';
import { formatPriceSimple } from '@/utils/currency';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <Card className="group cursor-pointer transition-all duration-500 hover:shadow-card-hover hover:-translate-y-2 hover:scale-105 bg-gradient-card hover-lift">
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden rounded-t-lg bg-muted relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
          />
          <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <Badge variant="secondary" className="ml-2 shrink-0">
              {product.category}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              {formatPriceSimple(product.price)}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart}
          className="w-full group/button"
          size="lg"
        >
          <ShoppingCart className="w-4 h-4 mr-2 transition-all duration-300 group-hover/button:scale-125 group-hover/button:rotate-12" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};