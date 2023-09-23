<?php

require_once __DIR__ . '/pathConfig.php';

$configFile = ENVIRONMENT === 'development' ? 'configDev.json' : 'config.json';
$config = json_decode(file_get_contents(__DIR__ . '/' . $configFile), true);

$allowedOrigins = ENVIRONMENT === 'development' ? ['http://localhost:3000'] : ['https://host_default'];

$origin = isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins) 
          ? $_SERVER['HTTP_ORIGIN'] 
          : '*';

// Configurações de CORS para o ambiente de produção
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Allow-Credentials: true');
    header('Content-Length: 0');
    header('Status: 204');
    header('HTTP/1.1 204 No Content');
    header('Content-Type: application/json; charset=UTF-8');
    header('Content-Disposition: attachment; filename=config.json');
    exit();
}

// Configurações de CORS para o ambiente de desenvolvimento
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');
header('Content-Disposition: attachment; filename=config.json');
