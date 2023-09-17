<?php

require_once __DIR__ . '/../config/pathConfig.php';

// Verifica qual tabela está sendo usada
$configFile = BASE_PATH . 'config/' . (ENVIRONMENT === 'development' ? 'configDev.json' : 'config.json');
$configData = json_decode(file_get_contents($configFile), true);

function generateCsv() {
    global $configData;

  // Gera valores aleatórios para "Efetuada PDV"
  $efetuada_values = [];
  $sum = 0;
  for ($i = 0; $i < 14; $i++) {
      $value = rand(100, 700); // Valores aleatórios entre 100 e 700 como exemplo
      $efetuada_values[] = $value;
      $sum += $value;
  }

  // Garante que a soma total esteja entre 9000 e 15000
  $efetuada_values[] = rand(9000, 15000) - $sum;
  shuffle($efetuada_values);

  $rows = [];

  // Adiciona 15 linhas para "Efetuada PDV "
  for ($i = 0; $i < 15; $i++) {
      $rows[] = [
          'Loja' => $configData['filial'],
          'Data' => date('d/m/Y', strtotime('-3 hours')),
          'Hora' => date('H:i:s', strtotime('-3 hours')),
          'Estado' => 'Efetuada PDV ',
          'Valor' => $efetuada_values[$i],
          'Operador' => rand(1000, 9999)
      ];
  }

  // Adiciona 5 linhas para "Cancelada PDV"
  for ($i = 0; $i < 5; $i++) {
      $rows[] = [
          'Loja' => $configData['filial'],
          'Data' => date('d/m/Y', strtotime('-3 hours')),
          'Hora' => date('H:i:s', strtotime('-3 hours')),
          'Estado' => 'Cancelada PDV',
          'Valor' => rand(100, 700), // Valores aleatórios entre 100 e 700 como exemplo
          'Operador' => rand(1000, 9999)
      ];
  }

  // Adiciona 3 linhas para "Negada"
  for ($i = 0; $i < 3; $i++) {
      $rows[] = [
          'Loja' => $configData['filial'],
          'Data' => date('d/m/Y', strtotime('-3 hours')),
          'Hora' => date('H:i:s', strtotime('-3 hours')),
          'Estado' => 'Negada',
          'Valor' => rand(100, 700), // Valores aleatórios entre 100 e 700 como exemplo
          'Operador' => rand(1000, 9999)
      ];
  }

  // Converte as linhas para o formato CSV
    $csv_data = "Loja;Data;Hora;PDV;NSU Tef;NSU Host;Transacao;Estado;Cod. Resp.;Autorizadora;Concessionaria/Integrador;Telefone;Valor;NSU Sitef Pagto.;Loja Conc.;Operador;Usuario Pend.;Data Pend.;Hora Pend.;Cupom fiscal;Hora fiscal\n";
    foreach ($rows as $row) {
        $csv_data .= "{$row['Loja']};{$row['Data']};{$row['Hora']};;;;;{$row['Estado']};;;;;{$row['Valor']};;;{$row['Operador']};;;;;\n";
    }

  // Define o caminho para salvar o CSV gerado
  $csv_file_path = __DIR__ . '/../uploads/demo.csv';

  // Abre o arquivo para escrever
  $file_handle = fopen($csv_file_path, 'w');
  if (!$file_handle) {
      die('Error: Não é possível abrir o arquivo para gravação.');
  }

  // Grava os dados CSV no arquivo
  fwrite($file_handle, $csv_data);

  // Fecha o arquivo
  fclose($file_handle);

  // Retorna o caminho do CSV gerado para consumo do frontend
  return $csv_file_path;
}

?>
