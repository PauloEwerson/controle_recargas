#!/bin/bash

# Verifica se node_modules existe
if [ ! -d "../frontend/node_modules" ]; then
    echo "❌ node_modules não encontrado."
    read -p "Deseja instalar o node_modules? (s/n): " escolha
    if [ "$escolha" == "n" ]; then
        echo "❌ Processo interrompido pelo usuário."
        exit 0
    fi
    cd ../frontend
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Ocorreu um erro durante o npm install."
        exit 1
    fi
    if [ ! -d "node_modules" ]; then
        echo "❌ node_modules não foi criado com sucesso."
        exit 1
    fi
    echo "✅ node_modules instalado com sucesso!"
fi

cd ../frontend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Ocorreu um erro durante o npm run build."
    exit 1
fi
if [ ! -d "build" ]; then
    echo "❌ Diretório build não foi criado com sucesso."
    exit 1
fi
echo "✅ Aplicação construída com sucesso!"

# Verifica a existência dos arquivos de build antigos na raiz e pergunte ao usuário se deseja substituí-los
existem_arquivos_antigos=$(ls ../favicon.ico ../manifest.json ../robots.txt ../index.html ../static ../asset-manifest.json 2>/dev/null | wc -l)
if [ "$existem_arquivos_antigos" != "0" ]; then
    echo "⚠️ Arquivos antigos de build encontrados na raiz. Eles serão substituídos pelos novos arquivos de build."
    read -p "Deseja substituir os arquivos antigos de build? (s/n): " escolha
    if [ "$escolha" == "n" ]; then
        echo "❌ Processo interrompido pelo usuário."
        exit 0
    fi
fi

rm -rf ../favicon.ico ../manifest.json ../robots.txt ../index.html ../static ../asset-manifest.json

# Move os novos arquivos de build para a raiz
mv build/* ../
if [ $? -ne 0 ]; then
    echo "❌ Ocorreu um erro ao mover os arquivos de build para a raiz."
    exit 1
fi

# Verifica se os arquivos de build existem na raiz
existem_novos_arquivos=$(ls ../favicon.ico ../manifest.json ../robots.txt ../index.html ../static ../asset-manifest.json 2>/dev/null | wc -l)
if [ "$existem_novos_arquivos" == "0" ]; then
    echo "❌ Novos arquivos de build não encontrados na raiz."
    exit 1
fi
echo "✅ Novos arquivos de build movidos para a raiz com sucesso!"

# Remove o diretório build
rm -rf build
echo "✅ Diretório build removido com sucesso! ✅"
