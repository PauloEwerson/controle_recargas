<?php

require_once __DIR__ . '/pathConfig.php';

$configFile = ENVIRONMENT === 'development' ? 'configDev.json' : 'config.json';
$config = json_decode(file_get_contents(__DIR__ . '/' . $configFile), true);

$host = $config['db_host'];
$db_name = $config['db_name'];
$db_user = $config['db_user'];
$db_password = $config['db_password'];

$dsn = "mysql:host=$host;dbname=$db_name;charset=utf8";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $db_user, $db_password, $options);
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

?>
