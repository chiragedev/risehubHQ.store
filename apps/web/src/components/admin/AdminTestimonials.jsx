
/**
 * AdminTestimonials Component
 * Admin view for managing customer testimonials.
 * Allows creating, editing, and deleting testimonials.
 */
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Loader2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import pb from '@/lib/pocketbaseClient.js';

export default function AdminTestimonials() {
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Data states
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal and form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    opinion: '',
    rating: 5
  });

  /**
   * Fetches all testimonials from PocketBase.
   */
  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const records = await pb.collection('testimonials').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setTestimonials(records);
    } catch (error) {
      toast({ title: t('common.error'), description: 'Failed to load testimonials', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchTestimonials();
  }, []);

  /**
   * Opens the modal for adding or editing a testimonial.
   * @param {Object|null} item - Testimonial to edit, or null for new
   */
  const openModal = (item = null) => {
    setSelectedItem(item);
    if (item) {
      setFormData({
        name: item.name,
        role: item.role || '',
        opinion: item.opinion,
        rating: item.rating
      });
    } else {
      setFormData({ name: '', role: '', opinion: '', rating: 5 });
    }
    setIsModalOpen(true);
  };

  /**
   * Handles form submission to create or update a testimonial.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.opinion || !formData.rating) {
      toast({ title: 'Validation Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedItem) {
        await pb.collection('testimonials').update(selectedItem.id, formData, { $autoCancel: false });
        toast({ title: t('common.success'), description: 'Testimonial updated' });
      } else {
        await pb.collection('testimonials').create(formData, { $autoCancel: false });
        toast({ title: t('common.success'), description: 'Testimonial created' });
      }
      fetchTestimonials();
      setIsModalOpen(false);
    } catch (error) {
      toast({ title: t('common.error'), description: 'Failed to save testimonial', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Deletes a testimonial after confirmation.
   * @param {string} id - Testimonial ID
   */
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await pb.collection('testimonials').delete(id, { $autoCancel: false });
      toast({ title: t('common.success'), description: 'Testimonial deleted' });
      fetchTestimonials();
    } catch (error) {
      toast({ title: t('common.error'), description: 'Failed to delete testimonial', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">{t('admin.testimonials')}</h2>
        <Button onClick={() => openModal()}>
          <Plus className="mr-2 h-4 w-4" />
          {t('admin.addTestimonial')}
        </Button>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.name')}</TableHead>
              <TableHead>{t('admin.role')}</TableHead>
              <TableHead>{t('admin.rating')}</TableHead>
              <TableHead>{t('admin.opinion')}</TableHead>
              <TableHead className="text-right">{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : testimonials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No testimonials found.
                </TableCell>
              </TableRow>
            ) : (
              testimonials.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>
                    <div className="flex text-yellow-500">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{item.opinion}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openModal(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedItem ? t('admin.editTestimonial') : t('admin.addTestimonial')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t('admin.name')} *</Label>
              <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>{t('admin.role')}</Label>
              <Input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="e.g. UI Designer" />
            </div>
            <div className="space-y-2">
              <Label>{t('admin.rating')} (1-5) *</Label>
              <Input type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} required />
            </div>
            <div className="space-y-2">
              <Label>{t('admin.opinion')} *</Label>
              <Textarea value={formData.opinion} onChange={e => setFormData({...formData, opinion: e.target.value})} required rows={4} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>{t('admin.cancel')}</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('admin.save')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
