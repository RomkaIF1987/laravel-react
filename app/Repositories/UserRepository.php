<?php

namespace App\Repositories;

use App\Contracts\UserRepositoryInterface;
use App\Http\Requests\StoreUserCloneRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserProfileRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Mail\UserCreateMail;
use App\Models\Role;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use InvalidArgumentException;

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
    public function getUsers(Request $request)
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

        if ($request->has('sort') && $request->sort == 'role' && $request->has('order')) {
            $users = $users->select(['users.*'])->leftJoin('roles', 'roles.id', '=', 'role_id')->orderBy('roles.title', $request->input('order'));
        } elseif ($request->has('sort') && $request->sort == 'company' && $request->has('order')) {
            $users = $users->select(['users.*'])->leftJoin('companies', 'companies.id', '=', 'company_id')->orderBy('companies.title', $request->input('order'));
        } elseif ($request->has('sort') && $request->sort == 'created' && $request->has('order')) {
            $users = $users->orderBy('users.created_at', $request->input('order'));
        } elseif ($request->has('sort') && $request->sort == 'modified' && $request->has('order')) {
            $users = $users->orderBy('users.updated_at', $request->input('order'));
        } elseif ($request->has('sort') && $request->sort == 'full_name' && $request->has('order')) {
            $users = $users->orderBy('users.last_name', $request->input('order'));
        } elseif ($request->has('sort') && $request->has('order')) {
            $users = $users->orderBy($request->input('sort'), $request->input('order'));
        }

        return $users->paginate($limit);
    }

    /**
     * Search users
     *
     * @param Request $request
     * @return mixed
     */
    public function searchUsers(Request $request)
    {
        $query = $this->model;
        if ($request->has('keyword')) {
            $query = $query->where('email', 'like', '%' . $request['keyword'] . '%');
            $query = $query->orWhere('first_name', 'like', '%' . $request['keyword'] . '%');
            $query = $query->orWhere('last_name', 'like', '%' . $request['keyword'] . '%');
        }
        return $query->get();
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
            $user->company_id = $request->user()->isSuperAdmin() ? (array_key_exists('status', $params) ? $params['company_id'] : null) : $request->user()->company_id;
            $user->status = array_key_exists('status', $params) ? $params['status'] : false;
            $user->created_by = $request->user()->id || null;
             if ($user->save()) {
                 Mail::to($user->email)->queue(new UserCreateMail($user, $password));
             }
            return $user;
        } catch (InvalidArgumentException $e) {
            throw new InvalidArgumentException($e->getMessage(), 400, $e);
        }
    }

    /**
     * Clone user
     *
     * @param StoreUserCloneRequest $request
     * @return User
     * @throws Exception
     */
    public function cloneUser(StoreUserCloneRequest $request): User
    {
        try {
            $params = $request->all();
            $parentUser = $this->getRecordByIdOrFail($params['parent_id']);
            $user = new User;
            if ($parentUser) {
                $cloneEmail = 'clone@gmail.com';
                if (!empty($parentUser->email)) {
                    $parts = explode('@', $parentUser->email);
                    $userName = $parts[0] . '+clone' . random_int(1, 999);
                    $cloneEmail = $userName . '@' . $parts[1];
                }
                $user->first_name = $parentUser->first_name;
                $user->last_name = $parentUser->last_name;
                $user->email = $cloneEmail;
                $user->password = $parentUser->password;
                $user->role_id = $parentUser->role_id;
                $user->company_id = $parentUser->company_id;
                $user->status = false;
                $user->created_by = $parentUser->id || null;
                $user->save();
            }
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
        if (($user->id === '1' && !((string)$request->user()->id === $user->id) || !$request->user()->isSuperAdmin() && $user->company_id !== $request->user()->company_id)) {
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
            $user->company_id = array_key_exists('status', $params) ? $params['company_id'] : null;
            $user->status = array_key_exists('status', $params) ? $params['status'] : false;
            $user->updated_by = $request->user()->id || null;
            $user->save();
            return $user;
        } catch (InvalidArgumentException $e) {
            throw new InvalidArgumentException($e->getMessage(), 400, $e);
        }
    }

    /**
     * Update and return user info
     *
     * @param UpdateUserProfileRequest $request
     * @param User $user
     * @return Model
     */
    public function updateProfile(UpdateUserProfileRequest $request, User $user): Model
    {
        try {
            $params = $request->all();
            $user->first_name = array_key_exists('first_name', $params) ? $params['first_name'] : '';
            $user->last_name = array_key_exists('last_name', $params) ? $params['last_name'] : '';
            $user->email = array_key_exists('email', $params) ? $params['email'] : '';
            if (array_key_exists('password', $params) && $params['password'] != '') {
                $user->password = bcrypt($params['password']);
            }
            $user->status = array_key_exists('status', $params) ? $params['status'] : false;
            $user->updated_by = $request->user()->id || null;
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
    public function deleteUser(User $user)
    {
        try {
            $user->delete();
        } catch (InvalidArgumentException $e) {
            throw new InvalidArgumentException($e->getMessage(), 400, $e);
        }
    }

    /**
     * Display a listing of the revisions.
     *
     * @param User $user
     * @return mixed
     */
    public function getUserRevisions(User $user)
    {
        try {
            return $this->model->getRevisions($user);
        } catch (InvalidArgumentException $e) {
            throw new InvalidArgumentException($e->getMessage(), 400, $e);
        }
    }

    /**
     * Display the specified revision.
     *
     * @param User $user
     * @param $revision
     * @return mixed
     */
    public function getUserRevision(User $user, $revision)
    {
        try {
            return $this->model->getRevision($user, $revision);
        } catch (InvalidArgumentException $e) {
            throw new InvalidArgumentException($e->getMessage(), 400, $e);
        }
    }

    /**
     * Get only trashed company users when company has become inactive
     *
     * @param $removalTime
     * @return mixed
     */
    public function getOnlyTrashedUsers($removalTime)
    {
        return $this->model->onlyTrashed()->where('deleted_at' >= $removalTime)->get();
    }

    /**
     * List users
     *
     * @param Request $request
     * @return mixed
     */
    public function getSuperAdmins(Request $request)
    {
        return $this->model->superadmin()->get();
    }

    /**
     * Users stats
     *
     * @return mixed
     */
    public function getStats()
    {
        return [
            'all' => $this->model->count(),
            'active' => $this->model->where('status', 1)->count(),
            'inactive' => $this->model->where('status', 0)->count(),
        ];
    }

}
