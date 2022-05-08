<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * AuthController constructor.
     *
     */
    public function __construct()
    {
        $this->middleware('status');
        $this->middleware('hasRole');
    }

    /**
     * Get user info
     *
     * @param Request $request
     * @return JsonResponse [string] message
     */
    public function getUser(Request $request): JsonResponse
    {
        return (new UserResource($request->user()))->response();
    }

    /**
     * Set user last logged in date
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getLoggedInUser(Request $request): JsonResponse
    {
        $user = $request->user();
        return (new UserResource($user))->response();
    }

    /**
     * Logout user (Revoke the token)
     *
     * @param Request $request
     * @return JsonResponse [string] message
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->token()->revoke();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

}
