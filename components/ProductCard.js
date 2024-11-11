export default function ProductCard({ product }) {
    return (
      <div className="border p-4 rounded shadow-md">
        <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover mb-2" />
        <h2 className="text-xl font-semibold">{product.name}</h2>
        <p>{product.description}</p>
        <p className="font-bold text-lg mt-2">Rp {product.price}</p>
        <p className="text-gray-500">Likes: {product.likes}</p>
        <div className="grid grid-cols-2 gap-3 mt-4">
        <button className="bg-sky-500 font-bold  px-3 py-2 rounded-lg mt-2  text-slate-200">Buynow</button>
        <button className="bg-transparent border-2 border-sky-500 font-bold px-3 py-2 rounded-lg mt-2 hover:bg-sky-500 hover:text-slate-200">add to cart</button>
        </div>
        
        
      </div>
    );
  }
  