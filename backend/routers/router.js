const checkDataRegistrationUser = require("../controllers/checkDataRegistrationUser")
const RegistrationUserController = require("../controllers/registrationUserController")
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

module.exports = routerApi
