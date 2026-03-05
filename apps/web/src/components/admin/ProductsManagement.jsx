
/**
 * ProductsManagement Component
 * Admin view for listing, filtering, and managing products.
 * Includes functionality to toggle featured status, edit, and delete products.
 */
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Star, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import pb from '@/lib/pocketbaseClient.js';
import ProductFormModal from './ProductFormModal.jsx';
import DeleteConfirmationDialog from './DeleteConfirmationDialog.jsx';

export default function ProductsManagement() {
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Data states
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal visibility states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  /**
   * Fetches all products from PocketBase, sorted by creation date.
   */
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const records = await pb.collection('products').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setProducts(records);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      toast({
        title: t('common.error'),
        description: 'Failed to load products',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  /**
   * Toggles the 'featured' status of a product directly from the table.
   * 
   * @param {Object} product - The product to update
   * @param {boolean} checked - New featured status
   */
  const handleToggleFeatured = async (product, checked) => {
    try {
      await pb.collection('products').update(product.id, { featured: checked }, { $autoCancel: false });
      // Optimistically update local state
      setProducts(products.map(p => p.id === product.id ? { ...p, featured: checked } : p));
      toast({
        title: t('common.success'),
        description: `Product ${checked ? 'featured' : 'unfeatured'} successfully.`
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to update featured status',
        variant: 'destructive'
      });
    }
  };

  // Modal handlers
  const openAddModal = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  // Filter products based on search query
  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">{t('admin.products')}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchProducts} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {t('admin.refresh')}
          </Button>
          <Button onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            {t('admin.addProduct')}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2 max-w-sm">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder={t('admin.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Data Table or Error State */}
      {error ? (
        <div className="text-center py-12 bg-card border rounded-md">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchProducts} variant="outline">{t('product.retry')}</Button>
        </div>
      ) : (
        <div className="border rounded-md bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.image')}</TableHead>
                <TableHead>{t('admin.title')}</TableHead>
                <TableHead>{t('admin.category')}</TableHead>
                <TableHead>{t('admin.price')}</TableHead>
                <TableHead>{t('admin.featured')}</TableHead>
                <TableHead className="text-right">{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading Skeletons
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-10 w-16 rounded" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-[80px] rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-10 rounded-full" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredProducts.length === 0 ? (
                // Empty State
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    {searchQuery ? 'No products match your search.' : 'No products found. Add one to get started!'}
                  </TableCell>
                </TableRow>
              ) : (
                // Product Rows
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="h-10 w-16 rounded overflow-hidden bg-muted border">
                        <img 
                          src={product.imageUrl} 
                          alt={product.title} 
                          className="h-full w-full object-cover"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {product.isDiscounted ? (
                        <div className="flex flex-col">
                          <span className="text-destructive font-bold">${product.discountedPrice}</span>
                          <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
                        </div>
                      ) : (
                        <span>${product.price}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={product.featured}
                          onCheckedChange={(checked) => handleToggleFeatured(product, checked)}
                        />
                        {product.featured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(product)} title={t('admin.editProduct')}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => openDeleteModal(product)} title={t('admin.deleteProduct')}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modals */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        product={selectedProduct}
        onSuccess={fetchProducts}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        product={selectedProduct}
        onSuccess={fetchProducts}
      />
    </div>
  );
}
