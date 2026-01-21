import { COMPANY_NAME } from '@/constants/company';

export default function TermsPage() {
  return (
    <div className="pb-16 pt-12 md:pt-16">
      <div className="mx-auto w-full max-w-4xl px-6">
        <div className="mb-12 space-y-3">
          <p className="text-sm font-semibold text-primary">Terms of Service</p>
          <h1 className="text-4xl font-semibold tracking-tight">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using {COMPANY_NAME}'s website and services, you agree to be bound by these
              Terms of Service and all applicable laws and regulations. If you do not agree with any of these
              terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              {COMPANY_NAME} provides web development, design, and consulting services. The specific terms,
              deliverables, timelines, and pricing for each project will be outlined in a separate service
              agreement or statement of work (SOW).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Use License</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>
                Permission is granted to temporarily access and use our website for personal, non-commercial
                transitory viewing only. This is the grant of a license, not a transfer of title, and under this
                license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
              <p className="mt-2">
                This license shall automatically terminate if you violate any of these restrictions.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              The materials on our website, including but not limited to text, graphics, logos, icons, images,
              audio clips, and software, are the property of {COMPANY_NAME} or its content suppliers and are
              protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              Upon full payment for services, ownership of custom-developed code and design work will be
              transferred to the client as specified in the service agreement, subject to any retained rights
              for portfolio and marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Payment Terms</h2>
            <p className="text-muted-foreground mb-2">Payment terms will be specified in your service agreement. Generally:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Payment is due according to the schedule outlined in the service agreement</li>
              <li>Late payments may incur interest charges as specified in the agreement</li>
              <li>All fees are non-refundable unless otherwise stated</li>
              <li>We reserve the right to suspend services for overdue accounts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Project Deliverables and Timelines</h2>
            <p className="text-muted-foreground leading-relaxed">
              Project deliverables, milestones, and timelines will be clearly defined in the service agreement.
              While we strive to meet all deadlines, timelines are estimates and may be subject to change based
              on project scope adjustments, client feedback delays, or unforeseen circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Client Responsibilities</h2>
            <p className="text-muted-foreground mb-2">Clients are responsible for:</p>
            <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
              <li>Providing accurate and complete information necessary for project completion</li>
              <li>Timely review and feedback on deliverables</li>
              <li>Providing access to necessary accounts, systems, and resources</li>
              <li>Obtaining any required licenses or permissions for third-party content</li>
              <li>Making timely payments as outlined in the service agreement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Warranties and Disclaimers</h2>
            <p className="text-muted-foreground leading-relaxed">
              The materials on our website are provided on an 'as is' basis. {COMPANY_NAME} makes no warranties,
              expressed or implied, and hereby disclaims and negates all other warranties including, without
              limitation, implied warranties or conditions of merchantability, fitness for a particular purpose,
              or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall {COMPANY_NAME} or its suppliers be liable for any damages (including, without
              limitation, damages for loss of data or profit, or due to business interruption) arising out of
              the use or inability to use the materials on our website, even if {COMPANY_NAME} or an authorized
              representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              Either party may terminate a service agreement with written notice. Upon termination, payment is
              due for all work completed up to the termination date. Confidentiality and intellectual property
              provisions survive termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These terms and conditions are governed by and construed in accordance with applicable laws. Any
              disputes relating to these terms shall be subject to the exclusive jurisdiction of the courts in
              the jurisdiction specified in the service agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              {COMPANY_NAME} may revise these Terms of Service at any time without notice. By using this website
              and our services, you are agreeing to be bound by the then current version of these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at{' '}
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
