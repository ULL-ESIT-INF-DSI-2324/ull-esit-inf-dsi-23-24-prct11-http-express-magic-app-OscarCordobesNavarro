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
 * Enumeración que representa los diferentes tipos de líneas en un juego de cartas.
 * @enum {string}
 */
export enum TypeLine {
    Land = "Land",
    Creature = "Creature",
    Enchantment = "Enchantment",
    Sorcery = "Sorcery",
    Instant = "Instant",
    Artifact = "Artifact",
    Planeswalker = "Planeswalker",
}