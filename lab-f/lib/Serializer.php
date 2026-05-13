<?php
namespace App;
use App\Encoder\Enc_Interface;

class Serializer {
    private array $encoders;

    public function __construct(array $encoders) {
        $this->encoders = $encoders;
    }

    public function convert(string $data, string $from, string $to): string {
        $decoded = [];
        foreach ($this->encoders as $e) {
            if ($e->supports($from)) {
                $decoded = $e->decode($data, $from);
                break;
            }
        }
        foreach ($this->encoders as $e) {
            if ($e->supports($to)) {
                return $e->encode($decoded, $to);
            }
        }
        return $data;
    }
}