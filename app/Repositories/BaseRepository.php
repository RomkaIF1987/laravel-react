<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

abstract class BaseRepository
{
    /**
     * @var static|mixed Model
     */
    protected $model;

    /**
     * BaseRepository constructor.
     *
     * @param Model $model
     */
    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * Get multiple records from DB
     *
     * @param Request|null $request
     * @return mixed (\Illuminate\Database\Eloquent\Collection or \Illuminate\Pagination\LengthAwarePaginator)
     */
    public function getRecords(Request $request = null, $where = [])
    {
        $query = $this->model->where($where);

        $request->validate([
            'offset' => 'integer',
            'limit' => 'integer|max:100',
            'sort' => 'string',
            'order' => 'string|in:asc,desc',
            'page' => 'integer'
        ]);

        $perPage = $this->model->getPerPage();
        $limit = (int) $request->input('limit', $perPage);
        $query = $query->filter($request);

        if ($request->has('sort') && $request->sort == 'created' && $request->has('order')) {
            $query = $query->orderBy('created_at', $request->input('order'));
        } elseif ($request->has('sort') && $request->sort == 'modified' && $request->has('order')) {
            $query = $query->orderBy('updated_at', $request->input('order'));
        } elseif ($request->has('sort') && $request->has('order')) {
            $query = $query->orderBy($request->input('sort'), $request->input('order'));
        }

        return $query->paginate($limit);
    }

    /**
     * Get multiple records from DB
     *
     * @param Request $request
     * @return mixed (\Illuminate\Database\Eloquent\Collection or \Illuminate\Pagination\LengthAwarePaginator)
     */
    public function getAllRecords(Request $request = null)
    {
        return $this->model->get();
    }

    /**
     * Get multiple records from DB
     *
     * @param Request $request
     * @return mixed (\Illuminate\Database\Eloquent\Collection or \Illuminate\Pagination\LengthAwarePaginator)
     */
    public function getAllActiveRecords(Request $request = null)
    {
        return $this->model->active()->get();
    }

    /**
     * Get single record from DB
     *
     * @param mixed $where
     * @return Model
     */
    public function getRecord($where = [])
    {
        if (!empty($where)) {
            return $this->model->where($where)->first();
        } else {
            return $this->model->first();
        }
    }

    /**
     * Get single record from DB or throw an exception if not found
     *
     * @param mixed $where
     * @return Model
     * @throws ModelNotFoundException
     */
    public function getRecordOrFail($where = [])
    {
        if (!empty($where)) {
            return $this->model->where($where)->firstOrFail();
        } else {
            return $this->model->firstOrFail();
        }
    }

    /**
     * Get single record from DB by ID
     *
     * @param string $id
     * @return Model
     */
    public function getRecordById($id)
    {
        return $this->model->find($id);
    }

    /**
     * Get single record from DB by ID or throw an exception if not found
     *
     * @param string $id
     * @return Model
     * @throws ModelNotFoundException
     */
    public function getRecordByIdOrFail($id)
    {
        return $this->model->findOrFail($id);
    }
}
