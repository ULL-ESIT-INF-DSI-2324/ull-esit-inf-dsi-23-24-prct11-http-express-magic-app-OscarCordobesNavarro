import "mocha";
import { expect } from "chai";
import { Rarity } from "../src/Modificacion/IRarity.js";
import { Color } from "../src/Modificacion/IColor.js";
import { TypeLine } from "../src/Modificacion/ITypeLine.js";
import { ICard } from "../src/Modificacion/ICard.js";
import { CardCollectionsHandlerAsync } from "../src/Modificacion/index.js";

describe("CardCollectionHandlerAsync tests", () => {
  describe("addCard with promises", () => {
    it("addCard should add a card to the collection", () => {
      const handler = new CardCollectionsHandlerAsync("testUserPromises");

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

      handler
        .clearCollection()
        .then((data) => {
          expect(data).to.be.undefined;
          return handler.addCard(carta).then((result) => {
            expect(result).to.be.undefined;
          });
        })
        .catch((err) => {
          expect(err).to.be.undefined;
        });
    });

    it("addCard the same card twice should throw an error", () => {
      const handler = new CardCollectionsHandlerAsync("testUserPromises");

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

      handler
        .clearCollection()
        .then((data) => {
          expect(data).to.be.undefined;
          handler.addCard(carta).then(() => {
            return handler.addCard(carta).catch((err) => {
              expect(err).to.be.an("error");
            });
          });
        })
        .catch((err) => {
          expect(err).to.be.an("error");
        });
    });

    it("addCard a creature card without strength and endurance should throw an error", () => {
      const handler = new CardCollectionsHandlerAsync("testUserPromises");

      const carta: ICard = {
        id: 1,
        name: "testCard",
        manaCost: 1,
        color: Color.Red,
        lineType: TypeLine.Creature,
        rarity: Rarity.Common,
        ruleText: "test rule text",
        strength: 1,
        brandsLoyalty: 7,
        marketValue: 1,
      };

      handler
        .clearCollection()
        .then((data) => {
          expect(data).to.be.undefined;
          return handler.addCard(carta).catch((err) => {
            expect(err).to.be.an("error");
          });
        })
        .catch((err) => {
          expect(err).to.be.an("error");
        });
    });

    it("addCard a planeswalker card without brands loyalty should throw an error", () => {
        const handler = new CardCollectionsHandlerAsync("testUserPromises");

      const carta: ICard = {
        id: 1,
        name: "testCard",
        manaCost: 1,
        color: Color.Red,
        lineType: TypeLine.Planeswalker,
        rarity: Rarity.Common,
        ruleText: "test rule text",
        strength: 1,
        endurance: 1,
        marketValue: 1,
      };

      handler
        .clearCollection()
        .then((data) => {
          expect(data).to.be.undefined;
          return handler.addCard(carta).catch((err) => {
            expect(err).to.be.an("error");
          });
        })
        .catch((err) => {
          expect(err).to.be.an("error");
        });
    });
  });

  describe("removeCard with promises", () => {
    it("remove a card that exists should remove the card", () => {
      const handler = new CardCollectionsHandlerAsync("testUserPromises");

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

      handler
        .clearCollection()
        .then(() => {
          handler.addCard(carta).then(() => {
            return handler.removeCard(1).then((result) => {
              expect(result).to.be.undefined;
            });
          });
        })
        .catch((err) => {
          expect(err).to.be.undefined;
        });
    });

    it("remove a card that does not exist should throw an error", () => {
      const handler = new CardCollectionsHandlerAsync("testUserPromises");

      handler
        .clearCollection()
        .then(() => {
          return handler.removeCard(1).catch((err) => {
            expect(err).to.be.an("error");
          });
        })
        .catch((err) => {
          expect(err).to.be.undefined;
        });
    });

    it("remove a card two times should throw an error at the second promise", () => {
      const handler = new CardCollectionsHandlerAsync("testUserPromises");

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

      handler
        .clearCollection()
        .then(() => {
          handler.addCard(carta).then(() => {
            handler.removeCard(1).then(() => {
              return handler.removeCard(1).catch((err) => {
                expect(err).to.be.an("error");
              });
            });
          });
        })
        .catch((err) => {
          expect(err).to.be.an("error");
        });
    });

    it("remove a card that does not exist should throw an error", () => {
      const handler = new CardCollectionsHandlerAsync("testUserPromises");

      handler
        .clearCollection()
        .then(() => {
          return handler.removeCard(1).catch((err) => {
            expect(err).to.be.an("error");
          });
        })
        .catch((err) => {
          expect(err).to.be.undefined;
        });
    });

    it("remove a card from a random user should throw an error", () => {
      const handler = new CardCollectionsHandlerAsync("randomUser");

      handler
        .clearCollection()
        .then(() => {
          return handler.removeCard(1).catch((err) => {
            expect(err).to.be.an("error");
          });
        })
        .catch((err) => {
          expect(err).to.be.undefined;
        });
    });
  });
});
