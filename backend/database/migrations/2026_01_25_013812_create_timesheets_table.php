<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('timesheets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('projeto_id')->constrained('projects')->cascadeOnDelete();
            $table->string('colaborador');
            $table->date('data');
            $table->decimal('horas', 6, 2);
            $table->enum('tipo', ['corretiva','evolutiva','implantacao','legislativa']);
            $table->text('descricao')->nullable();
            $table->timestamps();

            $table->index(['projeto_id', 'data']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('timesheets');
    }
};
