<?php

session_start();

require_once __DIR__ . '/../../config/pathConfig.php';

require_once BASE_PATH . 'config/corsConfig.php';
require_once BASE_PATH . 'config/databaseConnection.php';
require_once BASE_PATH . 'controllers/operatorsController.php';

require_once BASE_PATH . 'middlewares/authMiddleware.php';
authenticate();

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $operators = fetchAllOperators();
    echo json_encode($operators);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"));
    $result = addOperator($data->name, $data->registration);
    echo json_encode(['status' => $result]);
}

if ($_SERVER["REQUEST_METHOD"] == "PUT") {
    $data = json_decode(file_get_contents("php://input"));
    $result = modifyOperator($data->id, $data->name, $data->registration);
    echo json_encode(['status' => $result]);
}

if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    $id = basename($_SERVER['REQUEST_URI']);
    $result = removeOperator($id);
    echo json_encode($result);
}

?>
