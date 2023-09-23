<?php

require_once __DIR__ . '/../../config/pathConfig.php';
require_once BASE_PATH . 'config/corsConfig.php';

$configFile = (ENVIRONMENT === 'development') ? 'configDev.json' : 'config.json';
$configData = json_decode(file_get_contents(BASE_PATH . 'config/' . $configFile), true);

$step = isset($_GET['step']) ? intval($_GET['step']) : 0;

if (isset($configData['db_host']) && isset($configData['db_name']) && isset($configData['db_user']) && isset($configData['db_password'])) {
    
    try {
        $pdo = new PDO("mysql:host={$configData['db_host']};dbname={$configData['db_name']}", $configData['db_user'], $configData['db_password']);
    } catch (PDOException $exception) {
        echo json_encode(['message' => 'Erro ao conectar ao banco de dados: ' . $exception->getMessage(), 'status' => 'error']);
        exit();
    }
    
    if ($step === 1) {
        echo json_encode(['message' => 'Conexão com o banco de dados bem-sucedida.', 'status' => 'success']);
        exit();
    }

    if ($step === 2) {
        $existing_tables = [];
        $table_names = ['Users_Recargas', 'Operators_Recargas', 'Analytics_Recargas', 'DataTables_Recargas'];
        foreach ($table_names as $table_name) {
            $stmt = $pdo->prepare("SHOW TABLES LIKE ?");
            $stmt->execute([$table_name]);
            if ($stmt->rowCount() > 0) {
                $existing_tables[] = $table_name;
            }
        }
        if (!empty($existing_tables)) {
            echo json_encode(['message' => 'As seguintes tabelas já existem no banco de dados: ' . implode(', ', $existing_tables), 'status' => 'error']);
            exit();
        }
        echo json_encode(['message' => 'Tabelas não existem. Pronto para instalar.', 'status' => 'success']);
        exit();
    }

    if ($step === 3) {
        $pdo->beginTransaction();
        
        // Verifica se a tabela Operators_Recargas deve ser reutilizada
        if (isset($configData['reuse_operators']) && $configData['reuse_operators']) {
            // Verifica se a tabela sac_operadores existe
            $stmt = $pdo->prepare("SHOW TABLES LIKE 'sac_operadores'");
            $stmt->execute();
            if ($stmt->rowCount() == 0) {
                echo json_encode(['message' => 'Tabela sac_operadores não encontrada!', 'status' => 'error']);
                exit();
            }
            echo json_encode(['message' => 'Tabela sac_operadores existente e será reutilizada.', 'status' => 'success']);
        } else {
            $sql = "CREATE TABLE IF NOT EXISTS Operators_Recargas (
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                registration VARCHAR(50) NOT NULL,
                created_at DATETIME,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET='utf8'";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            echo json_encode(['message' => 'Tabela Operators_Recargas criada com sucesso.', 'status' => 'success']);
        }
        $pdo->commit();
        exit();
    }

    if ($step === 4) {
        $pdo->beginTransaction();
        $sql = "CREATE TABLE IF NOT EXISTS Users_Recargas (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            registration VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            perfil ENUM('admin', 'colab') NOT NULL,
            created_at DATETIME,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET='utf8'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
    
        // Insert initial data
        $insert_users_recargas = "INSERT INTO Users_Recargas (name, registration, password, perfil) VALUES ('Admin', 'admin', '$2y$10$.rXHgYbTdav0GUdCvEr/qOgyCap1/wMIiszjeTx/5PPLLhESQGuAy', 'admin');";
        $pdo->query($insert_users_recargas);
    
        $pdo->commit();
        echo json_encode(['message' => 'Tabela Users_Recargas criada e dados iniciais inseridos com sucesso.', 'status' => 'success']);
        exit();
    }

    if ($step === 5) {
        $pdo->beginTransaction();
        $sql = "CREATE TABLE IF NOT EXISTS Analytics_Recargas (
            id INT AUTO_INCREMENT PRIMARY KEY,
            meta DECIMAL(10, 2) NOT NULL,
            accumulate DECIMAL(10, 2) NOT NULL,
            projection DECIMAL(10, 2) NOT NULL,
            average DECIMAL(10, 2) NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET='utf8'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
    
        // Insert initial data
        $insert_analytics_recargas = "INSERT INTO Analytics_Recargas (meta, accumulate, projection, average)
            SELECT 0, 0, 0, 0
            FROM (SELECT 1) AS a
            LEFT JOIN Analytics_Recargas ON 1=0
            WHERE Analytics_Recargas.id IS NULL;
        ";
        $pdo->query($insert_analytics_recargas);
    
        $pdo->commit();
        echo json_encode(['message' => 'Tabela Analytics_Recargas criada e dados iniciais inseridos com sucesso.', 'status' => 'success']);
        exit();
    }

    if ($step === 6) {
        $pdo->beginTransaction();
        $sql = "CREATE TABLE IF NOT EXISTS DataTables_Recargas (
            id INT AUTO_INCREMENT PRIMARY KEY,
            loja VARCHAR(255),
            data VARCHAR(255),
            hora VARCHAR(255),
            pdv VARCHAR(255),
            nsuTef VARCHAR(255),
            nsuHost VARCHAR(255),
            transacao VARCHAR(255),
            estado VARCHAR(255),
            codResp VARCHAR(255),
            autorizadora VARCHAR(255),
            concessionariaIntegrador VARCHAR(255),
            telefone VARCHAR(255),
            valor DECIMAL(10, 2),
            nsuSitefPagto VARCHAR(255),
            lojaConc VARCHAR(255),
            operador VARCHAR(255),
            usuarioPend VARCHAR(255),
            dataPend VARCHAR(255),
            horaPend VARCHAR(255),
            cupomFiscal VARCHAR(255),
            horaFiscal VARCHAR(255),
            created_at DATETIME,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET='utf8'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $pdo->commit();
        echo json_encode(['message' => 'Tabela DataTables_Recargas criada com sucesso.', 'status' => 'success']);
        exit();
    }

    echo json_encode(['message' => 'Etapa inválida.', 'status' => 'error']);
    
} else {
    echo json_encode(['message' => 'Dados incompletos. Por favor, verifique o arquivo de configuração.', 'status' => 'error']);
}
