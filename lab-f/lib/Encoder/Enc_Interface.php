<?php

namespace App\Encoder;

interface Enc_Interface
{
    public function supports(string $format): bool;

    public function decode(string $data, string $format): array;

    public function encode(array $data, string $format): string;
}