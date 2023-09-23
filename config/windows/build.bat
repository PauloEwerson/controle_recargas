@echo off

:: Verifica se node_modules existe
if not exist "..\..\frontend\node_modules" (
    echo node_modules nao encontrado.
    set /p escolha="Deseja instalar o node_modules? (s/n): "
    if "%escolha%"=="n" (
        echo Processo interrompido pelo usuario.
        exit /b 0
    )
    cd ..\..\frontend
    npm install
    if errorlevel 1 (
        echo Ocorreu um erro durante o npm install.
        exit /b 1
    )
    cd ..\..\config
    echo node_modules instalado com sucesso!
)

cd ..\..\frontend
npm run build
if errorlevel 1 (
    echo Ocorreu um erro durante o npm run build.
    exit /b 1
)

:: Verifica e substitui arquivos de build antigos
if exist "..\..\favicon.ico" if exist "..\..\manifest.json" if exist "..\..\robots.txt" if exist "..\..\index.html" if exist "..\..\static" if exist "..\..\asset-manifest.json" (
    echo ⚠️ Arquivos antigos de build encontrados na raiz. Eles serao substituidos pelos novos arquivos de build.
    set /p escolha="Deseja substituir os arquivos antigos de build? (s/n): "
    if "%escolha%"=="n" (
        echo Processo interrompido pelo usuario.
        exit /b 0
    )
    del /q "..\..\favicon.ico" "..\..\manifest.json" "..\..\robots.txt" "..\..\index.html" "..\..\asset-manifest.json"
    rmdir /s /q "..\..\static"
)

:: Substituir arquivos de build antigos
cd ..\..\frontend\build
xcopy * ..\..\.. /E /Y
if errorlevel 1 (
    echo Ocorreu um erro ao mover os arquivos de build para a raiz.
    exit /b 1
)
cd ..\..\config

:: Remove o diretorio build
rmdir /s /q ..\..\frontend\build
echo Diretorio build removido com sucesso!
