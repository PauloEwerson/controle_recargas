@echo off
setlocal enabledelayedexpansion

:: Caminho para o arquivo config.json
set CONFIG_JSON_PATH="..\\..\\backend\\src\\config\\config.json"

:: Função para perguntar e confirmar a entrada do usuário
:ask_and_confirm
set prompt=%~1
set config_key=%~2

:confirm_loop
set /p input="%prompt%: "
echo Voce informou: !input!
set /p confirm="Esta correto? (s/n): "

if "!confirm!"=="s" (
    :: Chamar o script VBScript para atualizar o valor no arquivo config.json
    cscript //nologo update_config.vbs %config_key% !input!
    goto :eof
) else if "!confirm!"=="n" (
    echo Por favor, insira o valor novamente.
    goto confirm_loop
) else (
    echo Entrada invalida. Por favor, responda com 's' ou 'n'.
    goto confirm_loop
)

:: Iniciar o processo de configuração
echo Bem-vindo, vamos configurar a conexão com o BD

:: Perguntar e confirmar cada parâmetro
call :ask_and_confirm "Informe o host do banco de dados" "db_host"
call :ask_and_confirm "Informe o nome do banco de dados" "db_name"
call :ask_and_confirm "Informe o nome de usuario do banco de dados" "db_user"
call :ask_and_confirm "Informe a senha do banco de dados" "db_password"
call :ask_and_confirm "Informe o numero da filial" "filial"

:: Perguntar sobre reuse_operators
:reuse_operators_loop
set /p confirm="Voce deseja reutilizar os usuarios do Portal de Sacolas? (s/n): "
echo Voce informou: !confirm!
set /p final_confirm="Esta correto? (s/n): "

if "!final_confirm!"=="s" (
    :: Chamar o script VBScript para atualizar o valor no arquivo config.json
    cscript //nologo update_config.vbs "reuse_operators" !confirm!
    goto :eof
) else if "!final_confirm!"=="n" (
    echo Por favor, insira o valor novamente.
    goto reuse_operators_loop
) else (
    echo Entrada invalida. Por favor, responda com 's' ou 'n'.
    goto reuse_operators_loop
)

:: Definir 'installed' como true
:: Chamar o script VBScript para atualizar o valor no arquivo config.json
cscript //nologo update_config.vbs "installed" "true"

echo ✅ Configuracao concluida com sucesso!
