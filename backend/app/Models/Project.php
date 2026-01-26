<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = [
        'cliente_id',
        'nome',
        'descricao',
        'data_inicio',
        'data_fim',
        'valor_contrato',
        'custo_hora_base',
        'status',
    ];

    protected $casts = [
        'data_inicio' => 'date',
        'data_fim' => 'date',
        'valor_contrato' => 'decimal:2',
        'custo_hora_base' => 'decimal:2',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'cliente_id');
    }

    public function timesheets(): HasMany
    {
        return $this->hasMany(Timesheet::class, 'projeto_id');
    }
}
