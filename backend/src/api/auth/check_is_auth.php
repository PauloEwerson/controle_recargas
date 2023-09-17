<?php

session_start();

require_once __DIR__ . '/../../config/pathConfig.php';

require_once BASE_PATH . 'config/corsConfig.php';

require_once BASE_PATH . 'middlewares/authMiddleware.php';
authenticate();

echo json_encode(['is_auth' => true]);