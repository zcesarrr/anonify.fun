<?php
require_once __DIR__ . '/config/env.php';

$db_host = $_ENV['DB_HOST'];
$db_port = $_ENV['DB_PORT'];
$db_name = $_ENV['DB_NAME'];
$db_user = $_ENV['DB_USER'];
$db_pass = $_ENV['DB_PASS'];

try {
    $dsn = "pgsql:host=$db_host;port=$db_port;dbname=$db_name";
    $pdo = new PDO($dsn, $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    $pdo = null;
    $db_error = "Connection failed: " . $e->getMessage();
    die($db_error);
}

function query(PDO $pdo = null, $query) {
    if (!$pdo) {
        echo "No DB connection.";
        return;
    }

    $stmt = $pdo->prepare($query);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function print_rows($rows, $names) {
    if (!$rows) {
        echo "No rows.";
    } else {
        foreach ($rows as $value) {
            for ($i = 0; $i < count($names); $i++) {
                echo $names[$i].": " . htmlspecialchars($value[$names[$i]]);
                if ($i < count($names) - 1) echo " | ";
            }
            echo "<br>";
        }
    }
}
?>