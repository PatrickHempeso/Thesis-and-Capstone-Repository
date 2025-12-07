<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Http\Middleware\HandleCors;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {

        // CORS should be applied to API routes
        $middleware->api(prepend: [
            HandleCors::class,
        ]);

        // Sanctum SPA must be applied to web middleware
        $middleware->web(append: [
            EnsureFrontendRequestsAreStateful::class,
        ]);

    }) // ✅ close withMiddleware properly
    ->withExceptions(function (Exceptions $exceptions): void {
        // optional exception config
    }) // ✅ close withExceptions properly
    ->create();
