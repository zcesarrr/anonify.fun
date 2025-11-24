<?php
$clientIP = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
$acceptLang = $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? 'unknown';


$fingerprint = md5($clientIP . $userAgent . $acceptLang);

$attempts = (int)file_get_contents(__DIR__ . "/.attempts_$fingerprint") ?: 0;
$cooldown = min(15 * pow(2, $attempts), 300); // 15s, 30s, 60s, 120s, 300s max


if (strlen($userAgent) < 10 || strpos($userAgent, 'bot') !== false) {
    $cooldown *= 3;
}

$rateLimitFile = __DIR__ . '/.rate_limit' . $fingerprint;
$cooldownSeconds = $cooldown;

if (file_exists($rateLimitFile)) {
    $lastRequest = (int)file_get_contents($rateLimitFile);
    $timeLeft = $cooldownSeconds - (time() - $lastRequest);

    if ($timeLeft > 0) {
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
?>