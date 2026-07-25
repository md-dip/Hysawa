<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        return response()->json(Student::with('institution')->orderByDesc('id')->get());
    }

    public function create() {}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'institution_id' => 'required|exists:institutions,id',
            'girls_count'    => 'required|integer|min:0',
            'boys_count'     => 'required|integer|min:0',
            'year'           => 'required|integer|min:2000|max:2030',
        ]);

        $student = Student::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Student data saved successfully!',
            'data'    => $student,
        ], 201);
    }

    public function show(Student $student)
    {
        return response()->json($student);
    }

    public function edit(Student $student) {}

    public function update(UpdateStudentRequest $request, Student $student) {}

    public function destroy(Student $student) {}
}