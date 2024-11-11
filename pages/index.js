import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import "../app/globals.css";

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      let { data, error } = await supabase.from('products').select('*');
      if (error) console.log("Error fetching products:", error);
      else setProducts(data);
    }
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Katalog Produk</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
 