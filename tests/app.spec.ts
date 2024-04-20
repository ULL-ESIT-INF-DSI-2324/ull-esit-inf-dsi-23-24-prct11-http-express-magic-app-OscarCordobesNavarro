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
                    "http://localhost:3000/cards?name=testUserApp",
                    (err, res, body) => {
                      const parsedInfo = JSON.parse(body);
                      expect(parsedInfo.error).to.be.undefined;
                      expect(parsedInfo.length).to.equal(2);
                      expect(parsedInfo[0].name).to.equal("testCard");
                      expect(parsedInfo[1].name).to.equal("testCard2");
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

    it("cards endpoint with 2 arguments and the second one is the id of a card that do not exist should throw an error", (done) => {
        request.get(
            "http://localhost:3000/cards?name=testUserApp&id=3",
            (err, res, body) => {
            const parsedInfo = JSON.parse(body);
            expect(parsedInfo.error).to.be.string;
            expect(parsedInfo.error).to.equal(
                "Card not found at testUserApp collection",
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

  describe("post tests", () => {});

  describe("delete tests", () => {});

  describe("path tests", () => {});
});
