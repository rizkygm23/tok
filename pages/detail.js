import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TransactionForm from '../components/TransaksiForm';
import inventory from '../data/inventory';
import "../app/globals.css";

export default function DetailPage() {
  const router = useRouter();
  const { id } = router.query; // Ambil ID produk dari query string
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Cari produk berdasarkan ID dari inventory.js
      const productData = inventory.find((item) => item.id === parseInt(id));
      setProduct(productData);
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

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

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(angka);
  };

  return (
    <div className="container mx-auto lg:p-44">
      <div className='w-full hidden md:block h-fit  top-10 left-10 sticky rounded-full  p-2 '>
        <img onClick={() => router.push('/')} alt={product.name} src='back-icon.png' className='w-12 h-12 bg-slate-100 hover:bg-slate-200 p-4 rounded-full' ></img>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Gambar produk */}
        <div className="px-4">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover rounded shadow"
          />
        </div>

        {/* Detail produk dan form pembelian */}
        <div>
          <div className="px-4">
            <h1 className="text-xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-700 text-sm">Kategori: {product.category}</p>
            <p className="text-xl font-bold my-2">{formatRupiah(product.price)}</p>
            <p className="text-gray-500 text-sm">Stok: {product.stock}</p>
          </div>
          <TransactionForm product={product} />
        </div>
        <p className="text-gray-700 text-sm md:text-base mb-4 md:col-span-2 px-4 pb-[70px]">
          {product.description}
        </p>
      </div>
      <div className="fixed bottom-0 right-0 grid grid-cols-5 w-full md:hidden">
        <button
          onClick={() => router.back()}
          className="bg-white border-2 border-[#374957] text-[#374957] col-span-2 py-4"
        >
          Back
        </button>
        <button
          onClick={() => router.push(`/buy?id=${id}`)}
          className="bg-[#374957] text-white py-4 col-span-3"
        >
          Buy
        </button>
      </div>
    </div>
  );
}
