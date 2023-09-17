<?php

require_once __DIR__ . '/../../config/pathConfig.php';

require_once BASE_PATH . 'config/corsConfig.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->db_host) && isset($data->db_name) && isset($data->db_user) && isset($data->db_password)) {
    // Testa a conexão com o banco de dados
    try {
        $pdo = new PDO("mysql:host=$data->db_host;dbname=$data->db_name", $data->db_user, $data->db_password);
    } catch (PDOException $exception) {
        echo json_encode(['message' => 'Erro ao conectar ao banco de dados: ' . $exception->getMessage(), 'status' => 'error']);
        exit();
    }

    // Testa se as tabelas já existem
    $existing_tables = [];
    foreach (['Users_Recargas', 'Operators_Recargas', 'Analytics_Recargas', 'DataTables_Recargas'] as $table_name) {
        $stmt = $pdo->prepare("SHOW TABLES LIKE ?");
        $stmt->execute([$table_name]);
        if ($stmt->rowCount() > 0) {
            $existing_tables[] = $table_name;
        }
    }
    if (!empty($existing_tables)) {
        echo json_encode(['message' => 'A seguinte tabela já existe no banco de dados: ' . implode(', ', $existing_tables), 'status' => 'error']);
        exit();
    }

    // Se a conexão for bem-sucedida, atualiza o arquivo config.json
    $configData = [
        'db_host' => $data->db_host,
        'db_name' => $data->db_name,
        'db_user' => $data->db_user,
        'db_password' => $data->db_password,
        'reuse_operators' => $data->reuse_operators,
        'filial' => $data->filial,
        'db_charset' => $data->db_charset,
        'installed' => true
    ];

    // Se o servidor for localhost, atualiza o arquivo configDev.json, se não, atualiza o arquivo config.json
    $configFile = ENVIRONMENT === 'development' ? 'configDev.json' : 'config.json';
    file_put_contents(BASE_PATH . 'config/' . $configFile, json_encode($configData));
    
    // Executa o script de instalação do banco de dados usando método query
    try {
        $pdo->beginTransaction();

    // Verifica se a tabela Operators_Recargas deve ser reutilizada
    if (isset($data->reuse_operators) && $data->reuse_operators) {
        // Verifica se a tabela sac_operadores existe
        $stmt = $pdo->prepare("SHOW TABLES LIKE 'sac_operadores'");
        $stmt->execute();
        if ($stmt->rowCount() == 0) {
            echo json_encode(['message' => 'Tabela sac_operadores não encontrada!', 'status' => 'error']);
            exit();
        }
    } else {
        // Cria a tabela Operators_Recargas se a opção de reutilizar os operadores for falsa
        $operators_recargas = "CREATE TABLE IF NOT EXISTS Operators_Recargas (
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            registration VARCHAR(50) NOT NULL,
            created_at DATETIME,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=$data->db_charset";
        $stmt = $pdo->prepare($operators_recargas);
        $stmt->execute();
    }

    // Tabela Users_Recargas
    $users_recargas = "CREATE TABLE IF NOT EXISTS Users_Recargas (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        registration VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        perfil ENUM('admin', 'colab') NOT NULL,
        created_at DATETIME,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=$data->db_charset";
    $pdo->query($users_recargas);

    // Insere um registro inicial na tabela Users_Recargas se ela estiver vazia
    $insert_users_recargas = "INSERT INTO Users_Recargas (name, registration, password, perfil) VALUES ('Admin', 'admin', '$2y$10$.rXHgYbTdav0GUdCvEr/qOgyCap1/wMIiszjeTx/5PPLLhESQGuAy', 'admin');";
    $pdo->query($insert_users_recargas);

    // Tabela Analytics_Recargas
    $analytics_recargas = "CREATE TABLE IF NOT EXISTS Analytics_Recargas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        meta DECIMAL(10, 2) NOT NULL,
        accumulate DECIMAL(10, 2) NOT NULL,
        projection DECIMAL(10, 2) NOT NULL,
        average DECIMAL(10, 2) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=$data->db_charset";
    $pdo->query($analytics_recargas);

    // Insere um registro inicial na tabela Analytics_Recargas se ela estiver vazia
    $insert_analytics_recargas = "INSERT INTO Analytics_Recargas (meta, accumulate, projection, average)
        SELECT 0, 0, 0, 0
        FROM (SELECT 1) AS a
        LEFT JOIN Analytics_Recargas ON 1=0
        WHERE Analytics_Recargas.id IS NULL;
    ";
    $pdo->query($insert_analytics_recargas);

    // Tabela DataTables_Recargas
    $datatables_recargas = "CREATE TABLE IF NOT EXISTS DataTables_Recargas (
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
        ) ENGINE=InnoDB DEFAULT CHARSET=$data->db_charset";
    $pdo->query($datatables_recargas);

        $pdo->commit();

        echo json_encode(['message' => 'Instalação concluída. Por favor, faça login.', 'status' => 'success']);
    
    } catch (PDOException $exception) {
        $pdo->rollBack();
        
        echo json_encode(['message' => 'Database error: ' . $exception->getMessage(), 'status' => 'error']);
    }
} else {
    echo json_encode(['message' => 'Dados incompletos.', 'status' => 'error']);
}
