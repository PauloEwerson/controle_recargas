<?php

session_start();

require_once __DIR__ . '/../../config/pathConfig.php';

require_once BASE_PATH . 'config/corsConfig.php';
require_once BASE_PATH . 'config/databaseConnection.php';

require_once BASE_PATH . 'middlewares/authMiddleware.php';
authenticate();

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    global $pdo;

    $stmt = $pdo->query("SELECT * FROM DataTables_Recargas");
    $data = $stmt->fetchAll();

    echo json_encode($data);
}

?>
