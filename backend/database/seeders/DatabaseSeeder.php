<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Client;
use App\Models\Project;
use App\Models\Timesheet;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $clienteA = Client::create([
            'nome' => 'Alpha Tech',
            'email' => 'alpha@cliente.com',
            'telefone' => '11999990001',
            'ativo' => true,
        ]);

        $clienteB = Client::create([
            'nome' => 'Beta Corp',
            'email' => 'beta@cliente.com',
            'telefone' => '11999990002',
            'ativo' => true,
        ]);

        $projetoA = Project::create([
            'cliente_id' => $clienteA->id,
            'nome' => 'Portal Alpha',
            'descricao' => 'Novo portal de clientes',
            'data_inicio' => '2026-01-05',
            'data_fim' => null,
            'valor_contrato' => 15000,
            'custo_hora_base' => 45,
            'status' => 'em_andamento',
        ]);

        $projetoB = Project::create([
            'cliente_id' => $clienteB->id,
            'nome' => 'App Beta',
            'descricao' => 'Aplicativo interno',
            'data_inicio' => '2026-01-10',
            'data_fim' => null,
            'valor_contrato' => 22000,
            'custo_hora_base' => 55,
            'status' => 'planejado',
        ]);

        $datas = [
            Carbon::parse('2026-01-10'),
            Carbon::parse('2026-01-12'),
            Carbon::parse('2026-01-15'),
            Carbon::parse('2026-01-18'),
        ];

        Timesheet::create([
            'projeto_id' => $projetoA->id,
            'colaborador' => 'Maria',
            'data' => $datas[0],
            'horas' => 4.5,
            'tipo' => 'evolutiva',
            'descricao' => 'Novo fluxo de cadastro',
        ]);

        Timesheet::create([
            'projeto_id' => $projetoA->id,
            'colaborador' => 'Joao',
            'data' => $datas[1],
            'horas' => 2.0,
            'tipo' => 'corretiva',
            'descricao' => 'Ajuste de bugs',
        ]);

        Timesheet::create([
            'projeto_id' => $projetoA->id,
            'colaborador' => 'Ana',
            'data' => $datas[2],
            'horas' => 3.0,
            'tipo' => 'implantacao',
            'descricao' => 'Deploy inicial',
        ]);

        Timesheet::create([
            'projeto_id' => $projetoB->id,
            'colaborador' => 'Carlos',
            'data' => $datas[3],
            'horas' => 5.0,
            'tipo' => 'legislativa',
            'descricao' => 'Adequacao LGPD',
        ]);
    }
}
