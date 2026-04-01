import express from "express";
import pilotosRoutes from "./routes/pilotos.js";
import navesRoutes from "./routes/naves.js";
import planetasRoutes from "./routes/planetas.js";
import missoesRoutes from "./routes/missoes.js";

const app = express();
app.use(express.json());

app.use("/pilotos", pilotosRoutes);
app.use("/naves", navesRoutes);
app.use("/planetas", planetasRoutes);
app.use("/missoes", missoesRoutes);

app.listen(3000, () => console.log("Rodando em http://localhost:3000"));
