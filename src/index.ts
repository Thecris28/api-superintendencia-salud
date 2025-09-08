import express from "express";
import cors from "cors"
import profesionalRoute from "./routes/profesional.route";
import adminRoute from "./routes/admin.route";

const app = express();
app.use(express.json());

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}))


// Rutas de la API
app.use("/api/profesional", profesionalRoute)

app.use('/api/admin', adminRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})