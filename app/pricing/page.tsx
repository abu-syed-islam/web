import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface PricingTier {
  name: string;
  description: string;
  price: string;
  period?: string;
  features: string[];
  popular?: boolean;
  cta: string;
  ctaLink: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    description: 'Perfect for small projects and startups',
    price: '$5,000',
    period: 'one-time',
    features: [
      'Basic website (up to 5 pages)',
      'Responsive design',
      'Content management system',
      'SEO optimization',
      '3 months of support',
      'Basic analytics setup',
    ],
    cta: 'Get Started',
    ctaLink: '/contact',
  },
  {
    name: 'Professional',
    description: 'Ideal for growing businesses',
    price: '$15,000',
    period: 'one-time',
    features: [
      'Custom web application',
      'Advanced design system',
      'User authentication',
      'Database integration',
      'API development',
      '6 months of support',
      'Performance optimization',
      'Advanced analytics',
    ],
    popular: true,
    cta: 'Get Started',
    ctaLink: '/contact',
  },
  {
    name: 'Enterprise',
    description: 'For large-scale projects and organizations',
    price: 'Custom',
    period: '',
    features: [
      'Complex web platform',
      'Scalable architecture',
      'Multi-user system',
      'Custom integrations',
      '24/7 monitoring',
      '12 months of support',
      'Dedicated team',
      'Ongoing maintenance',
      'Priority support',
    ],
    cta: 'Contact Us',
    ctaLink: '/contact',
  },
];

export default function PricingPage() {
  return (
    <div className="pb-16 pt-12 md:pt-16">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mb-12 text-center space-y-3">
          <p className="text-sm font-semibold text-primary">Pricing</p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Choose the right plan for you
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Transparent pricing for web development services. All plans include
            consultation and project planning.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative border-border/70 bg-card/80 transition hover:-translate-y-1 hover:shadow-lg ${
                tier.popular
                  ? 'border-primary/40 shadow-lg scale-105 md:scale-105'
                  : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="space-y-4 pb-6">
                <div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {tier.description}
                  </CardDescription>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.period && (
                      <span className="text-sm text-muted-foreground">
                        / {tier.period}
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="w-full"
                  variant={tier.popular ? 'default' : 'outline'}
                  size="lg"
                >
                  <Link href={tier.ctaLink}>{tier.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border bg-muted/40 p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold">
            Need a custom solution?
          </h3>
          <p className="mb-4 text-muted-foreground">
            We offer flexible pricing for custom projects. Contact us to discuss
            your specific requirements and get a tailored quote.
          </p>
          <Button asChild size="lg">
            <Link href="/contact">Get a Custom Quote</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
