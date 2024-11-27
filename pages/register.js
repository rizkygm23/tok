import { useState } from 'react';
import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';
import "../app/globals.css";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    id_user: '',
    username: '',
    name: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Hash password dengan bcrypt
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    // Insert data ke tabel 'user' di Supabase
    const { data, error } = await supabase.from('user').insert([
      {
        id_user: formData.id_user,
        username: formData.username,
        name: formData.name,
        password: hashedPassword,
      },
    ]);

    if (error) {
      console.error('Error registering user:', error);
      alert('Pendaftaran gagal, silakan coba lagi.');
    } else {
      alert('Pendaftaran berhasil!');
      setFormData({ id_user: '', username: '', name: '', password: '' });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-xl font-bold mb-4">Register Admin</h2>
        <input
          type="number"
          name="id_user"
          placeholder="ID User"
          value={formData.id_user}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="text"
          name="name"
          placeholder="Nama Lengkap"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}
