/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Desarrollo de Sistemas Informáticos
 * Curso: 3º
 * Autor: Óscar Cordobés Navarro
 * Correo: alu0101478081@ull.edu.es
 * Fecha: 16/04/2024
 * Práctica 11: Aplicación Express para coleccionistas de cartas Magic
 */
import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __dirname = join(dirname(fileURLToPath(import.meta.url)), '../src/public');

app.use(express.static(__dirname));

// Middleware para que todas las peticiones pasen por acá
app.use((req, res, next) => {
    if(!req.url.startsWith('/cards')) {
        res.sendFile(join(__dirname, '404.html'));
        return;
    }
    next();
});

console.log(__dirname);


app.get('/cards', (req, res) => {
    console.log(req.query);
    // Le envío de vuelta el query que me envió el cliente
    if (!req.query.name) {
        res.send({
            error: 'You must provide a name query parameter'
        });
        return;
    }
    res.send(req.query);
    // res.send('About page');
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
