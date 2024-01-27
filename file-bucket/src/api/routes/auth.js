import express from 'express';
import { handleUserRegistration, handleUserLogin, handleUserAtHomepage } from '../controllers/auth.js';
import { getUserAuthState } from '../middlewares/auth.js';
const authRoute = express.Router();

authRoute
.get('/', getUserAuthState, handleUserAtHomepage)
.post('/auth/create', handleUserRegistration)
.post('/auth/login', handleUserLogin)

export default authRoute;