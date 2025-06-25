<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Sale;

class SalesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customer = Customer::where('customer_name', 'Budi')->first();
        $product = Product::where('product_code','P0001')->first();
        Sale::create([
            'customer_id' => $customer->id,
            'product_id' => $product->id,
            'order_date' => now(),
            'quantity' => 2,
            'total_price' => 24000.00,
        ]);
    }
}
