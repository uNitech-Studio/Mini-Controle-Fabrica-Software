<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $busca = trim((string) $request->query('busca', ''));

        $query = Client::query();

        if ($busca !== '') {
            $query->where(function ($q) use ($busca) {
                $q->where('nome', 'like', "%{$busca}%")
                    ->orWhere('email', 'like', "%{$busca}%");
            });
        }

        return $query->orderBy('nome')->get();
    }

    public function store(StoreClientRequest $request)
    {
        $client = Client::create($request->validated());

        return response()->json($client, 201);
    }

    public function show(Client $cliente)
    {
        return $cliente;
    }

    public function update(UpdateClientRequest $request, Client $cliente)
    {
        $cliente->update($request->validated());

        return $cliente;
    }

    public function destroy(Client $cliente)
    {
        $cliente->delete();

        return response()->noContent();
    }
}
