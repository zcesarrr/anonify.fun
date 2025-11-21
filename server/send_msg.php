<?php
require_once 'db.php';
$pdo = start_db();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $message = $_POST["message"];
    query($pdo, "INSERT INTO messages(msg) VALUES(?);", [$message]);

    $messages_rows = query_notparams($pdo, "SELECT * FROM messages");
    print_rows($messages_rows, ["id", "msg"]);
}
?>