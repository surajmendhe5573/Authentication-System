const express= require('express');
const { signUp, login, getAllUsers } = require('../controllers/user.controller');
const router= express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/', getAllUsers);

module.exports= router;