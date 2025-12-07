<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Faculty;
use Illuminate\Http\Request;


class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        // Student login
        $student = Student::where('Email', $request->email)
                        ->where('LoginDetails', $request->password)
                        ->first();

        if ($student) {
            $token = $student->createToken('api-token')->plainTextToken;
            return response()->json([
                'user' => $student,
                'role' => 'student',
                'token' => $token
            ]);
        }

        // Faculty login
        $faculty = Faculty::where('LoginDetails', $request->email)
                        ->where('Password', $request->password)
                        ->first();

        if ($faculty) {
            $token = $faculty->createToken('api-token')->plainTextToken;
            return response()->json([
                'user' => $faculty,
                'role' => 'faculty',
                'token' => $token
            ]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }



    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }
        return response()->json(['message' => 'Logged out']);
    }
}
