#!/bin/bash

echo "Bem-vindo ao instalador!"
echo "Este script irá ajudá-lo a configurar o projeto Controle de Recargas."
echo "---------------------------------------------------------------------"

# Pergunta ao usuário se deseja definir o host executando set_host.sh
echo "# Passo 1 de 4 #"
read -p "Deseja definir o host executando set_host.sh? (s/n): " escolha
if [ "$escolha" == "s" ]; then
    ./set_host.sh
    if [ $? -ne 0 ]; then
        echo "❌ Ocorreu um erro ao definir o host."
        exit 1
    fi
else
    echo "❌ Processo interrompido pelo usuário."
    exit 0
fi

# Ler o valor do host do arquivo temporário
if [ -f /tmp/recargas_host.tmp ]; then
    HOST=$(cat /tmp/recargas_host.tmp)
    rm /tmp/recargas_host.tmp  # Limpa o arquivo temporário após o uso
else
    echo "❌ Erro: Host não definido."
    exit 1
fi

# Pergunta ao usuário se deseja construir a aplicação executando build.sh
echo "# Passo 2 de 4 #"
read -p "Deseja construir a aplicação executando build.sh? (s/n): " escolha
if [ "$escolha" == "s" ]; then
    ./build.sh
    if [ $? -ne 0 ]; then
        echo "❌ Ocorreu um erro ao construir a aplicação."
        exit 1
    fi
else
    echo "❌ Processo interrompido pelo usuário."
    exit 0
fi

echo "🎉 A instalação está completa!"
echo "-------------------------------"

echo "# Passo 3 de 4 #"
read -p "Deseja configurar o banco de dados executando db_install.sh? (s/n): " escolha
if [ "$escolha" == "s" ]; then
    ./db_install.sh
    if [ $? -ne 0 ]; then
        echo "❌ Ocorreu um erro ao configurar o banco de dados."
        exit 1
    fi
else
    echo "❌ Processo interrompido pelo usuário."
    exit 0
fi

echo "Passo 4 de 4:"
echo "Acesse o link abaixo para importar as tabelas no banco de dados"
echo "https://$HOST/recargas/#/install"
echo "-------------------------------"
echo "Após a instalação, a rota será bloqueada para evitar que outros usuários acessem."
echo "-------------------------------"
echo "Dúvidas, entre em contato com o desenvolvedor 💻"
