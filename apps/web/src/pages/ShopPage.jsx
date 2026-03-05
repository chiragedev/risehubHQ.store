
/**
 * ShopPage Component
 * Displays a grid of products with filtering and search capabilities.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Search, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import pb from '@/lib/pocketbaseClient.js';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import PageTransition from '@/components/PageTransition.jsx';

function ShopPage() {
  const { t } = useTranslation();
  
  // Data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 200]);

  // Fetch products and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          pb.collection('products').getFullList({ sort: '-created', $autoCancel: false }),
          pb.collection('categories').getFullList({ sort: 'name', $autoCancel: false })
        ]);
        setProducts(productsData);
        setCategories(['All', ...categoriesData.map(c => c.name)]);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Memoized filtered products based on search, category, and price range.
   */
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const activePrice = product.isDiscounted ? product.discountedPrice : product.price;
      const matchesPrice = activePrice >= priceRange[0] && activePrice <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchQuery, selectedCategory, priceRange]);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition>
      <Helmet>
        <title>Shop Digital Products | RiseHub</title>
        <meta name="description" content="Browse our collection of premium digital products including Figma kits, design templates, courses, and tools for designers and developers." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('shop.title')}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('shop.subtitle')}
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('shop.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rtl:pr-10 rtl:pl-3 h-12 text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Category Filter */}
                <div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
                    <SlidersHorizontal className="h-5 w-5" />
                    <h2 className="text-lg font-semibold">{t('shop.filters')}</h2>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium mb-3">{t('shop.category')}</p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Badge
                          key={category}
                          variant={selectedCategory === category ? 'default' : 'outline'}
                          className="cursor-pointer transition-all hover:scale-105"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <p className="text-sm font-medium mb-3">{t('shop.priceRange')}</p>
                  <div className="space-y-4">
                    <Slider
                      min={0}
                      max={200}
                      step={10}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Results Count */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    {!isLoading && t('shop.productsFound', { count: filteredProducts.length })}
                  </p>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="h-full">
                      <Skeleton className="h-48 w-full rounded-t-lg" />
                      <CardContent className="p-6 space-y-4">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()} variant="outline">{t('product.retry')}</Button>
                </div>
              ) : filteredProducts.length > 0 ? (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filteredProducts.map((product) => (
                    <motion.div key={product.id} variants={item}>
                      <Link to={`/product/${product.id}`} className="block h-full">
                        <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden flex flex-col">
                          {product.isDiscounted && (
                            <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto z-10 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold shadow-md">
                              {t('shop.sale')}
                            </div>
                          )}
                          <CardHeader className="p-0">
                            <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                              <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          </CardHeader>
                          <CardContent className="p-6 flex-grow">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="secondary">{product.category}</Badge>
                              <div className="flex flex-col items-end rtl:items-start">
                                {product.isDiscounted ? (
                                  <>
                                    <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                                    <span className="text-2xl font-bold text-destructive">${product.discountedPrice}</span>
                                  </>
                                ) : (
                                  <span className="text-2xl font-bold">${product.price}</span>
                                )}
                              </div>
                            </div>
                            <CardTitle className="mb-2 line-clamp-1">{product.title}</CardTitle>
                            <CardDescription className="line-clamp-2">
                              {product.description}
                            </CardDescription>
                          </CardContent>
                          <CardFooter className="p-6 pt-0 mt-auto">
                            <motion.div
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              className="w-full"
                            >
                              <Button 
                                className="w-full relative overflow-hidden group/btn border-primary/50 hover:border-primary" 
                                variant="outline"
                              >
                                <span className="relative z-10 flex items-center justify-center font-medium">
                                  {t('shop.viewDetails')}
                                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 rtl:mr-2 rtl:ml-0 rtl:rotate-180 rtl:group-hover/btn:-translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                              </Button>
                            </motion.div>
                          </CardFooter>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-16">
                  <div className="mb-4">
                    <Search className="h-16 w-16 mx-auto text-muted-foreground/50" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">{t('shop.noProducts')}</h3>
                  <p className="text-muted-foreground mb-6">
                    {t('shop.adjustFilters')}
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setPriceRange([0, 200]);
                    }}
                  >
                    {t('shop.clearFilters')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default ShopPage;
