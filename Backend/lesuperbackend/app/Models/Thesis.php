<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Thesis extends Model
{
    protected $primaryKey = 'ThesisID';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;
    protected $table = 'thesis';

    protected $fillable = [
        'ThesisID',
        'Title',
        'Abstract',
        'Keywords',
        'Authors',
        'Adviser',
        'YearPublished',
        'DateCreated',
        'DocumentID',
    ];

    //Accessor to clean up the Authors field when accessed.
    protected function getAuthorsAttribute($value)
    {
        $cleanedString = str_replace(["\r", "\n", ";"], ["" , ",", ","], $value);
        $authorsArray = array_map('trim', explode(',', $cleanedString));
        return array_values(array_filter($authorsArray));
    }

    // Relationship: Thesis belongs to a Document
    public function document()
    {
        return $this->belongsTo(Document::class, 'DocumentID', 'DocumentID');
    }
}