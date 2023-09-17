<?php

require_once __DIR__ . '/../../config/pathConfig.php';

require_once BASE_PATH . 'config/corsConfig.php';

echo json_encode(['message' => 'Hello World!']);