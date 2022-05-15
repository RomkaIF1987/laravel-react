<?php

namespace App\Providers;

use App\Contracts\UserRepositoryInterface;
use App\Repositories\UserRepository;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * All the container singletons that should be registered.
     *
     * @var array
     */
    public array $singletons = [
        UserRepositoryInterface::class => UserRepository::class,
    ];

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
