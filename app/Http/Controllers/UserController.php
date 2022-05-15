<?php

namespace App\Http\Controllers;

use App\Contracts\UserRepositoryInterface;
use App\Http\Requests\StoreUserCloneRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserProfileRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\StatusResource;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserListCollection;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class UserController extends Controller
{
    /**
     * @var UserRepositoryInterface
     */
    private UserRepositoryInterface $userRepository;

    /**
     * UserController constructor.
     *
     * @param UserRepositoryInterface $userRepository
     */
    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        return (UserResource::collection($this->userRepository->getUsers($request)))->response();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param StoreUserRequest $request
     * @return JsonResponse
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userRepository->createUser($request);
        return (new UserResource($user))->response();
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @param User $user
     * @return JsonResponse
     */
    public function show(Request $request, User $user): JsonResponse
    {
        return $this->userRepository->getUser($request, $user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateUserRequest $request
     * @param User $user
     * @return JsonResponse
     */
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $user = $this->userRepository->updateUser($request, $user);
        return (new UserResource($user))->response();
    }

    /**
     * Get user info
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getProfile(Request $request): JsonResponse
    {
        return (new UserResource($request->user()))->response();
    }

    /**
     * Update auth user.
     *
     * @param UpdateUserProfileRequest $request
     * @return JsonResponse
     */
    public function updateProfile(UpdateUserProfileRequest $request): JsonResponse
    {
        $this->userRepository->updateProfile($request, $request->user());
        return (new UserCollection($this->userRepository->getUsers($request)))->response();
    }

    /**
     * Store clone and return specified resource.
     *
     * @param StoreUserCloneRequest $request
     * @return JsonResponse
     */
    public function clone(StoreUserCloneRequest $request): JsonResponse
    {
        $this->userRepository->cloneUser($request);
        return (new UserCollection($this->userRepository->getUsers($request)))->response();
    }

    /**
     * Update status and return specified resource.
     *
     * @param Request $request
     * @param User $user
     * @return JsonResponse
     */
    public function status(Request $request, User $user): JsonResponse
    {
        $user = $this->userRepository->updateUserStatus($request, $user);
        return (new StatusResource($user))->response();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param User $user
     * @return Response
     */
    public function destroy(User $user): Response
    {
        $this->userRepository->deleteUser($user);
        return response(null, ResponseAlias::HTTP_NO_CONTENT);
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function superAdminsIndex(Request $request): JsonResponse
    {
        return (new UserListCollection($this->userRepository->getSuperAdmins($request)))->response();
    }
    
    /**
     * Display a stats of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function stats(Request $request): JsonResponse
    {
        return response()->json($this->userRepository->getStats());
    }

}
