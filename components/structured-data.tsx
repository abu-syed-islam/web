import { COMPANY_NAME, SITE_DESCRIPTION, CONTACT_EMAIL, SOCIAL_MEDIA } from "@/constants/company";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com";

export function OrganizationStructuredData() {
  const sameAs = Object.values(SOCIAL_MEDIA).filter(
    (url) => url && !url.includes("yourpage") && !url.includes("yourcompany") && !url.includes("yourchannel") && !url.includes("yourhandle")
  );

  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY_NAME,
    description: SITE_DESCRIPTION,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    email: CONTACT_EMAIL,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    contactPoint: {
      "@type": "ContactPoint",
      email: CONTACT_EMAIL,
      contactType: "customer service",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: COMPANY_NAME,
    url: siteUrl,
    description: SITE_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: COMPANY_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BlogPostStructuredData({
  title,
  description,
  author,
  publishedAt,
  image,
  slug,
}: {
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  image?: string;
  slug: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description,
    image: image || `${siteUrl}/logo.png`,
    datePublished: publishedAt,
    dateModified: publishedAt,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: COMPANY_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
