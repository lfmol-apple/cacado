import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

for (const key of ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"]) {
    if (!process.env[key]) {
        throw new Error(`Variável de ambiente ${key} não definida. Configure o arquivo .env (veja .env.example).`);
    }
}

let db = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
})

// Sem este listener, um erro de conexão perdida (timeout ocioso, rede) vira
// exceção não tratada e derruba o processo inteiro. Com o listener, o mysql2
// só descarta a conexão ruim do pool e cria outra na próxima query.
db.on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Erro no pool do MySQL:`, err.code || err.message);
});

export default db;