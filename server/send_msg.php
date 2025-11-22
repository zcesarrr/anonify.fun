<?php
require_once 'db.php';
$pdo = initDB();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $message = $_POST["message"];
    if (strlen($message) < 6) die("The message cannot be short!");

    query($pdo, "INSERT INTO messages(msg) VALUES(?);", [$message]);

    $messages_rows = queryNotParams($pdo, "SELECT * FROM messages");
    printRows($messages_rows, ["id", "msg"]);
}
?>