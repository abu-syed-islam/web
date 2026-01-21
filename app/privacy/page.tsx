import { COMPANY_NAME } from '@/constants/company';

export default function PrivacyPage() {
  return (
    <div className="pb-16 pt-12 md:pt-16">
      <div className="mx-auto w-full max-w-4xl px-6">
        <div className="mb-12 space-y-3">
          <p className="text-sm font-semibold text-primary">Privacy Policy</p>
          <h1 className="text-4xl font-semibold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              {COMPANY_NAME} ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you visit our website
              and use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Personal Information</h3>
                <p>We may collect personal information that you provide directly to us, including:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Company name and job title</li>
                  <li>Project details and requirements</li>
                  <li>Any other information you choose to provide</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Automatically Collected Information</h3>
                <p>When you visit our website, we may automatically collect:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>IP address</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Referral source</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground mb-2">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Provide, maintain, and improve our services</li>
              <li>Respond to your inquiries and communicate with you</li>
              <li>Send you updates, newsletters, and marketing communications (with your consent)</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Detect, prevent, and address technical issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Sharing and Disclosure</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share your
              information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
              <li>With service providers who assist us in operating our website and conducting our business</li>
              <li>When required by law or to protect our rights and safety</li>
              <li>In connection with a merger, acquisition, or sale of assets (with notice to users)</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction. However, no method
              of transmission over the internet or electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-muted-foreground mb-2">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Access and receive a copy of your personal information</li>
              <li>Rectify inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to or restrict processing of your information</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website uses cookies to enhance your experience. You can set your browser to refuse cookies,
              but some features of our website may not function properly as a result.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting
              the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="/contact" className="text-primary hover:underline">
                our contact page
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
