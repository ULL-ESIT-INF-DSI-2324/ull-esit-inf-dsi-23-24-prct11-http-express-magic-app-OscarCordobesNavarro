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

/**
 * Enumeración que representa los diferentes colores en un juego de cartas.
 * También se incluyen los colores multicolor y sin color.
 * @enum {string}
 */
export enum Color {
    White = "FFFFFF",
    Blue = "0000FF",
    Black = "000000",
    Red = "FF0000",
    Green = "00FF00",
    ColorLess = "colorless",
    Multicolor = "multicolor",
  }