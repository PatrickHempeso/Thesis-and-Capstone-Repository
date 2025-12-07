<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Authentication Defaults
    |--------------------------------------------------------------------------
    */

    'defaults' => [
        'guard' => env('AUTH_GUARD', 'web'),
        'passwords' => env('AUTH_PASSWORD_BROKER', 'users'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Authentication Guards
    |--------------------------------------------------------------------------
    | We added 'student' and 'faculty' here using the 'session' driver 
    | for your Sanctum SPA setup.
    */

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],
        //  START CUSTOM GUARDS 
        'student' => [
            'driver' => 'session', 
            'provider' => 'students',
        ],
        'faculty' => [
            'driver' => 'session', 
            'provider' => 'faculty',
        ],
        //  END CUSTOM GUARDS 
    ],

    /*
    |--------------------------------------------------------------------------
    | User Providers
    |--------------------------------------------------------------------------
    | We added the 'students' and 'faculty' providers, linking them to their models.
    */

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => env('AUTH_MODEL', App\Models\User::class),
        ],
        
        // START CUSTOM PROVIDERS 
        'students' => [
            'driver' => 'eloquent',
            'model' => App\Models\Student::class,
        ],
        'faculty' => [
            'driver' => 'eloquent',
            'model' => App\Models\Faculty::class,
        ],
        //  END CUSTOM PROVIDERS 
    ],

    /*
    |--------------------------------------------------------------------------
    | Resetting Passwords
    |--------------------------------------------------------------------------
    */

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => env('AUTH_PASSWORD_RESET_TOKEN_TABLE', 'password_reset_tokens'),
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Password Confirmation Timeout
    |--------------------------------------------------------------------------
    */

    'password_timeout' => env('AUTH_PASSWORD_TIMEOUT', 10800),

];