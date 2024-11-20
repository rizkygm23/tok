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
    <div>

      <div className=" py-8 grid grid-cols-4 relative ">
      <div id='divNav' className="bg-slate-200 rounded  top-0 left-0 fixed w-64 rounded-tr-md rounded-br-md h-full">
        <div className="p-10 grid grid-cols-1 gap-8">
        <a className='font-bold hover:bg-slate-300 p-4 rounded-md' href="/admin">Admin</a>
        <a className='font-bold hover:bg-slate-300 p-4 rounded-md' href="/">Home</a>
        <a className='font-bold hover:bg-slate-300 p-4 rounded-md' href="/about">About</a>
        <a className='font-bold hover:bg-slate-300 p-4 rounded-md' href="/contact">Contact</a>
        </div>
      </div>
      <div className="col-span-1"></div>
      <div className="container mx-auto p-4 col-span-3">
      <h1 className="text-3xl font-bold mb-4">Katalog Produk</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
    </div>

    </div>
    
    
  );
}
 

