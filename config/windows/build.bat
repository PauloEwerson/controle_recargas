@echo off
setlocal EnableDelayedExpansion

:: Verifica se node_modules existe
if not exist "..\..\frontend\node_modules" (
    echo node_modules nao encontrado.
    set /p escolha="Deseja instalar o node_modules? (s/n): "
    if "%escolha%"=="n" goto :skip_npm_install
    pushd ..\..\frontend
    call npm install
    if errorlevel 1 (
        echo Ocorreu um erro durante o npm install.
        exit /b 1
    )
    popd
    echo node_modules instalado com sucesso!
)

:skip_npm_install

pushd ..\..\frontend
call npm run build
if errorlevel 1 (
    echo Ocorreu um erro durante o npm run build.
    exit /b 1
)
popd
echo Aplicacao construida com sucesso!

:: Loop para mover diretórios
for /D %%D in ("..\..\frontend\build\*") do (
    move "%%D" "..\..\"
    if errorlevel 1 (
        echo Ocorreu um erro ao mover o diretório %%D para a raiz.
        exit /b 1
    )
)

:: Loop para mover arquivos
for %%F in ("..\..\frontend\build\*") do (
    move "%%F" "..\..\"
    if errorlevel 1 (
        echo Ocorreu um erro ao mover o arquivo %%F para a raiz.
        exit /b 1
    )
)

:: Remove o diretório build
rmdir /S /Q "..\..\frontend\build"
if errorlevel 1 (
    echo Ocorreu um erro ao remover o diretório build.
    exit /b 1
)

echo Diretorio build removido com sucesso!

endlocal
