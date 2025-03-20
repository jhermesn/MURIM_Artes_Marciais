<?php
namespace Config;

use Firebase\JWT\JWT as FirebaseJWT;
use Firebase\JWT\Key;

class JWT {
    private static $secretKey = "12345678";

    public static function generate(array $payload, int $expirySeconds = 3600): string {
        $issuedAt = time();
        $expiresAt = $issuedAt + $expirySeconds;
        $payload["iat"] = $issuedAt;
        $payload["exp"] = $expiresAt;

        return FirebaseJWT::encode($payload, self::$secretKey, "HS256");
    }

    public static function verify(string $token): ?array {
        try {
            $decoded = FirebaseJWT::decode($token, new Key(self::$secretKey, "HS256"));
            $data = (array)$decoded;
            if (time() > $data["exp"]) {
                return null;
            }
            return $data;
        } catch (\Exception $e) {
            return null;
        }
    }
}