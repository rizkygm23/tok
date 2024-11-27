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
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [transactionData, setTransactionData] = useState({
    name: '',
    quantity: 1,
    size: 'L',
    address: '',
    notes: '',
    email: '',
    phone: '',
    total: 0,
  });

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
  

  const handleBuyNowClick = () => {
    setIsPopupOpen(true);
    setTransactionData({
      ...transactionData,
      total: product.price, 
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransactionData((prev) => ({
      ...prev,
      [name]: value,
      total: product.price * (name === 'quantity' ? value : prev.quantity), // Update total
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, quantity, size, address, notes, email, phone, total } = transactionData;

    // Buat orderId yang unik untuk setiap transaksi
    const orderId = `ORDER-${new Date().getTime()}`;

    // Simpan transaksi ke database Supabase dengan status 'pending'
    try {
      const { data, error } = await supabase.from('transaction').insert([
        {
          order_id: orderId,
          product_id: product.id,
          name: name,
          email: email,
          phone: phone,
          quantity: quantity,
          size: size,
          address: address,
          notes: notes,
          total_amount: total,
          status: 'pending',
          
        },
      ]);
        

      if (error) {
        console.error('Error inserting transaction:', error.message, error.details);
        alert('Gagal membuat pesanan, coba lagi.');
        return;
      }
    } catch (error) {
      console.error('Unexpected error when inserting transaction:', error);
      alert('Terjadi kesalahan saat membuat pesanan, coba lagi.');
      return;
    }
    try {
      const { data: productData } = await supabase
        .from('products')
        .select('stock')
        .eq('id', product.id)
        .single();

      if (!productData) {
        throw new Error('Product not found');
      }

      const newStock = productData.stock - quantity;
      await supabase.from('products').update({ stock: newStock }).eq('id', product.id);
    } catch (error) {
      console.error('Error updating stock:', error);
    }
    // Panggil API backend untuk membuat transaksi di Midtrans
    const transactionPayload = {
      orderId: orderId, // Gunakan orderId yang sama
      grossAmount: total,
      customerDetails: {
        first_name: name,
        email: email,
        phone: phone,
      },
    };

    try {
      const response = await fetch('/api/create-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to create Midtrans transaction');
      }

      const responseData = await response.json();
      if (responseData.redirectUrl) {
        // Arahkan user ke halaman pembayaran Midtrans
        
        
        window.location.href =(responseData.redirectUrl);
        

        ;
      } else {
        throw new Error('Invalid Midtrans response');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Terjadi kesalahan saat memproses pembayaran, coba lagi.');
    }
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

            <p className="text-gray-700 text-sm md:text-base mb-4 md:col-span-2 px-4 pb-[70px]">{product.description}</p>
            
            
      </div>
<div className="fixed bottom-0 right-0 grid grid-cols-5 w-full md:hidden">
    <button onClick={() => router.back()} className="bg-white border-2 border-[#374957]  text-[#374957]  col-span-2 py-4 ">Back</button>
    <button onClick={handleBuyNowClick} className="bg-[#374957] text-white  py-4 col-span-3  ">Buy</button>
</div>


      {isPopupOpen && (
        // <div><popUpformTransaksi/></div>
        
        <div className="fixed top-0 left-0 p-4 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-slate-100 p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Detail Pembelian</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-[12px] text-gray-500">
              <input
                type="text"
                name="name"
                placeholder="Nama Anda"
                value={transactionData.name}
                onChange={handleInputChange}
                required
                className="w-full p-2 border-b-[1px]  border-gray-300 rounded"
              />
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={transactionData.email}
                onChange={handleInputChange}
                required
                className="w-full p-2  border-b-[1px]  border-gray-300 rounded"
              />
              <input
                type="text"
                name="phone"
                placeholder="Nomor Telepon"
                value={transactionData.phone}
                onChange={handleInputChange}
                required
                className="w-full p-2  border-b-[1px]  border-gray-300 rounded"
              />
              <input
                type="number"
                name="quantity"
                placeholder="Jumlah"
                value={transactionData.quantity}
                onChange={handleInputChange}
                required
                className="w-full p-2  border-b-[1px]  border-gray-300 rounded"
                min="1"
              />
              <select
                name="size"
                value={transactionData.size}
                onChange={handleInputChange}
                required
                className="w-full p-2  border-b-[1px]  border-gray-300 rounded"
              >
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="XXXL">XXXL</option>
              </select>
              <input
                type="text"
                name="address"
                placeholder="Alamat"
                value={transactionData.address}
                onChange={handleInputChange}
                required
                className="w-full p-2  border-b-[1px]  border-gray-300 rounded"
              />
              <textarea
                name="notes"
                placeholder="Catatan"
                value={transactionData.notes}
                onChange={handleInputChange}
                className="w-full p-2  border-b-[1px]  border-gray-300 rounded"
              ></textarea>
              <p className="font-bold">Total: Rp{transactionData.total}</p>
              <div className="flex justify-between">
                <button type="button" onClick={() => setIsPopupOpen(false)} className="bg-red-600 text-white px-4 py-2 rounded">
                  Batal
                </button>
                <button type="submit" className="bg-[#374957] text-white px-4 py-2 rounded">
                  Konfirmasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
