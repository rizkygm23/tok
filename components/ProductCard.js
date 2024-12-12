import { useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "@/components/Fade";
import { formatRupiah } from "@/lib/format";

export default function ProductCard({ product, delay,  }) {
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

  return (
    <motion.div
      variants={fadeIn("up", delay)}
      initial={"hidden"}
      whileInView={"show"}
      viewport={{ once: true, amount: 0.01 }}
      className="border   shadow-md rounded-[16px] overflow-hidden text-black "
    >
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full h-32 object-cover "
      />
      <div className="p-2 bg-slate-100 h-full min-h[164px]">
        <h2 className="text-[12px] md:text-[16px] font-light  line-clamp-2 ">
          {product.name}
        </h2>
        <p
          className="font-bold text-[14px] mt-1 overflow-hidden text-ellipsis line-clamp-2 
             whitespace-normal -webkit-box -webkit-line-clamp-2 -webkit-box-orient-vertical"
        >
          {formatRupiah(product.price)}
        </p>
        <p className="text-gray-500 mt-2 text-xs bg-[#586c7b] bg-opacity-10 w-fit px-2 py-1 rounded">
          {product.category}
        </p>
        <div className="grid grid-cols-3 gap-1 sm:gap-3  text-[12px] sm:text-sm  font-normal">
          <button
            onClick={handleBuyNowClick}
            className="bg-[#374957] col-span-2 hover:scale-1 ease-in-out duration-[20000] px-2 py-2 rounded-lg mt-1 hover:bg-[#586c7b] text-slate-200 w-full "
          >
            Order
          </button>
          <a
            id="detail"
            href={`/detail?id=${product.id}`}
            className="w-full mt-1 bg-slate-200 hover:bg-slate-100 rounded-lg items-center justify-center flex"
          >
            <button className="">
              <img
                className="w-6  h-6 mx-auto my-auto"
                src="/detail-icon.png"
              ></img>
            </button>
          </a>
        </div>
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
    </motion.div>
  );
}
