<?php

namespace App\Encoder;

class YamlEncoder implements Enc_Interface
{
    public function supports(string $format): bool
    {
        return strtolower($format) === 'yaml';
    }

    public function decode(string $data, string $format): array
    {
        if (!function_exists('yaml_parse')) {
            return ["error" => "Rozszerzenie YAML nie jest zainstalowane"];
        }

        $decoded = yaml_parse($data);
        return is_array($decoded) ? $decoded : [];
    }

    public function encode(array $data, string $format): string
    {
        if (!function_exists('yaml_emit')) {
            return "Błąd: Brak rozszerzenia YAML w PHP.";
        }

        return yaml_emit($data);
    }
}