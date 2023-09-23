#!/bin/bash

# Path to the config.json file
CONFIG_JSON_PATH="../../backend/src/config/config.json"

# Function to ask and confirm user input
ask_and_confirm() {
  local prompt="$1"
  local config_key="$2"

  while true; do
    read -p "$prompt: " input
    echo "Você informou: $input"
    read -p "Está correto? (s/n): " confirm

    if [ "$confirm" == "s" ]; then
      sed -i "s/\"${config_key}\": \"[^\"]*\"/\"${config_key}\": \"${input}\"/" $CONFIG_JSON_PATH
      break  # Sai do loop
    elif [ "$confirm" == "n" ]; then
      echo "Por favor, insira o valor novamente."
    else
      echo "Entrada inválida. Por favor, responda com 's' ou 'n'."
    fi
  done
}


# Start the configuration process
echo "Vamos configurar a conexão com o banco de dados!"

# Ask and confirm each parameter
ask_and_confirm "Informe o host do banco de dados" "db_host"
ask_and_confirm "Informe o nome do banco de dados" "db_name"
ask_and_confirm "Informe o nome de usuário do banco de dados" "db_user"
ask_and_confirm "Informe a senha do banco de dados" "db_password"
ask_and_confirm "Informe o número da filial" "filial"

# Ask about reuse_operators
while true; do
  read -p "Você deseja reutilizar os usuários do Portal de Sacolas? (s/n): " confirm
  echo "Você informou: $confirm"
  read -p "Está correto? (s/n): " final_confirm

  if [ "$final_confirm" == "s" ]; then
    if [ "$confirm" == "s" ]; then
      sed -i 's/"reuse_operators": false/"reuse_operators": true/' $CONFIG_JSON_PATH
    else
      sed -i 's/"reuse_operators": true/"reuse_operators": false/' $CONFIG_JSON_PATH
    fi
    break  # Sai do loop
  elif [ "$final_confirm" == "n" ]; then
    echo "Por favor, insira o valor novamente."
  else
    echo "Entrada inválida. Por favor, responda com 's' ou 'n'."
  fi
done


# Set 'installed' to true
sed -i 's/"installed": false/"installed": true/' $CONFIG_JSON_PATH

echo "✅ Configuração concluída com sucesso!"
