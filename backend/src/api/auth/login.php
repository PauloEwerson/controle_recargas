<?php

require_once __DIR__ . '/../../config/pathConfig.php';

require_once BASE_PATH . 'config/corsConfig.php';
require_once BASE_PATH . 'config/databaseConnection.php';

// Verificar qual tabela está sendo usada
$configFile = BASE_PATH . 'config/' . (ENVIRONMENT === 'development' ? 'configDev.json' : 'config.json');
$configData = json_decode(file_get_contents($configFile), true);


// Inicia a sessão
session_start();

// Pega o corpo da requisição
$data = json_decode(file_get_contents("php://input"));

// Se os dados não forem vazios
if (!empty($data->username) && !empty($data->password)) {
    $username = $data->username;
    $password = $data->password;

    // Prepara uma declaração para buscar o usuário
    $stmt = $pdo->prepare("SELECT * FROM Users_Recargas WHERE registration = :username");
    $stmt->bindParam(':username', $username);
    $stmt->execute();

    // Pega o resultado da consulta
    $user = $stmt->fetch();

    // Verifica se o usuário existe e se a senha está correta
    if ($user && password_verify($password, $user['password'])) {
        // Se a autenticação for bem-sucedida, armazene as informações do usuário na sessão
        $_SESSION['user_id'] = $user["id"];
        $_SESSION['user_name'] = $user["name"];
        $_SESSION['user_registration'] = $user["registration"];
        $_SESSION['user_perfil'] = $user["perfil"];
        $_SESSION['is_authenticated'] = true;
        $_SESSION['usingSacOperadores'] = ($configData['reuse_operators']);
        $_SESSION['ambient'] = ENVIRONMENT;

        // Define um cookie para o usuário
        // setcookie("user_auth", md5($user["id"]), time() + (86400 * 30), "/");  // 86400 = 1 dia
        setcookie("user_auth", md5($user["id"]), time() + (600 * 30), "/");  // 600 = 30 minutos
        // setcookie("user_auth", md5($user["id"]), time() + 60, "/"); // 1 minuto

        echo json_encode(array(
            "message" => "Login realizado com sucesso.",
            "user_name" => $user["name"],
            "registration" => $user["registration"],
            "user_perfil" => $user["perfil"],
            "reuse_operators" => $configData['reuse_operators'],
            "ambient" => ENVIRONMENT
        ));
        
    } else {
        echo json_encode(array("message" => "Dados inválidos."));
    }
} else {
    echo json_encode(array("message" => "Preencha todos os campos."));
}

?>
