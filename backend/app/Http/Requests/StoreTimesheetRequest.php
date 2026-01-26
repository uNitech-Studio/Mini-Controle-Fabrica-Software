<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTimesheetRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'projeto_id' => ['required', 'integer', 'exists:projects,id'],
            'colaborador' => ['required', 'string', 'max:255'],
            'data' => ['required', 'date'],
            'horas' => ['required', 'numeric', 'gt:0'],
            'tipo' => ['required', 'in:corretiva,evolutiva,implantacao,legislativa'],
            'descricao' => ['nullable', 'string'],
        ];
    }
}
