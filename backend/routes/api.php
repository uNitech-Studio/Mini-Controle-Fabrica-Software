<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectDashboardController;
use App\Http\Controllers\TimesheetController;
use Illuminate\Support\Facades\Route;

Route::apiResource('clientes', ClientController::class);
Route::apiResource('projetos', ProjectController::class);
Route::apiResource('lancamentos', TimesheetController::class);

Route::get('projetos/{projeto}/dashboard', [ProjectDashboardController::class, 'show']);
