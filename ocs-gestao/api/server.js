import app from "./src/app.js"
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const port = 21007;

// Em produção o build do Angular (ocs-gestao/dist) é servido pelo mesmo
// processo, no mesmo domínio da API — evita CORS e mantém a arquitetura
// original (rotas de API e assets estáticos não colidem).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, "..", "dist");
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
}

// Rede de segurança: loga qualquer erro que escape dos try/catch e das
// promises tratadas nos controllers, mas mantém o processo no ar em vez
// de deixar o Node derrubar o servidor inteiro por causa de uma requisição.
process.on('uncaughtException', (err) => {
    console.error(`[${new Date().toISOString()}] Exceção não tratada:`, err);
});

process.on('unhandledRejection', (reason) => {
    console.error(`[${new Date().toISOString()}] Promise rejeitada sem tratamento:`, reason);
});

app.listen(port,()=>{
    console.log(`Servidor escutando em http://localhost:${port}`);
})