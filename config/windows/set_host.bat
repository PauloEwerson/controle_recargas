@echo off

:: Iniciar loop para receber o nome do host do usuário
:loopStart
set /p host="Informe o Host: "
echo Voce informou o host como: %host%
set /p confirm="Esta correto? (s/n): "
if "%confirm%"=="n" (
    echo Por favor, informe o host novamente.
    goto loopStart
)

:: Atualizar package.json, env.json e corsConfig.php
call cscript //nologo update_files.vbs %host%
if errorlevel 1 (
    echo Ocorreu um erro ao atualizar os arquivos.
    exit /b 1
)

:: Escrever o host em um arquivo temporário para uso posterior
echo %host% > temp_host.txt

echo Host atualizado com sucesso para: %host%
