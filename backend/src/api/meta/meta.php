<?php

require_once __DIR__ . '/../../config/pathConfig.php';

require_once BASE_PATH . 'config/corsConfig.php';
require_once BASE_PATH . 'config/databaseConnection.php';
require_once BASE_PATH . 'controllers/metaController.php';

$requestMethod = $_SERVER['REQUEST_METHOD'];

switch ($requestMethod) {
    case 'GET':
        echo getMeta();
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        echo setMeta($data['meta']);
        break;

    default:
        echo json_encode(['message' => 'Method not supported']);
}
?>
