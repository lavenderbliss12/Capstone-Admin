<?php
// db.php - simple PDO connection helper for XAMPP MySQL
// FILE LOCATION: src/components/php-backend/db.php
// CHANGE: added simple PHP backend inside components (for local XAMPP)

// Defaults for XAMPP on local machine. Override with environment variables if needed.
$DB_HOST = getenv('DB_HOST') ?: '127.0.0.1';
$DB_NAME = getenv('DB_NAME') ?: 'capstone';
$DB_USER = getenv('DB_USER') ?: 'root';
$DB_PASS = getenv('DB_PASS') ?: '';
$DB_CHARSET = getenv('DB_CHARSET') ?: 'utf8mb4';

// enable debug logging to file in this folder when developing
$DEBUG = true;

function get_db() {
    global $DB_HOST, $DB_NAME, $DB_USER, $DB_PASS, $DB_CHARSET, $DEBUG;

    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $dsn = "mysql:host={$DB_HOST};dbname={$DB_NAME};charset={$DB_CHARSET}";
    try {
        $pdo = new PDO($dsn, $DB_USER, $DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        if ($DEBUG) {
            error_log(date('[Y-m-d H:i:s]') . " DB connected: {$DB_USER}@{$DB_HOST}/{$DB_NAME}\n", 3, __DIR__ . '/db_debug.log');
        }
        return $pdo;
    } catch (PDOException $e) {
        if ($DEBUG) {
            error_log(date('[Y-m-d H:i:s]') . " DB connect failed: {$e->getMessage()}\n", 3, __DIR__ . '/db_debug.log');
        }
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed', 'hint' => 'Check XAMPP MySQL is running and DB credentials in src/components/php-backend/db.php']);
        exit;
    }
}

function send_json($data, $status = 200) {
    if (!headers_sent()) header('Content-Type: application/json; charset=utf-8');
    http_response_code($status);
    echo json_encode($data);
    // do not call exit here — caller should return
    return;
}
