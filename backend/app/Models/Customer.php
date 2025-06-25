<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Customer extends Model
{    
    protected $fillable = [
        'customer_name',
        'customer_address',
        'gender',
        'birth_date',
    ];
    
}
