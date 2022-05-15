<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->group(function () {
    Route::get('user', [AuthController::class, 'getUser']);
    Route::get('logged_in', [AuthController::class, 'getLoggedInUser']);
    Route::get('logout', [AuthController::class, 'logout']);

    Route::get('users/profile', [UserController::class, 'getProfile']);
    Route::put('users/profile', [UserController::class, 'updateProfile']);
    Route::put('users/{user}/status', [UserController::class, 'status']);
    Route::post('users/clone', [UserController::class, 'clone']);
    Route::get('users/super_admins', [UserController::class, 'superAdminsIndex']);
    Route::get('users/stats', [UserController::class, 'stats']);
    Route::apiResource('users', UserController::class);
});
