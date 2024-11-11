import { useState } from 'react';
import { supabase } from '../lib/supabase';
import axios from 'axios';
import "../app/globals.css";

export default function AdminPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    image: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload image to Cloudinary
    const formDataImage = new FormData();
    formDataImage.append('file', formData.image);
    formDataImage.append('upload_preset', 'img_data');

    const res = await axios.post(`https://api.cloudinary.com/v1_1/dtjnzbvlg/image/upload`, formDataImage);
    const imageUrl = res.data.secure_url;

    // Add product to Supabase
    const { data, error } = await supabase.from('products').insert([
      {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: formData.price,
        image_url: imageUrl,
        likes: 0
      }
    ]);

    if (error) {
      console.error("Error adding product:", error);
    } else {
      console.log("Product added:", data);
      setFormData({ name: '', description: '', category: '', price: '', image: null });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin - Tambah Produk</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Nama Produk" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded"/>
        <textarea name="description" placeholder="Deskripsi" value={formData.description} onChange={handleChange} required className="w-full p-2 border rounded"/>
        <input type="text" name="category" placeholder="Kategori" value={formData.category} onChange={handleChange} required className="w-full p-2 border rounded"/>
        <input type="number" name="price" placeholder="Harga" value={formData.price} onChange={handleChange} required className="w-full p-2 border rounded"/>
        <input type="file" onChange={handleImageChange} required className="w-full"/>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Tambah Produk</button>
      </form>
    </div>
  );
}
