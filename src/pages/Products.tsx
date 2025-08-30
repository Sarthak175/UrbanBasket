import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCard } from '@/components/ProductCard';
import { Search, Loader2 } from 'lucide-react';
import { useProducts, useCategories } from '@/hooks/useApi';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Use API hooks to fetch data
  const { 
    data: productsData, 
    isLoading: productsLoading, 
    error: productsError 
  } = useProducts({
    search: searchTerm || undefined,
    category: selectedCategory !== 'All Categories' ? selectedCategory : undefined,
  });

  const { 
    data: categoriesData, 
    isLoading: categoriesLoading 
  } = useCategories();

  const products = productsData?.products || [];
  const categories = categoriesData ? ['All Categories', ...categoriesData] : ['All Categories'];

  const filteredProducts = products;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our wide range of high-quality products at competitive prices.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Error State */}
        {productsError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              Failed to load products. Please try again.
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {productsLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mr-2" />
            <span>Loading products...</span>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing {filteredProducts.length} of {productsData?.total || 0} products
                {selectedCategory !== 'All Categories' && ` in ${selectedCategory}`}
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-2xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or category filter.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;