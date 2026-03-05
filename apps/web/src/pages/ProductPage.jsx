
/**
 * ProductPage Component
 * Displays detailed information about a single product, including pricing,
 * features, and related products.
 */
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Check, ExternalLink, ArrowLeft, Package, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import pb from '@/lib/pocketbaseClient.js';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import PageTransition from '@/components/PageTransition.jsx';

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Data states
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product details and related products on mount or ID change
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const record = await pb.collection('products').getOne(id, { $autoCancel: false });
        setProduct(record);

        // Fetch related products in the same category
        const related = await pb.collection('products').getList(1, 4, {
          filter: `category="${record.category}" && id!="${record.id}"`,
          $autoCancel: false
        });
        setRelatedProducts(related.items);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(t('product.notFoundDesc'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, t]);

  // Loading state UI
  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Error or Not Found state UI
  if (error || !product) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-3xl font-bold mb-2">{t('product.notFound')}</h1>
            <p className="text-muted-foreground mb-6">{error || t('product.notFoundDesc')}</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => navigate('/shop')} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0 rtl:rotate-180" />
                {t('product.backToShop')}
              </Button>
              <Button onClick={() => window.location.reload()}>
                {t('product.retry')}
              </Button>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  // Static content
  const faqs = [
    { question: 'How do I access the product after purchase?', answer: 'After completing your purchase on Gumroad, you\'ll receive an email with download links and access instructions. All files are available for immediate download.' },
    { question: 'Can I get a refund?', answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with your purchase, contact us within 30 days for a full refund.' },
    { question: 'Do I get lifetime updates?', answer: 'Yes! All purchases include lifetime access to updates. You\'ll be notified via email whenever new versions or improvements are released.' },
    { question: 'Can I use this for commercial projects?', answer: 'Absolutely! All our products come with a commercial license, allowing you to use them in client projects and commercial work.' }
  ];

  const genericFeatures = [
    'High-quality professional design',
    'Instant digital download',
    'Lifetime access to updates',
    'Commercial license included',
    'Priority email support',
    'Easy to customize and use'
  ];

  const genericIncluded = [
    'Source files and assets',
    'Comprehensive documentation',
    'Usage guidelines',
    'Free updates'
  ];

  return (
    <PageTransition>
      <Helmet>
        <title>{`${product.title} | RiseHub`}</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Back Button */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button variant="ghost" onClick={() => navigate('/shop')}>
            <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0 rtl:rotate-180" />
            {t('product.backToShop')}
          </Button>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="aspect-video rounded-lg overflow-hidden bg-muted relative shadow-lg"
              >
                {product.isDiscounted && (
                  <div className="absolute top-4 right-4 rtl:left-4 rtl:right-auto z-10 bg-destructive text-destructive-foreground px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {t('shop.sale')}
                  </div>
                )}
                <img
                  src={product.imageUrl}
                  alt={`${product.title} preview`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <Badge className="mb-4">{product.category}</Badge>
                <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
                <p className="text-muted-foreground text-lg mb-6">{product.description}</p>
                <div className="flex items-baseline space-x-4 rtl:space-x-reverse mb-6">
                  {product.isDiscounted ? (
                    <>
                      <span className="text-5xl font-bold text-destructive">${product.discountedPrice}</span>
                      <span className="text-2xl text-muted-foreground line-through">${product.originalPrice}</span>
                    </>
                  ) : (
                    <span className="text-5xl font-bold">${product.price}</span>
                  )}
                  <span className="text-muted-foreground">{t('product.oneTimePayment')}</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="sticky top-24 space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <Button
                    size="lg"
                    className="w-full text-lg h-14 relative overflow-hidden group"
                    asChild
                  >
                    <a
                      href={product.gumroadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="relative z-10 flex items-center justify-center font-semibold">
                        {t('product.buyNow')}
                        <ExternalLink className="ml-2 h-5 w-5 rtl:mr-2 rtl:ml-0 group-hover:translate-x-1 group-hover:-translate-y-1 rtl:group-hover:-translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-primary-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_20px_rgba(var(--primary),0.8)]" />
                    </a>
                  </Button>
                </motion.div>
                <p className="text-sm text-muted-foreground text-center">
                  {t('product.secureCheckout')}
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">{t('product.keyFeatures')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {genericFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 rtl:space-x-reverse p-4 rounded-lg bg-muted/50"
                >
                  <Check className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* What's Included */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">{t('product.whatsIncluded')}</h2>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {genericIncluded.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3 rtl:space-x-reverse">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* FAQ */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">{t('product.faq')}</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold mb-8">{t('product.relatedProducts')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`} className="block h-full">
                    <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col">
                      {relatedProduct.isDiscounted && (
                        <div className="absolute top-2 right-2 rtl:left-2 rtl:right-auto z-10 bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full text-xs font-bold shadow-md">
                          {t('shop.sale')}
                        </div>
                      )}
                      <CardHeader className="p-0">
                        <div className="aspect-video overflow-hidden rounded-t-lg bg-muted">
                          <img
                            src={relatedProduct.imageUrl}
                            alt={relatedProduct.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 flex-grow">
                        <CardTitle className="text-lg mb-2 line-clamp-1">
                          {relatedProduct.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 mb-2">
                          {relatedProduct.description}
                        </CardDescription>
                        {relatedProduct.isDiscounted ? (
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <span className="text-xl font-bold text-destructive">${relatedProduct.discountedPrice}</span>
                            <span className="text-sm text-muted-foreground line-through">${relatedProduct.originalPrice}</span>
                          </div>
                        ) : (
                          <p className="text-xl font-bold">${relatedProduct.price}</p>
                        )}
                      </CardContent>
                      <CardFooter className="p-4 pt-0 mt-auto">
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
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

export default ProductPage;
