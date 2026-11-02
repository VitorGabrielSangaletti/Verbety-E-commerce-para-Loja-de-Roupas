# Deploy do Verbety (Render + MySQL)

Este guia publica o site completo: o Spring Boot serve a API **e** o front-end, e o MySQL fica em um serviço gerenciado na nuvem.

```
Navegador  ->  https://SEU-SITE.onrender.com  ->  Spring Boot (Docker)  ->  MySQL na nuvem
```

## 1. Banco de dados MySQL

Escolha um provedor com plano gratuito (os planos mudam; confirme antes de criar):

- **Aiven** (MySQL)
- **Railway** (MySQL)
- **Clever Cloud** (MySQL)
- **TiDB Cloud** (compatível com MySQL)

Ao criar a instância, anote:

- host
- porta
- nome do banco
- usuário
- senha

Crie o banco com `utf8mb4` se o provedor pedir:

```sql
CREATE DATABASE verbety CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Importar os dados

O dump atual está em:

```
C:\Users\Vitinho\workSpace-sts\siteverbety-deploy.sql
```

No **Prompt de Comando (cmd)**, importe com (troque os valores):

```bat
mysql -h HOST -P PORTA -u USUARIO -p NOME_DO_BANCO < "C:\Users\Vitinho\workSpace-sts\siteverbety-deploy.sql"
```

O PowerShell não aceita o `<`; se preferir usá-lo, chame o `cmd`:

```powershell
cmd /c 'mysql -h HOST -P PORTA -u USUARIO -p NOME_DO_BANCO < "C:\Users\Vitinho\workSpace-sts\siteverbety-deploy.sql"'
```

Se o provedor exigir SSL, acrescente `--ssl-mode=REQUIRED`.

> Esse arquivo contém os dados reais do site. **Não commite o dump no GitHub.**

## 2. Enviar o código para o GitHub

O repositório já aponta para:

```
https://github.com/VitorGabrielSangaletti/Verbety-E-commerce-para-Loja-de-Roupas
```

Depois de autorizar o commit, envie a branch `main`:

```powershell
git push origin main
```

## 3. Criar o serviço no Render

1. Crie uma conta em <https://render.com> e conecte sua conta do GitHub.
2. Clique em **New +** > **Web Service**.
3. Selecione o repositório `Verbety-E-commerce-para-Loja-de-Roupas`.
4. Configure:
   - **Name:** `verbety` (ou outro nome)
   - **Branch:** `main`
   - **Runtime:** `Docker`
   - **Dockerfile Path:** `./Dockerfile`
   - **Instance Type:** `Free`
5. Em **Environment Variables**, adicione:

| Variável | Valor |
|---|---|
| `DB_URL` | `jdbc:mysql://HOST:PORTA/NOME_DO_BANCO?useUnicode=true&characterEncoding=UTF-8&serverTimezone=UTC&sslMode=REQUIRED&allowPublicKeyRetrieval=true` |
| `DB_USER` | usuário do banco |
| `DB_PASSWORD` | senha do banco |

Observações:

- Se o provedor **não usar SSL**, remova `sslMode=REQUIRED`.
- Se der erro de autenticação, mantenha `allowPublicKeyRetrieval=true`.
- **Não** defina `PORT`: o Render injeta essa variável automaticamente.

6. Clique em **Create Web Service** e aguarde o build (a primeira vez leva alguns minutos).

## 4. Testar

Quando o deploy terminar, abra:

```
https://SEU-SITE.onrender.com/
```

O `index.html` redireciona para `/html/Home.html`.

Teste também:

```
https://SEU-SITE.onrender.com/api/produtos
https://SEU-SITE.onrender.com/html/Catalogo.html
```

No plano gratuito, o serviço hiberna após um período sem acesso. A primeira visita pode demorar **30 a 60 segundos**. Antes da apresentação, abra o site alguns minutos antes.

As sessões de login ficam na memória do servidor. Se o Render reiniciar ou hibernar, basta entrar de novo; os dados do banco continuam salvos.

## 5. Trocar as senhas de administrador

O dump atual mantém as contas de administrador criadas durante o desenvolvimento, com as senhas de teste.

**Troque antes de deixar o site público.** Como não existe tela para alterar senha, o caminho é gerar um hash BCrypt da senha nova e rodar no banco:

```sql
UPDATE funcionario
SET senha = 'HASH_BCRYPT_DA_SENHA_NOVA'
WHERE email = 'admin@verbety.com';
```

Peça o hash para o assistente (basta informar a senha nova) ou gere com uma ferramenta BCrypt confiável. Não coloque a senha em texto puro no banco.

## 6. Atualizações futuras

Qualquer `git push` na branch `main` faz o Render reconstruir e publicar de novo.

Para testar localmente antes:

```powershell
cd "C:\Users\Vitinho\workSpace-sts\_tcc-verbety-git\Sts"
.\mvnw.cmd package -DskipTests
java -jar target\SiteVerbety-0.0.1-SNAPSHOT.jar
```

O Docker copia automaticamente a pasta `Front end` para dentro do jar durante o build. Localmente, o front continua sendo servido pela pasta `../Front end` via `WebConfig`.

## Checklist antes da apresentação

- [ ] Abrir o site 5 minutos antes (para acordar o Render).
- [ ] Login de cliente funcionando.
- [ ] Catálogo com produtos e imagens.
- [ ] Adicionar ao carrinho e finalizar um pedido de teste.
- [ ] Login de administrador e painel admin.
- [ ] Senhas padrão trocadas.
- [ ] Dump do banco guardado fora do repositório.
