<?php
require_once 'db.php';

$rows = query($pdo, "SELECT * FROM messages");
print_rows($rows, ["id", "msg"]);
?>