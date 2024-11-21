const checkDataRegistrationUser = require("../controllers/checkDataRegistrationUser")
const RegistrationUserController = require("../controllers/registrationUserController")
const routerApi = require(`express`).Router()
routerApi.post(`/register`, checkDataRegistrationUser.routerVerfify)
routerApi.post(`/confirmCode`, RegistrationUserController.router)
module.exports = routerApi
