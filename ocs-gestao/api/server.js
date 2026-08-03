import app from "./src/app.js"

const port = 21007;

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