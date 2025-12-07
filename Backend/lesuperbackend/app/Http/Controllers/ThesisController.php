<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Thesis;
use App\Models\Student;

class ThesisController extends Controller
{
    // GET /api/student/theses
    public function listTheses(Request $request)
    {
        // Security Check
        if (!$request->user() instanceof Student) {
            abort(403, 'Unauthorized.');
        }

        // Return all theses with all fields
        $theses = Thesis::orderBy('YearPublished', 'desc')->get();

        return response()->json($theses);
    }

    // GET /api/student/thesis/{id}
    public function viewThesis(Request $request, $id) 
    {
        if (!$request->user() instanceof Student) {
            abort(403, 'Unauthorized.');
        }

        $thesis = Thesis::with('document')
            ->where('ThesisID', $id)
            ->firstOrFail();

        return response()->json($thesis);
    }
}
