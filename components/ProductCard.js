import { useState } from 'react';
import { supabase } from '../lib/supabase';
// import popUpformTransaksi from './PopUpForm';


export default function ProductCard({ product }) {
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
      total: product.price, // Set initial total (harga * jumlah)
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

  return (
    <div className="border   shadow-md rounded-[16px]">
      <img src={product.image_url} alt={product.name} className="w-full h-32 object-cover mb-2" />
      <div className='p-2'>
      <h2 className="text-[12px] font-light  line-clamp-2 ">{product.name}</h2>
      <p className="font-bold text-[14px] mt-1 overflow-hidden text-ellipsis line-clamp-2 
             whitespace-normal -webkit-box -webkit-line-clamp-2 -webkit-box-orient-vertical">{formatRupiah(product.price)}</p>
      <p className="text-gray-500 mt-2 text-xs bg-[#586c7b] bg-opacity-10 w-fit px-2 py-1 rounded">{product.category}</p>
      <div className="grid grid-cols-3 gap-1 sm:gap-3  text-[12px] sm:text-sm  font-normal">
 
        <button
          onClick={handleBuyNowClick}
          className="bg-[#374957] col-span-2 px-2 py-2 rounded-lg mt-1 hover:bg-[#586c7b] text-slate-200 w-full "
        >
          Order
        </button>
        <a id='detail' href={`/detail?id=${product.id}`} className='w-full mt-1 bg-slate-200 hover:bg-slate-100 rounded-lg items-center justify-center flex'>
          <button className=''>
            <img className='w-6 h-6 mx-auto my-auto' src='/detail-icon.png'></img>
          </button>
        </a>
        {/* <button className="bg-transparent border-2 border-[#374957]  px-3 py-2 rounded-lg mt-2 hover:bg-[#374957] hover:text-slate-200">
          Detail
        </button> */}
      </div>

      </div>

      {/* Popup untuk form pembelian */}
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
