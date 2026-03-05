
import React from 'react';
import { Helmet } from 'react-helmet';
import { Zap, Heart, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PageTransition from '@/components/PageTransition.jsx';

function AboutPage() {
  const values = [
    {
      icon: Zap,
      title: 'Innovation First',
      description: 'We constantly push boundaries to create cutting-edge digital products that set new industry standards.'
    },
    {
      icon: Heart,
      title: 'Quality Obsessed',
      description: 'Every product is meticulously crafted with attention to detail, ensuring premium quality in every pixel.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'We listen to our users and build products based on real needs and feedback from the design community.'
    },
    {
      icon: Award,
      title: 'Excellence Always',
      description: 'We never compromise on quality. Our commitment to excellence is reflected in everything we create.'
    }
  ];

  const metrics = [
    { value: '10K+', label: 'Happy Customers' },
    { value: '50+', label: 'Premium Products' },
    { value: '4.9/5', label: 'Average Rating' },
    { value: '24/7', label: 'Support Available' }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition>
      <Helmet>
        <title>About Us | RiseHub</title>
        <meta name="description" content="Learn about RiseHub's mission to provide premium digital products for designers and developers. Discover our values, story, and commitment to excellence." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Empowering Creators with Premium Digital Products
              </h1>
              <p className="text-xl text-muted-foreground">
                We believe great design should be accessible to everyone. That's why we create high-quality digital products that help designers and developers bring their visions to life.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  At RiseHub, we're on a mission to democratize design excellence. We create premium digital products that empower designers and developers to work faster, smarter, and more creatively. Every template, kit, and course we produce is crafted with meticulous attention to detail and a deep understanding of modern design workflows.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12"
              >
                <h3 className="text-2xl font-bold mb-4">Why We Do What We Do</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We've been in your shoes. We know the frustration of starting from scratch, the time wasted on repetitive tasks, and the challenge of maintaining consistency across projects. That's why we created RiseHub—to give you the tools and resources you need to focus on what matters most: creating amazing experiences.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our products aren't just files—they're carefully crafted solutions designed to solve real problems and accelerate your creative process.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                These core principles guide everything we do and every product we create
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {values.map((value, index) => (
                <motion.div key={index} variants={item}>
                  <Card className="h-full text-center hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <value.icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle>{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{value.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Trusted by Thousands</h2>
              <p className="text-muted-foreground text-lg">
                Join a growing community of designers and developers
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {metric.value}
                  </div>
                  <div className="text-muted-foreground">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-4xl font-bold mb-6">Built by Designers, for Designers</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our team consists of experienced designers, developers, and educators who are passionate about creating tools that make a real difference in your workflow. We use our own products daily, ensuring they meet the highest standards of quality and usability.
              </p>
              <p className="text-lg text-muted-foreground">
                Every product we release is battle-tested in real-world projects and refined based on feedback from our community of thousands of users worldwide.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

export default AboutPage;
