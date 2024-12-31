<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function signup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'firstName' => 'required|string',
            'lastName' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        }

        try {
            // Wysyłanie danych rejestracyjnych do Springa
            $response = Http::post(env('SPRING_API_URL') . '/auth/signup', [
                'firstName' => $request->firstName,
                'lastName' => $request->lastName,
                'email' => $request->email,
                'password' => $request->password,
            ]);

            if ($response->successful()) {
                $data = $response->json();

                $user = User::create([
                    'first_name' => $request->firstName,
                    'last_name' => $request->lastName,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                ]);

                return response()->json([
                    'message' => 'User created successfully',
                    'user' => [
                        'firstName' => $user->first_name,
                        'lastName' => $user->last_name,
                        'email' => $user->email,
                    ],
                    'token' => $data['jwt'], // Token JWT z Springa
                ], 201);
            }

            return response()->json(['message' => 'Signup failed'], 400);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error connecting to authentication server: ' . $e->getMessage()], 500);
        }
    }

    public function signin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 400);
        }

        try {
            // Wysyłanie danych logowania do Springa
            $response = Http::post(env('SPRING_API_URL') . '/auth/signin', [
                'email' => $request->email,
                'password' => $request->password,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                $user = User::where('email', $request->email)->first();

                if ($user === null) {
                    return response()->json(['message' => 'Invalid email or password'], 401);
                }

                // Zwrócenie tokenu JWT do klienta
                return response()->json([
                    'message' => 'Logged in successfully',
                    'user' => [
                        'firstName' => $user->first_name,
                        'lastName' => $user->last_name,
                        'email' => $request['email'],
                    ],
                    'token' => $data['jwt'],
                ], 200);
            }

            return response()->json(['message' => 'Invalid email or password'], 401);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error connecting to authentication server: ' . $e->getMessage()], 500);
        }
    }

    public function signout()
    {
        return response()->json(['message' => 'Logged out successfully'], 200);
    }

    // Stare logowanie generowane JWT z Laravela
    // public function signup(Request $request)
    // {
    //     $validator = Validator::make($request->all(), [
    //         'firstName' => 'required|string',
    //         'lastName' => 'required|string',
    //         'email' => 'required|email|unique:users,email',
    //         'password' => 'required|string|min:8',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json([
    //             'message' => 'Validation error',
    //             'errors' => $validator->errors(),
    //         ], 400);
    //     }

    //     // Tworzenie nowego użytkownika
    //     $user = User::create([
    //         'first_name' => $request->firstName,
    //         'last_name' => $request->lastName,
    //         'email' => $request->email,
    //         'password' => Hash::make($request->password),
    //     ]);

    //     // Generowanie tokenu autoryzacji
    //     $token = $user->createToken('authToken')->plainTextToken;

    //     return response()->json([
    //         'message' => 'User created successfully',
    //         'user' => [
    //             'firstName' => $user->first_name,
    //             'lastName' => $user->last_name,
    //             'email' => $user->email,
    //         ],
    //         'token' => $token,
    //     ], 201);

    //     // JWT do Javy, ale aktualnie (2024-12-04) nic konkretnego nie ma
    //     // $response = Http::post(env('SPRING_API_URL') . '/api/v1/auth/signup', $request->all());

    //     // if ($response->successful()) {
    //     //     return response()->json([
    //     //         'message' => 'User created successfully',
    //     //         'firstName' => $request['firstName'],
    //     //         'lastName' => $request['lastName'],
    //     //         'email' => $request['email'],
    //     //         'password' => $request['password'],
    //     //     ]);
    //     // } else {
    //     //     return response()->json([
    //     //         'message' => 'Error creating user',
    //     //     ], 500);
    //     // }
    // }

    // Stare logowanie generowane JWT z Laravela
    // public function signin(Request $request)
    // {
    //     // Walidacja danych wejściowych
    //     $validator = Validator::make($request->all(), [
    //         'email' => 'required|email',
    //         'password' => 'required|string',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json([
    //             'message' => 'Validation error',
    //             'errors' => $validator->errors(),
    //         ], 400);
    //     }

    //     // Sprawdzanie poprawności danych logowania
    //     if (!Auth::attempt($request->only('email', 'password'))) {
    //         return response()->json([
    //             'message' => 'Invalid email or password',
    //         ], 401);
    //     }

    //     // Pobranie użytkownika
    //     $user = Auth::user();

    //     // Generowanie tokenu autoryzacji
    //     $token = $user->createToken('authToken')->plainTextToken;

    //     return response()->json([
    //         'message' => 'Logged in successfully',
    //         'user' => [
    //             'firstName' => $user->first_name,
    //             'lastName' => $user->last_name,
    //             'email' => $user->email,
    //         ],
    //         'token' => $token,
    //     ], 200);
    // }

    // public function signout(Request $request)
    // {
    //     // Usuwanie tokenu autoryzacji
    //     $request->user()->currentAccessToken()->delete();

    //     return response()->json([
    //         'message' => 'Logged out successfully',
    //     ], 200);
    // }
}

