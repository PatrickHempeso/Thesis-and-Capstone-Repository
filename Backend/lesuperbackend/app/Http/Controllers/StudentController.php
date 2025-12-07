<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
// Import Models
use App\Models\Thesis;
use App\Models\Capstone;
use App\Models\Student; 
use App\Models\Faculty; 

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
        $totalThesis = Thesis::count(); // Use capitalized Model
        $totalCapstone = Capstone::count(); // Use capitalized Model

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

    //METHOD 1: Get the current authenticated student's full name (Pre-fill Author) 🛑
    public function getAuthenticatedAuthor(Request $request)
    {
        $user = $request->user();
        if (!$user || !($user instanceof Student)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $fullName = "{$user->FirstName} {$user->LastName}";
        $studentData = [
            'name' => $fullName,
            'id' => $user->StudentID,
            'program' => $user->Program
        ];

        return response()->json($studentData);
    }

    // METHOD 2: Search for other Students (Co-Authors) 
    public function searchStudents(Request $request)
    {
        $query = $request->input('q');

        $students = Student::where('FirstName', 'LIKE', "%{$query}%")
                           ->orWhere('LastName', 'LIKE', "%{$query}%")
                           ->select('StudentID', 'FirstName', 'LastName', 'Program')
                           ->limit(10)
                           ->get();

        return $students->map(function ($student) {
            return [
                'id' => $student->StudentID,
                'name' => "{$student->FirstName} {$student->LastName}",
                'details' => $student->Program,
            ];
        });
    }

    // 3: Search for Faculty (Adviser) 
    public function searchFaculty(Request $request)
    {
        $query = $request->input('q');

        $faculty = Faculty::where('FirstName', 'LIKE', "%{$query}%")
                          ->orWhere('LastName', 'LIKE', "%{$query}%")
                          ->select('FacultyID', 'FirstName', 'LastName')
                          ->limit(10)
                          ->get();

        return $faculty->map(function ($member) {
            return [
                'id' => $member->FacultyID,
                'name' => "{$member->FirstName} {$member->LastName}",
                'details' => 'Faculty/Adviser',
            ];
        });
    }
}