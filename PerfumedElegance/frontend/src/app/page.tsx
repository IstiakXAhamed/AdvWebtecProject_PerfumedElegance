import ProductCard from '@/components/ProductCard';
import api from '@/lib/axios'; 


// 1. Define the Product structure matching our backend entity
interface Brand {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  brand?: Brand;
}

// 2. Fetch products using our global Axios instance
async function getProducts(): Promise<Product[]> {
  try {
    // Axios handles base URL and JSON parsing automatically!
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products from backend:', error);
    return []; // Return empty array if backend is down, so the site doesn't crash
  }
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="bg-base-100 min-h-screen pb-20">
      {/* SECTION 1: The Editorial Hero Banner */}
      <section className="border-b border-base-300 py-12 px-6 bg-base-200">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-base-content/60 font-semibold mb-4">
           
            Established 2026
         
          </span>
          <h1 className="text-2xl md:text-4xl font-light tracking-widest uppercase mb-3 leading-tight">
           
            Elegance In Every Bottle
        
          </h1>
          <p className="max-w-xl text-sm md:text-base text-base-content/75 font-light tracking-wide leading-relaxed mb-4">
            
            Experience our highly curated, signature catalog of modern niche fragrances.
            Hand-crafted botanical blends formulated for the sophisticated mind.
        
          </p>
          <div className="w-12 h-[1px] bg-base-content/40"></div>
        </div>
      </section>

      
      {/* SECTION 2: The Fragrance Catalog Grid */}
      <section className="max-w-7xl mx-auto px-6 mt-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-baseline justify-between border-b border-base-300 pb-4 mb-10">
          <h2 className="text-2xl font-medium tracking-wider uppercase">
            
            The Signature Collection

          </h2>
          <span className="text-xs uppercase tracking-widest text-base-content/60 mt-1 md:mt-0 font-medium">
            
            Showing {products.length} Fragrances

          </span>
        </div>

        
        {/* Dynamic Catalog Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Graceful Fallback if database is empty or offline */
          <div className="text-center py-20 border border-dashed border-base-300 bg-base-200/50">
            <h3 className="text-lg font-medium tracking-wide mb-2">
              Our shelves are currently empty
            </h3>
            <p className="text-sm text-base-content/60 max-w-sm mx-auto font-light leading-relaxed">
              We are hand-bottling our next batch of fragrances. Please check back shortly, 
              or log in as an administrator to populate our catalog!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
