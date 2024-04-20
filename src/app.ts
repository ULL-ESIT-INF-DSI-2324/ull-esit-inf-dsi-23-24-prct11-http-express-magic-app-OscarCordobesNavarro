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
import { CardCollectionsHandlerAsync } from "./dataAPI/CardCollectionsHandlerAsync.js";
import chalk from "chalk";
import stripAnsi from "strip-ansi";
import { ICard } from "./dataAPI/ICard.js";
import { TypeLine } from "./dataAPI/ITypeLine.js";
import { Rarity } from "./dataAPI/IRarity.js";
import { Color } from "./dataAPI/IColor.js";

// Creamos la aplicación express
const app = express();

// Definimos __dirname para poder acceder a la carpeta public
const __dirname = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/public",
);

// Middleware para que se pueda acceder a req.body
app.use(express.json());

// Middleware para que se pueda acceder a la carpeta public
app.use(express.static(__dirname));

// Middleware para que todas las peticiones pasen por aquí
app.use((req, res, next) => {
  if (!req.url.startsWith("/cards")) {
    res.sendFile(join(__dirname, "404.html"));
    return;
  }
  next();
});


/**
 * Manejador del endpoint /cards para solicitudes GET
 */
app.get("/cards", (req, res) => {
  // Si se proporciona entre 1 y 2 parámetros
  if (Object.keys(req.query).length > 0 && Object.keys(req.query).length < 3) {
    // Si se quiere listar todas las cartas de una collección, se requiere del parámetro name
    if (Object.keys(req.query).length == 1 && req.query.name) {
      // Implementar la lógica para listar todas las cartas de una colección
      const handler = new CardCollectionsHandlerAsync(
        req.query.name.toString(),
      );
      handler.getCollection((error, collection) => {
        if (error) {
          console.log(
            chalk.red(
              "Error al enviar la colección del usuario " +
                req.query.name +
                ".",
              stripAnsi(error.message),
            ),
          );
          res.send({ error: stripAnsi(error.message) });
        } else {
          console.log(
            chalk.green(
              "La colección del usuario " +
                req.query.name +
                " se ha enviado correctamente.",
            ),
          );
          // Convertimos el array de cartas a un objeto JSON
          res.send(JSON.stringify(collection));
        }
      });
    } else if (
      Object.keys(req.query).length == 2 &&
      req.query.name &&
      req.query.id
    ) {
      // Implementar la lógica para listar una carta en concreto de una colección
      const handler = new CardCollectionsHandlerAsync(
        req.query.name.toString(),
      );
      const idNumber = parseInt(req.query.id.toString());
      if (isNaN(idNumber)) {
        res.send({ error: "El id debe ser un número" });
        return;
      }

      handler.getCard(idNumber, (error, card) => {
        if (error) {
          console.log(
            chalk.red(
              "Error al enviar la carta del usuario " +
                req.query.name +
                " con id " +
                req.query.id +
                ".",
              stripAnsi(error.message),
            ),
          );
          res.send({ error: stripAnsi(error.message) });
        } else {
          console.log(
            chalk.green(
              "La carta del usuario " +
                req.query.name +
                " con id " +
                req.query.id +
                " se ha enviado correctamente.",
            ),
          );
          res.send(card);
        }
      });
    } else {
      res.send({error: "Se han proporcionado 2 parámetros pero no son los correctos, recuerda que se requiere name e id(numero)"});
    }
  } else {
    res.send({ error: "No se han proporcionado los parámetros necesarios, recuerda que se requiere de 1 a 2 parámetros" });
  }
});

/**
 * Manejador del endpoint /cards para solicitudes POST
 */
app.post("/cards", (req, res) => {
  // Comprobar que el usuario se está indicando en la queryString y que es solo un parámetro
  if (Object.keys(req.query).length == 1 && req.query.name) {
    // Comprobar que se está enviando una carta en el body
    if (Object.keys(req.body).length > 0) {
      const handler = new CardCollectionsHandlerAsync(
        req.query.name.toString(),
      );

      // Comprobar que tenga los parámetros minimos de una ICard
      if (!req.body.id || !req.body.name || !req.body.manaCost || !req.body.color || !req.body.lineType || !req.body.rarity || !req.body.ruleText || !req.body.marketValue) {
        res.send({ error: "No se han proporcionado todos los parámetros necesarios, recuerda que se requiere id, name, manaCost, color, lineType, rarity, ruleText y marketValue" });
        return;
      }

      // Pasamos la string de color a un color de IColor
      const color = Color[req.body.color as keyof typeof Color];
      const typeLine = TypeLine[req.body.lineType as keyof typeof TypeLine];
      const rarity = Rarity[req.body.rarity as keyof typeof Rarity];

      if (!color) {
        res.send({ error: "Color not found" });
        return;
      }

      if (!typeLine) {
        res.send({ error: "TypeLine not found" });
        return;
      }

      if (!rarity) {
        res.send({ error: "Rarity not found" });
        return;
      }

      const carta: ICard = {
        id: req.body.id,
        name: req.body.name,
        manaCost: req.body.manaCost,
        color: color,
        lineType: typeLine,
        rarity: rarity,
        strength: req.body.strength,
        endurance: req.body.endurance,
        brandsLoyalty: req.body.brandsLoyalty,
        ruleText: req.body.ruleText,
        marketValue: req.body.marketValue,
      };

      handler.addCard(carta, (error) => {
        if (error) {
          console.log(
            chalk.red(
              "Error al añadir la carta al usuario " + req.query.name + ".",
              stripAnsi(error.message),
            ),
          );
          res.send({ error: stripAnsi(error.message) });
          return;
        } else {
          console.log(
            chalk.green(
              "La carta se ha añadido correctamente al usuario " +
                req.query.name +
                ".",
            ),
          );
          res.send({ data: "La carta se ha añadido correctamente" });
          return;
        }
      });
    } else {
      res.send({error: "No se ha enviado ninguna carta en el body"});
      return;
    }
  } else {
    res.send({error: "No se ha proporcionado el parámetro name en la queryString o se han proporcionado más parámetros de los necesarios"});
    return;
  }
});

/**
 * Manejador del endpoint /cards para solicitudes DELETE
 */
app.delete("/cards", (req, res) => {
  //Comprobamos que se ha proporcionado el parámetro name y id en la queryString
  if (Object.keys(req.query).length == 2 && req.query.name && req.query.id) {
    const handler = new CardCollectionsHandlerAsync(req.query.name.toString());
    const idNumber = parseInt(req.query.id.toString());
    if (isNaN(idNumber)) {
      res.send({ error: "El id debe ser un número" });
      return;
    }
    handler.removeCard(idNumber, (error) => {
      if (error) {
        console.log(
          chalk.red(
            "Error al eliminar la carta del usuario " +
              req.query.name +
              " con id " +
              req.query.id +
              ".",
            stripAnsi(error.message),
          ),
        );
        res.send({ error: stripAnsi(error.message) });
        return;
      } else {
        console.log(
          chalk.green(
            "La carta del usuario " +
              req.query.name +
              " con id " +
              req.query.id +
              " se ha eliminado correctamente.",
          ),
        );
        res.send({data: "La carta se ha eliminado correctamente"});
        return;
      }
    });
  } else {
    res.send({error: "No se han proporcionado los parámetros necesarios, recuerda que se requiere name e id"});
    return;
  }
});

/**
 * Manejador del endpoint /cards para solicitudes PATCH
 */
app.patch("/cards", (req, res) => {
  // Comprobar que tanto el id como el name se han proporcionado en la queryString
  if (Object.keys(req.query).length == 2 && req.query.name && req.query.id) {
    // Comprobar que se está enviando una carta en el body
    if (Object.keys(req.body).length > 0) {
      const handler = new CardCollectionsHandlerAsync(
        req.query.name.toString(),
      );

      const idNumber = parseInt(req.query.id.toString());

      if (isNaN(idNumber)) {
        res.send({ error: "El id debe ser un número" });
        return;
      }

      // Pasamos la string de color a un color de IColor
      const color = Color[req.body.color as keyof typeof Color];
      const typeLine = TypeLine[req.body.lineType as keyof typeof TypeLine];
      const rarity = Rarity[req.body.rarity as keyof typeof Rarity];

      if (!color && color != undefined) {
        res.send({ error: "Color not found" });
        return;
      }

      if (!typeLine && typeLine != undefined) {
        res.send({ error: "TypeLine not found" });
        return;
      }

      if (!rarity && rarity != undefined) {
        res.send({ error: "Rarity not found" });
        return;
      }

      const carta: ICard = {
        id: req.body.id,
        name: req.body.name,
        manaCost: req.body.manaCost,
        color: color,
        lineType: typeLine,
        rarity: rarity,
        strength: req.body.strength,
        endurance: req.body.endurance,
        brandsLoyalty: req.body.brandsLoyalty,
        ruleText: req.body.ruleText,
        marketValue: req.body.marketValue,
      };
      handler.updateCard(carta, idNumber, (error) => {
        if (error) {
          console.log(
            chalk.red(
              "Error al actualizar la carta del usuario " +
                req.query.name +
                " con id " +
                req.query.id +
                ".",
              stripAnsi(error.message),
            ),
          );
          res.send({ error: stripAnsi(error.message) });
          return;
        } else {
          console.log(
            chalk.green(
              "La carta del usuario " +
                req.query.name +
                " con id " +
                req.query.id +
                " se ha actualizado correctamente.",
            ),
          );
          res.send({ data: "La carta se ha actualizado correctamente" });
          return;
        }
      });
    } else {
      res.send({error: "No se ha enviado ninguna carta en el body"});
      return;
    }
  } else {
    res.send({error: "No se ha proporcionado el parámetro name en la queryString o se han proporcionado más parámetros de los necesarios"});
    return;
  }
});

// Iniciamos el servidor en el puerto 3000
app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
