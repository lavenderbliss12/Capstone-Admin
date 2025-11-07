<?php
// users.php - CRUD endpoints for `user` table
// Table fields: id, surname, name, email, date_created, password, points
// LOCATION: src/components/php-backend/users.php

require_once __DIR__ . '/db.php';

function send_json($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function handle_users($method, $id = null) {
    switch ($method) {
        case 'GET':
            if ($id) get_user((int)$id);
            else list_users();
            break;
        case 'POST':
            create_user();
            break;
        case 'PUT':
        case 'PATCH':
            if (!$id) send_json(['error' => 'Missing id for update'], 400);
            update_user((int)$id);
            break;
        case 'DELETE':
            if (!$id) send_json(['error' => 'Missing id for delete'], 400);
            delete_user((int)$id);
            break;
        default:
            send_json(['error' => 'Unsupported method'], 405);
    }
}

function list_users() {
    $db = get_db();
    // include course in returned rows
    $stmt = $db->query('SELECT id, surname, name, email, course, date_created, points FROM `user`');
    $rows = $stmt->fetchAll();
    send_json($rows);
}

function get_user($id) {
    $db = get_db();
    $stmt = $db->prepare('SELECT id, surname, name, email, course, date_created, points FROM `user` WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) send_json(['error' => 'User not found'], 404);
    send_json($row);
}

function create_user() {
    $db = get_db();
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) send_json(['error' => 'Invalid JSON body'], 400);

    // basic required fields
    $surname = $input['surname'] ?? null;
    $name = $input['name'] ?? null;
    $email = $input['email'] ?? null;
    $password = $input['password'] ?? null; // plain text in this simple scaffold
    $points = $input['points'] ?? 0;
    $course = $input['course'] ?? '';

    if (!$surname || !$name || !$email || !$password) {
        send_json(['error' => 'Missing required fields (surname, name, email, password)'], 400);
    }

    try {
    $stmt = $db->prepare('INSERT INTO `user` (surname, name, email, course, password, points) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([$surname, $name, $email, $course, $password, $points]);
        $id = (int)$db->lastInsertId();
        // NOTE: date_created is set by DB default
        send_json(['success' => true, 'id' => $id], 201);
    } catch (PDOException $e) {
        send_json(['error' => 'Insert failed', 'message' => $e->getMessage()], 500);
    }
}

function update_user($id) {
    $db = get_db();
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) send_json(['error' => 'Invalid JSON body'], 400);

    $fields = [];
    $values = [];
    $allowed = ['surname','name','email','password','points','course'];
    foreach ($allowed as $f) {
        if (array_key_exists($f, $input)) {
            $fields[] = "`$f` = ?";
            $values[] = $input[$f];
        }
    }
    if (empty($fields)) send_json(['error' => 'No updatable fields provided'], 400);

    $values[] = $id;
    $sql = 'UPDATE `user` SET ' . implode(', ', $fields) . ' WHERE id = ?';
    try {
        $stmt = $db->prepare($sql);
        $stmt->execute($values);
        send_json(['success' => true]);
    } catch (PDOException $e) {
        send_json(['error' => 'Update failed', 'message' => $e->getMessage()], 500);
    }
}

function delete_user($id) {
    $db = get_db();
    try {
        $stmt = $db->prepare('DELETE FROM `user` WHERE id = ?');
        $stmt->execute([$id]);
        send_json(['success' => true]);
    } catch (PDOException $e) {
        send_json(['error' => 'Delete failed', 'message' => $e->getMessage()], 500);
    }
}
