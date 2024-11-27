import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import "../app/globals.css";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false); // Untuk dropdown kategori
  const [activeCategory, setActiveCategory] = useState(null); // Kategori aktif
  const [searchQuery, setSearchQuery] = useState(''); // Query pencarian

  // Fungsi untuk mengambil produk
  const fetchProducts = async (category = null, search = '') => {
    let query = supabase.from('products').select('*');
    if (category) {
      query = query.eq('category', category); // Filter berdasarkan kategori
    }
    if (search) {
      query = query.ilike('name', `%${search}%`); // Pencarian berdasarkan nama produk
    }

    const { data, error } = await query;
    if (error) {
      console.log('Error fetching products:', error);
    } else {
      setProducts(data);
    }
  };

  // Ambil semua produk saat halaman pertama kali dimuat
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fungsi untuk menangani klik kategori
  const handleCategoryClick = (category) => {
    setActiveCategory(category); // Set kategori aktif
    fetchProducts(category); // Ambil produk berdasarkan kategori
    setIsCategoryOpen(false); // Tutup dropdown
  };

  // Fungsi untuk menangani pencarian
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(activeCategory, searchQuery); // Ambil produk berdasarkan kategori dan pencarian
  };

  return (
    <div className="grid grid-cols-12 h-screen">
      
      {/* Sidebar */}
      <div className="bg-slate-100 overflow-hidden  col-span-2 lg:col-span-2 p-4 rounded-tr-md rounded-br-md w-full h-full">
        <nav className="grid grid-cols-1 gap-10 text-[#374957] text-sm"
        >
          {/* Home */}
          <a
            className="grid grid-cols-1 hover:text-slate-900 md:grid-cols-3 font-bold hover:bg-slate-300 ease-in-out duration-[20000] md:px-4 md:py-4 rounded-md md:pr-7"
            href="/"
          >
            <img src="/home.png" alt="Home" className="w-5 h-5 mx-auto" />
            <h2 className="hidden md:block my-auto col-span-2">Home</h2>
          </a>

          {/* Dropdown Kategori */}
          <div
            className="relative grid grid-cols-1 md:grid-cols-3 hover:text-slate-900 font-bold hover:bg-slate-300 md:px-4 md:py-4 rounded-md md:pr-7 cursor-pointer"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
            <img src="/categori.png" alt="Category" className="w-5 h-5 mx-auto" />
            <h2 className="hidden md:block my-auto col-span-2">Category</h2>

            {isCategoryOpen && (
              <div className="absolute left-0 top-full mt-2 bg-white shadow-md rounded w-fit md:w-full z-10">
                <a
                  onClick={() => handleCategoryClick('Tshirt')}
                  className="block p-2 hover:bg-slate-100 cursor-pointer"
                >
                  Tshirt
                </a>
                <a
                  onClick={() => handleCategoryClick('Kemeja')}
                  className="block p-2 hover:bg-slate-100 cursor-pointer"
                >
                  Kemeja
                </a>
                <a
                  onClick={() => handleCategoryClick('Hoodie')}
                  className="block p-2 hover:bg-slate-100 cursor-pointer"
                >
                  Hoodie
                </a>
                <a
                  onClick={() => handleCategoryClick('Pants')}
                  className="block p-2 hover:bg-slate-100 cursor-pointer"
                >
                  Pants
                </a>
              </div>
            )}
          </div>

          {/* Kebijakan */}
          <a
            className="grid grid-cols-1 md:grid-cols-3 hover:text-slate-900 font-bold hover:bg-slate-300 md:px-4 md:py-4 rounded-md md:pr-7"
            href="/policy"
          >
            <img src="/kebijakan.png" alt="Policy" className="w-5 h-5 mx-auto" />
            <h2 className="hidden md:block my-auto col-span-2">Kebijakan</h2>
          </a>

          {/* FAQ */}
          <a
            className="grid grid-cols-1 md:grid-cols-3 font-bold hover:bg-slate-300 hover:text-slate-900 md:px-4 md:py-4 rounded-md md:pr-7"
            href="/faq"
          >
            <img src="/faq.png" alt="FAQ" className="w-5 h-5 mx-auto" />
            <h2 className="hidden md:block my-auto col-span-2">FAQ</h2>
          </a>
        </nav>
      </div>

      {/* Konten Utama */}
      <main className="
        col-span-10 md:col-span-9 bg-slate-200 lg:col-span-10 p-4">
        {/* Search Bar */}
        <div className="fixed bottom-8 md:hidden left-1/2 transform -translate-x-1/2  px-6 text-sm rounded z-50 w-full max-w-lg md:bottom-[20%] md:left-auto md:translate-x-0 md:right-8">
          <form onSubmit={handleSearch} className="grid grid-cols-5 gap-2 w-full p-2 bg-transparent backdrop-blur-sm bg-opacity-80 rounded-[14px] border border-gray-300">
            <input
              type="text"
              placeholder="Search product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="col-span-4  p-3 border border-gray-300 rounded-md focus:outline-none"
            />
            <button
              type="submit"
              className="bg-slate-200 col-span-1 text-white px-4 py-2 rounded-md hover:bg-[#374957] focus:outline-none"
            > <img src="/search.png" alt="Search" className="w-5 mx-auto" />
              
            </button>
          </form>
        </div>


        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-screen-lg mx-auto mt-4  sm:px-7">
                  {/* Product List */}
        <h1 className="text-2xl font-bold mb-4 col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5">
          {activeCategory ? `Category: ${activeCategory}` : 'All Product'}
        </h1>
        <form onSubmit={handleSearch} className=" md:col-span-4 sticky top-3 lg:col-span-5 hidden md:grid grid-cols-5 gap-2 w-full p-2 bg-transparent backdrop-blur-sm bg-opacity-80 rounded-[24px] border border-gray-300">
            <input
              type="text"
              placeholder="Search product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="col-span-3 lg:col-span-4 p-2 border border-gray-300 rounded-2xl focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#374957] col-span-2 lg:col-span-1 text-white px-4 py-2 rounded-2xl hover:bg-[#425767] focus:outline-none"
            >
              Search
            </button>
          </form>
          <img src='/content.png' className='col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5  rounded-2xl'></img>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>


    </div>
  );
}
