# ForumDevBack

Backend de um fórum simples com autenticação via JWT, CRUD de posts e comentários, desenvolvido com **Express**, **Bun** e **MySQL**.

## Funcionalidades

* Autenticação de usuários (login e cadastro) com JWT via cookies HttpOnly
* CRUD de posts:

  * Listar todos os posts
  * Criar novo post
  * Deletar post
  * Listar posts por usuário
* CRUD de comentários:

  * Criar comentário em post
  * Listar comentários por post
* Contagem de comentários por post
* Documentação da API via **Swagger/OpenAPI**

## Tecnologias

* Node.js / Bun
* Express
* MySQL
* Zod (validação de schemas)
* JWT (autenticação)
* Swagger / OpenAPI


## Rotas da API

### Usuários

| Método | Endpoint | Descrição           |
| ------ | -------- | ------------------- |
| POST   | /signin  | Cadastro de usuário |
| POST   | /login   | Login de usuário    |

### Posts

| Método | Endpoint        | Descrição                        |
| ------ | --------------- | -------------------------------- |
| GET    | /posts          | Lista todos os posts (JWT)             |
| GET    | /posts/:id      | Detalhes de um post (JWT)              |
| GET    | /posts/user/:id | Lista posts de um usuário (JWT)        |
| POST   | /posts          | Cria um post (JWT )   |
| DELETE | /posts/:id      | Deleta um post (JWT) |

### Comentários

| Método | Endpoint               | Descrição                        |
| ------ | ---------------------- | -------------------------------- |
| POST   | /comment/:post_id      | Cria comentário em um post (JWT) |
| GET    | /post/:post_id/comment | Lista comentários de um post (JWT)    |


### Desenvolvedor
@telinidev
