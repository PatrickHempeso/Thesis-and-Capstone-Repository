<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function listDocuments()
    {
        $documents = Document::all();
        return response()->json($documents);
    }

    public function viewDocument($id)
    {
        $document = Document::find($id);
        if (!$document) {
            return response()->json(['message' => 'Document not found'], 404);
        }
        return response()->json($document);
    }
}
