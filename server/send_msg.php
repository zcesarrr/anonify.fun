<?php
require_once 'db.php';
header("Content-Type: application/json; chatset=utf-8");

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "JSON received isn't valid."]);
    exit;
}

$msg = trim($input["msg"] ?? '');

if (strlen($msg) < 6) {
    http_response_code(422);
    echo json_encode(["status" => "error", "message" => "The message cannot be short!"]);
    exit;
}

$pdo = initDB();
query($pdo, "INSERT INTO messages(msg) VALUES(?);", [$msg]);

$responseData = [
    "sentMessage" => $msg
];

echo json_encode([
    "status" => "success",
    "message" => "Operation successfully completed!",
    "data" => $responseData
]);
?>