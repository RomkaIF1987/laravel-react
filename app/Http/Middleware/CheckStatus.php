<?php

namespace App\Http\Middleware;

use App\Exceptions\ForbiddenException;
use Closure;
use Illuminate\Http\Request;

class CheckStatus
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     * @throws ForbiddenException
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        $isActive = false;
        if (isset($user->status)) {
            $isActive = $user->status;
        }
        if (!$isActive) {
            if (is_object($user)) {
                $user->token()->revoke();
            }
            throw new ForbiddenException('Insufficient permissions');
        }
        return $next($request);
    }
}
