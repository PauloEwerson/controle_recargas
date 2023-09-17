<?php

session_start();

require_once __DIR__ . '/../../config/pathConfig.php';

require_once BASE_PATH . 'config/corsConfig.php';
require_once BASE_PATH . 'config/databaseConnection.php';
require_once BASE_PATH . 'controllers/usersController.php';

require_once BASE_PATH . 'middlewares/authMiddleware.php';
authenticate();

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $users = fetchAllUsers();
    echo json_encode($users);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"));
    $result = addUser($data->name, $data->registration, $data->password, $data->perfil);
    echo json_encode(['status' => $result]);
}

if ($_SERVER["REQUEST_METHOD"] == "PUT") {
    $data = json_decode(file_get_contents("php://input"));
    $result = modifyUser($data->id, $data->name, $data->registration, $data->password, $data->perfil);
    echo json_encode(['status' => $result]);
}

if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    $id = basename($_SERVER['REQUEST_URI']);
    $result = removeUser($id);
    echo json_encode($result);
}

?>
