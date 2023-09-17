<?php

session_start();

require_once __DIR__ . '/../../config/pathConfig.php';

require_once BASE_PATH . 'config/corsConfig.php';

require_once BASE_PATH . 'middlewares/authMiddleware.php';
authenticate();

if ($_SERVER["REQUEST_METHOD"] == "GET") {
  echo json_encode([
    'session' => $_SESSION,
  ]);
}
?>
