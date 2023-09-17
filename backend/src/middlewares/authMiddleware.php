<?php

require_once __DIR__ . '/../config/databaseConnection.php';

function authenticate() {
    // Inicie a sessão
    session_start();
    
    // Verifica se o usuário já está autenticado por meio da sessão
    if (!isset($_SESSION['is_authenticated']) || $_SESSION['is_authenticated'] !== true) {
        // Se não estiver autenticado pela sessão, verifique o cookie
        if (isset($_COOKIE['user_auth'])) {
            global $pdo;
            $userIdHash = $_COOKIE['user_auth'];

            // Busca o usuário com base no cookie
            $stmt = $pdo->prepare("SELECT * FROM Users_Recargas WHERE MD5(id) = ?");
            $stmt->execute([$userIdHash]);
            $user = $stmt->fetch();

            // Se o usuário for encontrado, recrie a sessão
            if ($user) {
                $_SESSION['user_id'] = $user["id"];
                $_SESSION['user_name'] = $user["name"];
                $_SESSION['user_registration'] = $user["registration"];
                $_SESSION['user_perfil'] = $user["perfil"];
                $_SESSION['is_authenticated'] = true;
            } else {
                // Se o usuário não for encontrado, negue a solicitação
                header('HTTP/1.0 401 Unauthorized');
                echo json_encode(array("error" => "Unauthorized"));
                exit;
            }
            
        } else {
            // Se nem a sessão nem o cookie estiverem presentes, negue a solicitação
            header('HTTP/1.0 401 Unauthorized');
            echo json_encode(array("error" => "Unauthorized"));
            exit;
        }
    }
}

?>
