<?php

require_once __DIR__ . '/../../config/pathConfig.php';

require_once BASE_PATH . 'config/corsConfig.php';

// Inicia a sessão
session_start();

// Destrói a sessão para deslogar o usuário
session_destroy();

echo json_encode(array("message" => "Desconectado com sucesso."));

?>
