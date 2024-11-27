import { useState } from 'react';
import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import {TransaksiForm} from '../components/TransaksiForm'
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
  // Login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({
    id_user: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Ambil data user dari Supabase
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .eq('id_user', loginData.id_user)
        .single();

      if (error || !data) {
        toast.error('ID User tidak ditemukan');
        return;
      }

      // Verifikasi password
      const isMatch = await bcrypt.compare(loginData.password, data.password);

      if (!isMatch) {
        toast.error('Password salah');
        return;
      }

      toast.success('Login sukses');
      setIsLoggedIn(true);
    } catch (err) {
      console.error('Login Error:', err);
      toast.error('Terjadi kesalahan, silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Toaster />
        <form
          onSubmit={handleLoginSubmit}
          className="bg-white p-6 rounded shadow-md w-96"
        >
          <h2 className="text-xl font-bold mb-4">Login Admin</h2>
          <input
            type="text"
            name="id_user"
            placeholder="ID User"
            value={loginData.id_user}
            onChange={handleLoginChange}
            required
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleLoginChange}
            required
            className="w-full p-2 border rounded mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  // Halaman admin setelah login
  return (
    <div>
      <h1>Welcome to Admin Page!</h1>
      {/* Tambahkan fitur admin di sini */}
      <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin - Tambah Produk</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Nama Produk" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded"/>
        <textarea name="description" placeholder="Deskripsi" value={formData.description} onChange={handleChange} required className="w-full p-2 border rounded"/>
        <select 
    name="category" 
    value={formData.category} 
    onChange={handleChange} 
    required 
    className="w-full p-2 border rounded"
  >
    <option value="" disabled>Pilih Kategori</option>
    <option value="Tshirt">Tshirt</option>
    <option value="Kemeja">Kemeja</option>
    <option value="Hoodie">Hoodie</option>
    <option value="Pants">Pants</option>
  </select>
        <input type="number" name="price" placeholder="Harga" value={formData.price} onChange={handleChange} required className="w-full p-2 border rounded"/>
        <input type="file" onChange={handleImageChange} required className="w-full"/>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Tambah Produk</button>
      </form>
    </div>
    </div>
  );
}
