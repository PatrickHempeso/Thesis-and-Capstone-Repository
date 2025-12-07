<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;

class FacultyController extends Controller
{
    public function dashboard(Request $request)
    {
        $faculty = $request->user();
        $documents = Document::all(); // ← FIXED

        return response()->json([
            'faculty' => $faculty,
            'documents' => $documents
        ]);
    }
}
