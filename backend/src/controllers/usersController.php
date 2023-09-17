<?php

require_once __DIR__ . '/../config/pathConfig.php';
require_once BASE_PATH . 'models/usersModel.php';

function addUser($name, $registration, $password, $perfil) {

    // Transforma a senha em um hash
    $password = password_hash($password, PASSWORD_DEFAULT);

    $result = insertUser($name, $registration, $password, $perfil);
    
    if (isset($result['success']) && $result['success'] === false) {
        // Se o operador NÃO foi inserido com sucesso, retorne o resultado
        return $result;
    } elseif ($result) {
        // Se o operador foi inserido com sucesso, retorne o resultado
        return [
            'success' => true,
            'message' => 'Usuário adicionado com sucesso.',
            // remove o password do resultado
            'user' => [
                'id' => $result['id'],
                'name' => $result['name'],
                'registration' => $result['registration'],
                'perfil' => $result['perfil'],
                'created_at' => $result['created_at'],
                'updated_at' => $result['updated_at'],
            ]
            // 'operator' => $result
        ];
    } else {

        return [
            'success' => false,
            'message' => 'Erro ao adicionar o usuário.'
        ];
    }
}


// Função para lidar com a busca de todos os usuários
function fetchAllUsers() {
    return getAllUsers();
}


function modifyUser($id, $name = null, $registration = null, $password = null, $perfil = null) {

    $result = updateUser($id, $name, $registration, $password, $perfil);
    
    // Verifique a estrutura do resultado para definir a mensagem apropriada
    if (is_array($result) && isset($result['success']) && !$result['success']) {
        return $result;  // Isso retornará {message: 'Matrícula já está em uso, success: false'}
    } else {
        return [
            'success' => true, 'message' => 'Usuário atualizado com sucesso',
            'user' => ['id' => $id, 'name' => $name, 'registration' => $registration, 'perfil' => $perfil]
        ];
    }
}


function removeUser($id) {
    $result = deleteUser($id);
    
    if ($result) {
        return ['success' => true, 'message' => 'Usuário excluído com sucesso'];
    } else {
        return ['success' => false, 'message' => 'Erro ao excluir o usuário'];
    }
}
