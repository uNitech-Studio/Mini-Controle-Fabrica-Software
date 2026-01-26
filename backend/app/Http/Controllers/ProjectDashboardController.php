<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Timesheet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProjectDashboardController extends Controller
{
    private const TIPOS = ['corretiva', 'evolutiva', 'implantacao', 'legislativa'];

    public function show(Request $request, Project $projeto)
    {
        $request->validate([
            'inicio' => ['required', 'date'],
            'fim' => ['required', 'date', 'after_or_equal:inicio'],
        ]);

        $inicio = $request->query('inicio');
        $fim = $request->query('fim');

        $horasTotais = (float) Timesheet::where('projeto_id', $projeto->id)
            ->whereBetween('data', [$inicio, $fim])
            ->sum('horas');

        $custoTotal = $horasTotais * (float) $projeto->custo_hora_base;
        $receita = (float) $projeto->valor_contrato;
        $margem = $receita - $custoTotal;
        $margemPercent = $receita > 0 ? ($margem / $receita) * 100 : 0.0;
        $breakEven = (float) $projeto->custo_hora_base > 0
            ? $receita / (float) $projeto->custo_hora_base
            : 0.0;

        $porTipoRaw = Timesheet::select('tipo', DB::raw('SUM(horas) as horas'))
            ->where('projeto_id', $projeto->id)
            ->whereBetween('data', [$inicio, $fim])
            ->groupBy('tipo')
            ->get()
            ->keyBy('tipo');

        $porTipo = [];
        foreach (self::TIPOS as $tipo) {
            $horas = isset($porTipoRaw[$tipo]) ? (float) $porTipoRaw[$tipo]->horas : 0.0;
            $porTipo[$tipo] = [
                'horas' => round($horas, 2),
                'custo' => round($horas * (float) $projeto->custo_hora_base, 2),
            ];
        }

        return [
            'horas' => round($horasTotais, 2),
            'custo' => round($custoTotal, 2),
            'receita' => round($receita, 2),
            'margem' => round($margem, 2),
            'margemPercent' => round($margemPercent, 2),
            'breakEven' => round($breakEven, 2),
            'porTipo' => $porTipo,
        ];
    }
}
