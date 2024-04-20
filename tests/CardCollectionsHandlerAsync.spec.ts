import "mocha";
import { expect } from "chai";
import { CardCollectionsHandlerAsync } from "../src/dataAPI/CardCollectionsHandlerAsync.js";
import { Color } from "../src/dataAPI/IColor.js";
import { Rarity } from "../src/dataAPI/IRarity.js";
import { TypeLine } from "../src/dataAPI/ITypeLine.js";
import { ICard } from "../src/dataAPI/ICard.js";
import fs from "fs";
import chalk from "chalk";
import { get } from "request";

// Deshabilitamos la salida estandar
before(() => {
  console.log = () => {};
});

describe("CardCollectionsHandlerAsync tests", () => {
  describe("basic methods test", () => {
    // it("getUserCollectionDirectory method should return the correct directory", () => {
    //     const handler = new CardCollectionsHandlerAsync("testCollectionIndexAsync");
    //     expect(handler.getUserCollectionDirectory()).to.equal("./data/testCollectionIndexAsync");
    // });

    it("getUsername method should return the correct username", () => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsync",
      );
      expect(handler.getUsername()).to.equal("testCollectionIndexAsync");
    });

    it("updateUsername method should update the username", () => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsync",
      );
      handler.updateUser("newUsername");
      expect(handler.getUsername()).to.equal("newUsername");
    });
  });

  describe("clearCollectionAsync method test", () => {
    it("should clear the collection", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsync",
      );
      handler.clearCollection((error) => {
        if (error) {
          done(error);
        } else {
          fs.access(
            "./data/testCollectionIndexAsync",
            fs.constants.F_OK,
            (err) => {
              if (err) {
                done();
              } else {
                done(new Error("The collection was not cleared"));
              }
            },
          );
        }
      });
    });

    it("should return null if the directory does not exist", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsync",
      );
      handler.clearCollection((error) => {
        if (error) {
          done(error);
        } else {
          handler.clearCollection((error) => {
            if (error) {
              done(error);
            } else {
              done();
            }
          });
        }
      });
    });
  });

  describe("addCard, removeCard and getCard method test", () => {
    it("should add a card to the collection", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsync",
      );
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
              handler.getCard(1, (error, card) => {
                if (error) {
                  done(error);
                } else {
                  expect(card).to.deep.equal(carta);
                  done();
                }
              });
            }
          });
        }
      });
    });

    it("add the same card twice should return an error", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsync",
      );
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
              handler.addCard(carta, (error) => {
                if (error) {
                  done();
                } else {
                  done(new Error("The card was added twice"));
                }
              });
            }
          });
        }
      });
    });

    it("add a card and remove it two times should return an error", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsync",
      );
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
              handler.removeCard(1, (error) => {
                if (error) {
                  done(error);
                } else {
                  handler.removeCard(1, (error) => {
                    if (error) {
                      done();
                    } else {
                      done(new Error("The card was removed twice"));
                    }
                  });
                }
              });
            }
          });
        }
      });
    });

    it("remove a card that does not exist should return an error", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsync",
      );
      handler.clearCollection((error) => {
        if (error) {
          done(error);
        } else {
          handler.removeCard(1, (error) => {
            if (error) {
              done();
            } else {
              done(new Error("The card was removed"));
            }
          });
        }
      });
    });

    it("get a card that does not exist should return an error", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsync",
      );
      handler.clearCollection((error) => {
        if (error) {
          done(error);
        } else {
          handler.getCard(1, (error, card) => {
            if (error) {
              done();
            } else {
              done(new Error("The card was found"));
            }
          });
        }
      });
    });
    it("remove a card from a collection that does not exist should return an error", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsyncNotExists",
      );
      handler.removeCard(1, (error) => {
        if (error) {
          done();
        } else {
          done(new Error("The card was removed"));
        }
      });
    });
    it("get a card from a collection that does not exist should return an error", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsyncNotExists",
      );
      handler.getCard(1, (error, card) => {
        if (error) {
          done();
        } else {
          done(new Error("The card was found"));
        }
      });
    });

    it("add a card that is a creature without streng and endurance should return an error", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsync",
      );
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
      handler.clearCollection((error) => {
        if (error) {
          done(error);
        } else {
          handler.addCard(carta, (errorAdd) => {
            if (errorAdd) {
              expect(errorAdd).to.not.be.null;
              expect(errorAdd.message).to.equal(
                chalk.red.bold(
                  "Creature card must have strength and endurance",
                ),
              );
              done();
            }
          });
        }
      });
    });

    it("add a card that is a planeswalker without brandsLoyalty should return an error", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsync",
      );
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
      handler.clearCollection((error) => {
        if (error) {
          done(error);
        } else {
          handler.addCard(carta, (errorAdd) => {
            if (errorAdd) {
              expect(errorAdd).to.not.be.null;
              expect(errorAdd.message).to.equal(
                chalk.red.bold("Planeswalker card must have brands loyalty"),
              );
              done();
            }
          });
        }
      });
    });
    it("get a card form an empty collection should return an error", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsyncEmpty",
      );

      // Creamos un directorio vacio
      fs.access(
        "./data/testCollectionIndexAsyncEmpty",
        fs.constants.F_OK,
        (err) => {
          if (err) {
            fs.mkdir("./data/testCollectionIndexAsyncEmpty", (err) => {
              if (err) {
                done(err);
              } else {
                handler.getCard(1, (error, card) => {
                  if (error) {
                    done();
                  } else {
                    done(new Error("The card was found"));
                  }
                });
              }
            });
          } else {
            handler.getCard(1, (error, card) => {
              if (error) {
                done();
              } else {
                done(new Error("The card was found"));
              }
            });
          }
        },
      );
    });
  });
  describe("updateCard method test", () => {
    it("update a card that does not exist should return an error", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsync",
      );
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
          handler.updateCard(carta, 1, (error) => {
            if (error) {
              done();
            } else {
              done(new Error("The card was updated"));
            }
          });
        }
      });
    });

    it("update a card that exists should update it", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsync",
      );
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
        id: 1,
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
              handler.updateCard(carta2, 1, (error) => {
                if (error) {
                  done(error);
                } else {
                  handler.getCard(1, (error, card) => {
                    if (error) {
                      done(error);
                    } else {
                      expect(card).to.deep.equal(carta2);
                      done();
                    }
                  });
                }
              });
            }
          });
        }
      });
    });

    it("update a card with different id should throw an error", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsync",
      );
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
              handler.updateCard(carta2, 1, (error) => {
                if (error) {
                  expect(error).to.not.be.null;
                  expect(error.message).to.equal(
                    chalk.red.bold("Card ID and parameter ID do not match")
                  );
                  done();
                } else {
                  done(new Error("The card was updated"));
                }
              });
            }
          });
        }
      });
    });
    it("updata a card from a collection that does not exist should return an error", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsyncNotExists",
      );
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
      handler.updateCard(carta, 1, (error) => {
        if (error) {
          done();
        } else {
          done(new Error("The card was updated"));
        }
      });
    });
    it("update a card that is a creature without streng and endurance should return an error", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsync",
      );
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
      handler.clearCollection((error) => {
        if (error) {
          done(error);
        } else {
          handler.addCard(carta, (error) => {
            if (error) {
              expect(error).to.not.be.null;
              expect(error.message).to.equal(
                chalk.red.bold(
                  "Creature card must have strength and endurance",
                ),
              );
              done();
            }
          });
        }
      });
    });
    it("update a card that is a planeswalker without brandsLoyalty should return an error", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsync",
      );
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
      handler.clearCollection((error) => {
        if (error) {
          done(error);
        } else {
          handler.addCard(carta, (error) => {
            if (error) {
              expect(error).to.not.be.null;
              expect(error.message).to.equal(
                chalk.red.bold("Planeswalker card must have brands loyalty"),
              );
              done();
            }
          });
        }
      });
    });
  });
  describe("showCards method test", () => {
    it("show a card that does not exist should return an error", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsync",
      );
      handler.clearCollection((error) => {
        if (error) {
          done(error);
        } else {
          handler.showCard(1, (error) => {
            if (error) {
              expect(error).to.not.be.null;
              done();
            } else {
              done(new Error("The card was found"));
            }
          });
        }
      });
    });
    it("show a card from a collection that exists and the card exists should return the card", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsync",
      );
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
              handler.showCard(1, (error) => {
                if (error) {
                  done(error);
                } else {
                  done();
                }
              });
            }
          });
        }
      });
    });
    it("show a card from a collection that does not exist should return an error", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsyncNotExists",
      );
      handler.showCard(1, (error) => {
        if (error) {
          done();
        } else {
          done(new Error("The card was found"));
        }
      });
    });
  });

  describe("listCollection method test", () => {
    it("list an empty collection should return an error", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsync",
      );
      handler.clearCollection((error) => {
        if (error) {
          done(error);
        } else {
          handler.listCollection((error) => {
            if (error) {
              done();
            } else {
              done(new Error("The collection was listed"));
            }
          });
        }
      });
    });
  });

  it("list a collection with cards should return an array with the cards", (done) => {
    const handler = new CardCollectionsHandlerAsync("testCollectionIndexAsyncCollection");
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
                handler.listCollection((error) => {
                  if (error) {
                    done(error);
                  } else {
                    done();
                  }
                });
              }
            });
          }
        });
      }
    });
  });

  describe("getCollection method test", () => {
    it("get a collection that does not exist should return an error", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsyncNotExists",
      );
      handler.getCollection((error) => {
        if (error) {
          done();
        } else {
          done(new Error("The collection was found"));
        }
      });
    });
  });

  describe("getStringCollection and getStringCard method test", () => {
    it("get a string card from a collection that does not exist should return an error", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsyncNotExists",
      );
      handler.getStringCard(1, (error) => {
        if (error) {
          done();
        } else {
          done(new Error("The card was found"));
        }
      });
    });

    it("get a string card that does not exist should return an error", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsync",
      );
      handler.clearCollection((error) => {
        if (error) {
          done(error);
        } else {
          handler.getStringCard(1, (error) => {
            if (error) {
              done();
            } else {
              done(new Error("The card was found"));
            }
          });
        }
      });
    });

    it("get a string card that exists should return the card", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsync",
      );
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
              handler.getStringCard(1, (error) => {
                if (error) {
                  done(error);
                } else {
                  done();
                }
              });
            }
          });
        }
      });
    });

    it("get a string collection that does not exist should return an error", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsyncNotExists",
      );
      handler.getStringCollection((error) => {
        if (error) {
          done();
        } else {
          done(new Error("The collection was found"));
        }
      });
    });

    it("get a string collection that exists should return the collection", (done) => {
      const handler = new CardCollectionsHandlerAsync(
        "testCollectionIndexAsync",
      );
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
                  handler.getStringCollection((error) => {
                    if (error) {
                      done(error);
                    } else {
                      done();
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  });

});