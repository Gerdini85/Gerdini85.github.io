<?php
// 1. Debugowanie i dołączenie Autoloadera
use App\Encoder\CsvEncoder;
use App\Encoder\JsonEncoder;
use App\Encoder\YamlEncoder;
use App\Serializer;

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/autoload.php';

// 2. Obsługa ciasteczek i danych
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = $_POST['raw_input'] ?? '';
    $inputFormat = $_POST['input_format'] ?? 'csv';
    $outputFormat = $_POST['output_format'] ?? 'json';

    setcookie('last_data', $rawInput, time() + (86400 * 30), "/");
    setcookie('last_in', $inputFormat, time() + (86400 * 30), "/");
    setcookie('last_out', $outputFormat, time() + (86400 * 30), "/");
} else {
    $rawInput = $_COOKIE['last_data'] ?? '';
    $inputFormat = $_COOKIE['last_in'] ?? 'csv';
    $outputFormat = $_COOKIE['last_out'] ?? 'json';
}

$result = "";

// 3. Logika konwersji
if (!empty($rawInput)) {
    $encoders = [
            new CsvEncoder(),
            new JsonEncoder(),
            new YamlEncoder()
    ];

    $serializer = new Serializer($encoders);

    $result = $serializer->convert($rawInput, $inputFormat, $outputFormat);
}
?>

<!--4. Html-->
<!DOCTYPE html>
<html lang="pl">
<head>
    <title>Gerard Fiał (57701) - PTW LAB F</title>
</head>
<body>
<h1>Konwerter formatów</h1>
<form method="post">
    <textarea name="raw_input" rows="10" cols="50" placeholder="Wklej dane tutaj..."><?php echo htmlspecialchars($rawInput); ?></textarea>
    <br>
    Wejście:
    <select name="input_format">
        <?php foreach(['csv','ssv','tsv','json','yaml'] as $f): ?>
            <option value="<?=$f?>" <?=$inputFormat==$f?'selected':''?>><?=strtoupper($f)?></option>
        <?php endforeach; ?>
    </select>

    Wyjście:
    <select name="output_format">
        <?php foreach(['json','csv','ssv','tsv','yaml'] as $f): ?>
            <option value="<?=$f?>" <?=$outputFormat==$f?'selected':''?>><?=strtoupper($f)?></option>
        <?php endforeach; ?>
    </select>

    <button type="submit">Konwertuj i zapisz ciastka</button>
</form>

<h2>Wynik:</h2>
<pre style="background: #eee; padding: 10px;"><?php echo htmlspecialchars($result); ?></pre>

<footer>
    <p>&copy; 2026 Gerard Fiał. Wszystkie prawa nie zastrzeżone.</p>
</footer>
</body>
</html>