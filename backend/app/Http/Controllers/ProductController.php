<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        return Product::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_code' => 'required|string|unique:products,product_code',
            'product_name' => 'required|string',
            'stock' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
        ]);

        $product = Product::create($validated);

        return response()->json($product, 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'product_code' => 'sometimes|string|unique:products,product_code,' . $id,
            'product_name' => 'sometimes|string',
            'stock' => 'sometimes|integer|min:0',
            'price' => 'sometimes|numeric|min:0',
        ]);

        $product->update($validated);

        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Produk berhasil dihapus']);
    }
}
