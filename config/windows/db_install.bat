@echo off
setlocal enabledelayedexpansion

set CONFIG_JSON_PATH=..\..\backend\src\config\config.json
set TEMP_JSON_PATH=temp_config.json

set db_host=
set db_name=
set db_user=
set db_password=
set filial=
set reuse_operators=false

echo Vamos configurar a conexao com o banco de dados!

:ask_host
echo Informe o host do banco de dados
set /p db_host=
echo Voce informou: !db_host!
set /p confirm=Esta correto? (s/n): 
if "%confirm%"=="n" goto ask_host

:ask_db_name
echo Informe o nome do banco de dados
set /p db_name=
echo Voce informou: !db_name!
set /p confirm=Esta correto? (s/n): 
if "%confirm%"=="n" goto ask_db_name

:ask_db_user
echo Informe o nome de usuario do banco de dados
set /p db_user=
echo Voce informou: !db_user!
set /p confirm=Esta correto? (s/n): 
if "%confirm%"=="n" goto ask_db_user

:ask_db_password
echo Informe a senha do banco de dados
set /p db_password=
echo Voce informou: !db_password!
set /p confirm=Esta correto? (s/n): 
if "%confirm%"=="n" goto ask_db_password

:ask_filial
echo Informe o numero da filial
set /p filial=
echo Voce informou: !filial!
set /p confirm=Esta correto? (s/n): 
if "%confirm%"=="n" goto ask_filial

:ask_reuse_operators
echo Voce deseja reutilizar os usuarios do Portal de Sacolas? (s/n)
set /p reuse_operators=
echo Voce informou: !reuse_operators!
set /p confirm=Esta correto? (s/n): 
if "%confirm%"=="n" goto ask_reuse_operators
if "%reuse_operators%"=="s" (
    set reuse_operators=true
) else (
    set reuse_operators=false
)

:: Cria um novo JSON com as configuracoes informadas
(
    echo {
    echo   "db_host": "!db_host!",
    echo   "db_name": "!db_name!",
    echo   "db_user": "!db_user!",
    echo   "db_password": "!db_password!",
    echo   "filial": "!filial!",
    echo   "reuse_operators": !reuse_operators!,
    echo   "installed": true
    echo }
) > !TEMP_JSON_PATH!

:: Move o JSON para o local correto
move /Y !TEMP_JSON_PATH! !CONFIG_JSON_PATH!

echo Configuracao concluida com sucesso!
