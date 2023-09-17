<?php

require_once __DIR__ . '/../../config/pathConfig.php';

require_once BASE_PATH . 'config/corsConfig.php';
require_once BASE_PATH . 'config/databaseConnection.php';

require_once BASE_PATH . 'middlewares/authMiddleware.php';
authenticate();

// Define as chaves de forma global
$keys = [
    'loja', 'data', 'hora', 'pdv', 'nsuTef',
    'nsuHost', 'transacao', 'estado', 'codResp',
    'autorizadora', 'concessionariaIntegrador',
    'telefone', 'valor', 'nsuSitefPagto', 'lojaConc',
    'operador', 'usuarioPend', 'dataPend', 'horaPend',
    'cupomFiscal', 'horaFiscal'
];

function validate_csv_structure($file_path, $expected_columns)
{
    $file = fopen($file_path, 'r');
    fgetcsv($file);  // Ignora o cabeçalho

    $row = fgetcsv($file, 1000, ";");

    // Verifique se $row é um array antes de contar
    if (!is_array($row)) {
        return ["isValid" => false, "message" => "Falha ao ler os dados do CSV."];
    }

    if (count($row) != count($expected_columns)) {
        return ["isValid" => false, "message" => "Número inválido de colunas. Esperado " . count($expected_columns) . " mas recebeu " . count($row) . "."];
    }

    return ["isValid" => true, "message" => "A estrutura do arquivo é válida."];
}

function processCsv($filePath)
{
    global $keys;
    $file = fopen($filePath, 'r');
    $data = [];

    fgetcsv($file); // Ignora o cabeçalho

    while (($row = fgetcsv($file, 1000, ";")) !== FALSE) {
        $data[] = array_combine($keys, $row);
    }

    fclose($file);
    return $data;
}

function insertDataIntoDatabase($csvData)
{
    global $pdo;

    $truncateStmt = $pdo->prepare("TRUNCATE TABLE DataTables_Recargas");
    $truncateStmt->execute();

    foreach ($csvData as $row) {
        // Converta a data de dd/mm/aaaa para aaaa-mm-dd para 'dados'
        $dateParts = explode("/", $row['data']);
        $row['data'] = $dateParts[2] . "-" . $dateParts[1] . "-" . $dateParts[0];

        // Converta a data de dd/mm/aaaa para aaaa-mm-dd em 'dataPend'
        if (!empty($row['dataPend'])) {
            $datePartsPend = explode("/", $row['dataPend']);
            $row['dataPend'] = $datePartsPend[2] . "-" . $datePartsPend[1] . "-" . $datePartsPend[0];
        } else {
            // Defina como NULL se estiver vazio
            $row['dataPend'] = NULL;
        }

        // Converta o 'valor' de vírgula para formato decimal de ponto
        $row['valor'] = str_replace(",", ".", $row['valor']);

        try {
            $insertStmt = $pdo->prepare("INSERT INTO DataTables_Recargas (
                loja, data, hora, pdv, nsuTef,
                nsuHost, transacao, estado, codResp,
                autorizadora, concessionariaIntegrador,
                telefone, valor, nsuSitefPagto, lojaConc,
                operador, usuarioPend, dataPend, horaPend,
                cupomFiscal, horaFiscal
            ) VALUES (
                :loja, :data, :hora, :pdv, :nsuTef,
                :nsuHost, :transacao, :estado, :codResp,
                :autorizadora, :concessionariaIntegrador,
                :telefone, :valor, :nsuSitefPagto, :lojaConc,
                :operador, :usuarioPend, :dataPend, :horaPend,
                :cupomFiscal, :horaFiscal
            )");

            $insertStmt->execute($row);
        } catch (PDOException $e) {
            echo json_encode(["message" => $e->getMessage()]);
            exit();
        }
    }
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!empty($_FILES)) {
        $firstFileKey = array_key_first($_FILES);
        $uploadedFile = $_FILES[$firstFileKey];

        $fileType = mime_content_type($uploadedFile['tmp_name']);

        if ($fileType == 'text/csv' || $fileType == 'text/plain') {
            $filePath = $uploadedFile['tmp_name'];

            $validation_result = validate_csv_structure($filePath, $keys);
            if (!$validation_result["isValid"]) {
                echo json_encode(["message" => $validation_result["message"]]);
                return;
            }

            $csvData = processCsv($filePath);
            insertDataIntoDatabase($csvData);

            echo json_encode([
                'message' => 'CSV importado com sucesso.',
                'status' => 'success',
                'detectedType' => $fileType,
            ]);
        } else {
            echo json_encode([
                'message' => 'Tipo de arquivo inválido. Envie um arquivo CSV.',
                'status', 'error'
            ]);
        }
    } else {
        echo json_encode([
            'message' => 'Arquivo não enviado.',
            'status', 'error'
        ]);
    }
} else {
    echo json_encode([
        'message' => 'Método não suportado.',
        'status', 'error'
    ]);
}
