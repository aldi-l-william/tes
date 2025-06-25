import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import ProductEditForm from "../component/ProductEdit";
const ProductPage = () => {
    const [sale, setsale] = useState<[]>([]);
    const [product, setProduct] = useState<[]>([]);
    const [customer, setCustomer] = useState<[]>([]);
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
        customer_id: '',
        product_id: '',
        order_date: '',
        qty: 1,
        total_price:''
    });

  

  const [message, setMessage] = useState<any>(null);

  const handleChange = (e: any) => {
  const { name, value } = e.target;
  const updatedForm:any = {
    ...form,
    [name]: value,
  };

  if (name === 'qty' || name === 'product_id') {
    const selectedProduct:any = product.find((p: any) => p.id === (name === 'product_id' ? value : form.product_id));
    if (selectedProduct) {
      updatedForm.total_price = Number(updatedForm.qty || 1) * Number(selectedProduct.price);
    }
  }

  setForm(updatedForm);
};

 const handleSubmit = async (e: any) => {
  e.preventDefault();

  // Temukan produk berdasarkan ID yang dipilih
  const selectedProduct:any = product.find((p: any) => p.id === form.product_id);

  if (!selectedProduct) {
    setMessage("Produk tidak ditemukan.");
    return;
  }

  // Validasi stok
  if (form.qty > selectedProduct.stock) {
    setMessage(`Stok tidak mencukupi. Stok tersedia: ${selectedProduct.stock}`);
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await api.post('/orders', form, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    setMessage('Penjualan berhasil disimpan');
    setForm({ customer_id: '', product_id: '', order_date: '', qty: 1, total_price: '' });
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
         const fetchOrder = async () => {
            try {
                const res = await api.get('/orders'); 
                console.log(res, "res");
                setsale(res.data);
                setLoading(false);
            } catch (err: any) {
               setError(err.message);
               setLoading(false);
            }
        };
       

        const fetchProduct = async () => {
            try {
                const res = await api.get('/products'); 
                console.log(res, "res");
                setProduct(res.data);
                setLoading(false);
            } catch (err: any) {
               setError(err.message);
               setLoading(false);
            }
        };
        

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
        fetchProduct();
        fetchOrder();
    }, [])

    return(
        <>
            <div className="p-4">
                {loading && <p>🔄 Memuat data...</p>}
                {error && <p className="text-red-500">❌ {error}</p>}

                {!loading && !error && sale.length === 0 && (
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
                                <div>Tambah Penjualan</div>
                                <div
                                    onClick={() => {
                                        setShowDialog(false);
                                        setCustomerNumberInput(""); // reset input saat tutup
                                    }}
                                    className="bg-gray-400 rounded-full px-3 py-1 cursor-pointer text-white">x</div>
                            </div>

                           <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
                            <h2 className="text-xl font-semibold mb-4">Tambah Penjualan</h2>
                            {message && <p className="mb-4 text-sm text-red-500">{message}</p>}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <select
                                name="customer_id"
                                value={form.customer_id}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md"
                                required
                                >
                                <option value="">Pilih Customer</option>
                                {customer.map((c: any) => (
                                    <option key={c.id} value={c.id}>
                                    {c.customer_name}
                                    </option>
                                ))}
                                </select>

                                <select
                                name="product_id"
                                value={form.product_id}
                                onChange={handleChange}
                                className="w-full border px-3 py-2 rounded-md"
                                required
                                >
                                <option value="">Pilih Produk</option>
                                {product.map((p: any) => (
                                    <option key={p.id} value={p.id}>
                                    {p.product_name} - {p.product_code}
                                    </option>
                                ))}
                                </select>

                                <input
                                name="qty"
                                type="number"
                                value={form.qty}
                                onChange={handleChange}
                                placeholder="Jumlah"
                                className="w-full border px-3 py-2 rounded-md"
                                min={1}
                                required
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
                    className="bg-blue-500 px-4 py-2 my-4 text-white rounded cursor-pointer">Tambah Penjualan</button>
                </div>

                {!loading && !error && sale.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {sale.map((item: any) => (
                            <div key={item.id} 
                                className="border p-4 rounded shadow cursor-pointer"
                                onClick={() => {
                                    setSelectedProductId(item);
                                    setShowDialogUpdate(true);
                                    setItemList(item);
                                    setCustomerNumberInput(""); // reset input saat dialog baru dibuka
                                }}>
                                <p className="font-semibold">Customer_id:{item.customer_id}</p>
                                <p className="text-sm text-gray-500">Product_id: {item.product_id}</p>
                                <p className="text-sm">Tgl Order: {item.order_date}</p>
                                <p className="text-sm">Qty {item.quantity}</p>
                                <p className="text-sm">Total_price {item.total_price}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>  
        </>
    );
}
export default ProductPage;
