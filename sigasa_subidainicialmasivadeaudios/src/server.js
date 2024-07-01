import * as dotenv from "dotenv";
import express from "express";
import Routes from "./api_routes/Routes.js";
import cors from "cors";
import CreateLocalDBTable from "./sqlite/services/CreateLocalDBTable.mjs";
import InsertLocalDBData from "./sqlite/services/InsertLocalDBData.js";

//Inicializa el server express
const app = express();
app.use([express.json(), cors()]);
// app.use(express.json()) // con esta linea se requiere que la solicitud tenga el encabezado Content-Type: application/json para el body

//Asigna las rutas y sus controladores que manejará el API
Routes(app);

//Obtiene las variables de entorno del archivo .env
dotenv.config();

//Establece el puerto y hostname del servicio
const port = process.env.PORT;
//const hostName = process.env.HOSTNAME;
const hostName = "localhost";
app.listen(port, hostName, () => {
  console.log(`Listening to port http://${hostName}:${port}`);
});

//Crea la tabla de la base de datos local si no existe
await CreateLocalDBTable();

//Obtiene los valores de configuración de la base de datos remota y
//los inserta en la tabla de configuración de la base de datos local
await InsertLocalDBData();
