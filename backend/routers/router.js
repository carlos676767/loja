
const { RegisterContentController } = require("../controllers/authorization/registerContentController")
const checkDataRegistrationUser = require("../controllers/checkDataRegistrationUser")
const DeleteUserController = require("../controllers/deleteUserController")
const Login = require("../controllers/loginUserController")
const GetHistory = require("../controllers/payments/historyPaymentUserController")
const { getHistoricy } = require("../controllers/payments/historyPaymentUserController")
const StripeApi = require("../controllers/payments/methodsPayments/StripeApi")
const PaymentsController = require("../controllers/payments/paymentsController")
const ProductsLinkedWithUserController = require("../controllers/payments/ProductsLinkedWithUserController")
const WebHookStripe = require("../controllers/payments/webhook/stripeWebhook")
const RegistrationUserController = require("../controllers/registrationUserController")

const ResetPassWorld = require("../controllers/resetPassWord")
const UpdateUserController = require("../controllers/updateUserController")
const verifyPassResetController = require("../controllers/verifyPassResetController")
const MiddlareLoginService = require("../middleware/middlareLoginService")
const Multer = require("../utils/multerConfigService")

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

routerApi.use(`/middleware-login`, MiddlareLoginService.Oauth)

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
 *     tags: [Content]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               conteudo:
 *                 type: string
 *                 description: |
 *                   The content text to be submitted. (Max length: 500 characters)
 *               preco_conteudo:
 *                 type: number
 *                 format: float
 *                 description: |
 *                   The price of the content. (Example: 19.99)
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: |
 *                   The image file to be uploaded (acceptable formats: jpg, jpeg, png; max size: 5MB).
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



const single =  Multer.multerConfig().single(`file`)

routerApi.post(`/content`, (req, res, next) => {
    single(req, res, (err) => {
      if (err) {
      return  next(err.message);
      }
      next()
    
    });
 },   RegisterContentController.router);






 /**
 * @swagger
 * components:
 *   schemas:
 *     PaymentRequest:
 *       type: object
 *       required:
 *         - idsProdutos
 *         - idUsuario
 *         - metodoPagamento
 *       properties:
 *         idsProdutos:
 *           type: string
 *           description: Lista de IDs dos produtos a serem pagos, separados por vírgula.
 *           example: "1,2,3"
 *         idUsuario:
 *           type: integer
 *           description: ID do usuário que está realizando o pagamento.
 *           example: 101
 *         metodoPagamento:
 *           type: string
 *           description: Método de pagamento desejado, como "pix" ou "boleto".
 *           enum:
 *             - pix
 *             - boleto
 *           example: "boleto"
 *     PaymentResponse:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           description: URL para o pagamento (se aplicável).
 *           example: "https://payment.example.com"
 *         status:
 *           type: string
 *           description: Status do pagamento.
 *           example: "awaiting payment"
 * 
 * paths:
 *   /payment:
 *     post:
 *       summary: Realiza o pagamento de um pedido.
 *       description: Este endpoint realiza o pagamento utilizando os métodos Pix ou Boleto, dependendo da escolha do usuário.
 *       operationId: createPayment
 *       tags:
 *         - Pagamento
 *       requestBody:
 *         description: Dados para realizar o pagamento.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentRequest'
 *       responses:
 *         '200':
 *           description: Pagamento iniciado com sucesso.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/PaymentResponse'
 *         '400':
 *           description: Erro de validação ou entrada inválida.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   err:
 *                     type: string
 *                     description: Mensagem de erro.
 *                     example: "Enter a valid payment method between bank slip and pix"
 *         '404':
 *           description: Usuário ou produto não encontrado.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   err:
 *                     type: string
 *                     description: Mensagem de erro.
 *                     example: "The ID entered does not exist in the database."
 */



 routerApi.post(`/payment`, PaymentsController.router)
  


routerApi.post(`/stripeWebHook`,  WebHookStripe.webWhook)



/**
 * @swagger
 * components:
 *   schemas:
 *     Historic:
 *       type: object
 *       properties:
 *         ID:
 *           type: integer
 *           description: ID do usuário.
 *         iD_USER:
 *           type: integer
 *           description: ID do usuário no histórico de pagamento.
 *         PAYMENT_DATE:
 *           type: string
 *           format: date-time
 *           description: Data do pagamento.
 *         AMOUNT:
 *           type: number
 *           description: Quantia paga.
 *       example:
 *         ID: 1
 *         iD_USER: 1
 *         PAYMENT_DATE: "2024-12-01T10:00:00.000Z"
 *         AMOUNT: 150.50
 */

/**
 * @swagger
 * /history/{user}:
 *   get:
 *     summary: Recupera o histórico de pagamentos de um usuário.
 *     description: Retorna uma lista com o histórico de pagamentos vinculados a um ID de usuário específico.
 *     tags: [Histórico de Pagamento]
 *     parameters:
 *       - in: path
 *         name: user
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário.
 *     responses:
 *       200:
 *         description: Lista de históricos de pagamento.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 itens:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Historic'
 *       400:
 *         description: O ID do usuário não foi fornecido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: "enter the user id"
 *       404:
 *         description: Nenhum histórico de pagamento foi encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: "There is no payment history for this user"
 */

routerApi.get(`/history/:user`, GetHistory.router)


/**
 * @swagger
 * components:
 *   schemas:
 *     ProductTransaction:
 *       type: object
 *       properties:
 *         ID_CONTEUDO:
 *           type: integer
 *           description: ID do conteúdo comprado pelo usuário.
 *         CONTEUDO:
 *           type: string
 *           description: Descrição ou nome do conteúdo.
 *         DIA_PAGAMENTO:
 *           type: string
 *           format: date
 *           description: Data do pagamento.
 *         HORA_PAGAMENTO:
 *           type: string
 *           format: time
 *           description: Hora do pagamento.
 *       example:
 *         ID_CONTEUDO: 101
 *         CONTEUDO: "Ebook de Programação"
 *         DIA_PAGAMENTO: "2024-12-01"
 *         HORA_PAGAMENTO: "14:35:00"
 */

/**
 * @swagger
 * /products/{user}:
 *   get:
 *     summary: Retorna os produtos e transações relacionadas a um usuário específico.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: user
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário.
 *     responses:
 *       200:
 *         description: Lista de produtos e transações do usuário.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductTransaction'
 *       400:
 *         description: O ID do usuário não foi fornecido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: "enter the user id"
 *       404:
 *         description: Nenhum produto encontrado para o usuário.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   example: "There is no payment product for this user"
 */


routerApi.get(`/products/:user`, ProductsLinkedWithUserController.router)



/**
 * @swagger
 * /update-user:
 *   put:
 *     summary: Update a user field
 *     description: Updates a specific field of a user in the database. Select either "email" or "senha" as the field to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newValue:
 *                 type: string
 *                 description: New value for the field.
 *               id:
 *                 type: integer
 *                 description: ID of the user to update.
 *               opcao:
 *                 type: string
 *                 description: The field to update ("email" or "senha").
 *             required:
 *               - newValue
 *               - id
 *               - opcao
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: Invalid input or error during the update.
 */

routerApi.put(`/update-user`, UpdateUserController.router)


/**
 * @swagger
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         msg:
 *           type: string
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The ID of the user.
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operations related to users.
 */

/**
 * @swagger
 * /deleteUser/{userId}:
 *   delete:
 *     summary: Deletes a user by ID
 *     description: This endpoint deletes a user from the database using the provided ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to be deleted.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: User deleted successfully.
 *       400:
 *         description: Invalid ID supplied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized or invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

routerApi.delete(`/deleteUser/:userId`, DeleteUserController.router)
module.exports = routerApi
