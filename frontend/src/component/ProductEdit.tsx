import { useState, useEffect } from 'react';
import api from "../services/api";
export default function ProductEditForm({ product }:any) {
  const [form, setForm] = useState({
    id:'',
    product_name: '',
    product_code: '',
    price: '',
    stock: '',
  });
  const [message, setMessage] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setForm({
          id:product.id,
          product_name: product.product_name || '',
          product_code: product.product_code || '',
          price: product.price || '',
          stock: product.stock || '',
        });
      } catch (error) {
        console.error(error);
        setMessage('Gagal memuat data produk');
      }
    };

    fetchProduct();
  }, [product]);

  const handleChange = (e:any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');

    await api.put(`/products/${product.id}`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    setMessage('Produk berhasil diupdate');
  } catch (err) {
    console.error(err);
    setMessage('Terjadi kesalahan saat mengupdate');
  }
};

const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
    try {
      const token = localStorage.getItem('token');

      await api.delete(`/products/${product.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      setMessage('Produk berhasil dihapus');
      // Opsional: bisa panggil props.onDeleted() atau navigate/refresh
    } catch (err) {
      console.error(err);
      setMessage('Gagal menghapus produk');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-xl font-semibold mb-4">Edit Produk</h2>
      {message && <p className="mb-4 text-sm text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="product_name"
          value={form.product_name}
          onChange={handleChange}
          placeholder="Nama Produk"
          className="w-full border px-3 py-2 rounded-md"
        />
        <input
          name="product_code"
          value={form.product_code}
          onChange={handleChange}
          placeholder="Kode Produk"
          className="w-full border px-3 py-2 rounded-md"
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Harga"
          className="w-full border px-3 py-2 rounded-md"
        />
        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stok"
          className="w-full border px-3 py-2 rounded-md"
        />
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Update
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
