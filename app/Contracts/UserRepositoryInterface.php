<?php

namespace App\Contracts;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;

interface UserRepositoryInterface
{
    /**
     * List users
     *
     * @param Request $request
     * @return mixed
     */
    public function getUsers(Request $request): mixed;

    /**
     * Create and return user info
     *
     * @param StoreUserRequest $request
     * @return mixed
     */
    public function createUser(StoreUserRequest $request): mixed;

    /**
     * Get user info
     *
     * @param Request $request
     * @param User $user
     * @return mixed
     */
    public function getUser(Request $request, User $user): mixed;

    /**
     * Update and return user info
     *
     * @param UpdateUserRequest $request
     * @param User $user
     * @return mixed
     */
    public function updateUser(UpdateUserRequest $request, User $user): mixed;

    /**
     * Update status and return user info
     *
     * @param Request $request
     * @param User $user
     * @return mixed
     */
    public function updateUserStatus(Request $request, User $user): mixed;

    /**
     * Delete user
     *
     * @param User $user
     * @return void
     */
    public function deleteUser(User $user): void;

    /**
     * List users
     *
     * @param Request $request
     * @return mixed
     */
    public function getSuperAdmins(Request $request): mixed;
    
    /**
     * Users stats
     *
     * @return mixed
     */
    public function getStats(): mixed;
}
