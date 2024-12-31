<?php

namespace App\Http\Middleware;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Closure;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class JwtMiddleware
{
    public function handle($request, Closure $next)
    {
        $token = $request->bearerToken();
        $key = base64_decode(env('SPRING_SECRET_KEY')); // Odkodowanie klucza z Base64

        if (!$token) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        try {
            // Weryfikacja tokena JWT
            $decoded = JWT::decode($token, new Key($key, 'HS256'));

            // Pobranie użytkownika z bazy danych na podstawie "sub" w tokenie
            $user = User::where('email', $decoded->sub)->first();

            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            // Ustawienie użytkownika w kontekście autoryzacji Laravel
            Auth::login($user);

            // Kontynuacja przetwarzania żądania
            return $next($request);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid token: ' . $e->getMessage()], 401);
        }
    }
}