<?php
header("Content-Type: application/json; chatset=utf-8");

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "JSON received isn't valid."]);
    exit;
}


// Get data
$msg = trim($input["msg"] ?? '');


// Validations
if (strlen($msg) < 6) {
    http_response_code(422);
    echo json_encode(["status" => "error", "message" => "The message cannot be short!"]);
    exit;
}


// Do operations
require_once 'db.php';
$pdo = initDB();
query($pdo, "INSERT INTO messages(msg) VALUES(?);", [$msg]);


// Return response
$responseData = [
    "sentMessage" => $msg
];

echo json_encode([
    "status" => "success",
    "message" => "Operation successfully completed!",
    "data" => $responseData
]);
?>