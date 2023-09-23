@echo off
echo Bem-vindo ao instalador!
echo Este script ira ajuda-lo a configurar o projeto Controle de Recargas.
echo ---------------------------------------------------------------------

:: Passo 1 de 4
set /p escolha="Deseja definir o host executando set_host.bat? (s/n): "
if "%escolha%"=="s" (
    call set_host.bat
    if errorlevel 1 (
        echo Ocorreu um erro ao definir o host.
        exit /b 1
    )
) else (
    echo Processo interrompido pelo usuario.
    exit /b 0
)

:: Ler o valor do host do arquivo temporario
if exist "temp_host.txt" (
    set /p HOST=<temp_host.txt
    del /q temp_host.txt
) else (
    echo Erro: Host nao definido.
    exit /b 1
)

:: Passo 2 de 4
set /p escolha="Deseja construir a aplicacao executando build.bat? (s/n): "
if "%escolha%"=="s" (
    call build.bat
    if errorlevel 1 (
        echo Ocorreu um erro ao construir a aplicacao.
        exit /b 1
    )
) else (
    echo Processo interrompido pelo usuario.
    exit /b 0
)

echo A instalacao esta completa!

:: Passo 3 de 4
set /p escolha="Deseja configurar o banco de dados executando db_install.bat? (s/n): "
if "%escolha%"=="s" (
    call db_install.bat
    if errorlevel 1 (
        echo Ocorreu um erro ao configurar o banco de dados.
        exit /b 1
    )
) else (
    echo Processo interrompido pelo usuario.
    exit /b 0
)

:: Passo 4 de 4
echo Acesse o link abaixo para importar as tabelas no banco de dados
echo https://%HOST%/recargas/#/install
echo -------------------------------
echo Apos a instalacao, a rota sera bloqueada para evitar que outros usuarios acessem.
echo -------------------------------
echo Duvidas, entre em contato com o desenvolvedor
