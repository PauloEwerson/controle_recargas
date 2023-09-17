<?php

require_once __DIR__ . '/../config/pathConfig.php';

require_once BASE_PATH . 'config/databaseConnection.php';

function getMeta() {
    global $pdo;
    $stmt = $pdo->query("SELECT meta FROM Analytics_Recargas LIMIT 1");
    return $stmt->fetchColumn();
}

function setMeta($newMeta) {
    global $pdo;
    $stmt = $pdo->prepare("UPDATE Analytics_Recargas SET meta = :meta WHERE id = 1");
    return $stmt->execute(['meta' => $newMeta]);
}
?>

