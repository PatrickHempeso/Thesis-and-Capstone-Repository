<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Thesis;
use App\Models\Capstone;
use App\Models\Student;
use App\Models\Faculty;
use Carbon\Carbon;

class ProjectSubmissionController extends Controller
{
    /**
     * Generates a sequential string ID (e.g., TH001, TH002).
     * @param string $prefix The ID prefix (TH or CP).
     * @param object $model The Eloquent model (Thesis or Capstone).
     * @param string $idColumn The primary key column name.
     * @return string The new sequential ID.
     */
    protected function generateSequentialId($prefix, $model, $idColumn)
    {
        // 1. Get the last record by ID
        $lastRecord = $model::orderBy($idColumn, 'desc')->first();
        
        $newSequence = 1;

        if ($lastRecord) {
            // 2. Extract the numeric part (e.g., get '123' from 'TH123')
            $lastId = $lastRecord->{$idColumn};
            $lastSequence = (int) substr($lastId, strlen($prefix)); // Extract number after prefix
            $newSequence = $lastSequence + 1;
        }

        // 3. Format the new ID (e.g., Pad '1' to '001')
        // We use 3 digits here to ensure we generate TH001, TH002, etc.
        $paddedSequence = str_pad($newSequence, 3, '0', STR_PAD_LEFT);

        return $prefix . $paddedSequence;
    }


    public function submitThesis(Request $request)
    {
        $validated = $request->validate([
            // ... (Your validation rules)
            'title' => 'required|string|max:255',
            'authors' => 'required|string',
            'program' => 'required|string',
            'abstract' => 'required|string|min:200',
            'keywords' => 'required|string',
            'adviser' => 'required|string',
            'yearPublished' => 'required|integer|digits:4',
        ]);
        
        // 🛑 NEW ID GENERATION 🛑
        $thesisID = $this->generateSequentialId('TH', new Thesis(), 'ThesisID');

        try {
            $thesis = Thesis::create([
                'ThesisID'      => $thesisID,
                'Title'         => $validated['title'],
                // ... (Other fields)
                'Abstract'      => $validated['abstract'],
                'Keywords'      => $validated['keywords'],
                'Authors'       => $validated['authors'],
                'Adviser'       => $validated['adviser'],
                'YearPublished' => $validated['yearPublished'],
                'DateCreated'   => Carbon::now()->toDateString(),
                'DocumentID'    => null, 
            ]);

            return response()->json([
                'message' => 'Thesis metadata submitted successfully',
                'id' => $thesis->ThesisID
            ], 201);

        } catch (\Exception $e) {
             // ... (Error handling)
             return response()->json([
                'message' => 'Database error',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function submitCapstone(Request $request)
    {
        $validated = $request->validate([
            // ... (Your validation rules)
            'title' => 'required|string|max:255',
            'authors' => 'required|string',
            'program' => 'required|string',
            'abstract' => 'required|string|min:200',
            'keywords' => 'required|string',
            'adviser' => 'required|string',
            'yearPublished' => 'required|integer|digits:4',
        ]);

        // 🛑 NEW ID GENERATION 🛑
        $capstoneID = $this->generateSequentialId('CP', new Capstone(), 'CapstoneID');

        try {
            $capstone = Capstone::create([
                'CapstoneID'    => $capstoneID,
                'Title'         => $validated['title'],
                // ... (Other fields)
                'Abstract'      => $validated['abstract'],
                'Keywords'      => $validated['keywords'],
                'Authors'       => $validated['authors'],
                'Adviser'       => $validated['adviser'],
                'YearPublished' => $validated['yearPublished'],
                'DateCreated'   => Carbon::now()->toDateString(),
                'DocumentID'    => null,
            ]);

            return response()->json([
                'message' => 'Capstone metadata submitted successfully',
                'id' => $capstone->CapstoneID
            ], 201);

        } catch (\Exception $e) {
            // ... (Error handling)
            return response()->json([
                'message' => 'Database error',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}