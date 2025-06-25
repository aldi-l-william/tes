import { useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../services/api';
import React from 'react';


function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [_, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      return alert('email dan password wajib diisi');
    }
    try {
      setLoading(true);
      const res = await api.post('/login', { email:form.email, password:form.password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('auth', 'true');
      navigate('/');
    } catch (err:any) {
      alert('Login gagal: ' + err.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
  <div className="relative w-screen h-screen">
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <form onSubmit={handleSubmit} className="bg-white/30 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/40">
        <h2 className="mb-4 text-xl font-bold text-center">Login</h2>
        <input
          name="email"
          onChange={handleChange}
          placeholder="email"
          className="block w-full px-4 py-2 border border-gray-300 rounded mb-4"
        />
        <input
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Password"
          className="block w-full px-4 py-2 border border-gray-300 rounded mb-4"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  </div>
);

}

export default Login;
