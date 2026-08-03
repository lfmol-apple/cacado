// galpaoRoutes.js
import express from 'express';
import validateJWT from './jwtmiddleware.js';
import GalpaoController from '../controllers/galpao.Controller.js';

const router = express.Router();

// Definir as rotas para Galpão

router
// Rota para listar todos os galpões
.get('/galpoes', validateJWT, GalpaoController.getAllGalpoes)

// Rota para listar apenas os galpões ativos
.get('/galpoes/ativos', validateJWT, GalpaoController.getGalpoesAtivos)

// Rota para recuperar um galpão específico pelo ID
.get('/galpoes/:id', validateJWT, GalpaoController.getGalpaoById)

// Rota para criar um novo galpão
.post('/galpoes', validateJWT, GalpaoController.createGalpao)

// Rota para atualizar um galpão existente pelo ID
.put('/galpoes/:id', validateJWT, GalpaoController.updateGalpao)

// Rota para deletar um galpão existente pelo ID
.delete('/galpoes/:id', validateJWT, GalpaoController.deleteGalpao);

export default router;
