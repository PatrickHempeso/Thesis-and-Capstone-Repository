<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Capstone;
use App\Models\Student;

class CapstoneController extends Controller
{
    // GET /api/student/capstones
    public function listCapstones(Request $request)
    {
        if (!$request->user() instanceof Student) {
            abort(403, 'Unauthorized.');
        }

        // Return all capstones with all fields
        $capstones = Capstone::orderBy('YearPublished', 'desc')->get();

        return response()->json($capstones);
    }

    // GET /api/student/capstone/{id}
    public function viewCapstone(Request $request, $id)
    {
        if (!$request->user() instanceof Student) {
            abort(403, 'Unauthorized.');
        }

        $capstone = Capstone::with('document')
            ->where('CapstoneID', $id)
            ->firstOrFail();

        return response()->json($capstone);
    }
}
