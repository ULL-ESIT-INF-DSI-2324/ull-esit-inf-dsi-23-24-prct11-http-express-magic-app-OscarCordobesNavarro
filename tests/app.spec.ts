import "mocha";
import { expect } from "chai";
import { ICard } from "../src/dataAPI/ICard.js";
import { TypeLine } from "../src/dataAPI/ITypeLine.js";
import { Rarity } from "../src/dataAPI/IRarity.js";
import { Color } from "../src/dataAPI/IColor.js";
import { CardCollectionsHandlerAsync } from "../src/dataAPI/CardCollectionsHandlerAsync.js";
import request from "request";
import { error } from "console";


describe("App tests", () => {
  describe("basic tests", () => {
    it("the server is running", (done) => {
      request.get("http://localhost:3000", (err, res, body) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it("the server with the /cards endpoint is running", (done) => {
      request.get("http://localhost:3000/cards", (err, res, body) => {
        const parsedInfo = JSON.parse(body);
        expect(res.statusCode).to.equal(200);
        expect(parsedInfo.error).to.be.string;
        expect(parsedInfo.error).to.equal(
          "No se han proporcionado los parámetros necesarios, recuerda que se requiere de 1 a 2 parámetros",
        );
        done();
      });
    });

    it("the server response with an html with any other endpoint", (done) => {
      request.get("http://localhost:3000/any", (err, res, body) => {
        expect(res.statusCode).to.equal(200);
        expect(res.headers["content-type"]).to.equal(
          "text/html; charset=UTF-8",
        );
        done();
      });
    });
  });

  describe("get tests", () => {
    it("cards endpoint with any argument should return an error", (done) => {
      request.get("http://localhost:3000/cards", (err, res, body) => {
        const parsedInfo = JSON.parse(body);
        expect(parsedInfo.error).to.be.string;
        expect(parsedInfo.error).to.equal(
          "No se han proporcionado los parámetros necesarios, recuerda que se requiere de 1 a 2 parámetros",
        );
        done();
      });
    });

    it("cards endpoint with 1 argument and is not name should throw and error", (done) => {
      request.get(
        "http://localhost:3000/cards?names=oscar",
        (err, res, body) => {
          const parsedInfo = JSON.parse(body);
          expect(parsedInfo.error).to.be.string;
          expect(parsedInfo.error).to.equal(
            "Se han proporcionado 2 parámetros pero no son los correctos, recuerda que se requiere name e id(numero)",
          );
          done();
        },
      );
    });

    it("cards endpoint with 1 argument and is name but empty should throw an error", (done) => {
      request.get("http://localhost:3000/cards?name=", (err, res, body) => {
        const parsedInfo = JSON.parse(body);
        expect(parsedInfo.error).to.be.string;
        expect(parsedInfo.error).to.equal(
          "Se han proporcionado 2 parámetros pero no son los correctos, recuerda que se requiere name e id(numero)",
        );
        done();
      });
    });

    it("cards endpoint with name argument of a collection that does not exist should throw an error", (done) => {
      request.get(
        "http://localhost:3000/cards?name=notacollection",
        (err, res, body) => {
          const parsedInfo = JSON.parse(body);
          expect(parsedInfo.error).to.be.string;
          expect(parsedInfo.error).to.equal("Collection not found");
          done();
        },
      );
    });

    it("cards endpoint with name argument of a collection that exists should return a collection", (done) => {
      const handler = new CardCollectionsHandlerAsync("testUserAppCollection");
      const carta: ICard = {
        id: 1,
        name: "testCard",
        manaCost: 1,
        color: Color.Red,
        lineType: TypeLine.Artifact,
        rarity: Rarity.Common,
        ruleText: "test rule text",
        strength: 1,
        endurance: 1,
        brandsLoyalty: 7,
        marketValue: 1,
      };
      const carta2: ICard = {
        id: 2,
        name: "testCard2",
        manaCost: 2,
        color: Color.Blue,
        lineType: TypeLine.Creature,
        rarity: Rarity.Rare,
        ruleText: "test rule text 2",
        strength: 2,
        endurance: 2,
        brandsLoyalty: 8,
        marketValue: 2,
      };
      handler.clearCollection((error) => {
        if (error) {
          done(error);
        } else {
          handler.addCard(carta, (error) => {
            if (error) {
              done(error);
            } else {
              handler.addCard(carta2, (error) => {
                if (error) {
                  done(error);
                } else {
                  request.get(
                    "http://localhost:3000/cards?name=testUserAppCollection",
                    (err, res, body) => {
                      const parsedInfo = JSON.parse(body);
                      expect(parsedInfo.error).to.be.undefined;
                      expect(parsedInfo.length).to.equal(2);
                      done();
                    },
                  );
                }
              });
            }
          });
        }
      });
    });

    it("cards endpoint with 2 arguments and the second is not a number should throw an error", (done) => {
      request.get(
        "http://localhost:3000/cards?name=testUserApp&id=notanumber",
        (err, res, body) => {
          const parsedInfo = JSON.parse(body);
          expect(parsedInfo.error).to.be.string;
          expect(parsedInfo.error).to.equal(
            "El id debe ser un número",
          );
          done();
        },
      );
    });

    it("cards endpoint with 2 arguments and the second one is not the id of a card should throw an error", (done) => {
        request.get(
            "http://localhost:3000/cards?name=testUserApp&notid=3",
            (err, res, body) => {
            const parsedInfo = JSON.parse(body);
            expect(parsedInfo.error).to.be.string;
            expect(parsedInfo.error).to.equal(
                "Se han proporcionado 2 parámetros pero no son los correctos, recuerda que se requiere name e id(numero)",
            );
            done();
            },
        );
    });

    it("cards endpoint with 2 arguments and the second one is the id of a card that exist should return the card", (done) => {
        const handler = new CardCollectionsHandlerAsync("testUserApp");
        const carta: ICard = {
          id: 1,
          name: "testCard",
          manaCost: 1,
          color: Color.Red,
          lineType: TypeLine.Artifact,
          rarity: Rarity.Common,
          ruleText: "test rule text",
          strength: 1,
          endurance: 1,
          brandsLoyalty: 7,
          marketValue: 1,
        };
        handler.clearCollection((error) => {
            if (error) {
                done(error);
            } else {
                handler.addCard(carta, (error) => {
                if (error) {
                    done(error);
                } else {
                    request.get(
                    "http://localhost:3000/cards?name=testUserApp&id=1",
                    (err, res, body) => {
                        const parsedInfo = JSON.parse(body);
                        expect(parsedInfo.error).to.be.undefined;
                        expect(parsedInfo.name).to.equal("testCard");
                        expect(parsedInfo.manaCost).to.equal(1);
                        done();
                    },
                    );
                }
                });
            }
        });
    });

    it("cards endpoint with 3 arguments should throw an error", (done) => {
        request.get(
            "http://localhost:3000/cards?name=testUserApp&id=1&extra=extra",
            (err, res, body) => {
            const parsedInfo = JSON.parse(body);
            expect(parsedInfo.error).to.be.string;
            expect(parsedInfo.error).to.equal(
                "No se han proporcionado los parámetros necesarios, recuerda que se requiere de 1 a 2 parámetros",
            );
            done();
            },
        );
    });
  });

  describe("post tests", () => {
    it("cards endpoint with query string empty should be an error", (done) => {
      request.post("http://localhost:3000/cards", (err, res, body) => {
        const parsedInfo = JSON.parse(body);
        expect(parsedInfo.error).to.be.string;
        expect(parsedInfo.error).to.equal(
          "No se ha proporcionado el parámetro name en la queryString o se han proporcionado más parámetros de los necesarios",
        );
        done();
      });
    });

    it("cards endpoint with name parameter empty should be an error", (done) => {
      request.post("http://localhost:3000/cards?name=", (err, res, body) => {
        const parsedInfo = JSON.parse(body);
        expect(parsedInfo.error).to.be.string;
        expect(parsedInfo.error).to.equal(
          "No se ha proporcionado el parámetro name en la queryString o se han proporcionado más parámetros de los necesarios",
        );
        done();
      });
    });

    it("cards endpoint with name parameter and no body should be an error", (done) => {
      request.post("http://localhost:3000/cards?name=testUserApp", (err, res, body) => {
        const parsedInfo = JSON.parse(body);
        expect(parsedInfo.error).to.be.string;
        expect(parsedInfo.error).to.equal(
          "No se ha enviado ninguna carta en el body",
        );
        done();
      });
    });

    it("cards endpoint with name parameter and empty body should be an error", (done) => {
      request.post(
        {
          url: "http://localhost:3000/cards?name=testUserApp",
          body: {},
          json: true,
        },
        (err, res, body) => {
          const parsedInfo = body;
          expect(parsedInfo.error).to.be.string;
          expect(parsedInfo.error).to.equal(
            "No se ha enviado ninguna carta en el body",
          );
          done();
        },
      );
    });

    it("cards endpoint with name parameter and body without name should be an error", (done) => {
      request.post(
        {
          url: "http://localhost:3000/cards?name=testUserApp",
          body: { id: 1 },
          json: true,
        },
        (err, res, body) => {
          const parsedInfo = body;
          expect(parsedInfo.error).to.be.string;
          expect(parsedInfo.error).to.equal(
            "No se han proporcionado todos los parámetros necesarios, recuerda que se requiere id, name, manaCost, color, lineType, rarity, ruleText y marketValue",
          );
          done();
        },
      );
    });

    it("cards endpoint with name parameter and body without id should be an error", (done) => {
      request.post(
        {
          url: "http://localhost:3000/cards?name=testUserApp",
          body: { name: "testCard" },
          json: true,
        },
        (err, res, body) => {
          const parsedInfo = body;
          expect(parsedInfo.error).to.be.string;
          expect(parsedInfo.error).to.equal(
            "No se han proporcionado todos los parámetros necesarios, recuerda que se requiere id, name, manaCost, color, lineType, rarity, ruleText y marketValue",
          );
          done();
        },
      );
    });

    it("cards endpoint with name parameter and body without manaCost should be an error", (done) => {
      request.post(
        {
          url: "http://localhost:3000/cards?name=testUserApp",
          body: { id: 1, name: "testCard" },
          json: true,
        },
        (err, res, body) => {
          const parsedInfo = body;
          expect(parsedInfo.error).to.be.string;
          expect(parsedInfo.error).to.equal(
            "No se han proporcionado todos los parámetros necesarios, recuerda que se requiere id, name, manaCost, color, lineType, rarity, ruleText y marketValue",
          );
          done();
        },
      );
    });

    it("cards endpoint with an incorrect color should be an error", (done) => {
      request.post(
        {
          url: "http://localhost:3000/cards?name=testUserApp",
          body: { id: 1, name: "testCard", manaCost: 1, color: "notacolor", lineType: TypeLine.Artifact, rarity: Rarity.Common, ruleText: "test rule text", marketValue: 1 },
          json: true,
        },
        (err, res, body) => {
          const parsedInfo = body;
          expect(parsedInfo.error).to.be.string;
          expect(parsedInfo.error).to.equal(
            "Color not found",
          );
          done();
        },
      );
    });

    it("cards endpoint with an incorrect lineType should be an error", (done) => {
      request.post(
        {
          url: "http://localhost:3000/cards?name=testUserApp",
          body: { id: 1, name: "testCard", manaCost: 1, color: "Red", lineType: "notalineType", rarity: Rarity.Common, ruleText: "test rule text", marketValue: 1 },
          json: true,
        },
        (err, res, body) => {
          const parsedInfo = body;
          expect(parsedInfo.error).to.be.string;
          expect(parsedInfo.error).to.equal(
            "TypeLine not found",
          );
          done();
        },
      );
    });

    it("cards endpoint with an incorrect rarity should be an error", (done) => {
      request.post(
        {
          url: "http://localhost:3000/cards?name=testUserApp",
          body: { id: 1, name: "testCard", manaCost: 1, color: "Red", lineType: "Artifact", rarity: "notararity", ruleText: "test rule text", marketValue: 1 },
          json: true,
        },
        (err, res, body) => {
          const parsedInfo = body;
          expect(parsedInfo.error).to.be.string;
          expect(parsedInfo.error).to.equal(
            "Rarity not found",
          );
          done();
        },
      );
    });

    it("cards endpoint with correct parameters should add the card to the collection", (done) => {
      const handler = new CardCollectionsHandlerAsync("testUserApp");
      handler.clearCollection((error) => {
        if (error) {
          done(error);
        } else {
          request.post(
            {
              url: "http://localhost:3000/cards?name=testUserApp",
              body: {
                id: 1,
                name: "testCard",
                manaCost: 1,
                color: "Red",
                lineType: "Artifact",
                rarity: "Common",
                ruleText: "test rule text",
                marketValue: 1,
              },
              json: true,
            },
            (err, res, body) => {
              const parsedInfo = body;
              expect(parsedInfo.error).to.be.undefined;
              expect(parsedInfo.data).to.be.string;
              expect(parsedInfo.data).to.equal("La carta se ha añadido correctamente");
              handler.getCard(1, (error, card) => {
                if (error) {
                  done(error);
                } else if (card) {
                  expect(card.name).to.equal("testCard");
                  done();
                }
              });
            },
          );
        }
      });
    });

    it("cards endpoint with correct parameters and 2 parameters in the query string should throw an error", (done) => {
      request.post(
        {
          url: "http://localhost:3000/cards?name=testUserApp&id=1",
          body: {
            id: 1,
            name: "testCard",
            manaCost: 1,
            color: "Red",
            lineType: "Artifact",
            rarity: "Common",
            ruleText: "test rule text",
            marketValue: 1,
          },
          json: true,
        },
        (err, res, body) => {
          const parsedInfo = body;
          expect(parsedInfo.error).to.be.string;
          expect(parsedInfo.error).to.equal(
            "No se ha proporcionado el parámetro name en la queryString o se han proporcionado más parámetros de los necesarios",
          );
          done();
        },
      );
    });
  });

  describe("delete tests", () => {
    it("cards endpoint with query string empty should be an error", (done) => {
      request.delete("http://localhost:3000/cards", (err, res, body) => {
        const parsedInfo = JSON.parse(body);
        expect(parsedInfo.error).to.be.string;
        expect(parsedInfo.error).to.equal(
          "No se han proporcionado los parámetros necesarios, recuerda que se requiere name e id",
        );
        done();
      });
    });

    it("cards endpoint with name parameter empty should be an error", (done) => {
      request.delete("http://localhost:3000/cards?name=", (err, res, body) => {
        const parsedInfo = JSON.parse(body);
        expect(parsedInfo.error).to.be.string;
        expect(parsedInfo.error).to.equal(
          "No se han proporcionado los parámetros necesarios, recuerda que se requiere name e id",
        );
        done();
      });
    });

    it("cards endpoint with name parameter and id parameter empty should be an error", (done) => {
      request.delete("http://localhost:3000/cards?name=testUserApp", (err, res, body) => {
        const parsedInfo = JSON.parse(body);
        expect(parsedInfo.error).to.be.string;
        expect(parsedInfo.error).to.equal(
          "No se han proporcionado los parámetros necesarios, recuerda que se requiere name e id",
        );
        done();
      });
    });

    it("cards endpoint with name parameter and id parameter not a number should be an error", (done) => {
      request.delete("http://localhost:3000/cards?name=testUserApp&id=notanumber", (err, res, body) => {
        const parsedInfo = JSON.parse(body);
        expect(parsedInfo.error).to.be.string;
        expect(parsedInfo.error).to.equal(
          "El id debe ser un número",
        );
        done();
      });
    });

    it("cards endpoint with name parameter and id parameter from a user that do not existe should throw an error", (done) => {
      request.delete("http://localhost:3000/cards?name=notacollection&id=1", (err, res, body) => {
        const parsedInfo = JSON.parse(body);
        expect(parsedInfo.error).to.be.string;
        expect(parsedInfo.error).to.equal(
          "Collection not found",
        );
        done();
      });
    });

    it("cards endpoint with name parameter and id parameter from a user and a card that exist should delete the card", (done) => {
      const handler = new CardCollectionsHandlerAsync("testUserApp");
      const carta: ICard = {
        id: 1,
        name: "testCard",
        manaCost: 1,
        color: Color.Red,
        lineType: TypeLine.Artifact,
        rarity: Rarity.Common,
        ruleText: "test rule text",
        strength: 1,
        endurance: 1,
        brandsLoyalty: 7,
        marketValue: 1,
      };

      handler.clearCollection((error) => {
        if (error) {
          done(error);
        } else {
          handler.addCard(carta, (error) => {
            if (error) {
              done(error);
            } else {
              request.delete("http://localhost:3000/cards?name=testUserApp&id=1", (err, res, body) => {
                const parsedInfo = JSON.parse(body);
                expect(parsedInfo.error).to.be.undefined;
                expect(parsedInfo.data).to.be.string;
                expect(parsedInfo.data).to.equal("La carta se ha eliminado correctamente");
                done();
              });
            }
          });
        }
      });
    });
  });

  describe("patch tests", () => {
    it("cards endpoint with query string empty should be an error", (done) => {
      request.patch("http://localhost:3000/cards", (err, res, body) => {
        const parsedInfo = JSON.parse(body);
        expect(parsedInfo.error).to.be.string;
        expect(parsedInfo.error).to.equal(
          "No se ha proporcionado el parámetro name en la queryString o se han proporcionado más parámetros de los necesarios",
        );
        done();
      });
    });

    it("cards endpoint with name parameter empty should be an error", (done) => {
      request.patch("http://localhost:3000/cards?name=", (err, res, body) => {
        const parsedInfo = JSON.parse(body);
        expect(parsedInfo.error).to.be.string;
        expect(parsedInfo.error).to.equal(
          "No se ha proporcionado el parámetro name en la queryString o se han proporcionado más parámetros de los necesarios",
        );
        done();
      });
    });

    it("cards endpoint with name parameter and id parameter empty should be an error", (done) => {
      request.patch("http://localhost:3000/cards?name=testUserApp", (err, res, body) => {
        const parsedInfo = JSON.parse(body);
        expect(parsedInfo.error).to.be.string;
        expect(parsedInfo.error).to.equal(
          "No se ha proporcionado el parámetro name en la queryString o se han proporcionado más parámetros de los necesarios",
        );
        done();
      });
    });

    it("cards endpoint with name parameter and id parameter not a number and the body empty should be an error ", (done) => {
      request.patch("http://localhost:3000/cards?name=testUserApp&id=notanumber", (err, res, body) => {
        const parsedInfo = JSON.parse(body);
        expect(parsedInfo.error).to.be.string;
        expect(parsedInfo.error).to.equal(
          "No se ha enviado ninguna carta en el body",
        );
        done();
      });
    });

    it("cards endpoint with name parameter and id parameter that is not a number with a body should be an error", (done) => {
      request.patch(
        {
          url: "http://localhost:3000/cards?name=testUserApp&id=notanumber",
          body: {id:1},
          json: true,
        },
        (err, res, body) => {
          const parsedInfo = body;
          expect(parsedInfo.error).to.be.string;
          expect(parsedInfo.error).to.equal(
            "El id debe ser un número",
          );
          done();
        },
      );
    });

    it("cards endpoint with all parameters and a body but the collection does not exist should be an error", (done) => {
      request.patch(
        {
          url: "http://localhost:3000/cards?name=notacollection&id=1",
          body: { id: 1, name: "testCard", manaCost: 1, color: "Red", lineType: "Artifact", rarity: "Common", ruleText: "test rule text", marketValue: 1 },
          json: true,
        },
        (err, res, body) => {
          const parsedInfo = body;
          expect(parsedInfo.error).to.be.string;
          expect(parsedInfo.error).to.equal(
            "Collection not found",
          );
          done();
        },
      );
    });

    it("cards endpoint with all parameters and body but the card does not exist should be an error", (done) => {
      const handler = new CardCollectionsHandlerAsync("testUserApp");
      const carta: ICard = {
        id: 1,
        name: "testCard",
        manaCost: 1,
        color: Color.Red,
        lineType: TypeLine.Artifact,
        rarity: Rarity.Common,
        ruleText: "test rule text",
        strength: 1,
        endurance: 1,
        brandsLoyalty: 7,
        marketValue: 1,
      };
      handler.clearCollection((error) => {
        if (error) {
          done(error);
        } else {
          handler.addCard(carta, (error) => {
            if(error) {
              done(error);
            } else {
              request.patch(
                {
                  url: "http://localhost:3000/cards?name=testUserApp&id=2",
                  body: { id: 2, name: "testCard2", manaCost: 2, color: "Blue", lineType: "Creature", rarity: "Rare", ruleText: "test rule text 2", marketValue: 2 },
                  json: true,
                },
                (err, res, body) => {
                  const parsedInfo = body;
                  expect(parsedInfo.error).to.be.string;
                  expect(parsedInfo.error).to.equal(
                    "Card not found at testUserApp collection",
                  );
                  done();
                },
              );
            }
          });
        }
      });
    });

    it("cards endpoint with all parameters and body should update the card", (done) => {
      const handler = new CardCollectionsHandlerAsync("testUserApp");
      const carta: ICard = {
        id: 1,
        name: "testCard",
        manaCost: 1,
        color: Color.Red,
        lineType: TypeLine.Artifact,
        rarity: Rarity.Common,
        ruleText: "test rule text",
        strength: 1,
        endurance: 1,
        brandsLoyalty: 7,
        marketValue: 1,
      };
      handler.clearCollection((error) => {
        if (error) {
          done(error);
        } else {
          handler.addCard(carta, (error) => {
            if (error) {
              done(error);
            } else {
              request.patch(
                {
                  url: "http://localhost:3000/cards?name=testUserApp&id=1",
                  body: { id: 1, name: "testCard2", manaCost: 2, color: "Blue", lineType: "Creature", rarity: "Rare", ruleText: "test rule text 2", marketValue: 2 },
                  json: true,
                },
                (err, res, body) => {
                  const parsedInfo = body;
                  expect(parsedInfo.error).to.be.undefined;
                  expect(parsedInfo.data).to.be.string;
                  expect(parsedInfo.data).to.equal("La carta se ha actualizado correctamente");
                  handler.getCard(1, (error, card) => {
                    if (error) {
                      done(error);
                    } else if (card) {
                      expect(card.name).to.equal("testCard2");
                      expect(card.manaCost).to.equal(2);
                      expect(card.color).to.equal(Color.Blue);
                      expect(card.lineType).to.equal(TypeLine.Creature);
                      expect(card.rarity).to.equal(Rarity.Rare);
                      expect(card.ruleText).to.equal("test rule text 2");
                      expect(card.marketValue).to.equal(2);
                      done();
                    }
                  });
                },
              );
            }
          });
        }
      });
    });



  });
});
