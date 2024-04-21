<p align="center">
  <a href="https://coveralls.io/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-OscarCordobesNavarro?branch=main">
    <img src="https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-OscarCordobesNavarro/badge.svg?branch=main" alt="Coverage Status">
  </a>
  <a href="https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-OscarCordobesNavarro/actions/workflows/node.js.yml">
    <img src="https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-OscarCordobesNavarro/actions/workflows/node.js.yml/badge.svg" alt="Tests">
  </a>
  <a href="https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-OscarCordobesNavarro/actions/workflows/sonarcloud.yml">
    <img src="https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct11-http-express-magic-app-OscarCordobesNavarro/actions/workflows/sonarcloud.yml/badge.svg" alt="Sonar-Cloud">
  </a>
</p>


# Introducción

En esta práctica, veremos cómo podemos crear un servidor para atender peticiones HTTP. En este caso, responderemos a las solicitudes de `GET`, `DELETE`, `POST` y `PATCH`, relacionándolas con la dinámica que llevamos en prácticas anteriores con el sistema de cartas Magic.

La idea es que a través de estas solicitudes, el usuario interactúe con su colección de cartas.

# Aplicación Express para coleccionistas de cartas Magic


Recordar que teníamos implementado todo nuestro manejo de colecciones y cartas utilizando callbacks con la API asíncrona de Node.js. Para obtener más información, recomiendo revisar la carpeta `/src/DataAPI` para ver la estructura del manejador. Las mejoras realizadas para esta práctica incluyen una corrección en el método `updateCard`, ya que anteriormente no manejaba correctamente los errores.


Para el servidor vamos a utilizar Express JS que es un framework web para Node JS, debemos tenerlo instaladado como una dependencia local de nuestro proyecto con `npm install express` y como estamos en TypeScript, también necesitamos instalar los tipos de TypeScript para Express con `npm install --save-dev @types/express` pero esta vez será una dependencia de desarrollo.

Una vez tenemos instalado el módulo vamos a tener un objeto `express` que nos permitirá crear un servidor web de manera sencilla. A partir de este objeto express vamos a poder manejar las distintas peticiones HTTP pero antes de atender a las peticiones en mi caso he establecido varios middlewares para que se ejecuten antes de llegar a los manejadores de las rutas, en concreto son:

```typescript
// Creamos la aplicación express
const app = express();

// Definimos __dirname para poder acceder a la carpeta public
const __dirname = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/public",
);

// Middleware para que se pueda acceder a req.body
app.use(express.json());

// Middleware para que se pueda acceder a la carpeta public
app.use(express.static(__dirname));

// Middleware para que todas las peticiones pasen por aquí
app.use((req, res, next) => {
  if (!req.url.startsWith("/cards")) {
    res.sendFile(join(__dirname, "404.html"));
    return;
  }
  next();
});
```

En el primer middleware, `express.json()`, estamos permitiendo que las peticiones que lleguen al servidor puedan acceder al cuerpo de la petición, es decir, a `req.body`. En el segundo middleware, `express.static(__dirname)`, estamos permitiendo que se pueda acceder a la carpeta `public` que contiene los archivos estáticos de la aplicación. En el tercer middleware, estamos redirigiendo todas las peticiones que no empiecen por `/cards` a un archivo `404.html` que se encuentra en la carpeta `public` ¿Que será este HTML?.


Una vez tenemos las peticiones de alguna manera filtradas, podemos centrarnos en los manejadores de la ruta `/cards` que es donde vamos a realizar las operaciones de nuestra colección de cartas. Vamos a utilizar el objeto app para definir los manejadores de los tipos de peticiones indicandole la ruta a la que atienden y la función que se ejecutará cuando llegue una petición a esa ruta, como por ejemplo:

```typescript
app.get("/cards", (req, res) => {
  if (Object.keys(req.query).length > 0 && Object.keys(req.query).length < 3) {
    if (Object.keys(req.query).length == 1 && req.query.name) {
      const handler = new CardCollectionsHandlerAsync(req.query.name.toString());
      handler.getCollection((error, collection) => {
        if (error) {
          console.log(chalk.red("Error al enviar la colección del usuario " + req.query.name + ".", stripAnsi(error.message)));
          res.send({ error: stripAnsi(error.message) });
        } else {
          console.log(chalk.green("La colección del usuario " + req.query.name + " se ha enviado correctamente."));
          res.send(JSON.stringify(collection));
        }
      });
    } else if (Object.keys(req.query).length == 2 && req.query.name && req.query.id) {
      const handler = new CardCollectionsHandlerAsync(req.query.name.toString());
      const idNumber = parseInt(req.query.id.toString());
      if (isNaN(idNumber)) {
        res.send({ error: "El id debe ser un número" });
        return;
      }

      handler.getCard(idNumber, (error, card) => {
        if (error) {
          console.log(chalk.red("Error al enviar la carta del usuario " + req.query.name + " con id " + req.query.id + ".", stripAnsi(error.message)));
          res.send({ error: stripAnsi(error.message) });
        } else {
          console.log(chalk.green("La carta del usuario " + req.query.name + " con id " + req.query.id + " se ha enviado correctamente."));
          res.send(card);
        }
      });
    } else {
      res.send({ error: "Se han proporcionado 2 parámetros pero no son los correctos, recuerda que se requiere name e id(numero)" });
    }
  } else {
    res.send({ error: "No se han proporcionado los parámetros necesarios, recuerda que se requiere de 1 a 2 parámetros" });
  }
});
```

En este caso, estamos manejando las peticiones `GET` que lleguen a la ruta `/cards`, y estamos verificando si se han proporcionado los parámetros necesarios para realizar la operación. Específicamente, estamos comprobando si se ha proporcionado el parámetro `name`, o si se han proporcionado los parámetros `name` e `id`. Dependiendo de los parámetros proporcionados, se llevará a cabo una operación específica. En este escenario, estamos devolviendo la colección completa de cartas de un usuario o una carta específica de un usuario, según corresponda.

Como podemos ver simplemente manejamos los parámetros de la query y llamamos a los métodos de la clase `CardCollectionsHandlerAsync` que se encargará de realizar las operaciones necesarias.
Esto lo hacemos en todos las peticiones ya mencionadas, teniendo en cuenta las especificaciones del ejercicio ya que por ejemplo en el caso de `POST` vamos a tener que utilizar el cuerpo de la petición para añadir una carta a la colección de un usuario. Además todos los mensajes de error o de éxito se envían en formato JSON, los de error contienen un parámetro `error` con el mensaje de error y los de éxito contienen el parámetro `data` con la información de respuesta.

Y po último para hacer que el servidor escuche en un puerto específico, simplemente debemos llamar al método `listen` del objeto `app` y pasarle el puerto en el que queremos que escuche, por ejemplo:

```typescript
app.listen(3000, () => {
  console.log("Server is up on port 3000");
});
```

# Limpieza de los mensajes dados por el manejador de colecciones

La implementación que está realizada en el manejador de cartas hace que los mensajes de error sean enviados con colores, para limpiar estos mensaje he utilizado la librería `strip-ansi` que nos permite eliminar los códigos de escape ANSI de una cadena de texto, de esta manera los mensajes de error que se envían al cliente serán más limpios y fáciles de leer.

Para mas imformación le recomiendo que visite la [documentación de la librería](https://www.npmjs.com/package/strip-ansi), ya que es un paquete extremadamente sencillo de utilizar y bastante usado por la comunidad.

# Consideraciones a la hora de realizar las pruebas

Para hacer las pruebas vamos a necesitar un paquete que nos permita realizar peticiones HTTP a nuestro servidor, en este caso vamos a utilizar `request`. Para instalarlo simplemente debemos ejecutar `npm install request` y ya podremos utilizarlo en nuestro código.

Y a la hora de realizar las pruebas vamos a necesitar el servidor en ejecución, y cuando esté en ejecución podremos realizar las peticiones. 

En aquellas peticiones que se basan en la query de la URL usamos request de la siguiente manera:

```typescript
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
```

Vemos que utilizamos el método `get` para realizar la petición `GET` a la URL `http://localhost:3000/cards?names=oscar` y en el callback comprobamos que el mensaje de error que nos devuelve es el esperado.

Y para esas peticiones que tengamos que enviar un cuerpo en la petición usamos request de la siguiente manera:

```typescript
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
```

Vemos que al método `post` le pasamos un objeto con la URL, el cuerpo de la petición y que el cuerpo es un objeto JSON, y en el callback comprobamos que el mensaje de error que nos devuelve es el esperado.

# Modificación PE 101

La modificación que se ha realizado en la sesión del miercoles, ha sido simplemente utilizar la api asincrona de Node JS basada en promesas en dos métodos de la clase `CardCollectionsHandlerAsync`, en concreto los métodos que he decidido modificar son addCard y deleteCard, ya que son los que más se utilizan en la aplicación y los que más se van a ver beneficiados de esta modificación.

Al tener todo mas encapsulado he tenido que modificar mas de un método para que todo funcione correctamente, sobretodo métodos privados. Un ejemplo de esto es:

```typescript
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
```

Y por supuesto realizar algunas pruebas para ver su funcionamiento.

# Conclusión

En esta práctica hemos visto cómo podemos crear un servidor para atender peticiones HTTP, y cómo podemos relacionar estas peticiones con la dinámica que llevamos en prácticas anteriores con el sistema de cartas Magic. Hemos utilizado Express JS para crear el servidor, y hemos utilizado la API asíncrona de Node JS basada en promesas para realizar las operaciones de la colección de cartas en la sesión presencial.

 Además, hemos utilizado la librería `strip-ansi` para limpiar los mensajes de error que se envían al cliente, y hemos utilizado `request` para realizar las pruebas de las peticiones HTTP.

 Me ha parecido una práctica muy interesante que por primera vez he sentido que podemos hacer algo muy potente con las herramientas que hemos aprendidos a lo largo del curso, y que además es algo que se utiliza en la vida real para según que proyectos, algo que valoro mucho en cualquier asignatura.







