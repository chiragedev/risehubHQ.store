
/**
 * ProductFormModal Component
 * Modal dialog for creating and editing products in the admin panel.
 * Handles form validation, image uploads, and PocketBase data submission.
 */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Upload, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import pb from '@/lib/pocketbaseClient.js';

// Initial empty state for the product form
const initialFormState = {
  title: '',
  description: '',
  price: '',
  category: '',
  imageUrl: '',
  gumroadUrl: '',
  featured: false,
  isDiscounted: false,
  originalPrice: '',
  discountedPrice: ''
};

export default function ProductFormModal({ isOpen, onClose, product, onSuccess }) {
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Form and UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  
  // Image upload states
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  // Reset form or populate with product data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (product) {
        setFormData({
          title: product.title || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          category: product.category || '',
          imageUrl: product.imageUrl || '',
          gumroadUrl: product.gumroadUrl || '',
          featured: product.featured || false,
          isDiscounted: product.isDiscounted || false,
          originalPrice: product.originalPrice?.toString() || '',
          discountedPrice: product.discountedPrice?.toString() || ''
        });
        setImagePreview(product.imageUrl || '');
      } else {
        setFormData(initialFormState);
        setImagePreview('');
      }
      setErrors({});
    }
  }, [product, isOpen]);

  /**
   * Fetches available categories from PocketBase.
   */
  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const records = await pb.collection('categories').getFullList({ sort: 'name', $autoCancel: false });
      setCategories(records);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({ title: t('common.error'), description: 'Could not load categories.', variant: 'destructive' });
    } finally {
      setIsLoadingCategories(false);
    }
  };

  /**
   * Creates a new category in PocketBase and selects it in the form.
   */
  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const record = await pb.collection('categories').create({ name: newCategory.trim() }, { $autoCancel: false });
      setCategories(prev => [...prev, record].sort((a, b) => a.name.localeCompare(b.name)));
      setFormData(prev => ({ ...prev, category: record.name }));
      setNewCategory('');
      toast({ title: t('common.success'), description: 'Category created successfully.' });
    } catch (error) {
      toast({ title: t('common.error'), description: 'Failed to create category.', variant: 'destructive' });
    }
  };

  /**
   * Handles standard input changes and clears associated errors.
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Handles checkbox state changes.
   */
  const handleCheckedChange = (field, checked) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  /**
   * Handles file selection for image upload.
   * Validates file size/type and generates a base64 preview.
   * Note: Since the 'products' schema uses a text field for 'imageUrl', 
   * we store the base64 string directly instead of uploading a file object.
   */
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ title: t('common.error'), description: 'Please select a valid image file.', variant: 'destructive' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: t('common.error'), description: 'Image size must be less than 5MB.', variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    
    try {
      // Generate preview and base64 string using FileReader
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setFormData(prev => ({ ...prev, imageUrl: base64String }));
        if (errors.imageUrl) setErrors(prev => ({ ...prev, imageUrl: '' }));
        
        toast({ title: t('common.success'), description: 'Image processed successfully.' });
        setIsUploading(false);
      };
      reader.onerror = () => {
        throw new Error('Failed to read file');
      };
      reader.readAsDataURL(file);
      
      // Note: If the schema had a file field, we would use FormData here:
      // const formData = new FormData();
      // formData.append('image', file);
      // await pb.collection('products').create(formData);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: t('common.error'), description: 'Failed to process image. Please try using a URL instead.', variant: 'destructive' });
      setIsUploading(false);
    }
  };

  /**
   * Validates all form fields before submission.
   * @returns {boolean} True if form is valid
   */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.imageUrl.trim()) newErrors.imageUrl = 'Image URL or upload is required';
    if (!formData.gumroadUrl.trim() || !formData.gumroadUrl.startsWith('http')) newErrors.gumroadUrl = 'Valid Gumroad URL is required';

    // Validate pricing logic
    if (formData.isDiscounted) {
      if (!formData.originalPrice || isNaN(formData.originalPrice) || Number(formData.originalPrice) <= 0) {
        newErrors.originalPrice = 'Valid original price required';
      }
      if (!formData.discountedPrice || isNaN(formData.discountedPrice) || Number(formData.discountedPrice) < 0) {
        newErrors.discountedPrice = 'Valid discounted price required';
      }
      if (Number(formData.discountedPrice) >= Number(formData.originalPrice)) {
        newErrors.discountedPrice = 'Discounted price must be less than original';
      }
    } else {
      if (!formData.price || isNaN(formData.price) || Number(formData.price) < 0) {
        newErrors.price = 'Valid price is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission to create or update a product in PocketBase.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({ title: t('common.error'), description: 'Please check the form for errors.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare data payload
      const dataToSubmit = {
        ...formData,
        price: formData.isDiscounted ? Number(formData.discountedPrice) : Number(formData.price),
        originalPrice: formData.isDiscounted ? Number(formData.originalPrice) : null,
        discountedPrice: formData.isDiscounted ? Number(formData.discountedPrice) : null,
      };

      // Update or Create record
      if (product) {
        await pb.collection('products').update(product.id, dataToSubmit, { $autoCancel: false });
        toast({ title: t('common.success'), description: 'Product updated successfully.' });
      } else {
        await pb.collection('products').create(dataToSubmit, { $autoCancel: false });
        toast({ title: t('common.success'), description: 'Product created successfully.' });
      }
      
      handleClose();
      onSuccess();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: t('common.error'),
        description: error.message || 'Failed to save product. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Resets form state and closes the modal.
   */
  const handleClose = () => {
    setFormData(initialFormState);
    setImagePreview('');
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? t('admin.editProduct') : t('admin.addProduct')}</DialogTitle>
          <DialogDescription>
            {product ? 'Update the details of your product below.' : 'Fill in the details below to create a new product.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">{t('admin.title')} *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Premium UI Kit"
              className={errors.title ? 'border-destructive' : ''}
              disabled={isSubmitting}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="description">{t('admin.description')} *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your product..."
              rows={3}
              className={errors.description ? 'border-destructive' : ''}
              disabled={isSubmitting}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Selection */}
            <div className="space-y-2">
              <Label>{t('admin.category')} *</Label>
              <div className="flex flex-col space-y-2">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={isSubmitting || isLoadingCategories}
                  className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.category ? 'border-destructive' : ''}`}
                >
                  <option value="">Select a category...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <div className="flex space-x-2">
                  <Input 
                    placeholder={t('admin.createCategory')} 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <Button type="button" variant="secondary" onClick={handleCreateCategory} disabled={isSubmitting || !newCategory.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
            </div>

            {/* Image Upload & URL Input */}
            <div className="space-y-2">
              <Label>{t('admin.image')} *</Label>
              <div className="flex flex-col space-y-3">
                {/* File Upload Button */}
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept="image/jpeg, image/png, image/webp, image/gif"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={isSubmitting || isUploading}
                  />
                  <Label 
                    htmlFor="image-upload" 
                    className={`flex items-center justify-center w-full h-10 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                    {imagePreview ? t('admin.replaceImage') : t('admin.uploadImage')}
                  </Label>
                </div>
                
                <div className="text-center text-xs text-muted-foreground">OR</div>
                
                {/* Fallback URL Input */}
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => {
                    handleChange(e);
                    setImagePreview(e.target.value);
                  }}
                  placeholder={t('admin.imageUrl')}
                  className={errors.imageUrl ? 'border-destructive' : ''}
                  disabled={isSubmitting}
                />
                
                {/* Image Preview */}
                {imagePreview && !errors.imageUrl && (
                  <div className="mt-2 h-32 w-full rounded-md overflow-hidden bg-muted border flex items-center justify-center relative group">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="h-full w-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ImageIcon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                )}
              </div>
              {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl}</p>}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDiscounted"
                checked={formData.isDiscounted}
                onCheckedChange={(c) => handleCheckedChange('isDiscounted', c)}
                disabled={isSubmitting}
              />
              <Label htmlFor="isDiscounted" className="font-semibold cursor-pointer">
                {t('admin.enableDiscount')}
              </Label>
            </div>

            {formData.isDiscounted ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">{t('admin.originalPrice')} *</Label>
                  <Input
                    id="originalPrice"
                    name="originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className={errors.originalPrice ? 'border-destructive' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.originalPrice && <p className="text-sm text-destructive">{errors.originalPrice}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountedPrice">{t('admin.discountedPrice')} *</Label>
                  <Input
                    id="discountedPrice"
                    name="discountedPrice"
                    type="number"
                    step="0.01"
                    value={formData.discountedPrice}
                    onChange={handleChange}
                    className={errors.discountedPrice ? 'border-destructive' : ''}
                    disabled={isSubmitting}
                  />
                  {errors.discountedPrice && <p className="text-sm text-destructive">{errors.discountedPrice}</p>}
                </div>
                {/* Discount Calculation Preview */}
                {formData.originalPrice && formData.discountedPrice && Number(formData.originalPrice) > Number(formData.discountedPrice) && (
                  <div className="col-span-2 text-sm text-green-600 font-medium bg-green-50 dark:bg-green-900/20 p-2 rounded">
                    Discount: {Math.round((1 - Number(formData.discountedPrice) / Number(formData.originalPrice)) * 100)}% off
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="price">{t('admin.regularPrice')} *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className={errors.price ? 'border-destructive' : ''}
                  disabled={isSubmitting}
                />
                {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
              </div>
            )}
          </div>

          {/* Gumroad URL Input */}
          <div className="space-y-2">
            <Label htmlFor="gumroadUrl">{t('admin.gumroadUrl')} *</Label>
            <Input
              id="gumroadUrl"
              name="gumroadUrl"
              value={formData.gumroadUrl}
              onChange={handleChange}
              placeholder="https://gumroad.com/l/..."
              className={errors.gumroadUrl ? 'border-destructive' : ''}
              disabled={isSubmitting}
            />
            {errors.gumroadUrl && <p className="text-sm text-destructive">{errors.gumroadUrl}</p>}
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(c) => handleCheckedChange('featured', c)}
              disabled={isSubmitting}
            />
            <Label htmlFor="featured" className="cursor-pointer">
              {t('admin.featured')} (Show on Homepage)
            </Label>
          </div>

          {/* Form Actions */}
          <DialogFooter className="pt-6">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              {t('admin.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {product ? t('admin.save') : t('admin.addProduct')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
