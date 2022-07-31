<?php

namespace App\Repositories;

use App\Contracts\UserRepositoryInterface;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use InvalidArgumentException;
use JetBrains\PhpStorm\ArrayShape;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    /**
     * UserRepository constructor.
     *
     * @param User $user
     */
    public function __construct(User $user)
    {
        parent::__construct($user);
    }

    /**
     * List users
     *
     * @param Request $request
     * @return mixed
     */
    public function getUsers(Request $request): mixed
    {
        $users = $this->model;

        $request->validate([
            'offset' => 'integer',
            'limit' => 'integer|max:100',
            'sort' => 'string',
            'order' => 'string|in:asc,desc',
            'page' => 'integer'
        ]);

        $perPage = $this->model->getPerPage();
        $limit = (int) $request->input('limit', $perPage);
//        $users = $users->filter($request);

        if ($request->has('sort') && $request->sort === 'role' && $request->has('order')) {
            $users = $users->select(['users.*'])->leftJoin('roles', 'roles.id', '=', 'role_id')->orderBy('roles.title', $request->input('order'));
        } elseif ($request->has('sort') && $request->sort === 'created' && $request->has('order')) {
            $users = $users->orderBy('users.created_at', $request->input('order'));
        } elseif ($request->has('sort') && $request->sort === 'modified' && $request->has('order')) {
            $users = $users->orderBy('users.updated_at', $request->input('order'));
        } elseif ($request->has('sort') && $request->sort === 'full_name' && $request->has('order')) {
            $users = $users->orderBy('users.last_name', $request->input('order'));
        } elseif ($request->has('sort') && $request->has('order')) {
            $users = $users->orderBy($request->input('sort'), $request->input('order'));
        }

        return $users->paginate($limit);
    }

    /**
     * Create and return user info
     *
     * @param StoreUserRequest $request
     * @return User
     */
    public function createUser(StoreUserRequest $request): User
    {
        try {
            $params = $request->all();
            $password = array_key_exists('password', $params) ? $params['password'] : '';
            $user = new User;
            $user->first_name = array_key_exists('first_name', $params) ? $params['first_name'] : '';
            $user->last_name = array_key_exists('last_name', $params) ? $params['last_name'] : '';
            $user->email = array_key_exists('email', $params) ? $params['email'] : '';
            $user->password = !empty($password) ? bcrypt($password) : '';
            $user->role_id = array_key_exists('role_id', $params) ? $params['role_id'] : null;
            $user->status = array_key_exists('status', $params) ? $params['status'] : false;
            $user->save();
            return $user;
        } catch (InvalidArgumentException $e) {
            throw new InvalidArgumentException($e->getMessage(), 400, $e);
        }
    }

    /**
     * Get user info
     *
     * @param Request $request
     * @param User $user
     * @return JsonResponse
     */
    public function getUser(Request $request, User $user): JsonResponse
    {
        if ($user->id === '1' && !$request->user()->isSuperAdmin()) {
            return response()->json(['code' => '404', 'message' => 'Item could not be found. Please check identifier.', 'errors' => []], 404);
        }
        return (new UserResource($user))->response();
    }

    /**
     * Update and return user info
     *
     * @param UpdateUserRequest $request
     * @param User $user
     * @return Model
     */
    public function updateUser(UpdateUserRequest $request, User $user): Model
    {
        try {
            $params = $request->all();
            $user->first_name = array_key_exists('first_name', $params) ? $params['first_name'] : '';
            $user->last_name = array_key_exists('last_name', $params) ? $params['last_name'] : '';
            $user->email = array_key_exists('email', $params) ? $params['email'] : '';
            if (array_key_exists('password', $params) && $params['password'] != '') {
                $user->password = bcrypt($params['password']);
            }
            $user->role_id = array_key_exists('role_id', $params) ? $params['role_id'] : null;
            $user->status = array_key_exists('status', $params) ? $params['status'] : false;
            $user->save();
            return $user;
        } catch (InvalidArgumentException $e) {
            throw new InvalidArgumentException($e->getMessage(), 400, $e);
        }
    }

    /**
     * Update status and return user info
     *
     * @param Request $request
     * @param User $user
     * @return Model
     */
    public function updateUserStatus(Request $request, User $user): Model
    {
        try {
            $request->validate(['status' => 'boolean']);
            $params = $request->all();
            $user->status = array_key_exists('status', $params) ? $params['status'] : false;
            $user->save();
            return $user;
        } catch (InvalidArgumentException $e) {
            throw new InvalidArgumentException($e->getMessage(), 400, $e);
        }
    }

    /**
     * Delete user
     *
     * @param User $user
     * @return void
     */
    public function deleteUser(User $user): void
    {
        try {
            $user->delete();
        } catch (InvalidArgumentException $e) {
            throw new InvalidArgumentException($e->getMessage(), 400, $e);
        }
    }

    /**
     * List users
     *
     * @param Request $request
     * @return mixed
     */
    public function getSuperAdmins(Request $request): mixed
    {
        return $this->model->superadmin()->get();
    }

    /**
     * Users stats
     *
     * @return array
     */
    #[ArrayShape(['all' => "mixed", 'active' => "mixed", 'inactive' => "mixed"])] public function getStats(): array
    {
        return [
            'all' => $this->model->count(),
            'active' => $this->model->where('status', 1)->count(),
            'inactive' => $this->model->where('status', 0)->count(),
        ];
    }

}
