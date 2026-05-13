<?php

namespace App\Encoder;


class CsvEncoder implements Enc_Interface
{
    private const DELIMITERS = [
        'csv' => ',',
        'ssv' => ';',
        'tsv' => "\t"
    ];

    public function supports(string $format): bool
    {
        return array_key_exists($format, self::DELIMITERS);
    }

    public function decode(string $data, string $format): array
    {
        $delimiter = self::DELIMITERS[$format];
        $lines = explode("\n", trim($data));
        if (empty($lines)) {
            return [];
        }

        $headers = str_getcsv(array_shift($lines), $delimiter, "\"", "\\");
        $result = [];

        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) continue;

            $row = str_getcsv($line, $delimiter, "\"", "\\");
            if (count($row) === count($headers)) {
                $result[] = array_combine($headers, $row);
            }
        }

        return $result;
    }

    public function encode(array $data, string $format): string
    {
        if (empty($data)) {
            return "";
        }

        $delimiter = self::DELIMITERS[$format];
        $handle = fopen('php://temp', 'r+');

        fputcsv($handle, array_keys($data[0]), $delimiter, "\"", "\\");

        foreach ($data as $row) {
            fputcsv($handle, $row, $delimiter, "\"", "\\");
        }

        rewind($handle);
        $output = stream_get_contents($handle);
        fclose($handle);

        return trim($output);
    }

}