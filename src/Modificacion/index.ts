/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Desarrollo de Sistemas Informáticos
 * Curso: 3º
 * Autor: Óscar Cordobés Navarro
 * Correo: alu0101478081@ull.edu.es
 * Fecha: 17/04/2024
 * Práctica 11: Modificacion PE101
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


  public addCard(card: ICard): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (card.lineType === "Creature" && (!card.strength || !card.endurance)) {
        reject(
          new Error(
            chalk.red.bold("Creature card must have strength and endurance"),
          ),
        );
      }
      if (card.lineType === "Planeswalker" && !card.brandsLoyalty) {
        reject(
          new Error(
            chalk.red.bold("Planeswalker card must have brands loyalty"),
          ),
        );
      }
      this.writeCardToFile(card)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private writeCardToFile(card: ICard): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.checkUserDirectory()
        .then(() => {
          this.checkCardFileAndWrite(card).then(() => {
            resolve();
          });
        })
        .catch((err) => {
          // Creamos el directorio si no existe y escribimos la carta
          fs.promises
            .mkdir(this.userDirectory)
            .then(() => {
              this.checkCardFileAndWrite(card)
                .then(() => {
                  resolve();
                })
                .catch((err) => {
                  reject(err);
                });
            })
            .catch((err) => {
              reject(err);
            });
        });
    });
  }

  private checkCardFileAndWrite(card: ICard): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const filePath = this.getCardFilePath(card.id);
      const data = JSON.stringify(card, undefined, 2);
      this.checkCardFile(card.id).then(() => {
        fs.promises
          .writeFile(filePath, data)
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  }

  private checkUserDirectory(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.promises
        .access(this.userDirectory, fs.constants.F_OK)
        .then(() => {
          resolve();
        })
        .catch(() => {
          const error = new Error(chalk.red.bold("Collection not found"));
          reject(error);
        });
    });
  }

  private checkCardFile(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const filePath = this.getCardFilePath(id);

      fs.promises
        .access(filePath, fs.constants.F_OK)
        .then(() => {
          const error = new Error(
            chalk.red.bold(
              `Card already exists at ${this.userName} collection`,
            ),
          );
          reject(error);
        })
        .catch(() => {
          resolve();
        });
    });
  }

  public removeCard(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const filePath = this.getCardFilePath(id);

      this.checkUserDirectory()
        .then(() => {
          fs.promises
            .access(filePath, fs.constants.F_OK)
            .then(() => {
              fs.promises
                .unlink(filePath)
                .then(() => {
                  resolve();
                })
                .catch((err) => {
                  reject(err);
                });
            })
            .catch((err) => {
              const error = new Error(
                chalk.red.bold(`Card not found at ${this.userName} collection`),
              );
              reject(error);
            });
        })
        .catch((err) => {
          const error = new Error(chalk.red.bold("Collection not found"));
          reject(error);
        });
    });
  }

  public clearCollection(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.promises
        .access(this.userDirectory, fs.constants.F_OK)
        .then(() => {
          fs.promises
            .rm(this.userDirectory, { recursive: true })
            .then(() => {
              resolve();
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch(() => {
          resolve();
        });
    });
  }
}


