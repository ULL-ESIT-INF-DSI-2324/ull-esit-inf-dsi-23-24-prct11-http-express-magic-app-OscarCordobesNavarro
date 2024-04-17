/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Desarrollo de Sistemas Informáticos
 * Curso: 3º
 * Autor: Óscar Cordobés Navarro
 * Correo: alu0101478081@ull.edu.es
 * Fecha: 18/03/2024
 * Práctica 9: Clases e interfaces genéricas. Principios SOLID
 */
import { Color } from "./IColor.js";
import { Rarity } from "./IRarity.js";
import { TypeLine } from "./ITypeLine.js";


/**
 * Interfaz que representa una carta del juego.
 */
export interface ICard {
  /**
   * Identificador de la carta.
   * @type {number}
   */
  id: number;
  /**
   * Nombre de la carta.
   * @type {string}
   */
  name: string;
  /**
   * Coste de maná de la carta.
   * @type {number}
   */
  manaCost: number;
  /**
   * Color de la carta.
   * @type {Color}
   */
  color: Color;
  /**
   * Tipo de línea de la carta.
   * @type {TypeLine}
   */
  lineType: TypeLine;
  /**
   * Rareza de la carta.
   * @type {Rarity}
   */
  rarity: Rarity;
  /**
   * Texto de reglas de la carta.
   * @type {string}
   */
  ruleText: string;
  /**
   * Fuerza de la carta.
   * @type {number}
   */
  strength?: number;
  /**
   * Resistencia de la carta.
   * @type {number}
   */
  endurance?: number;
  /**
   * Lealtad de la carta.
   * @type {number}
   */
  brandsLoyalty?: number;
  /**
   * Valor de mercado de la carta.
   * @type {number}
   */
  marketValue: number;
}