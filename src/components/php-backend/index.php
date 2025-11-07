<?php
// index.php - simple router for PHP backend placed inside components
// Routes:
//  - /src/components/php-backend/index.php/users[/{id}]
//  - /src/components/php-backend/index.php/transactions[/{id}]
// NOTE: If served via Apache from repo root (C:\xampp\htdocs), the URL will be
// http://localhost/A-INCENTIVES-CAPSTONE/src/components/php-backend/index.php/users

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Split path and try to locate resource segment
$segments = array_values(array_filter(explode('/', $uri)));
$resource = $segments[count($segments)-1] === 'index.php' ? ($segments[count($segments)-2] ?? '') : ($segments[count($segments)-1] ?? '');
$id = null;
// allow patterns like /index.php/users/3 or /src/components/php-backend/index.php/users/3
for ($i=0; $i < count($segments); $i++) {
    if ($segments[$i] === 'index.php' && isset($segments[$i+1])) {
        $resource = $segments[$i+1];
        $id = $segments[$i+2] ?? null;
        break;
    }
}

if ($resource === 'users') {
    require_once __DIR__ . '/users.php';
    handle_users($method, $id);
    exit;
}

if ($resource === 'transactions') {
    require_once __DIR__ . '/transactions.php';
    handle_transactions($method, $id);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Not found', 'path' => $uri]);
