<?php

require_once __DIR__ . '/../config/databaseConnection.php';

require_once __DIR__ . '/../config/pathConfig.php';
$configFile = BASE_PATH . 'config/' . (ENVIRONMENT === 'development' ? 'configDev.json' : 'config.json');
$configData = json_decode(file_get_contents($configFile), true);
$table_to_use = isset($configData['reuse_operators']) && $configData['reuse_operators'] ? 'sac_operadores' : 'Operators_Recargas';


// Função para lidar com a inserção de um novo operador
function insertOperator($name, $registration) {
    global $pdo;

    // Verifica se a 'registration' já existe para outro operador
    $check_stmt = $pdo->prepare("SELECT * FROM Operators_Recargas WHERE registration = ?");
    $check_stmt->execute([$registration]);
    $existing_operator = $check_stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($existing_operator) {
        return [
            'success' => false,
            'message' => 'Matrícula já está em uso'
        ];
    }

    // Se não houver conflito, prossegue com a inserção
    $stmt = $pdo->prepare("INSERT INTO Operators_Recargas (name, registration) VALUES (?, ?)");
    
    if ($stmt->execute([$name, $registration])) {
        // Peg o ID do operador inserido
        $lastId = $pdo->lastInsertId();
        
        // Faz uma consulta para obter os detalhes do operador inserido
        $stmt = $pdo->prepare("SELECT * FROM Operators_Recargas WHERE id = ?");
        $stmt->execute([$lastId]);
        $operator = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $operator;
    } else {
        return false;
    }
}


// Função para lidar com a busca de todos os operadore
function getAllOperators() {
    global $pdo;
    global $table_to_use;

    $stmt = $pdo->query("SELECT * FROM `$table_to_use`");
    return $stmt->fetchAll();
}

// Função para lidar com a atualização de um operador
function updateOperator($id, $name, $registration) {
    global $pdo;
    
    // Verifica se a 'registration' já existe para outro operador
    $check_stmt = $pdo->prepare("SELECT * FROM Operators_Recargas WHERE registration = ? AND id != ?");
    $check_stmt->execute([$registration, $id]);
    $existing_operator = $check_stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($existing_operator) {
        return [
            'success' => false,
            'message' => 'Matrícula já está em uso'
        ];
    }
    
    // Se não houver conflito, prossiga com a atualização
    $stmt = $pdo->prepare("UPDATE Operators_Recargas SET name = ?, registration = ? WHERE id = ?");
    return $stmt->execute([$name, $registration, $id]);
}


// Função para lidar com a exclusão de um operador
function deleteOperator($id) {
    global $pdo;
    $stmt = $pdo->prepare("DELETE FROM Operators_Recargas WHERE id = ?");
    return $stmt->execute([$id]);
}

?>
