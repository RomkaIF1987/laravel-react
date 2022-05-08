<?php

namespace App\Http\Middleware;

use App\Exceptions\ForbiddenException;
use Closure;
use Illuminate\Http\Request;

class HasRole
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     * @throws ForbiddenException
     */
    public function handle(Request $request, Closure $next): mixed
    {
        $user = $request->user();
        $hasRole = false;
        if (!empty($user->role_id)) {
            $hasRole = true;
        }
        if (!$hasRole) {
            if (is_object($user)) {
                $user->token()->revoke();
            }
            throw new ForbiddenException('Insufficient permissions');
        }
        return $next($request);
    }
}
