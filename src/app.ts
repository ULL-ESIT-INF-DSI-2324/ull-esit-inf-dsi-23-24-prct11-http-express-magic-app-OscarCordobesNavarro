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
import express from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { CardCollectionsHandlerAsync } from "./dataAPI/CardCollectionHandlerAsync.js";

export type ErrorMessage = {
  error: string;
};

const app = express();

const __dirname = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/public",
);

app.use(express.static(__dirname));

// Middleware para que todas las peticiones pasen por aquí
app.use((req, res, next) => {
  if (!req.url.startsWith("/cards")) {
    res.sendFile(join(__dirname, "404.html"));
    return;
  }
  next();
});

console.log(__dirname);

// Para las peticiones get a la raíz de la aplicación
app.get("/cards", (req, res) => {
  console.log("La query tiene los parámetros: " + req.query);
  console.log(
    "La cantidad de elementos que tenemose en la query es: " +
      Object.keys(req.query).length,
  );

  // Si se proporciona entre 1 y 2 parámetros
  if (Object.keys(req.query).length > 0 && Object.keys(req.query).length < 3) {
    // Si se quiere listar todas las cartas de una collección, se requiere del parámetro name
    if (Object.keys(req.query).length == 1 && req.query.name) {
      console.log("Se ha proporcionado el parámetro name" + req.query.name);
      res.send("Se ha proporcionado el parámetro name" + req.query.name);
      // Implementar la lógica para listar todas las cartas de una colección
    } else if (
      Object.keys(req.query).length == 2 &&
      req.query.name &&
      req.query.id
    ) {
        // Implementar la lógica para listar una carta en concreto de una colección
        const handler = new CardCollectionsHandlerAsync(req.query.name.toString());
        handler.getCard(parseInt(req.query.id.toString()), (card) => {
            res.send(card);
        });
    } else {
        const errorMessage: ErrorMessage = {
            error: "Se han proporcionado 2 parámetros pero no son los correctos, recuerda que se requiere name e id(numero)"
        };
        res.send(errorMessage);
    }
  } else {
    const errorMessage: ErrorMessage = {
      error:
        "No se han proporcionado los parámetros necesarios, recuerda que se requiere de 1 a 2 parámetros",
    };
    res.send(errorMessage);
  }
});

app.post("/cards", (req, res) => {});

app.delete("/cards", (req, res) => {});

app.patch("/cards", (req, res) => {});

app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
