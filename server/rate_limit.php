<?php
$clientIP = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$fingerprint = md5($clientIP);

$attemptsFile = __DIR__ . "/.attempts_$fingerprint";
$rateLimitFile = __DIR__ . "/.rate_limit_$fingerprint";

$attempts = 0;
if (file_exists($attemptsFile)) {
    $contents = @file_get_contents($attemptsFile);
    $attempts = (int)$contents;
}

$cooldown = min(30 * pow(2, max(0, $attempts)), 300);

if (file_exists($rateLimitFile)) {
    $lastRequest = (int)@file_get_contents($rateLimitFile);
    $elapsed = time() - $lastRequest;
    $timeLeft = $cooldown - $elapsed;

    if ($timeLeft > 0) {
        $attempts = $attempts + 1;
        @file_put_contents($attemptsFile, (string)$attempts, LOCK_EX);

        http_response_code(429);
        header('Content-Type: application/json; charset=utf-8');
        header("Retry-After: $timeLeft");
        header("X-RateLimit-Limit: $cooldown");
        header("X-RateLimit-Remaining: 0");
        header("X-RateLimit-Reset: " . (time() + $timeLeft));

        echo json_encode([
            "status" => "error",
            "message" => "Too many messages! Please wait.",
            "retryAfter" => $timeLeft
        ]);
        exit();
    }
}

if (file_exists($attemptsFile)) {
    @unlink($attemptsFile);
}
?>