<?php

namespace App\Http\Middleware;

use App\Exceptions\ForbiddenException;
use App\Models\Role;
use Closure;
use Illuminate\Http\Request;

class CheckRoles
{
    /**
     * Handle the incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @param array $roles
     * @return mixed
     * @throws ForbiddenException
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();
        if ($user && $user->role_id) {
            $hasPermissions = false;
            if ($user->role_id === Role::ROLE_SUPER_ADMIN) {
                $hasPermissions = true;
            } elseif (in_array($user->role_id, $roles)) {
                $hasPermissions = true;
            }
            if (!$hasPermissions) {
                throw new ForbiddenException('Insufficient permissions');
            }
        } else {
            throw new ForbiddenException('Insufficient permissions');
        }
        return $next($request);
    }
}
