import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function TransactionForm({ product, onSuccess }) {
  const [transactionData, setTransactionData] = useState({
    name: '',
    quantity: 1,
    size: 'L',
    address: '',
    notes: '',
    email: '',
    phone: '',
    total: product ? product.price : 0,
  });

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(angka);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransactionData((prev) => ({
      ...prev,
      [name]: value,
      total: product.price * (name === 'quantity' ? value : prev.quantity), // Update total jika jumlah berubah
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, quantity, size, address, notes, email, phone, total } = transactionData;

    // Buat orderId yang unik untuk setiap transaksi
    const orderId = `ORDER-${new Date().getTime()}`;

    try {
      const { error } = await supabase.from('transaction').insert([
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
        console.error('Error creating transaction:', error);
        alert('Gagal membuat transaksi. Silakan coba lagi.');
        return;
      }

      alert('Transaksi berhasil dibuat!');
      if (onSuccess) {
        onSuccess(); // Callback setelah transaksi berhasil
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Terjadi kesalahan saat membuat transaksi.');
    }
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
    <form onSubmit={handleSubmit} className="p-4 hidden md:grid grid-cols-2 gap-2">
      <input
        type="text"
        name="name"
        placeholder="Nama Anda"
        value={transactionData.name}
        onChange={handleInputChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="email"
        placeholder="Email"
        value={transactionData.email}
        onChange={handleInputChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="phone"
        placeholder="Nomor Telepon"
        value={transactionData.phone}
        onChange={handleInputChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        name="quantity"
        placeholder="Jumlah"
        value={transactionData.quantity}
        onChange={handleInputChange}
        required
        className="w-full p-2 border rounded"
        min="1"
        max={product.stock} // Batasi jumlah berdasarkan stok
      />
      <select
        name="size"
        value={transactionData.size}
        onChange={handleInputChange}
        required
        className="w-full p-2 border rounded"
      >
        <option value="L">L</option>
        <option value="XL">XL</option>
        <option value="XXL">XXL</option>
        <option value="XXXL">XXXL</option>
      </select>
      <textarea
        type="text"
        name="address"
        placeholder="Alamat"
        value={transactionData.address}
        onChange={handleInputChange}
        required
        className="w-full col-span-2 p-2 border rounded"
      />
      <textarea
        name="notes"
        placeholder="Catatan"
        value={transactionData.notes}
        onChange={handleInputChange}
        className="w-full p-2 border rounded col-span-2"
      ></textarea>
      <div className='col-span-2'>
      <p className="font-bold mt-3">Total: {formatRupiah(transactionData.total)}</p>
      <button type="submit" className="bg-[#374957] mt-1 w-full  text-white px-4 py-4 rounded">
        Konfirmasi
      </button>
      </div>

    </form>
  );
}
