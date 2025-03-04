import { useEffect, useRef } from 'react';

interface UseDocumentTitleOptions {
  restoreOnUnmount?: boolean;
}

export default function useDocumentTitle(
  title: string,
  { restoreOnUnmount = false }: UseDocumentTitleOptions = {}
): void {
  const previousTitle = useRef<string | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    // Store the previous title if we haven't already
    if (previousTitle.current === null) {
      previousTitle.current = document.title;
    }

    // Update the document title
    document.title = title;

    // Restore the previous title on unmount if requested
    return () => {
      if (restoreOnUnmount && previousTitle.current !== null) {
        document.title = previousTitle.current;
      }
    };
  }, [title, restoreOnUnmount]);
}

// Example usage:
// function HomePage() {
//   useDocumentTitle('Home | My App');
//   return <div>Home Page</div>;
// }
//
// function ProductPage({ product }) {
//   useDocumentTitle(`${product.name} | My App`, { restoreOnUnmount: true });
//   return <div>Product: {product.name}</div>;
// }
//
// function BlogPost({ post }) {
//   useDocumentTitle(`${post.title} - Blog | My App`, { restoreOnUnmount: true });
//   return <div>{post.content}</div>;
// } 