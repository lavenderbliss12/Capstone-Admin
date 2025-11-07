<?php
// transactions.php - CRUD endpoints for `transaction` table
// Table fields: reference_id, user_id, name, reward, points_used, date, status
// LOCATION: src/components/php-backend/transactions.php

require_once __DIR__ . '/db.php';

function send_json_tx($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function handle_transactions($method, $id = null) {
    switch ($method) {
        case 'GET':
            if ($id) get_transaction((int)$id);
            else list_transactions();
            break;
        case 'POST':
            create_transaction();
            break;
        case 'PUT':
        case 'PATCH':
            if (!$id) send_json_tx(['error' => 'Missing id for update'], 400);
            update_transaction((int)$id);
            break;
        case 'DELETE':
            if (!$id) send_json_tx(['error' => 'Missing id for delete'], 400);
            delete_transaction((int)$id);
            break;
        default:
            send_json_tx(['error' => 'Unsupported method'], 405);
    }
}

function list_transactions() {
    $db = get_db();
    $stmt = $db->query('SELECT reference_id, user_id, name, reward, points_used, date, status FROM `transaction`');
    $rows = $stmt->fetchAll();
    send_json_tx($rows);
}

function get_transaction($id) {
    $db = get_db();
    $stmt = $db->prepare('SELECT reference_id, user_id, name, reward, points_used, date, status FROM `transaction` WHERE reference_id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) send_json_tx(['error' => 'Transaction not found'], 404);
    send_json_tx($row);
}

function create_transaction() {
    $db = get_db();
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) send_json_tx(['error' => 'Invalid JSON body'], 400);

    $user_id = $input['user_id'] ?? null;
    $name = $input['name'] ?? null;
    $reward = $input['reward'] ?? null;
    $points_used = $input['points_used'] ?? 0;
    $date = $input['date'] ?? date('Y-m-d H:i:s');
    $status = $input['status'] ?? 'pending';

    if (!$user_id || !$name || !$reward) {
        send_json_tx(['error' => 'Missing required fields (user_id, name, reward)'], 400);
    }

    try {
        $stmt = $db->prepare('INSERT INTO `transaction` (user_id, name, reward, points_used, date, status) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([$user_id, $name, $reward, $points_used, $date, $status]);
        $id = (int)$db->lastInsertId();
        send_json_tx(['success' => true, 'reference_id' => $id], 201);
    } catch (PDOException $e) {
        send_json_tx(['error' => 'Insert failed', 'message' => $e->getMessage()], 500);
    }
}

function update_transaction($id) {
    $db = get_db();
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) send_json_tx(['error' => 'Invalid JSON body'], 400);

    $fields = [];
    $values = [];
    $allowed = ['user_id','name','reward','points_used','date','status'];
    foreach ($allowed as $f) {
        if (array_key_exists($f, $input)) {
            $fields[] = "`$f` = ?";
            $values[] = $input[$f];
        }
    }
    if (empty($fields)) send_json_tx(['error' => 'No updatable fields provided'], 400);

    $values[] = $id;
    $sql = 'UPDATE `transaction` SET ' . implode(', ', $fields) . ' WHERE reference_id = ?';
    try {
        $stmt = $db->prepare($sql);
        $stmt->execute($values);
        send_json_tx(['success' => true]);
    } catch (PDOException $e) {
        send_json_tx(['error' => 'Update failed', 'message' => $e->getMessage()], 500);
    }
}

function delete_transaction($id) {
    $db = get_db();
    try {
        $stmt = $db->prepare('DELETE FROM `transaction` WHERE reference_id = ?');
        $stmt->execute([$id]);
        send_json_tx(['success' => true]);
    } catch (PDOException $e) {
        send_json_tx(['error' => 'Delete failed', 'message' => $e->getMessage()], 500);
    }
}
