<?php

require_once __DIR__ . '/../../controllers/csvDemoController.php';

require_once BASE_PATH . 'config/corsConfig.php';

require_once BASE_PATH . 'middlewares/authMiddleware.php';
authenticate();

// Gera o CSV e retorna o caminho do arquivo
$csv_file_path = generateCsv();

// Provê o arquivo para download
if (file_exists($csv_file_path)) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/csv');
    header('Content-Disposition: attachment; filename="' . basename($csv_file_path) . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    header('Content-Length: ' . filesize($csv_file_path));
    readfile($csv_file_path);
    exit;
} else {
    echo "Error: Arquivo não encontrado.";
}
