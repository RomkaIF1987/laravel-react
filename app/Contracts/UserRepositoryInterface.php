<?php

namespace App\Contracts;

use App\Http\Requests\StoreUserCloneRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserProfileRequest;
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
    public function getUsers(Request $request);

    /**
     * Search users
     *
     * @param Request $request
     * @return mixed
     */
    public function searchUsers(Request $request);

    /**
     * Create and return user info
     *
     * @param StoreUserRequest $request
     * @return mixed
     */
    public function createUser(StoreUserRequest $request);

    /**
     * Get user info
     *
     * @param Request $request
     * @param User $user
     * @return mixed
     */
    public function getUser(Request $request, User $user);

    /**
     * Update and return user info
     *
     * @param UpdateUserRequest $request
     * @param User $user
     * @return mixed
     */
    public function updateUser(UpdateUserRequest $request, User $user);

    /**
     * Update and return user info
     *
     * @param UpdateUserProfileRequest $request
     * @param User $user
     * @return mixed
     */
    public function updateProfile(UpdateUserProfileRequest $request, User $user);

    /**
     * Clone user and return users list
     *
     * @param StoreUserCloneRequest $request
     * @return mixed
     */
    public function cloneUser(StoreUserCloneRequest $request);

    /**
     * Update status and return user info
     *
     * @param Request $request
     * @param User $user
     * @return mixed
     */
    public function updateUserStatus(Request $request, User $user);

    /**
     * Delete user
     *
     * @param User $user
     * @return mixed
     */
    public function deleteUser(User $user);

    /**
     * Display a listing of the revisions
     *
     * @param User $user
     * @return mixed
     */
    public function getUserRevisions(User $user);

    /**
     * Display the specified revision
     *
     * @param User $user
     * @param $revision
     * @return mixed
     */
    public function getUserRevision(User $user, $revision);

    /**
     * Get only trashed company users when company has become inactive
     *
     * @param $removalTime
     * @return mixed
     */
    public function getOnlyTrashedUsers($removalTime);

    /**
     * List users
     *
     * @param Request $request
     * @return mixed
     */
    public function getSuperAdmins(Request $request);
    
    /**
     * Users stats
     *
     * @return mixed
     */
    public function getStats();
}
