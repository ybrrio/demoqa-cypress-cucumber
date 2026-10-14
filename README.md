# Desafio QA - DemoQA

Automação de API (Book Store) e Frontend do [DemoQA](https://demoqa.com) com Cypress e Cucumber (Gherkin em português).

## Stack

- Cypress + @badeball/cypress-cucumber-preprocessor
- Faker para massa de dados
- Ajv para validação de contrato (JSON Schema)
- ESLint + eslint-plugin-cypress
- GitHub Actions

## Como rodar

Precisa de Node 20+.

```bash
npm install

npm test                 # tudo (menos @known-bug)
npm run cy:open          # modo interativo
npm run test:api
npm run test:front
npm run test:smoke
npm run test:bonus
npm run test:known-bugs  # cenários dos bugs do DemoQA (falham)
npm run lint
```

Para filtrar por tag: `npx cypress run --expose tags="@frontend and not @bonus"`.

Obs.: a partir do Cypress 15.17 o cucumber-preprocessor lê as tags de `--expose`. Com `--env` o filtro é ignorado e roda tudo.

O relatório fica em `reports/cucumber-report.html`.

## Estrutura

```
cypress/
  e2e/                  # features (api e frontend)
  fixtures/schemas/     # contratos da API
  fixtures/upload/      # arquivo do upload do Practice Form
  support/
    api/                # services da API
    pages/              # page objects
    factories/          # geração de dados
    step_definitions/   # steps e hooks
    utils/              # contexto do cenário e bloqueio de anúncios
    commands.js         # validateSchema e dragTo
```

## API

Fluxo: criar usuário, gerar token, confirmar autorização, listar livros, alugar 2 livros e consultar os detalhes do usuário.

- Todas as respostas são validadas contra JSON Schema.
- Negativos: senha fraca (400), usuário duplicado (406) e aluguel sem token (401).
- O usuário criado é apagado no hook `After`.

## Frontend

- **Practice Form**: preenche tudo com dados aleatórios, faz upload do .txt, submete e confere os valores do popup.
- **Browser Windows**: abre a nova janela e valida "This is a sample page".
- **Web Tables**: cria, edita e deleta um registro. Bônus: cria 12 registros (com faker e com DataTable) e deleta todos.
- **Progress Bar**: para antes de 25%, depois deixa chegar a 100% e reseta.
- **Sortable**: ordena a lista com drag and drop.
- Negativos: Practice Form sem campos obrigatórios e com celular inválido; Web Tables com e-mail inválido.

## Decisões

- **Nova janela**: o Cypress não controla outras abas, então faço stub do `window.open` e abro a URL na mesma aba.
- **Sortable**: a lista já começa em ordem crescente, então inverto antes de ordenar. O drag usa eventos nativos do HTML5 porque o componente usa react-dnd.
- **Web Tables**: os registros são buscados pelo e-mail, então não depende da paginação. A validação é feita coluna por coluna.
- **Anúncios**: as requisições de ads são bloqueadas e os banners escondidos com CSS. O `uncaught:exception` ignora só erros de terceiros e bugs conhecidos.
- Sem `cy.wait` fixo e sem `force: true` (as duas regras estão ativas no lint).
- 1 retry no `cypress run`, porque o DemoQA é instável.

## Bugs encontrados no DemoQA

Os cenários afetados estão com a tag `@known-bug` e ficam fora da execução padrão e do CI.

1. **Practice Form**: o botão Close não fecha o popup (erro `findDOMNode is not a function` no console). Com Esc fecha.
2. **Web Tables**: às vezes o modal de cadastro fica invisível na tela e bloqueia os cliques.
3. **Web Tables**: deletar qualquer registro apaga todos os registros adicionados.

Os bugs 2 e 3 afetam os cenários bônus.

## CI

O workflow roda o lint e depois as suítes de API e Frontend em paralelo (sem `@known-bug`), publicando o relatório e os screenshots de falha.
