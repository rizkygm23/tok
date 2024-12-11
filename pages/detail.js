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
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [transactionData, setTransactionData] = useState({
    name: "",
    quantity: 1,
    size: "L",
    address: "",
    notes: "",
    email: "",
    phone: "",
    total: 0,
  });

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
      total: product.price * (name === "quantity" ? value : prev.quantity),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, quantity, size, address, notes, email, phone, total } =
      transactionData;

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
    window.location.href = whatsappUrl;
  };





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
          onClick={() => router.back()}
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
        <img onClick={() => router.push('/catalog')} alt={product.name} src='back-icon.png' className='w-12 h-12 bg-slate-100 hover:bg-slate-200 p-4 rounded-full' ></img>
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
        
          onClick={handleBuyNowClick}
          className="bg-[#374957] text-white py-4 col-span-3"
        >
          Buy
        </button>
      </div>


      {isPopupOpen && (
        <div className="fixed top-0 left-0 p-4 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-slate-100 p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Detail Pembelian</h2>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 text-[12px] text-gray-500"
            >
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
              <p className="font-bold">
                Total: {formatRupiah(transactionData.total)}
              </p>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-[#374957] text-white px-4 py-2 rounded"
                >
                  Kirim ke WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
