<?php

namespace App\Encoder;
class JsonEncoder implements Enc_Interface
{
    public function supports(string $format): bool
    {
        return strtolower($format) === 'json';
    }

    public function decode(string $data, string $format): array
    {
        $decoded = json_decode($data, true);

        return is_array($decoded) ? $decoded : [];
    }

    public function encode(array $data, string $format): string
    {
        return json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}