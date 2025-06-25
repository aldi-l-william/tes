<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;

class CustomerController extends Controller
{
    public function index()
    {
        return Customer::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string',
            'customer_address' => 'required|string',
            'gender' => 'required|in:pria,wanita',
            'birth_date' => 'required|date',
        ]);

        $customer = Customer::create($validated);

        return response()->json($customer, 201);
    }
}
