import express from 'express';
import conectarDB from './config/db.js';
import dotenv  from 'dotenv';
import router from './routes/usuarioRoutes.js';


const app = express();
app.use(express.json())

dotenv.config();

conectarDB();

//routing
app.use('/api/usuarios',router);

const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
    console.log(`servidor funcionando en el puerto: ${PORT}`);
});


