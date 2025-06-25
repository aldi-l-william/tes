<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\OrderController;
use App\Models\User;
use Illuminate\Http\Request;               
use Illuminate\Support\Facades\Hash; 


Route::post('/login', function (Request $request) {
    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Login gagal'], 401);
    }

    $token = $user->createToken('api-token')->plainTextToken;

    return response()->json(['token' => $token]);
});

Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('products')->group(function () {
        Route::get('/', [ProductController::class, 'index']);         // GET /api/products
        Route::post('/', [ProductController::class, 'store']);         // POST /api/products
        Route::put('/{id}', [ProductController::class, 'update']);     // PUT /api/products/{id}
        Route::delete('/{id}', [ProductController::class, 'destroy']); // DELETE /api/products/{id}
    });

    Route::prefix('customers')->group(function () {
        Route::get('/', [CustomerController::class, 'index']);         // GET /api/customers
        Route::post('/', [CustomerController::class, 'store']);        // POST /api/customers
    });

    Route::prefix('orders')->group(function () {
        Route::post('/', [OrderController::class, 'store']);           // POST /api/orders
        Route::get('/', [OrderController::class, 'index']);            // GET /api/orders
    });

});
