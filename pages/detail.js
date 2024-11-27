import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TransactionForm from '../components/TransaksiForm';
import { supabase } from '../lib/supabase';
import"../app/globals.css";
import ProductCard from '@/components/ProductCard';

export default function DetailPage() {
  const router = useRouter();
  const { id } = router.query; // Ambil ID produk dari query string
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Fungsi untuk mendapatkan detail produk berdasarkan ID
      const fetchProduct = async () => {
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single(); // Ambil data produk tunggal

          if (error) {
            console.error('Error fetching product:', error.message);
          } else {
            setProduct(data);
          }
        } catch (error) {
          console.error('Unexpected error:', error);
        } finally {
          setIsLoading(false); // Hentikan loading
        }
      };

      fetchProduct();
    }
  }, [id]);

  if (isLoading) {
    return <div className="text-center mt-20">Loading...</div>;
  }
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(angka);
  };

  if (!product) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-2xl font-bold">Produk tidak ditemukan</h1>
        <button
          onClick={() => router.push('/')}
          className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
        >
          Kembali ke Home
        </button>
      </div>
    );

  }

  return (
    <div className="container mx-auto lg:p-44">
    
    
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Gambar produk */}
        <div className='px-4'>
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full p h-fullobject-cover rounded shadow"
        />
        </div>
       

        
       

        {/* Detail produk dan form pembelian */}
        <div>
        <div className='px-4'>
            <h1 className="text-xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-700 text-sm">Kategori: {product.category}</p>
          <p className="text-xl font-bold my-2">{formatRupiah(product.price)}</p>
          
          <p className="text-gray-500 text-sm">Stok: {product.stock}</p>
            </div>
            <TransactionForm
                product={product}
            // Redirect setelah transaksi sukses
            />
            </div>

            <p className="text-gray-700 mb-4 md:col-span-2 px-4">{product.description}</p>
            <button onClick={() => router.back()} className="bg-blue-500 text-white px-4 py-2 mt-4 rounded">Back</button>
      </div>
    </div>
  );
}
