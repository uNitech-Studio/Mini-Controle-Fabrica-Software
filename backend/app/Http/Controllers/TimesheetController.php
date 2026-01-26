<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTimesheetRequest;
use App\Http\Requests\UpdateTimesheetRequest;
use App\Models\Timesheet;
use Illuminate\Http\Request;

class TimesheetController extends Controller
{
    public function index(Request $request)
    {
        $projetoId = $request->query('projeto_id');
        $inicio = $request->query('inicio');
        $fim = $request->query('fim');

        if (!$projetoId || !$inicio || !$fim) {
            return [];
        }

        $request->validate([
            'projeto_id' => ['required', 'integer', 'exists:projects,id'],
            'inicio' => ['required', 'date'],
            'fim' => ['required', 'date', 'after_or_equal:inicio'],
        ]);

        return Timesheet::where('projeto_id', $projetoId)
            ->whereBetween('data', [$inicio, $fim])
            ->orderBy('data')
            ->get();
    }

    public function store(StoreTimesheetRequest $request)
    {
        $timesheet = Timesheet::create($request->validated());

        return response()->json($timesheet, 201);
    }

    public function show(Timesheet $lancamento)
    {
        return $lancamento;
    }

    public function update(UpdateTimesheetRequest $request, Timesheet $lancamento)
    {
        $lancamento->update($request->validated());

        return $lancamento;
    }

    public function destroy(Timesheet $lancamento)
    {
        $lancamento->delete();

        return response()->noContent();
    }
}
