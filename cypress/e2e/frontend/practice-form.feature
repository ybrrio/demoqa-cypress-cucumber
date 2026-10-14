# language: pt
@frontend @forms
Funcionalidade: Forms - Practice Form
  Como um estudante
  Quero preencher o formulário de cadastro
  Para registrar minhas informações

  Contexto:
    Dado que eu acesso a página inicial do DemoQA
    E eu escolho a opção "Forms" na página inicial
    E eu clico no submenu "Practice Form"

  @smoke
  Cenário: Preencher e submeter o formulário com valores aleatórios
    Quando eu preencho todo o formulário com valores aleatórios
    E eu faço o upload do arquivo "arquivo-teste.txt"
    E eu submeto o formulário
    Então um popup de confirmação deve ser aberto
    E o popup deve exibir os dados informados

  @negativo
  Cenário: Não submeter o formulário sem os campos obrigatórios
    Quando eu submeto o formulário
    Então o popup de confirmação não deve ser aberto
    E os campos obrigatórios devem ser sinalizados como inválidos

  # minlength não dá pra testar com cy.type(), o Chrome só valida digitação real
  @negativo
  Esquema do Cenário: Não submeter o formulário com celular inválido "<celular>"
    Quando eu preencho todo o formulário com valores aleatórios
    E eu informo o celular "<celular>"
    E eu submeto o formulário
    Então o popup de confirmação não deve ser aberto
    E o campo de celular deve ser sinalizado como inválido

    Exemplos:
      | celular    |
      | abcdefghij |
      | 98765abcde |

  # bug do DemoQA: o Close não fecha o popup (ver README)
  @known-bug
  Cenário: Fechar o popup de confirmação
    Dado que eu submeti o formulário preenchido com valores aleatórios
    Quando eu fecho o popup
    Então o popup não deve mais ser exibido
