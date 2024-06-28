var express = require('express');
var router = express.Router();
var UserController = require('../../controllers/users.controller');
var Authorization = require('../../auth/authorization');
var { validateCreateUser, validateAddFavoritas, validateAddToVistas, validateAddToPorVer, validateRemoveFromFavoritas, validateRemoveFromPorVer, validateRemoveFromVistas, validateGetFavoritas, validateGetVistas, validateGetPorVer, validateLogin, validateUpdateUser } = require('../../middlewares/validation');
var emailController = require('../../controllers/emailController');


router.get('/', function(req, res, next) {
    res.send('Llegaste a la ruta de  api/user.routes');
});

router.post('/registration', validateCreateUser, UserController.createUser);
router.post('/login/', validateLogin, UserController.loginUser);

router.post('/favoritas', Authorization, validateAddFavoritas, UserController.addFavoritas);
router.post('/favoritas/delete', Authorization, validateRemoveFromFavoritas, UserController.removeFavoritas);
router.post('/favoritas/get', Authorization, validateGetFavoritas, UserController.getFavoritas);

router.post('/porver', Authorization, validateAddToPorVer, UserController.addPorVer);
router.post('/porver/delete', Authorization, validateRemoveFromPorVer, UserController.removePorVer);
router.post('/porver/get', Authorization, validateGetPorVer, UserController.getPorVer);

router.post('/vistas', Authorization, validateAddToVistas, UserController.addVistas);
router.post('/vistas/delete', Authorization, validateRemoveFromVistas, UserController.removeVistas);
router.post('/vistas/get', Authorization, validateGetVistas, UserController.getVistas);

router.get('/users', Authorization, UserController.getUsers);
router.post('/userByMail', Authorization, UserController.getUsersByMail);
router.put('/update', Authorization, validateUpdateUser, UserController.updateUser);
router.delete('/delete', Authorization, UserController.removeUser);
router.post('/recovery', emailController.sendRecoveryEmail); 


module.exports = router;
