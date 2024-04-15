

<p align="center">
  <a href="https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-OscarCordobesNavarro/actions/workflows/node.js.yml">
    <img src="https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-OscarCordobesNavarro/actions/workflows/node.js.yml/badge.svg" alt="Tests">
  </a>
<a href='https://coveralls.io/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-OscarCordobesNavarro?branch=main'><img src='https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-OscarCordobesNavarro/badge.svg?branch=main' alt='Coverage Status' /></a>

  <a href="[https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-OscarCordobesNavarro/actions/workflows/sonarcloud.yml](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-OscarCordobesNavarro&metric=alert_status))">
    <img src="https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct10-fs-proc-sockets-magic-app-OscarCordobesNavarro/actions/workflows/sonarcloud.yml/badge.svg" alt="Quality Gate Status">
  </a>
</p>

# Introducción

En esta practica vamos a adentrarnos en el uso del paquete net de Node.JS que nos permite crear sockets para poder intercomunicar procesos. Vamos a utilizarlo para actualizar nuestro proyecto de la practica anterior. Vamos a generar un sistema servidor-cliente donde los clientes sean los que soliciten al servidor la información que requieran, el usuario seguirá utilizando el programa como antes, pero esta vez no será su maquina quien realize las operaciones.

# Aplicación para coleccionistas de cartas Magic cliente-servidor

Antes de nada, debemos echarle un ojo a lo que teniamos anteriormente, que en mi caso he decicido adaptar el código que ya tenía, tanto las interfaces y los enumerados siguen siendo las mismas.

El cambio principal que se ha realizado respecto al código que teníamos en la anterior practica es que he migrado las operaciones sincronas a operaciones asincronas utilizando la API basada en callbacks de Node.JS. Por lo que la implementación de la clase `CardCollectionHandler` ha cambiado por completo manteniendo la estructura y pasando a tener el nombre de `CardCollecetionHandlerAsync`. Además he tenido que añadir algunos métodos adicionales para obtener las cadenas, se tratan de `getStringCollection` y `getStringCard` y algunos métodos privados de ayuda para encapsular mejor.


Un ejemplo del cambio sería:
```typescript
  private checkCardFileAndWrite(
    card: ICard,
    callback: (error: Error | null) => void,
  ): void {
    const filePath = this.getCardFilePath(card.id);
    const data = JSON.stringify(card, undefined, 2);
    this.checkCardFile(card.id, (err) => {
      if (err) {
        return callback(err);
      } else {
        fs.writeFile(filePath, data, (err) => {
          if (err) {
            return callback(err);
          }
          callback(null);
        });
      }
    });
  }
```

Por si alguna duda recomiendo revisar la carpeta `Previo` para ver las operaciones fundamentales en la que se basa el servidor.


Ahora procedemos a la implementación del cliente. En mi caso, he creado la clase `MagicClient` para facilitar y simplificar la conexión al servidor. Esta clase se conecta al servidor tan pronto como se instancia. Si surge algún error durante la conexión, se informa inmediatamente por consola.

Para empezar a enviar los argumentos, disponemos del método público `init`, al cual se le pasan todos los argumentos de la línea de comandos. Este método se encarga de enviar los argumentos al servidor y de estar atento a sus respuestas, **sin cerrar la conexión**.

```typescript
export class MagicClient {
  private socket: net.Socket;
  private data: string = "";

  constructor(private puerto: number = 60300) {
    this.puerto = puerto;
    this.socket = net.connect({ port: this.puerto });

    this.socket.on("error", (error) => {
      console.log("Ha ocurrido un error al conectar con el servidor: " + error);
    });
  }

  public init(msg: string): void {
    this.sendArgv(msg);
    this.listenServer();
  }

  private sendArgv(argumentos: string): void {
    const longitudMensaje = Buffer.byteLength(argumentos, "utf8");

    const mensajeConLongitud = Buffer.alloc(4 + longitudMensaje);
    mensajeConLongitud.writeInt32BE(longitudMensaje, 0);
    mensajeConLongitud.write(argumentos, 4, "utf8");

    this.socket.write(mensajeConLongitud);
  }

  private listenServer(): void {
    this.socket.on("data", (data) => {
      this.data += data;
    });

    this.socket.on("data", (data) => {
      let buffer = Buffer.from(data);

      while (buffer.length >= 4) {
        const longitud = buffer.readInt32BE(0);

        if (buffer.length >= longitud + 4) {
          const respuestaString = buffer
            .subarray(4, longitud + 4)
            .toString("utf8");
          const respuesta = JSON.parse(respuestaString);

          console.log(respuesta.data);

          buffer = buffer.subarray(longitud + 4);
        } else {
          break;
        }
      }
    });
  }
}
```

Como podemos observar, la forma en que recibimos los datos es a través de un buffer. En este proceso, primero obtenemos el tamaño del mensaje que el servidor va a enviar. Luego, esperamos a recibir el mensaje completo, es decir, los bytes que el servidor especifica, antes de procesar el buffer. Este enfoque también se implementa en el servidor. Creo que esta es una manera simple y efectiva de garantizar que los mensajes se transmitan correctamente de un lado a otro.

Una vez tenemos la parte del cliente resuelta pasamos al servidor. Vamos a tener dos tipos de mensajes, en primer lugar vamos a tener un mensaje del tipo `RequestMessage` que será el tipo de mensaje que enviará el cliente al servidor solicitando un servicio.

```typescript
export interface RequestMessage {
    type: MessageType;
    data: string[];
}
```

Vemos que este mensaje viene acompañado de un `type` de tipo `MessageType`, este último será el servicio que se está solicitando, recordemos que eran read, add, list, remove y update. En este caso será un enumerado.

```typescript
export enum MessageType {
    READ = "read",
    ADD = "add",
    REMOVE = "remove",
    UPDATE = "update",
    LIST = "list",
  }
```


Con esto, hemos definido los comandos que podemos procesar; cualquier comando que no esté incluido aquí será ignorado. Una vez que recibimos el mensaje `RequestMessage`, lo gestionamos utilizando la función asíncrona `messageHandler`. Esta función se encarga de manejar la solicitud y ejecutar la API sincrónica que mencioné anteriormente.

Lo que hace es gestionar la petición dependiendo del servicio que se solicita, y en cada apartado se lleva a cabo la lógica necesaria:
```typescript
export function messageHandler(
    msg: string,
    callback: (error: Error | null, response?: string) => void,
  ) {
    const message = JSON.parse(msg) as RequestMessage;

  
    const handler = new CardCollectionsHandlerAsync(message.data[0]);
  
    const carta: ICard = {
      id: parseInt(message.data[1]),
      name: message.data[2],
      manaCost: parseInt(message.data[3]),
      color: message.data[4] as Color,
      lineType: message.data[5] as TypeLine,
      rarity: message.data[6] as Rarity,
      ruleText: message.data[7],
      strength: parseInt(message.data[8]),
      endurance: parseInt(message.data[9]),
      brandsLoyalty: parseInt(message.data[10]),
      marketValue: parseInt(message.data[11]),
    };

    switch (message.type) {
      case MessageType.ADD:
        console.log(chalk.yellow("Se ha solicitado añadir una carta por parte del usuario: " + message.data[0]))
        handler.addCard(carta, (error) => {
          if (error) {
            console.log(chalk.red.bold("Operacion fallida por error: " + error.message));
            callback(error);
            return;
          } else {
            console.log(chalk.green.bold("Operacion realizada con exito"));
            callback(null, chalk.green.bold("Card added successfully"));
          }
        });
        break;
      case MessageType.REMOVE:
        console.log(chalk.yellow("Se ha solicitado eliminar una carta por parte del usuario: " + message.data[0]))
        handler.removeCard(parseInt(message.data[1]), (error) => {
          if (error) {
            console.log(chalk.red.bold("Operacion fallida por error: " + error.message));
            callback(error);
            return;
          } else {
            console.log(chalk.green.bold("Operacion realizada con exito"));
            callback(null, chalk.green.bold("Card removed successfully"));
          }
        });
        break;
      case MessageType.READ:
        console.log(chalk.yellow("Se ha solicitado leer una carta por parte del usuario: " + message.data[0]))
        handler.getStringCard(parseInt(message.data[1]), (error, string) => {
          if (error) {
            console.log(chalk.red.bold("Operacion fallida por error: " + error.message));
            callback(error);
            return;
          } else {
            console.log(chalk.green.bold("Operacion realizada con exito"));
            callback(null, string);
          }
        });
        break;
        ....
        default:
            callback(new Error(chalk.red.bold("Unknown message type")));
    }
```

Y esta función genera una respuesta de tipo `ResponseMessage` que será la que se envía al cliente para que la interprete y se cierre la conexión.
```typescript
export interface ResponseMessage {
  success: boolean;
  data: string;
}
```


La propiedad `data` siempre se mostrará en la consola del cliente, marcando así el final del proceso de solicitud-respuesta.

Anteriormente, mencionamos que el cliente utilizará la colección como lo hacía antes, lo cual se lograba a través de yargs. Por lo tanto, he adaptado el archivo `magic-app.js` que teníamos en la práctica anterior. Los cambios principales se centran en establecer los comandos en modo `strict`, lo que significa que se deben proporcionar exclusivamente los argumentos necesarios. Esta medida es muy útil para gestionar posibles errores y entradas maliciosas por parte del usuario.

Dicho esto, para cada comando vamos a crear una instancia de `MagicClient` y enviaremos una petición dependiendo del comando que estemos ejecutando. Un ejemplo sería el comando de lectura:

```typescript
yargs(hideBin(process.argv))
  .strict()
  .command(
    "read",
    "Read a card of the user collection",
    {
      user: {
        alias: "u",
        description: "User Name",
        type: "string",
        demandOption: true,
      },
      id: {
        alias: "i",
        description: "Card ID",
        type: "number",
        demandOption: true,
      },
    },
    (argv) => {
      const client = new MagicClient();
      client.init(
        JSON.stringify({
          type: MessageType.READ,
          data: [argv.user, argv.id.toString()],
        }),
      );
    },
  )
```

Esta estructura nos permite evitar muchas comprobaciones que el servidor tendría que realizar. Además, nos permite filtrar algunos parámetros inadecuados al actualizar la carta, como el color o el tipo.


# Modificacion PE101

El objetivo de la modificación era aplicar el patrón de callback a dos métodos de la práctica anterior para convertirlos en asíncronos. La dificultad radicaba en la posibilidad de que fuera necesario modificar más de dos métodos, ya que, en mi caso, el método de eliminación dependía del método para verificar la existencia de una carta en una colección.


Partiendo de la clase `CardCollectionHandler` que teníamos anteriormente, eliminé los métodos que no iba a utilizar y realicé diversos cambios.

En addCard por ejemplo:
```typescript
  public addCard(card: ICard, callback: (error: Error | null) => void): void {

    this.cardExists(card.id, (exists) => {
      if (exists) {
        return callback(
          new Error("Card already exists at " + this.userName + " collection"),
        );
      }

      if (card.lineType === "Creature" && (!card.strength || !card.endurance)) {
        return callback(
          new Error("Creature card must have strength and endurance"),
        );
      }

      if (card.lineType === "Planeswalker" && !card.brandsLoyalty) {
        return callback(
          new Error("Planeswalker card must have brands loyalty"),
        );
      }

      this.writeCardToFileAsync(card, (error) => {
        if (error) {
          return callback(error);
        }
        callback(null);
      });
    });
  }

  private writeCardToFileAsync(
    card: ICard,
    callback: (error: Error | null) => void,
  ): void {
    const filePath = this.getCardFilePath(card.id);
    const directoryPath = path.dirname(filePath);

    fs.mkdir(directoryPath, { recursive: true }, (error) => {
      if (error) {
        return callback(error);
      }

      fs.writeFile(filePath, JSON.stringify(card, null, 1), (error) => {
        if (error) {
          return callback(error);
        }
        callback(null);
      });
    });
  }

```

# Conclusión

Esta práctica ha sido interesante para entender y desarrollar un proyecto con sockets de una manera más concreta. Aunque trabajamos con sockets el año pasado, el proyecto fue poco flexible. En este caso, la flexibilidad ha sido útil para evaluar qué decisiones son más interesantes de abordar.
