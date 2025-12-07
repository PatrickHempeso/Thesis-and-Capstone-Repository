<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $table = 'documents'; // Your table name
    protected $primaryKey = 'DocumentID'; // Primary key
    public $incrementing = false; // because it's a varchar
    protected $keyType = 'string';

    protected $fillable = [
        'DocumentID',
        'Title',
        'Keywords',
        'Authors',
        'YearPublished'
    ];

    // Optional: disable timestamps if your table doesn't have created_at/updated_at
    public $timestamps = false;
}
