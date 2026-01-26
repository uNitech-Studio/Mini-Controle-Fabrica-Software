<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Timesheet extends Model
{
    protected $fillable = [
        'projeto_id',
        'colaborador',
        'data',
        'horas',
        'tipo',
        'descricao',
    ];

    protected $casts = [
        'data' => 'date',
        'horas' => 'decimal:2',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'projeto_id');
    }
}
