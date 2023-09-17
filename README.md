# Controle de Recargas

## Sobre o Projeto

O **Controle de Recargas** é uma ferramenta dedicada a acompanhar as recargas de celulares pré-pagos em vista de uma meta mensal. Com ele, os usuários podem acessar informações detalhadas sobre:

- Venda acumulada
- Venda do dia
- Meta de venda para o dia
- Média de vendas
- Quantidade que falta para atingir a meta mensal
- Projeção de quando a meta será atingida

O projeto também oferece um CRUD para gerenciar operadores e um relatório que exibe um ranking de vendas dos colaboradores.

## Pré-requisitos

- Docker e Docker Compose
- Node.js (para o frontend)
- Git Bash para execução de Shell Scripts (Ambiente Windows)

## Rodando Localmente (Desenvolvimento)

Para iniciar os containers:

```
docker-compose up -d
```

Para encerrar os containers:

```
docker-compose down
```

## Rodando em Produção

Para configurar o ambiente e construir a aplicação, no diretório `config`, execute:

```
./install.sh
```

Este script irá guiar você na configuração inicial e também executará os demais arquivos shell conforme necessário.

Após a instalação, você pode acessar a URL fornecida pelo script para configurar o banco de dados.

**Nota**: Após a instalação, a rota de configuração do banco de dados será bloqueada por segurança.

## Suporte

Em caso de dúvidas ou problemas, entre em contato com o desenvolvedor.
