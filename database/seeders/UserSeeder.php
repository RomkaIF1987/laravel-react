<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'first_name' => 'Roman',
            'last_name' => 'Admin',
            'email' => 'roman@admin.net',
            'password' => Hash::make('passWord1'),
            'role_id' => 1,
            'status' => true
        ]);
    }
}
