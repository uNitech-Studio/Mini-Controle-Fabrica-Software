<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cliente_id' => ['required', 'integer', 'exists:clients,id'],
            'nome' => ['required', 'string', 'max:255'],
            'descricao' => ['nullable', 'string'],
            'data_inicio' => ['required', 'date'],
            'data_fim' => ['nullable', 'date', 'after_or_equal:data_inicio'],
            'valor_contrato' => ['required', 'numeric', 'gt:0'],
            'custo_hora_base' => ['required', 'numeric', 'gt:0'],
            'status' => ['required', 'in:planejado,em_andamento,pausado,finalizado'],
        ];
    }
}
