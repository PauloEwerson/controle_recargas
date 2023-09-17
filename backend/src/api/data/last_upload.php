<?php

require_once __DIR__ . '/../../config/pathConfig.php';

require_once BASE_PATH . 'config/corsConfig.php';
include_once BASE_PATH . 'config/databaseConnection.php';

// Consulta para obter o update_at mais recente da tabela DataTables_Recargas
$query = "SELECT 
COALESCE(
  CONVERT_TZ(MAX(updated_at), 'UTC', 'America/Sao_Paulo'),
  CONVERT_TZ(MAX(updated_at), '+00:00', '-03:00')
) as last_updated 
FROM DataTables_Recargas";

$stmt = $pdo->prepare($query);
$stmt->execute();

// Pega o resultado da consulta
$result = $stmt->fetch(PDO::FETCH_ASSOC);

// Retorna o resultado como JSON
echo json_encode($result);
