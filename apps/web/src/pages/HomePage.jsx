
/**
 * HomePage Component
 * The main landing page of the application. Displays hero section,
 * featured products, benefits, testimonials, and newsletter signup.
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowRight, Zap, Download, Shield, Star, Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import PageTransition from '@/components/PageTransition.jsx';

function HomePage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Data states
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true);
  const [error, setError] = useState(null);
  
  // Newsletter form state
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch initial data on mount
  useEffect(() => {
    /**
     * Fetches featured products from PocketBase.
     */
    const fetchFeaturedProducts = async () => {
      try {
        const result = await pb.collection('products').getList(1, 6, {
          filter: 'featured=true',
          sort: '-created',
          $autoCancel: false
        });
        setFeaturedProducts(result.items);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products.');
      } finally {
        setIsLoading(false);
      }
    };

    /**
     * Fetches recent testimonials from PocketBase.
     */
    const fetchTestimonials = async () => {
      try {
        const result = await pb.collection('testimonials').getList(1, 4, {
          sort: '-created',
          $autoCancel: false
        });
        setTestimonials(result.items);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
      } finally {
        setIsLoadingTestimonials(false);
      }
    };

    fetchFeaturedProducts();
    fetchTestimonials();
  }, []);

  // Static content configuration
  const benefits = [
    { icon: Zap, title: 'Premium Quality', description: 'Professionally crafted digital products designed by experts with years of experience in the industry.' },
    { icon: Download, title: 'Instant Access', description: 'Download immediately after purchase. No waiting, no hassle. Start using your products right away.' },
    { icon: Shield, title: 'Lifetime Updates', description: 'Get all future updates for free. Your purchase includes lifetime access to improvements and new features.' },
    { icon: Star, title: 'Expert Support', description: 'Dedicated support team ready to help. Get assistance whenever you need it with priority email support.' }
  ];

  const faqs = [
    { question: 'What are digital products?', answer: 'Digital products are downloadable files like Figma templates, UI kits, design systems, courses, and tools that help you create better designs faster. They\'re instantly accessible and can be used in your projects right away.' },
    { question: 'How do I access my purchase?', answer: 'After completing your purchase on Gumroad, you\'ll receive an email with download links and access instructions. All files are available for immediate download, and you\'ll have lifetime access to re-download them anytime.' },
    { question: 'Can I get a refund?', answer: 'Yes! We offer a 30-day money-back guarantee on all products. If you\'re not satisfied with your purchase for any reason, contact us within 30 days and we\'ll issue a full refund, no questions asked.' },
    { question: 'Do you offer support?', answer: 'Absolutely! All purchases include email support. We typically respond within 24 hours during business days. Premium products also include priority support and access to our community.' },
    { question: 'Are there any discounts available?', answer: 'We occasionally run promotions and offer bundle discounts. Subscribe to our newsletter to be the first to know about special offers, new product launches, and exclusive deals.' },
    { question: 'Can I use these products commercially?', answer: 'Yes! All our products come with a commercial license, allowing you to use them in client projects, commercial work, and even resell your final designs. The only restriction is that you cannot resell or redistribute the source files themselves.' }
  ];

  /**
   * Handles newsletter subscription form submission.
   */
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    try {
      await pb.collection('newsletterSubscribers').create({ email }, { $autoCancel: false });
      toast({
        title: `${t('common.success')}! 🎉`,
        description: "You've been subscribed to our newsletter."
      });
      setEmail('');
    } catch (error) {
      toast({
        title: t('common.error'),
        description: "You might already be subscribed or an error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Framer motion animation variants
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
        <title>Premium Digital Products for Designers | RiseHub</title>
        <meta name="description" content="Discover premium Figma kits, design templates, courses, and tools. High-quality digital products to accelerate your design workflow and create stunning projects." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  {t('hero.title')}
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                  {t('hero.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="text-lg h-14 px-8">
                    <Link to="/shop">
                      {t('hero.btnBrowse')}
                      <ArrowRight className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0 rtl:rotate-180" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-lg h-14 px-8">
                    <Link to="/about">{t('hero.btnLearnMore')}</Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://horizons-cdn.hostinger.com/534f0d33-d657-4fe3-90e6-ee2560737191/wing-a5WXT.png"
                    alt="Modern workspace with design tools and creative materials"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 rtl:-right-6 rtl:-left-auto bg-background border border-border rounded-lg p-4 shadow-lg">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{t('hero.rating')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t('hero.customers')}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('home.featuredTitle')}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t('home.featuredSubtitle')}
              </p>
            </motion.div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
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
              <div className="text-center py-12">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">{t('product.retry')}</Button>
              </div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {featuredProducts.map((product) => (
                  <motion.div key={product.id} variants={item}>
                    <Link to={`/product/${product.id}`}>
                      <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden">
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
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-3">
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
                        <CardFooter className="p-6 pt-0">
                          <Button className="w-full group-hover:bg-primary/90" variant="outline">
                            {t('shop.viewDetails')}
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 rtl:mr-2 rtl:ml-0 rtl:rotate-180 rtl:group-hover:-translate-x-1 transition-transform" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Button size="lg" variant="outline" asChild>
                <Link to="/shop">
                  {t('home.viewAll')}
                  <ArrowRight className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0 rtl:rotate-180" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('home.benefitsTitle')}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t('home.benefitsSubtitle')}
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {benefits.map((benefit, index) => (
                <motion.div key={index} variants={item}>
                  <Card className="h-full text-center hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
                    <CardHeader>
                      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <benefit.icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {benefit.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('home.testimonialsTitle')}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t('home.testimonialsSubtitle')}
              </p>
            </motion.div>

            {isLoadingTestimonials ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="h-full">
                    <CardHeader>
                      <Skeleton className="h-4 w-24 mb-3" />
                      <Skeleton className="h-16 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : testimonials.length > 0 ? (
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {testimonials.map((testimonial) => (
                  <motion.div key={testimonial.id} variants={item}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex space-x-1 rtl:space-x-reverse mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                        <CardDescription className="text-base italic">
                          "{testimonial.opinion}"
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <p className="text-center text-muted-foreground">No testimonials yet.</p>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('home.faqTitle')}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t('home.faqSubtitle')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-lg">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{t('home.newsletterTitle')}</h2>
              <p className="text-muted-foreground text-lg mb-8">
                {t('home.newsletterSubtitle')}
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder={t('home.newsletterPlaceholder')}
                  className="flex-1 h-12 text-base"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                <Button type="submit" size="lg" className="h-12 px-8" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : t('home.newsletterBtn')}
                </Button>
              </form>
              <p className="text-sm text-muted-foreground mt-4">
                {t('home.newsletterNote')}
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

export default HomePage;
