/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Desarrollo de Sistemas Informáticos
 * Curso: 3º
 * Autor: Óscar Cordobés Navarro
 * Correo: alu0101478081@ull.edu.es
 * Fecha: 16/04/2024
 * Práctica 11: Aplicación Express para coleccionistas de cartas Magic
 */

// PROMESAS

/**
 * Vemos que creamos una nueva promesa de tipo String, a esta promesa
 * se le pasa un manejador que recibe dos parámetros, resolve y reject.
 *
 * Si la ejecución de la promesa es exitosa, se llama a resolve con el
 * valor que queremos devolver, en este caso, "This is a successful response".
 *
 * Si la ejecución de la promesa falla, se llama a reject con el error que
 * queremos devolver.
 */

const myPromise = new Promise<string>((resolve, reject) => {
  setTimeout(() => {
    resolve("This is a successful response");
  }, 1000);
});

/**
 * Para evaluar una promesa utiliza el método .then() con la promesa como
 * cumplida y el método .catch() con la promesa como rechazada.
 *
 * Con esto nos permite separar el código de éxito del código de error.
 */

myPromise
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });

/**
 * Hay que  tener en cuenta que las promesas solo se pueden resolver o rechazar.
 * Si se llama a resolve y reject, solo se ejecutará el primero que se llame.
 */

// PROMESAS EN CADENA

// Teniendo esta función

/**
 * Vemos que retorna una promesa de tipo string
 */

const concatenate = (firstString: string, secondString: string) => {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      if (firstString.length === 0 || secondString.length === 0) {
        reject("Any of both arguments can be an empty string");
      } else {
        resolve(firstString + secondString);
      }
    }, 1000);
  });
};

// Una primera aproximación para encadenar promesas sería la siguiente:
concatenate("Hello ", "World!")
  .then((myString) => {
    concatenate(myString, " I am Eduardo")
      .then((mySecondString) => {
        console.log(mySecondString);
      })
      .catch((error) => {
        console.log(error);
      });
  })
  .catch((error) => {
    console.log(error);
  });

/**
 * Vemos que se encadenan las promesas pero el código se vuelve
 * muy difícil de leer y de mantener.
 *
 * Si hacemos varias llamadas a concatenate, el código se vuelve
 * un completo infierno, ademas que no tiene sentido gestionar los
 * errores de esta manera.
 */

// Para ello se pueden encadenar las promesas de la siguiente manera:

concatenate("Hola ", "Mundo")
  .then((myString) => {
    return concatenate(myString, " Soy Pablo").then((mySecondString) => {
      return concatenate(mySecondString, " y me gusta la programación").then(
        (myThirdString) => {
          console.log(myThirdString);
        },
      );
    });
  })
  .catch((error) => {
    console.log(error + "Error de manual");
  });

/**
 * Con esto lo que estamos haciendo es devolver la promesa de la siguiente
 * llamada a la función, de esta manera podemos encadenar las promesas.
 *
 * Y solo tenemos que gestionar los errores en un único catch. Ya que
 * se propagan los errores.
 */
