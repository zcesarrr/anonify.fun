<?php
require_once 'db.php';
$pdo = start_db();

query($pdo, "INSERT INTO messages(msg) VALUES(?);", ["holaaaauwhads"]);

$messages_rows = query_notparams($pdo, "SELECT * FROM messages");
print_rows($messages_rows, ["id", "msg"]);
?>