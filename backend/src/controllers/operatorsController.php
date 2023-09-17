<?php

require_once __DIR__ . '/../config/pathConfig.php';
require_once BASE_PATH . 'models/operatorsModel.php';

function addOperator($name, $registration) {
    $result = insertOperator($name, $registration);
    
    if (isset($result['success']) && $result['success'] === false) {
        // Se o operador já estiver cadastrado, retorne o resultado
        return $result;
    } elseif ($result) {
        // Se o operador foi inserido com sucesso, retorne o resultado
        return [
            'success' => true,
            'message' => 'Operador adicionado com sucesso.',
            'operator' => $result
        ];
    } else {
        return [
            'success' => false,
            'message' => 'Erro ao adicionar o operador.'
        ];
    }
}



// Function to handle fetching all operators
function fetchAllOperators() {
    return getAllOperators();
}

// Function to handle updating an operator
function modifyOperator($id, $name, $registration) {
    $result = updateOperator($id, $name, $registration);
    
    // Verifique a estrutura do resultado para definir a mensagem apropriada
    if (is_array($result) && isset($result['success']) && !$result['success']) {
        return $result;  // Isso retornará {success: false, message: 'Operador já cadastrado'}
    } else {
        return ['success' => true, 'message' => 'Operador atualizado com sucesso', 'operator' => ['id' => $id, 'name' => $name, 'registration' => $registration]];
    }
}

// Function to handle deleting an operator
function removeOperator($id) {
    $result = deleteOperator($id);
    
    if ($result) {
        return ['success' => true, 'message' => 'Operador excluído com sucesso'];
    } else {
        return ['success' => false, 'message' => 'Erro ao excluir operador'];
    }
}


// NOTE: Here, you can add more logic if needed, for example, input validation, error handling, etc.
?>
