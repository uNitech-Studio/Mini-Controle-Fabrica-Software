<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;

class ProjectController extends Controller
{
    public function index()
    {
        return Project::with('client')->orderBy('nome')->get();
    }

    public function store(StoreProjectRequest $request)
    {
        $project = Project::create($request->validated());

        return response()->json($project, 201);
    }

    public function show(Project $projeto)
    {
        return $projeto->load('client');
    }

    public function update(UpdateProjectRequest $request, Project $projeto)
    {
        $projeto->update($request->validated());

        return $projeto;
    }

    public function destroy(Project $projeto)
    {
        $projeto->delete();

        return response()->noContent();
    }
}
