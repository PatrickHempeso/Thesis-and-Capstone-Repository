<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
// Import Models
use App\Models\Thesis;
use App\Models\Capstone;
use App\Models\Student; 

class StudentController extends Controller
{
    /**
     * Display the Student Dashboard statistics.
     */
    public function dashboard(Request $request)
    {
        // 1. Authorization Check
        if (!$request->user() instanceof Student) {
            return response()->json([
                'message' => 'Unauthorized. This area is for Students only.'
            ], 403);
        }

        // 2. Get the authenticated student
        $student = $request->user(); 

        // 3. Fetch Statistics (Performance Optimized)
        $totalThesis = thesis::count();
        $totalCapstone = capstone::count();

        // 4. Return the Dashboard JSON
        return response()->json([
            'student_profile' => $student,
            'dashboard_stats' => [
                'total_theses' => $totalThesis,
                'total_capstones' => $totalCapstone,
            ],
            // Useful links for the frontend to know where to get the full lists
            'quick_links' => [
                'view_theses' => url('/api/student/thesis'),
                'view_capstones' => url('/api/student/capstones'),
            ]
        ]);
    }
}