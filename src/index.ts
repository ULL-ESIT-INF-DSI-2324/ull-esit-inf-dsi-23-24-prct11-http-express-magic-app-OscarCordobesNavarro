import { CardCollectionsHandlerAsync } from "./dataAPI/CardCollectionHandlerAsync.js";
import { ICard } from "./dataAPI/ICard.js";
import { Color } from "./dataAPI/IColor.js";
import { TypeLine } from "./dataAPI/ITypeLine.js";
import { Rarity } from "./dataAPI/IRarity.js";

const carta1: ICard = {
  id: 1,
  name: "Espada de Luz y Sombra",
  manaCost: 3,
  color: Color.ColorLess,
  lineType: TypeLine.Artifact,
  rarity: Rarity.Mythical,
  ruleText:
    "Equipar {3}\nLa criatura equipada obtiene +2/+2 e tiene protección contra los colores blanco y negro.",
  marketValue: 50,
};

const carta2: ICard = {
  id: 2,
  name: "Jace, el Maestro de las Ilusiones",
  manaCost: 4,
  color: Color.Blue,
  lineType: TypeLine.Planeswalker,
  rarity: Rarity.Rare,
  ruleText:
    "+1: Roba una carta.\n-2: Devuelve la criatura objetivo a la mano de su propietario.\n-8: Toma el control de todas las criaturas que controla el oponente.",
  brandsLoyalty: 4,
  marketValue: 120,
};

const carta3: ICard = {
  id: 3,
  name: "Chamán de los Bosques",
  manaCost: 2,
  color: Color.Green,
  lineType: TypeLine.Creature,
  rarity: Rarity.Common,
  ruleText:
    "Cuando el Chamán de los Bosques entre al campo de batalla, puedes buscar en tu biblioteca una carta de tierra básica y ponerla en el campo de batalla girada.",
  strength: 2,
  endurance: 1,
  marketValue: 5,
};

const carta4: ICard = {
  id: 4,
  name: "Lava Spike",
  manaCost: 1,
  color: Color.Red,
  lineType: TypeLine.Sorcery,
  rarity: Rarity.Common,
  ruleText:
    "Lava Spike hace 3 puntos de daño a cualquier objetivo. Siempre que un oponente reciba daño de una carta llamada Lava Spike en un turno, ese jugador pierde 3 puntos de vida.",
  marketValue: 2,
};

const carta5: ICard = {
  id: 5,
  name: "Gólem de Acero",
  manaCost: 4,
  color: Color.ColorLess,
  lineType: TypeLine.Artifact,
  rarity: Rarity.Common,
  ruleText:
    "Trample (Si esta criatura fuera a hacer suficiente daño de combate a sus bloqueadores para destruirlos, puedes hacer que el resto del daño de combate sea hecho al jugador defensor).\n{4}: Regenera el Gólem de Acero.",
  strength: 3,
  endurance: 3,
  marketValue: 8,
};

const carta6: ICard = {
  id: 6,
  name: "Espada de Fuego y Hielo",
  manaCost: 3,
  color: Color.ColorLess,
  lineType: TypeLine.Artifact,
  rarity: Rarity.Rare,
  ruleText:
    "Equipar {2}\nLa criatura equipada obtiene +2/+2 e tiene protección contra los colores rojo y azul.\nCuando la criatura equipada hace daño de combate a un jugador, roba una carta y ese jugador descarta una carta.",
  marketValue: 75,
};

const carta7: ICard = {
  id: 7,
  name: "Místico de los Sueños",
  manaCost: 3,
  color: Color.Blue,
  lineType: TypeLine.Creature,
  rarity: Rarity.Uncommon,
  ruleText:
    "Vuela (Esta criatura no puede ser bloqueada excepto por criaturas que tengan la habilidad de volar).\nCuando el Místico de los Sueños entre al campo de batalla, baraja tu biblioteca y pon los tres primeros cartas de ella en la parte superior en cualquier orden.",
  strength: 2,
  endurance: 2,
  marketValue: 15,
};

const carta8: ICard = {
  id: 8,
  name: "Ira del Dragón",
  manaCost: 5,
  color: Color.Red,
  lineType: TypeLine.Sorcery,
  rarity: Rarity.Rare,
  ruleText:
    "Ira del Dragón hace 5 puntos de daño a cada criatura sin volar y a cada jugador.",
  marketValue: 30,
};

const carta9: ICard = {
  id: 9,
  name: "Velo del Verano",
  manaCost: 1,
  color: Color.Green,
  lineType: TypeLine.Instant,
  rarity: Rarity.Uncommon,
  ruleText:
    "Las cartas de hechizo que juegues no pueden ser contrarrestadas este turno.\nGanas 1 vida por cada carta de hechizo verde que juegues este turno.",
  marketValue: 25,
};
const carta10: ICard = {
  id: 10,
  name: "Bosque Encantado",
  manaCost: 0,
  color: Color.Green,
  lineType: TypeLine.Land,
  rarity: Rarity.Common,
  ruleText:
    "({T}: Agrega {G} a tu reserva de maná).\nBosque Encantado entra al campo de batalla girado.",
  marketValue: 1,
};

const handler = new CardCollectionsHandlerAsync("oscar");

handler.addCard(carta1, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Carta añadida correctamente");
  }
});

handler.addCard(carta2, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Carta añadida correctamente");
  }
});

handler.addCard(carta3, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Carta añadida correctamente");
  }
});

handler.addCard(carta4, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Carta añadida correctamente");
  }
});

// handler.getCollection((error, collection) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log(collection);
//   }
// });
