
/**
 * AdminMessages Component
 * Admin view for managing contact form submissions and newsletter subscribers.
 * Uses tabs to separate the two data types.
 */
import React, { useState, useEffect } from 'react';
import { Trash2, Loader2, Mail, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import pb from '@/lib/pocketbaseClient.js';

export default function AdminMessages() {
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Data states
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state for viewing full message
  const [selectedMessage, setSelectedMessage] = useState(null);

  /**
   * Fetches both messages and subscribers concurrently from PocketBase.
   */
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [msgs, subs] = await Promise.all([
        pb.collection('contactMessages').getFullList({ sort: '-created', $autoCancel: false }),
        pb.collection('newsletterSubscribers').getFullList({ sort: '-created', $autoCancel: false })
      ]);
      setMessages(msgs);
      setSubscribers(subs);
    } catch (error) {
      toast({ title: t('common.error'), description: 'Failed to load data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Deletes a contact message after confirmation.
   * @param {string} id - Message ID
   */
  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await pb.collection('contactMessages').delete(id, { $autoCancel: false });
      setMessages(messages.filter(m => m.id !== id));
      toast({ title: t('common.success'), description: 'Message deleted' });
    } catch (error) {
      toast({ title: t('common.error'), description: 'Failed to delete message', variant: 'destructive' });
    }
  };

  /**
   * Deletes a newsletter subscriber after confirmation.
   * @param {string} id - Subscriber ID
   */
  const handleDeleteSubscriber = async (id) => {
    if (!window.confirm('Remove this subscriber?')) return;
    try {
      await pb.collection('newsletterSubscribers').delete(id, { $autoCancel: false });
      setSubscribers(subscribers.filter(s => s.id !== id));
      toast({ title: t('common.success'), description: 'Subscriber removed' });
    } catch (error) {
      toast({ title: t('common.error'), description: 'Failed to remove subscriber', variant: 'destructive' });
    }
  };

  // Filter logic for search bar
  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">{t('admin.messages')}</h2>
      </div>

      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="messages"><Mail className="mr-2 h-4 w-4" /> {t('admin.contactMessages')}</TabsTrigger>
          <TabsTrigger value="subscribers"><Users className="mr-2 h-4 w-4" /> {t('admin.subscribers')}</TabsTrigger>
        </TabsList>

        <div className="mt-6 mb-4">
          <Input
            placeholder={t('admin.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Messages Tab Content */}
        <TabsContent value="messages">
          <div className="border rounded-md bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.date')}</TableHead>
                  <TableHead>{t('admin.name')}</TableHead>
                  <TableHead>{t('admin.email')}</TableHead>
                  <TableHead>{t('admin.subject')}</TableHead>
                  <TableHead className="text-right">{t('admin.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                ) : filteredMessages.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No messages found.</TableCell></TableRow>
                ) : (
                  filteredMessages.map((msg) => (
                    <TableRow key={msg.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedMessage(msg)}>
                      <TableCell>{new Date(msg.created).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{msg.name}</TableCell>
                      <TableCell>{msg.email}</TableCell>
                      <TableCell>{msg.subject || 'No Subject'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg.id); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Subscribers Tab Content */}
        <TabsContent value="subscribers">
          <div className="border rounded-md bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.date')}</TableHead>
                  <TableHead>{t('admin.email')}</TableHead>
                  <TableHead className="text-right">{t('admin.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={3} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                ) : filteredSubscribers.length === 0 ? (
                  <TableRow><TableCell colSpan={3} className="h-24 text-center text-muted-foreground">No subscribers found.</TableCell></TableRow>
                ) : (
                  filteredSubscribers.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell>{new Date(sub.created).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{sub.email}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteSubscriber(sub.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Message Details Modal */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>From: {selectedMessage?.name} ({selectedMessage?.email})</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground">{t('admin.subject')}</h4>
              <p>{selectedMessage?.subject || 'No Subject'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground">Message</h4>
              <p className="whitespace-pre-wrap bg-muted p-4 rounded-md mt-1">{selectedMessage?.message}</p>
            </div>
            <div className="text-xs text-muted-foreground">
              Received: {selectedMessage && new Date(selectedMessage.created).toLocaleString()}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
