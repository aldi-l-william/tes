<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::create([
            'product_code' => 'P0001',
            'product_name' => 'Hydrococo 150ml',
            'stock' => 10,
            'price' => 12000.00
        ]);

        Product::create([
            'product_code' => 'P0002',
            'product_name' => 'Teh Botol Sosro',
            'stock' => 20,
            'price' => 7000.00
        ]);
    }
}
