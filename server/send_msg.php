<?php
$rateLimitFile = __DIR__ . '/rate_limit.txt';
$cooldownSeconds = 15;

if (file_exists($rateLimitFile)) {
    $lastRequest = (int)file_get_contents($rateLimitFile);
    $timeLeft = $cooldownSeconds - (time() - $lastRequest);

    if ($timeLeft > 0) {
        http_response_code(429);
        header("Retry-After: $timeLeft");
        echo json_encode([
            "status" => "error",
            "message" => "Too many messages! Please wait $timeLeft seconds.",
            "retryAfter" => $timeLeft
        ]);
        exit();
    }
}

file_put_contents($rateLimitFile, time());

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
    "id" => $pdo->lastInsertId(),
    "sentMessage" => $msg
];

echo json_encode([
    "status" => "success",
    "message" => "The anonymous message has been sent successfully! :3",
    "data" => $responseData
]);
?>