<?php
$clientIP = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

$fingerprint = md5($clientIP);

$attempts = (int)file_get_contents(__DIR__ . "/.attempts_$fingerprint") ?: 0;
$cooldown = min(30 * pow(2, $attempts), 300); // 15s, 30s, 60s, 120s, 300s max

$rateLimitFile = __DIR__ . '/.rate_limit' . $fingerprint;
$cooldownSeconds = $cooldown;

if (file_exists($rateLimitFile)) {
    $lastRequest = (int)file_get_contents($rateLimitFile);
    $timeLeft = $cooldownSeconds - (time() - $lastRequest);

    if ($timeLeft > 0) {
        $attempts++;
        file_put_contents(__DIR__ . "/.attempts_$fingerprint", $attempts);

        http_response_code(429);
        header("Retry-After: $timeLeft");
        echo json_encode([
            "status" => "error",
            "message" => "Too many messages! Please wait.",
            "retryAfter" => $timeLeft
        ]);
        exit();
    }
}

if (file_exists(__DIR__ . "/.attempts_$fingerprint")) {
    unlink(__DIR__ . "/.attempts_$fingerprint");
}
?>