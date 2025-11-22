<?php
require_once 'db.php';
$pdo = initDB();

header("Content-Type: application/json; chatset=utf-8");

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "JSON receivedd isn't valid."]);
    exit;
}

$msg = trim($input["msg"] ?? '');

if (strlen($msg) < 6) {
    http_response_code(422);
    echo json_encode(["status" => "error", "message" => "The message cannot be short!"]);
    exit;
}

query($pdo, "INSERT INTO messages(msg) VALUES(?);", [$msg]);

$responseData = [
    "msg" => $msg
];

echo json_encode([
    "status" => "success",
    "message" => "Operation successfully completed",
    "data" => $responseData
]);

/*if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $message = $_POST["message"];
    if (strlen($message) < 6) die("The message cannot be short!");

    query($pdo, "INSERT INTO messages(msg) VALUES(?);", [$message]);

    $messages_rows = queryNotParams($pdo, "SELECT * FROM messages");
    printRows($messages_rows, ["id", "msg"]);
}*/
?>