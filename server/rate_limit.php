<?php
$rateLimitFile = __DIR__ . '/.rate_limit';
$cooldownSeconds = 15;

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