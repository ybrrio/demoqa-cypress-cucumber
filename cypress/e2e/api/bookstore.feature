# language: pt
@api
Funcionalidade: Book Store API - Aluguel de livros
  Como um usuário da Book Store
  Quero criar uma conta, me autenticar e alugar livros
  Para consultar os livros reservados na minha conta

  Contexto:
    Dado que eu possuo os dados de um novo usuário válido

  @smoke @e2e-api
  Cenário: Fluxo completo - criar usuário, autenticar, alugar dois livros e consultar detalhes
    Quando eu crio o usuário
    Então o usuário deve ser criado com sucesso
    Quando eu gero um token de acesso
    Então o token deve ser gerado com sucesso
    Quando eu verifico se o usuário está autorizado
    Então o usuário deve estar autorizado
    Quando eu listo os livros disponíveis
    Então a lista de livros deve ser retornada com sucesso
    Quando eu alugo 2 livros da lista
    Então os livros devem ser adicionados à coleção do usuário
    Quando eu consulto os detalhes do usuário
    Então os detalhes do usuário devem conter os livros alugados

  @negativo
  Cenário: Não deve criar usuário com senha fora da política de segurança
    Dado que o usuário possui uma senha fraca
    Quando eu crio o usuário
    Então a API deve responder com status 400 e código de erro "1300"

  @negativo
  Cenário: Não deve permitir cadastrar um usuário já existente
    Dado que eu crio o usuário
    Quando eu crio o usuário
    Então a API deve responder com status 406 e código de erro "1204"

  @negativo
  Cenário: Não deve permitir alugar livros sem token de acesso
    Dado que eu crio o usuário
    E que eu listo os livros disponíveis
    Quando eu tento alugar 1 livro sem token de acesso
    Então a API deve responder com status 401 e código de erro "1200"
