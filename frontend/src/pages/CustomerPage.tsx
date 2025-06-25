import { useEffect, useState, useRef } from "react";
import api from "../services/api";
const CustomerPage = () => {
    const [customer, setCustomer] = useState<[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [successlist, setSuccessList] = useState<any>(null);
    const [isSuccessList, setIsSuccessList] = useState<boolean>(false);


    const [form, setForm] = useState({
        customer_name: '',
        customer_address: '',
        gender: '',
        birth_date: '',
    });

   
   const [status, setStatus] = useState<any>({ success: null, message: '' });

  const handleChange = (e:any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ success: null, message: '' });

    try {
      const token = localStorage.getItem('token'); // Pastikan token sudah login

      const response = await api.post('/customers', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      setStatus({ success: true, message: 'Berhasil menambahkan pelanggan.' });
      setForm({ customer_name: '', customer_address: '', gender: '', birth_date: '' });
    } catch (error:any) {
      const msg = error.response?.data?.message || 'Terjadi kesalahan.';
      setStatus({ success: false, message: msg });
    } finally {
      setLoading(false);
    }
  };


    const fetchedRef = useRef(false);


    useEffect(() => {
        if (fetchedRef.current) return; // cegah double fetch
        fetchedRef.current = true;
         const fetchCustomer = async () => {
            try {
                const res = await api.get('/customers'); 
                console.log(res, "res");
                setCustomer(res.data);
                setLoading(false);
            } catch (err: any) {
               setError(err.message);
               setLoading(false);
            }
        };
        fetchCustomer();
    }, [])

    return(
        <>
            <div className="p-4">
                {loading && <p>🔄 Memuat data...</p>}
                {error && <p className="text-red-500">❌ {error}</p>}

                {!loading && !error && customer.length === 0 && (
                    <p>📭 Tidak ada data yang tersedia.</p>
                )}

                {isSuccessList && (
                    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/30 z-50">
                        <div className="border border-black p-4 bg-white rounded shadow">
                            <div className="flex justify-between items-center">
                                <div>Sisa Saldo : <span className="font-bold">{successlist.data.buyer_last_saldo}</span></div>
                                <div
                                    onClick={() => {
                                        setIsSuccessList(false);
                                        setSuccessList(""); // reset successlist saat tutup
                                    }}
                                    className="bg-gray-400 rounded-full px-3 py-1 cursor-pointer text-white">x</div>
                            </div>
                            <div>Sku Code : <span className="font-bold">{successlist.data.buyer_sku_code}</span></div>
                            <div>Customer No : <span className="font-bold">{successlist.data.customer_no}</span></div>
                            <div>Message : <span className="font-bold">{successlist.data.message}</span></div>
                            <div>Price : <span className="font-bold">{successlist.data.price}</span></div>
                            <div>Ref_ID : <span className="font-bold">{successlist.data.ref_id}</span></div>
                            <div>SN : <span className="font-bold">{successlist.data.sn}</span></div>
                            <div>RC : <span className="font-bold">{successlist.data.rc}</span></div>
                            <div>Status : <span className="font-bold">{successlist.data.status}</span></div>
                            <div>Tele : <span className="font-bold">{successlist.data.tele}</span></div>
                            <div>Wa : <span className="font-bold">{successlist.data.wa}</span></div>
                        </div>
                        
                    </div>    
                )}

               

                {showDialog && (
                    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/30 z-50">
                        <div className="border border-black p-4 bg-white rounded shadow">
                            <div className="flex justify-between items-center">
                                <div>Isi Pelanggan Baru</div>
                                <div
                                    onClick={() => {
                                        setShowDialog(false);
                                         // reset input saat tutup
                                    }}
                                    className="bg-gray-400 rounded-full px-3 py-1 cursor-pointer text-white">x</div>
                            </div>
                            
                            <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
                            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Form Pelanggan</h2>

                            {status.message && (
                                <div
                                className={`mb-4 p-3 rounded ${
                                    status.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}
                                >
                                {status.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                                <input
                                    type="text"
                                    name="customer_name"
                                    value={form.customer_name}
                                    onChange={handleChange}
                                    placeholder="Masukkan nama lengkap"
                                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                </div>

                                <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                                <input
                                    type="text"
                                    name="customer_address"
                                    value={form.customer_address}
                                    onChange={handleChange}
                                    placeholder="Masukkan alamat"
                                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                </div>

                                <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                                <select
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="" disabled>Pilih jenis kelamin</option>
                                    <option value="pria">Pria</option>
                                    <option value="wanita">Wanita</option>
                                </select>
                                </div>

                                <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                                <input
                                    type="date"
                                    name="birth_date"
                                    value={form.birth_date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                </div>

                                <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                {loading ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </form>
                            </div>
                           
                        </div>
                    </div>
                )}
                <div>
                    <button
                    onClick={() =>{
                        setShowDialog(true);
                    }} 
                    className="bg-blue-500 px-4 py-2 my-4 text-white rounded cursor-pointer">Tambah Pelanggan Baru</button>
                </div>
                {!loading && !error && customer.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {customer.map((item: any) => (
                            <div key={item.customer_name} 
                                className="border p-4 rounded shadow cursor-pointer">
                                <p className="font-semibold">Nama: {item.customer_name}</p>
                                <p className="text-sm text-gray-500">Alamat: {item.customer_address}</p>
                                <p className="text-sm">Gender: {item.gender}</p>
                                <p className="text-sm">Tanggal Lahir: Rp {item.birth_date}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>  
        </>
    );
}
export default CustomerPage;
