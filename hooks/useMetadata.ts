import { useEffect, useCallback } from 'react';

interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

interface OpenGraph {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
}

interface Twitter {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  image?: string;
}

interface UseMetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  openGraph?: OpenGraph;
  twitter?: Twitter;
  additionalTags?: MetaTag[];
}

function setMetaTag(tag: MetaTag): void {
  const { name, property, content } = tag;
  const selector = name
    ? `meta[name="${name}"]`
    : `meta[property="${property}"]`;

  let element = document.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    if (name) {
      element.setAttribute('name', name);
    }
    if (property) {
      element.setAttribute('property', property);
    }
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function removeMetaTag(tag: MetaTag): void {
  const { name, property } = tag;
  const selector = name
    ? `meta[name="${name}"]`
    : `meta[property="${property}"]`;

  const element = document.querySelector(selector);
  if (element) {
    element.remove();
  }
}

export default function useMetadata({
  title,
  description,
  keywords,
  author,
  openGraph,
  twitter,
  additionalTags = [],
}: UseMetadataOptions = {}): void {
  const updateMetadata = useCallback(() => {
    if (typeof document === 'undefined') {
      return;
    }

    // Basic metadata
    if (title) {
      document.title = title;
      setMetaTag({ property: 'og:title', content: title });
      setMetaTag({ name: 'twitter:title', content: title });
    }

    if (description) {
      setMetaTag({ name: 'description', content: description });
      setMetaTag({ property: 'og:description', content: description });
      setMetaTag({ name: 'twitter:description', content: description });
    }

    if (keywords?.length) {
      setMetaTag({ name: 'keywords', content: keywords.join(', ') });
    }

    if (author) {
      setMetaTag({ name: 'author', content: author });
    }

    // Open Graph metadata
    if (openGraph) {
      if (openGraph.type) {
        setMetaTag({ property: 'og:type', content: openGraph.type });
      }
      if (openGraph.url) {
        setMetaTag({ property: 'og:url', content: openGraph.url });
      }
      if (openGraph.image) {
        setMetaTag({ property: 'og:image', content: openGraph.image });
      }
      if (openGraph.siteName) {
        setMetaTag({ property: 'og:site_name', content: openGraph.siteName });
      }
    }

    // Twitter metadata
    if (twitter) {
      if (twitter.card) {
        setMetaTag({ name: 'twitter:card', content: twitter.card });
      }
      if (twitter.site) {
        setMetaTag({ name: 'twitter:site', content: twitter.site });
      }
      if (twitter.creator) {
        setMetaTag({ name: 'twitter:creator', content: twitter.creator });
      }
      if (twitter.image) {
        setMetaTag({ name: 'twitter:image', content: twitter.image });
      }
    }

    // Additional custom tags
    additionalTags.forEach(tag => {
      setMetaTag(tag);
    });
  }, [
    title,
    description,
    keywords,
    author,
    openGraph,
    twitter,
    additionalTags,
  ]);

  useEffect(() => {
    updateMetadata();

    // Cleanup function to remove meta tags when component unmounts
    return () => {
      if (typeof document === 'undefined') {
        return;
      }

      if (description) {
        removeMetaTag({ name: 'description', content: '' });
        removeMetaTag({ property: 'og:description', content: '' });
        removeMetaTag({ name: 'twitter:description', content: '' });
      }

      if (keywords?.length) {
        removeMetaTag({ name: 'keywords', content: '' });
      }

      if (author) {
        removeMetaTag({ name: 'author', content: '' });
      }

      // Remove Open Graph tags
      if (openGraph) {
        removeMetaTag({ property: 'og:title', content: '' });
        removeMetaTag({ property: 'og:type', content: '' });
        removeMetaTag({ property: 'og:url', content: '' });
        removeMetaTag({ property: 'og:image', content: '' });
        removeMetaTag({ property: 'og:site_name', content: '' });
      }

      // Remove Twitter tags
      if (twitter) {
        removeMetaTag({ name: 'twitter:card', content: '' });
        removeMetaTag({ name: 'twitter:site', content: '' });
        removeMetaTag({ name: 'twitter:creator', content: '' });
        removeMetaTag({ name: 'twitter:title', content: '' });
        removeMetaTag({ name: 'twitter:image', content: '' });
      }

      // Remove additional custom tags
      additionalTags.forEach(tag => {
        removeMetaTag(tag);
      });
    };
  }, [
    updateMetadata,
    description,
    keywords,
    author,
    openGraph,
    twitter,
    additionalTags,
  ]);
}

// Example usage:
// function ProductPage({ product }) {
//   useMetadata({
//     title: `${product.name} | My Store`,
//     description: product.description,
//     keywords: ['product', 'store', product.category],
//     author: 'Store Name',
//     openGraph: {
//       title: product.name,
//       description: product.description,
//       image: product.imageUrl,
//       type: 'product',
//       siteName: 'My Store',
//     },
//     twitter: {
//       card: 'summary_large_image',
//       site: '@mystore',
//       creator: '@author',
//       title: product.name,
//       description: product.description,
//       image: product.imageUrl,
//     },
//     additionalTags: [
//       { name: 'price', content: product.price.toString() },
//       { name: 'availability', content: product.inStock ? 'in stock' : 'out of stock' },
//     ],
//   });
//
//   return (
//     <div>
//       <h1>{product.name}</h1>
//       {/* Rest of the product page */}
//     </div>
//   );
// } 