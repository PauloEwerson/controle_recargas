<?php

require_once __DIR__ . '/../../config/pathConfig.php';
require_once BASE_PATH . 'config/corsConfig.php';

$configFile = ENVIRONMENT === 'development' ? 'configDev.json' : 'config.json';
$isInstalled = json_decode(file_get_contents(__DIR__ . '/../../config/' . $configFile), true);

if ($isInstalled['installed']) {
    echo json_encode(['installed' => true]);
} else {
    echo json_encode(['installed' => false]);
}

?>
