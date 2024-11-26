const checkDataRegistrationUser = require("../controllers/checkDataRegistrationUser")
const Login = require("../controllers/loginUserController")
const RegistrationUserController = require("../controllers/registrationUserController")
const ResetPassWorld = require("../controllers/resetPassWord")
const verifyPassResetController = require("../controllers/verifyPassResetController")

const routerApi = require(`express`).Router()




/**
 * @swagger
 * /register:
 *   post:
 *     description: Checa se o usuario esta registrado, caso nao esta envia um codigo de confirmacao
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Please check your email, remembering you only have 5 minutes.
 */

routerApi.post(`/register`, checkDataRegistrationUser.routerVerfify)//para validacoes e enviar email para o uusario

/**
 * @swagger
 * /confirmCode:
 *   post:
 *     description: Rota que pega o código enviado por email e verifica se é igual ao código que temos. Caso seja, faz o cadastro.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *   
 *     responses:
 *       200:
 *         description: Código confirmado com sucesso, cadastro realizado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jwt:
 *                   type: string
 *                   description: Token JWT gerado após o cadastro.
 *                 register:
 *                   type: boolean
 *                   description: Indica se o usuário foi registrado com sucesso.
 */

routerApi.post(`/confirmCode`, RegistrationUserController.router)//rota que confirma o codigo da\ rota register e cria a conta.

/**
 * @swagger
 * /password/forgot:
 *   post:
 *     description: nessa rota serve para o usuario informar o email e verificar se esta cadastrado , caso estiver uma tela .html e enviado para o usuario assim trocando sua senha.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *              
 *     responses:
 *       200:
 *         description: has been sent to your email to change your password, you only have 5 minutes to change your password
 */

routerApi.post(`/password/forgot`,verifyPassResetController.router )

routerApi.patch(`/resetPass`, ResetPassWorld.routers)


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     Unauthorized:
 *       description: Acesso não autorizado
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *                 example: "the password is incorrect"
 */

/**
 * @swagger
 * tags:
 *   - name: Login
 *     description: API de login para autenticação de usuários usando JWT
 */


/**
 * @swagger
 * /middleware-login:
 *   get:
 *     summary: Middleware de autenticação usando JWT
 *     description: Valida o token JWT enviado nos headers da requisição.
 *     tags: [Login]
 *     security:
 *       - BearerAuth: []  # Indica que é necessário fornecer um token JWT no header Authorization
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token JWT para autenticação.
 *         schema:
 *           type: string
 *           example: Bearer <your-jwt-token>  # Exemplo de como passar o token
 *     responses:
 *       200:
 *         description: Token JWT válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "valid jwt token"
 *                 authorized:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "the token entered is invalid"
 */

routerApi.use(`/middleware-login`, Login.middlareLogin)

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza login do usuário
 *     description: Verifica o email e a senha e retorna um token JWT se as credenciais forem válidas.
 *     tags: [Login]
 *     requestBody:
 *       description: Credenciais do usuário para login (email e senha)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senhaUser
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               senhaUser:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login bem-sucedido, token gerado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 login:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Erro de autenticação ou dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: "the email provided does not exist"
 *       401:
 *         description: Senha incorreta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "the password is incorrect"
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Internal server error"
 */
routerApi.post(`/login`, Login.router)


/**
 * @swagger
 * tags:
 *   - name: Content
 *     description: Content management and image upload
 */

/**
 * @swagger
 * /content:
 *   post:
 *     summary: Upload an image and submit content
 *     description: Upload an image and submit content with validation for file size, format, and content length.
 *     tags: [Here you can upload the content]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               conteudo:
 *                 type: string
 *                 description: The content text to be submitted.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file to be uploaded (jpg, jpeg, png formats).
 *     responses:
 *       201:
 *         description: Content successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Content successfully registered
 *       400:
 *         description: Bad request, invalid content or file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Please send the content or the file
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: An error occurred while registering content, please try again.
 */

module.exports = routerApi
