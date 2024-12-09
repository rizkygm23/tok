import { useState } from 'react';

export default function TransactionForm({ product }) {
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
      total: product.price * (name === 'quantity' ? value : prev.quantity),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, quantity, size, address, notes, email, phone, total } = transactionData;

    // Format pesan WhatsApp
    const message = `
Halo, saya ingin memesan produk berikut:

Nama Produk: ${product.name}
Jumlah: ${quantity}
Ukuran: ${size}
Harga Satuan: ${formatRupiah(product.price)}
Total Harga: ${formatRupiah(total)}

Informasi Pemesan:
Nama: ${name}
Email: ${email}
Telepon: ${phone}
Alamat: ${address}
Catatan: ${notes}
    `;

    const whatsappUrl = `https://wa.me/6281218582747?text=${encodeURIComponent(
      message
    )}`;

    // Redirect ke WhatsApp
    window.open(whatsappUrl, '_blank');
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
        max={product.stock} 
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
      <div className="col-span-2">
        <p className="font-bold mt-3">
          Total: {formatRupiah(transactionData.total)}
        </p>
        <button type="submit" target="_blank" className="bg-[#374957] mt-1 w-full text-white px-4 py-4 rounded">
          Konfirmasi
        </button>
      </div>
    </form>
  );
}
