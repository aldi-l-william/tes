<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Customer;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {  
       Customer::insert([
            ['customer_name' => 'Budi', 'customer_address' => 'Jakarta','gender' => 'pria','birth_date' => '1990-01-01'],
            ['customer_name' => 'Ani', 'customer_address' => 'Bandung', 'gender' => 'wanita','birth_date' => '1992-05-10'],
            ['customer_name' => 'Siti', 'customer_address' => 'Semarang', 'gender' => 'wanita', 'birth_date' => '1995-09-15'],
        ]);
    }
}
