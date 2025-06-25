import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import ProductEditForm from "../component/ProductEdit";
const ProductPage = () => {
    const [pricelist, setPriceList] = useState<[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [showDialogUpdate, setShowDialogUpdate] = useState(false);
    const [itemList, setItemList] = useState<any>(null);
    const [successlist, setSuccessList] = useState<any>(null);
    const [isSuccessList, setIsSuccessList] = useState<boolean>(false);
    const [yes, setYes] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    const [form, setForm] = useState({
    product_name: '',
    product_code: '',
    price: '',
    stock: '',
  });

  

  const [message, setMessage] = useState<any>(null);

  const handleChange = (e:any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token'); // ambil token dari localStorage
       const response = await api.post('/products', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      setMessage('Produk berhasil ditambahkan');
      setForm({ product_name: '', product_code: '', price: '', stock: '' });
    } catch (error) {
      console.error(error);
      setMessage('Terjadi kesalahan saat mengirim data');
    }
  };


    // Tambahkan state untuk nomor customer inputan
    const [customerNumberInput, setCustomerNumberInput] = useState("");

    const fetchedRef = useRef(false);

    const dialogYesOrNo = () => {
        setYes(true);
        setShowDialog(false);
    }

    useEffect(() => {
        if (fetchedRef.current) return; // cegah double fetch
        fetchedRef.current = true;
         const fetchProduct = async () => {
            try {
                const res = await api.get('/products'); 
                console.log(res, "res");
                setPriceList(res.data);
                setLoading(false);
            } catch (err: any) {
               setError(err.message);
               setLoading(false);
            }
        };
        fetchProduct();
    }, [])

    return(
        <>
            <div className="p-4">
                {loading && <p>🔄 Memuat data...</p>}
                {error && <p className="text-red-500">❌ {error}</p>}

                {!loading && !error && pricelist.length === 0 && (
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
                                <div>Tambah Product</div>
                                <div
                                    onClick={() => {
                                        setShowDialog(false);
                                        setCustomerNumberInput(""); // reset input saat tutup
                                    }}
                                    className="bg-gray-400 rounded-full px-3 py-1 cursor-pointer text-white">x</div>
                            </div>

                           <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
                            <h2 className="text-xl font-semibold mb-4">Tambah Produk</h2>
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
                                value={form.price}
                                onChange={handleChange}
                                placeholder="Harga"
                                type="number"
                                className="w-full border px-3 py-2 rounded-md"
                                />
                                <input
                                name="stock"
                                value={form.stock}
                                onChange={handleChange}
                                placeholder="Stok"
                                type="number"
                                className="w-full border px-3 py-2 rounded-md"
                                />
                                <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                Simpan
                                </button>
                            </form>
                            </div>
                        </div>
                    </div>
                )}

                {showDialogUpdate && (<ProductEditForm className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/30 z-50" product={selectedProductId}/>)}

                <div>
                    <button
                    onClick={() =>{
                        setShowDialog(true);
                    }} 
                    className="bg-blue-500 px-4 py-2 my-4 text-white rounded cursor-pointer">Tambah Product Baru</button>
                </div>

                {!loading && !error && pricelist.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {pricelist.map((item: any) => (
                            <div key={item.product_code} 
                                className="border p-4 rounded shadow cursor-pointer"
                                onClick={() => {
                                    setSelectedProductId(item);
                                    setShowDialogUpdate(true);
                                    setItemList(item);
                                    setCustomerNumberInput(""); // reset input saat dialog baru dibuka
                                }}>
                                <p className="font-semibold">{item.product_name}</p>
                                <p className="text-sm text-gray-500">stock: {item.stock}</p>
                                <p className="text-sm">Harga: Rp {item.price.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>  
        </>
    );
}
export default ProductPage;
