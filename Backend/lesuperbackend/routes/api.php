<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\CapstoneController;
use App\Http\Controllers\ThesisController;
use App\Http\Controllers\GuestController;

// -------------------- PUBLIC API ROUTES --------------------

// Login (returns token)
Route::post('/login', [AuthController::class, 'login']);
Route::get('/dashboard/guest', [GuestController::class, 'dashboard']);
Route::get('/guest/document/{id}', [GuestController::class, 'viewDocument']);

// -------------------- PROTECTED API ROUTES --------------------
// Use 'auth:sanctum' for token-based auth (Sanctum personal access tokens)
Route::middleware('auth:sanctum')->group(function () {

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Faculty routes
    Route::get('/faculty/dashboard', [FacultyController::class, 'dashboard']);
    Route::get('/faculty/documents', [DocumentController::class, 'listDocuments']);
    Route::get('/faculty/document/{id}', [DocumentController::class, 'viewDocument']);
    Route::get('/faculty/capstones', [CapstoneController::class, 'listCapstones']);
    Route::get('/faculty/capstone/{id}', [CapstoneController::class, 'viewCapstone']);
    Route::get('/faculty/theses', [ThesisController::class, 'listTheses']);
    Route::get('/faculty/thesis/{id}', [ThesisController::class, 'viewThesis']);

    // Student routes
    Route::get('/student/dashboard', [StudentController::class, 'dashboard']);
    Route::get('/student/documents', [DocumentController::class, 'listDocuments']);
    Route::get('/student/document/{id}', [DocumentController::class, 'viewDocument']);
    Route::get('/student/capstones', [CapstoneController::class, 'listCapstones']);
    Route::get('/student/capstone/{id}', [CapstoneController::class, 'viewCapstone']);
    Route::get('/student/theses', [ThesisController::class, 'listTheses']);
    Route::get('/student/thesis/{id}', [ThesisController::class, 'viewThesis']);
});
