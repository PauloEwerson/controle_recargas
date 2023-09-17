<?php

require_once __DIR__ . '/../config/databaseConnection.php';

// Função para lidar com a inserção de um novo usuário
function insertUser($name, $registration, $password, $perfil) {
    global $pdo;

    // Verifica se a 'registration' já existe para outro operador
    $check_stmt = $pdo->prepare("SELECT * FROM Users_Recargas WHERE registration = ?");
    $check_stmt->execute([$registration]);
    $existing_user = $check_stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($existing_user) {
        return [
            'success' => false,
            'message' => 'Matrícula já está em uso'
        ];
    }

    // Se não houver conflito, prossegue com a inserção
    $stmt = $pdo->prepare("INSERT INTO Users_Recargas (name, registration, password, perfil) VALUES (?, ?, ?, ?)");
    
    if ($stmt->execute([$name, $registration, $password, $perfil])) {
        // Pega o ID do ultimo usuário inserido
        $lastId = $pdo->lastInsertId();
        
        // Faz uma consulta para obter os detalhes do usuário inserido
        $stmt = $pdo->prepare("SELECT * FROM Users_Recargas WHERE id = ?");
        $stmt->execute([$lastId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return $user;
    } else {
        return false;
    }
}

// Função para lidar com a busca de todos os usuários
function getAllUsers() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM Users_Recargas");
    return $stmt->fetchAll();
}

// Função para lidar com a atualização de um usuário
function updateUser($id, $name, $registration, $password, $perfil) {
    global $pdo;
    
    $fieldsToUpdate = [];
    $values = [];

    if ($name !== null) {
        $fieldsToUpdate[] = "name = ?";
        $values[] = $name;
    }

    if ($registration !== null) {
        $fieldsToUpdate[] = "registration = ?";
        $values[] = $registration;
    }

    if ($password !== null) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $fieldsToUpdate[] = "password = ?";
        $values[] = $hashedPassword;
    }

    if ($perfil !== null) {
        $fieldsToUpdate[] = "perfil = ?";
        $values[] = $perfil;
    }

    $values[] = $id;
    $stmt = $pdo->prepare("UPDATE Users_Recargas SET " . implode(", ", $fieldsToUpdate) . " WHERE id = ?");
    return $stmt->execute($values);
}

// Função para lidar com a remoção de um usuário
function deleteUser($id) {
    global $pdo;
    $stmt = $pdo->prepare("DELETE FROM Users_Recargas WHERE id = ?");
    return $stmt->execute([$id]);
}

?>
