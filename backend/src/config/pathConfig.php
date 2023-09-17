<?php

$configs = json_decode(file_get_contents(__DIR__ . '/environment.json'), true);

if ($_SERVER['SERVER_NAME'] == 'localhost') {
    define('BASE_PATH', $configs['development']['base_path']);
    define('ENVIRONMENT', 'development');
} else {
    define('BASE_PATH', $configs['production']['base_path']);
    define('ENVIRONMENT', 'production');
}

?>
