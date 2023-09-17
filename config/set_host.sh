#!/bin/bash

# Determina o caminho do diretório atual
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

while true; do
    # Pergunta ao usuário pelo novo nome do host
    read -p "Informe o Host: " host

    # Mostra o host ao usuário e confirma
    echo "Você informou o host como: $host"
    read -p "Está correto? (s/n): " confirm

    if [ "$confirm" == "s" ]; then
        break
    else
        echo "Por favor, informe o host novamente."
    fi
done

# Atualiza o package.json
sed -i "s|https://host_default/recargas|https://$host/recargas|" $DIR/../frontend/package.json
if ! grep -q "https://$host/recargas" $DIR/../frontend/package.json; then
    echo "❌ Falha ao atualizar o host em package.json"
    exit 1
fi

# Atualiza o env.json
sed -i "s|https://host_default/recargas/backend/src|https://$host/recargas/backend/src|" $DIR/../frontend/src/env.json
if ! grep -q "https://$host/recargas/backend/src" $DIR/../frontend/src/env.json; then
    echo "❌ Falha ao atualizar o host em env.json"
    exit 1
fi

# Atualize o corsConfig.php
sed -i "s|'https://host_default'|'https://$host'|" $DIR/../backend/src/config/corsConfig.php
if ! grep -q "'https://$host'" $DIR/../backend/src/config/corsConfig.php; then
    echo "❌ Falha ao atualizar o host em corsConfig.php"
    exit 1
fi

echo "✅ Host atualizado com sucesso para: $host"

# Escreve o host em um arquivo temporário para uso posterior
echo "$host" > /tmp/recargas_host.tmp
