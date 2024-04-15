import { error } from 'console';
import express from 'express';

const app = express();

app.get('', (_, res) => {
  res.send('Hello World!');
});

// Middleware
app.use((req, res, next) => {
    if (!req.url.startsWith('/cards')) {
        return res.status(404).sendFile('404.html');
    }
    next();
});

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