import express from "express";
import profesionalRoute from "./routes/profesional.route";
import adminRoute from "./routes/admin.route";

const app = express();
app.use(express.json());

// Rutas de la API
app.use("/api/profesional", profesionalRoute)

app.use('/api/admin', adminRoute);

app.listen(3000, ()=> {
  console.log("server is runnig on port 3000")
})