<?php
header("Content-Type: application/json; chatset=utf-8");

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "JSON received isn't valid."]);
    exit;
}


// Get data
$quantity = trim(intval($input["quantity"] ?? 10));


// Validations
if ($quantity == 0) {
    $quantity = 9999;
} else if ($quantity < 0){
    http_response_code(422);
    echo json_encode(["status" => "error", "message" => "The quantity must be 1 or greater."]);
    exit;
}


// Do operations
require_once 'db.php';
$pdo = initDB();
$rows_result = query($pdo, "SELECT * FROM messages ORDER BY id DESC LIMIT ?;", [$quantity]);


// Return response
$responseData = [
    "lastMessages" => $rows_result
];

echo json_encode([
    "status" => "success",
    "message" => "Operation successfully completed!",
    "data" => $responseData
]);
?>