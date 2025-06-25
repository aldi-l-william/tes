<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Sale;
use App\Models\Product;


class OrderController extends Controller
{
    public function index()
    {
        return Sale::with(['customer', 'product'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'product_id' => 'required|exists:products,id',
            'qty' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        // Cek stok
        if ($product->stock < $validated['qty']) {
            return response()->json([
                'message' => 'Stok tidak mencukupi. Stok tersedia: ' . $product->stock,
            ], 422);
        }

        // Hitung total harga
        $total_price = $product->price * $validated['qty'];

        // Simpan penjualan (order)
        $order = Sale::create([
            'customer_id' => $validated['customer_id'],
            'product_id' => $validated['product_id'],
            'quantity' => $validated['qty'],
            'order_date' => now(),
            'total_price' => $total_price,
        ]);

        // Kurangi stok produk
        $product->decrement('stock', $validated['qty']);

        return response()->json([
            'message' => 'Penjualan berhasil',
            'data' => $order,
        ]);
    }

}
