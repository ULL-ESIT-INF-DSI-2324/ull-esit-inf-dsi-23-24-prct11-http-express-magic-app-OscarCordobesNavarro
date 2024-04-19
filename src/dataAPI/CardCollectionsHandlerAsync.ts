/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Desarrollo de Sistemas Informáticos
 * Curso: 3º
 * Autor: Óscar Cordobés Navarro
 * Correo: alu0101478081@ull.edu.es
 * Fecha: 07/04/2024
 * Práctica 9: Filesystem  of node.js
 */
import { ICard } from "./ICard.js";
import { Color } from "./IColor.js";
import fs from "fs";
import path from "path";
import chalk from "chalk";

export class CardCollectionsHandlerAsync {
  private userCollectionPath: string = "./data/";
  private userName: string = "";
  private userDirectory: string = "";

  constructor(userName?: string) {
    if (userName) {
      this.userName = userName;
      this.userDirectory = path.join(this.userCollectionPath, this.userName);
    }
    // Creamos la carpeta data si no existe
    fs.mkdir(this.userCollectionPath, { recursive: true }, (err) => {
      if (err) {
        console.log(chalk.red.bold("Error creating data folder"));
      }
    });
  }

  /**
   * Devuelve el directorio de colección del usuario.
   * 
   * @returns El directorio de colección del usuario.
   */
  public getUserCollectionDirectory(): string {
    return this.userDirectory;
  }

  /**
   * Devuelve el nombre de usuario.
   * 
   * @returns El nombre de usuario.
   */
  public getUsername(): string {
    return this.userName;
  }

  /**
   * Actualiza el nombre de usuario.
   * 
   * @param newUser El nuevo nombre de usuario.
   */
  public updateUser(newUser: string): void {
    this.userName = newUser;
    this.userDirectory = path.join(this.userCollectionPath, this.userName);
  }

  /**
   * Devuelve el path de la carta.
   * 
   * @param id El id de la carta.
   * @returns El path de la carta.
   */
  private getCardFilePath(id: number): string {
    return path.join(this.userDirectory, `${id}.json`);
  }


  /**
   * Escribe una carta en un archivo.
   * 
   * @param card - La carta a escribir en el archivo.
   * @param callback - Una función de devolución de llamada que se invoca después de escribir la carta en el archivo. Recibe un parámetro de error en caso de que ocurra algún error durante la escritura.
   */
  private writeCardToFile(
    card: ICard,
    callback: (error: Error | null) => void,
  ): void {
    // Comprobamos si el directorio de la coleccion del usuario existe
    this.checkUserDirectory((err) => {
      if (err) {
        // Creamos el directorio si no existe y escribimos la carta
        fs.mkdir(this.userDirectory, (err) => {
          if (err) {
            return callback(err);
          }
          this.checkCardFileAndWrite(card, callback);
        });
      } else {
        this.checkCardFileAndWrite(card, callback);
      }
    });
  }

  /**
   * Comprueba el archivo de la tarjeta y escribe los datos de la tarjeta en él.
   * 
   * @param card - La tarjeta a escribir en el archivo.
   * @param callback - Una función de devolución de llamada que se invoca después de completar la escritura del archivo.
   */
  private checkCardFileAndWrite(
    card: ICard,
    callback: (error: Error | null) => void,
  ): void {
    const filePath = this.getCardFilePath(card.id);
    const data = JSON.stringify(card, undefined, 2);
    this.checkCardFile(card.id, (err) => {
      if (err) {
        return callback(err);
      } else {
        fs.writeFile(filePath, data, (err) => {
          if (err) {
            return callback(err);
          }
          callback(null);
        });
      }
    });
  }

  /**
   * Comprueba si el directorio del usuario existe.
   * 
   * @param callback - Función de devolución de llamada que se ejecuta después de comprobar el directorio del usuario.
   * @param error - Error que se pasa a la función de devolución de llamada si el directorio no existe.
   */
  private checkUserDirectory(callback: (error: Error | null) => void): void {
    fs.access(this.userDirectory, fs.constants.F_OK, (err) => {
      if (err) {
        const error = new Error(chalk.red.bold("Collection not found"));
        return callback(error);
      } else {
        return callback(null);
      }
    });
  }

  /**
   * Comprueba si existe un archivo de carta.
   * 
   * @param id - El ID de la carta.
   * @param callback - Función de devolución de llamada que se ejecuta después de comprobar el archivo.
   */
  private checkCardFile(
    id: number,
    callback: (error: Error | null) => void,
  ): void {
    const filePath = this.getCardFilePath(id);

    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        return callback(null);
      } else {
        const error = new Error(chalk.red.bold(
          `Card already exists at ${this.userName} collection`,
        ));
        return callback(error);
      }
    });
  }

  /**
   * Añade una carta a la colección.
   * 
   * @param card - La carta que se va a añadir.
   * @param callback - Una función de devolución de llamada que se ejecutará después de añadir la carta. 
   *                  Recibe un parámetro de error en caso de que ocurra un error durante la operación.
   */
  public addCard(card: ICard, callback: (error: Error | null) => void): void {
    if (card.lineType === "Creature" && (!card.strength || !card.endurance)) {
      callback(new Error(chalk.red.bold("Creature card must have strength and endurance")));
    }
    if (card.lineType === "Planeswalker" && !card.brandsLoyalty) {
      callback(new Error(chalk.red.bold("Planeswalker card must have brands loyalty")));
    }
    this.writeCardToFile(card, callback);
  }

  /**
   * Elimina todos los archivos y directorios de la colección del usuario.
   * 
   * @param callback - Función de devolución de llamada que se invoca una vez que se completa la operación. Recibe un parámetro de error que indica si ocurrió algún error durante la eliminación.
   */
  public clearCollection(callback: (error: Error | null) => void): void {
    fs.access(this.userDirectory, fs.constants.F_OK, (errAccess) => {
      if (errAccess) {
        return callback(null);
      } else {
        fs.rm(this.userDirectory, { recursive: true }, (errRemove) => {
          if (errRemove) {
            return callback(errRemove);
          }
          return callback(null);
        });
      }
    });
  }


  /**
   * Obtiene una tarjeta específica según su ID.
   * 
   * @param id - El ID de la tarjeta a obtener.
   * @param callback - Función de devolución de llamada que se ejecuta una vez que se obtiene la tarjeta.
   *                  Recibe dos parámetros: error y card.
   *                  - error: Un objeto Error si se produce un error durante la obtención de la tarjeta, o null si no hay errores.
   *                  - card: La tarjeta obtenida, representada como un objeto ICard, o null si no se encuentra la tarjeta.
   */
  public getCard(
    id: number,
    callback: (error: Error | null, card: ICard | null) => void,
  ): void {
    const filePath = this.getCardFilePath(id);

    this.checkUserDirectory((err) => {
      if (err) {
        const error = new Error(chalk.red.bold("Collection not found"));
        return callback(error, null);
      } else {
        fs.access(filePath, fs.constants.F_OK, (errAccess) => {
          if (errAccess) {
            const error = new Error(chalk.red.bold(
              `Card not found at ${this.userName} collection`,
            ));
            return callback(error, null);
          } else {
            fs.readFile(filePath, "utf-8", (errRead, data) => {
              if (errRead) {
                const error = new Error(chalk.red.bold(
                  `Error reading card file: ${errRead.message}`,
                ));
                return callback(error, null);
              }

              try {
                const card = JSON.parse(data) as ICard;
                return callback(null, card);
              } catch (parseError) {
                const error = new Error(chalk.red.bold(
                  `Error parsing card data: ${parseError.message}`,
                ));
                return callback(error, null);
              }
            });
          }
        });
      }
    });
  }

  /**
   * Elimina una tarjeta del sistema.
   * 
   * @param id - El ID de la tarjeta a eliminar.
   * @param callback - Función de devolución de llamada que se ejecuta una vez que se completa la eliminación de la tarjeta. Recibe un parámetro de error en caso de que ocurra un error durante la eliminación.
   */
  public removeCard(id: number, callback: (error: Error | null) => void): void {
    const filePath = this.getCardFilePath(id);

    this.checkUserDirectory((err) => {
      if (err) {
        const error = new Error(chalk.red.bold("Collection not found"));
        return callback(error);
      } else {
        fs.access(filePath, fs.constants.F_OK, (errAccess) => {
          if (errAccess) {
            const error = new Error(chalk.red.bold(
              `Card not found at ${this.userName} collection`,
            ));
            return callback(error);
          } else {
            fs.unlink(filePath, (err) => {
              if (err) {
                return callback(err);
              }
              return callback(null);
            });
          }
        });
      }
    });
  }

  /**
   * Imprime los detalles de una carta en la consola.
   * 
   * @param card - La carta a imprimir.
   */
  private printCard(card: ICard): void {
    const colorName = Object.keys(Color).find(
      (key) => Color[key as keyof typeof Color] === card.color,
    );
    console.log(
      "\n " + chalk.blue.bold("Card ID: ") + card.id + "\n",
      chalk.blue.bold("Card Name: ") + card.name + "\n",
      chalk.blue.bold("Card Mana Cost: ") + card.manaCost + "\n",
      chalk.hex(card.color).bold("Card Color: ") + colorName + "\n",
      chalk.blue.bold("Card Type Line: ") + card.lineType + "\n",
      chalk.blue.bold("Card Rarity: ") + card.rarity + "\n",
      chalk.blue.bold("Card Rules Text: ") + card.ruleText + "\n",
      chalk.blue.bold("Card Market Value: ") + card.marketValue + "\n",
    );
  }

  /**
   * Muestra una carta específica.
   * 
   * @param id - El ID de la carta a mostrar.
   * @param callback - Función de devolución de llamada que se ejecuta después de mostrar la carta.
   *                  Recibe un parámetro de error en caso de que ocurra algún error durante la operación.
   */
  public showCard(id: number, callback: (error: Error | null) => void): void {
    this.getCard(id, (error, card) => {
      if (error) {
        return callback(error);
      }
      this.printCard(card as ICard);
      return callback(null);
    });
  }

  /**
   * Lista las colecciones de tarjetas del usuario.
   * 
   * @param callback - Función de devolución de llamada que se ejecuta una vez que se completa la operación. Recibe un parámetro de error en caso de que ocurra un error.
   */
  public listCollection(callback: (error: Error | null) => void): void {
    this.checkUserDirectory((err) => {
      if (err) {
        const error = new Error(chalk.red.bold("Collection not found"));
        return callback(error);
      } else {
        fs.readdir(this.userDirectory, (err, files) => {
          if (err) {
            return callback(err);
          }
          if (files.length === 0) {
            const error = new Error(chalk.red.bold("Collection is empty"));
            return callback(error);
          }
          console.log(chalk.green.bold("Collection of " + this.userName + ":"));
          files.forEach((file) => {
            const filePath = path.join(this.userDirectory, file);
            fs.readFile(filePath, "utf-8", (err, data) => {
              if (err) {
                return callback(err);
              }
              const card = JSON.parse(data) as ICard;
              console.log("---------------------------------");
              this.printCard(card);
            });
          });
          return callback(null);
        });
      }
    });
  }

  /**
   * Actualiza una tarjeta en la colección.
   * 
   * @param {ICard} card - La tarjeta actualizada.
   * @param {number} id - El ID de la tarjeta a actualizar.
   * @param {(error: Error | null) => void} callback - Función de devolución de llamada que se ejecuta después de actualizar la tarjeta.
   * @returns {void}
   */
  public updateCard(
    card: ICard,
    id: number,
    callback: (error: Error | null) => void,
  ): void {
    if (card.id !== id) {
      const error = new Error(chalk.red.bold("Card ID and parameter ID do not match"));
      return callback(error);
    }

    this.checkUserDirectory((err) => {
      if (err) {
        const error = new Error(chalk.red.bold("Collection not found"));
        return callback(error);
      } else {
        // Obtenemos la carta a actualizar
        this.getCard(id, (error, oldCard) => {
          if (error) {
            return callback(error);
          } else {
            // Hacemos una mezcla de las propiedades de la carta antigua y la nueva, para mantener las propiedades no modificadas
            // Si la propiedad no está en la nueva carta, se mantiene la antigua
            const updatedCard: ICard = {
              id: card.id,
              name: card.name ?? oldCard?.name ?? "",
              manaCost: card.manaCost ?? oldCard?.manaCost ?? 0,
              color: card.color ?? oldCard?.color ?? "",
              lineType: card.lineType ?? oldCard?.lineType ?? "",
              rarity: card.rarity ?? oldCard?.rarity ?? "",
              ruleText: card.ruleText ?? oldCard?.ruleText ?? "",
              strength: card.strength ?? oldCard?.strength ?? undefined,
              endurance: card.endurance ?? oldCard?.endurance ?? undefined,
              brandsLoyalty: card.brandsLoyalty ?? oldCard?.brandsLoyalty ?? undefined,
              marketValue: card.marketValue ?? oldCard?.marketValue ?? 0,
            };
            // Eliminamos la carta antigua
            this.removeCard(id, (error) => {
              if (error) {
                return callback(error);
              }
              // Escribimos la carta actualizada
              this.writeCardToFile(updatedCard, callback);
            });
          }
        });
      }
    });
  }

  /**
   * Obtiene una representación en forma de cadena de texto de una carta.
   * 
   * @param cardID - El ID de la carta.
   * @param callback - Una función de devolución de llamada que se invoca con el error (si lo hay) y la cadena de texto de la carta.
   */
  public getStringCard(
    cardID: number,
    callback: (error: Error | null, cardString?: string) => void,
  ): void {
    this.getCard(cardID, (error, card) => {
      if (error) {
        return callback(error, undefined);
      } else if (card) { // Add null check
        const colorName = Object.keys(Color).find(
          (key) => Color[key as keyof typeof Color] === card.color,
        );
        const cardString =
          "\n" +
          chalk.blue.bold("Card ID: ") +
          card.id +
          "\n" +
          chalk.blue.bold("Card Name: ") +
          card.name +
          "\n" +
          chalk.blue.bold("Card Mana Cost: ") +
          card.manaCost +
          "\n" +
          chalk.hex(card.color).bold("Card Color: ") +
          colorName +
          "\n" +
          chalk.blue.bold("Card Type Line: ") +
          card.lineType +
          "\n" +
          chalk.blue.bold("Card Rarity: ") +
          card.rarity +
          "\n" +
          chalk.blue.bold("Card Rules Text: ") +
          card.ruleText +
          "\n" +
          chalk.blue.bold("Card Market Value: ") +
          card.marketValue +
          "\n";
        return callback(null, cardString);
      }
    });
  }

  /**
   * Obtiene una representación en forma de cadena de la colección de cartas.
   * 
   * @param callback - Función de devolución de llamada que se invoca con el resultado de la operación.
   *                   Recibe un error en caso de fallo o la cadena de la colección en caso de éxito.
   */
  public getStringCollection(
    callback: (error: Error | null, collectionString?: string) => void,
  ): void {
    this.checkUserDirectory((err) => {
      if (err) {
        const error = new Error(chalk.red.bold("Collection not found"));
        return callback(error, undefined);
      } else {
        fs.readdir(this.userDirectory, (err, files) => {
          if (err) {
            return callback(err, undefined);
          }
          if (files.length === 0) {
            const error = new Error(chalk.red.bold("Collection is empty"));
            return callback(error, undefined);
          }
          let collectionString = chalk.green.bold("Collection of " + this.userName + ":\n");
          let completed = 0;
          for (const file of files) {
            this.getStringCard(parseInt(file), (error, cardString) => {
              if (error) {
                return callback(error, undefined);
              }
              collectionString += cardString;
              completed++;
              if (completed === files.length) {
                return callback(null, collectionString);
              }
            });
          }
        });
      }
    });
  }

  /**
   * Obtiene la colección de cartas del usuario.
   * 
   * @param callback - Una función de devolución de llamada que se invoca con el resultado de la operación.
   *                   En este caso el resultado es la colección de cartas en forma de array ICard.
   *                   Recibe un error en caso de fallo o la colección de cartas en caso de éxito.
   */
  public getCollection(callback: (error: Error | null, collection?: ICard[]) => void): void {
    this.checkUserDirectory((err) => {
      if (err) {
        const error = new Error(chalk.red.bold("Collection not found"));
        return callback(error, undefined);
      } else {
        fs.readdir(this.userDirectory, (err, files) => {
          if (err) {
            return callback(err, undefined);
          }
          if (files.length === 0) {
            const error = new Error(chalk.red.bold("Collection is empty"));
            return callback(error, undefined);
          }
          const collection: ICard[] = [];
          let completed = 0;
          for (const file of files) {
            const filePath = path.join(this.userDirectory, file);
            fs.readFile(filePath, "utf-8", (err, data) => {
              if (err) {
                return callback(err, undefined);
              }
              const card = JSON.parse(data) as ICard;
              collection.push(card);
              completed++;
              if (completed === files.length) {
                return callback(null, collection);
              }
            });
          }
        });
      }
    });
  }
}