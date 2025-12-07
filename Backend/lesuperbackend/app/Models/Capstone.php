<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Capstone extends Model
{
    protected $primaryKey = 'CapstoneID';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $table = 'capstone';

    protected $fillable = [
        'CapstoneID',
        'Title',
        'Abstract',
        'Keywords',
        'Authors',
        'Adviser',
        'YearPublished',
        'DateCreated',
        'DocumentID',
    ];

    // Accessor to clean up the Authors field when accessed
    protected function getAuthorsAttribute($value)
    {
        $cleanedString = str_replace(["\r", "\n", ";"], ["" , ",", ","], $value);
        $authorsArray = array_map('trim', explode(',', $cleanedString));
        return array_values(array_filter($authorsArray));
    }

    // Relationship: Capstone belongs to a Document
    public function document()
    {
        return $this->belongsTo(Document::class, 'DocumentID', 'DocumentID');
    }
}