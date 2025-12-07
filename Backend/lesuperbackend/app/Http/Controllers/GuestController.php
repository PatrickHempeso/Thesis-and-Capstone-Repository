<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Document;
use Illuminate\Support\Facades\DB;

class GuestController extends Controller
{
    public function dashboard()
    {
        // Fetch all documents
        $documents = Document::select('DocumentID', 'Title', 'Keywords', 'Authors', 'YearPublished')->get();

        return response()->json([
            'documents' => $documents
        ]);
    }

    public function viewDocument($id)
    {
        $document = DB::table('documents')->where('DocumentID', $id)->first();

        if (!$document) {
            return response()->json(['error' => 'Document not found'], 404);
        }

        return response()->json($document);
    }

}
