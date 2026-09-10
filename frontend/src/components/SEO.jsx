import { useEffect } from 'react';

const SITE_URL = 'https://yourcollege.in';
const SITE_NAME = 'Your College';

export default function SEO({
  title,
  description,
  path = '/',
  noindex = false,
  jsonLd = null,
}) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : `${SITE_NAME} - Find the Right College for Your Future`;

    document.title = fullTitle;

    const setMeta = (selector, attributes) => {
      let element = document.head.querySelector(selector);

      if (!element) {
        element = document.createElement('meta');

        Object.entries(attributes).forEach(([key, value]) => {
          element.setAttribute(key, value);
        });

        document.head.appendChild(element);
      } else if (attributes.content) {
        element.setAttribute('content', attributes.content);
      }
    };

    const setLink = (rel, href) => {
      let element = document.head.querySelector(`link[rel="${rel}"]`);

      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }

      element.setAttribute('href', href);
    };

    const canonicalUrl = `${SITE_URL}${path}`;

    setMeta('meta[name="description"]', {
      name: 'description',
      content: description,
    });

    setMeta('meta[name="robots"]', {
      name: 'robots',
      content: noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large',
    });

    setMeta('meta[name="googlebot"]', {
      name: 'googlebot',
      content: noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large',
    });

    setMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: fullTitle,
    });

    setMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: description,
    });

    setMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: 'website',
    });

    setMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: canonicalUrl,
    });

    setMeta('meta[property="og:site_name"]', {
      property: 'og:site_name',
      content: SITE_NAME,
    });

    setMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary',
    });

    setMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: fullTitle,
    });

    setMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description,
    });

    setLink('canonical', canonicalUrl);

    // Remove previous JSON-LD created by this component
    const oldSchema = document.head.querySelector(
      'script[data-seo-jsonld="true"]'
    );

    if (oldSchema) {
      oldSchema.remove();
    }

    if (jsonLd) {
      const script = document.createElement('script');

      script.type = 'application/ld+json';
      script.setAttribute('data-seo-jsonld', 'true');
      script.textContent = JSON.stringify(jsonLd);

      document.head.appendChild(script);
    }

    return () => {
      const schema = document.head.querySelector(
        'script[data-seo-jsonld="true"]'
      );

      if (schema) {
        schema.remove();
      }
    };
  }, [title, description, path, noindex, jsonLd]);

  return null;
}