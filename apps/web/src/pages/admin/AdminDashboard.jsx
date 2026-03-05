
/**
 * AdminDashboard Component
 * Main layout for the admin panel. Includes a sidebar for navigation
 * and renders the selected admin view component.
 */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { LayoutDashboard, Package, Settings, LogOut, Menu, MessageSquare, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTranslation } from 'react-i18next';
import ProductsManagement from '@/components/admin/ProductsManagement.jsx';
import AdminTestimonials from '@/components/admin/AdminTestimonials.jsx';
import AdminMessages from '@/components/admin/AdminMessages.jsx';
import PageTransition from '@/components/PageTransition.jsx';

export default function AdminDashboard() {
  const { logout, admin } = useAuth();
  const { t } = useTranslation();
  
  // State for active tab and mobile menu
  const [activeTab, setActiveTab] = useState('products');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sidebar navigation items
  const navItems = [
    { id: 'dashboard', label: t('admin.dashboard'), icon: LayoutDashboard },
    { id: 'products', label: t('admin.products'), icon: Package },
    { id: 'testimonials', label: t('admin.testimonials'), icon: Star },
    { id: 'messages', label: t('admin.messages'), icon: MessageSquare },
    { id: 'settings', label: t('admin.settings'), icon: Settings },
  ];

  /**
   * Renders the content based on the currently active tab.
   * @returns {JSX.Element}
   */
  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductsManagement />;
      case 'testimonials':
        return <AdminTestimonials />;
      case 'messages':
        return <AdminMessages />;
      case 'dashboard':
        return (
          <div className="p-6 bg-card rounded-lg border shadow-sm">
            <h2 className="text-2xl font-bold mb-4">{t('admin.welcome')}</h2>
            <p className="text-muted-foreground">{t('admin.selectOption')}</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6 bg-card rounded-lg border shadow-sm">
            <h2 className="text-2xl font-bold mb-4">{t('admin.settings')}</h2>
            <p className="text-muted-foreground">Admin settings coming soon.</p>
          </div>
        );
      default:
        return <ProductsManagement />;
    }
  };

  /**
   * Sidebar content component used in both desktop and mobile views.
   */
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tight">Admin Panel</h2>
        <p className="text-sm text-muted-foreground mt-1">{admin?.email}</p>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => {
              setActiveTab(item.id);
              setIsMobileMenuOpen(false);
            }}
          >
            <item.icon className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
            {item.label}
          </Button>
        ))}
      </nav>
      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" onClick={logout}>
          <LogOut className="mr-2 h-5 w-5 rtl:ml-2 rtl:mr-0" />
          {t('admin.logout')}
        </Button>
      </div>
    </div>
  );

  return (
    <PageTransition>
      <Helmet>
        <title>Admin Dashboard | RiseHub</title>
      </Helmet>
      <div className="min-h-screen bg-muted/30 flex flex-col md:flex-row">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-background">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 border-r bg-background min-h-screen sticky top-0">
          <SidebarContent />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
