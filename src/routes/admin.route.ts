import { seedDatabase } from "../config/seed";
import { Request, Response, Router } from "express";

const adminRoute = Router();
// Endpoint para ejecutar el seed
adminRoute.post('/seed', async (req: Request, res: Response) => {
  try {
    // Opcionalmente puedes permitir elegir qué datos sembrar
    const options = req.body.options || {};
    
    // Ejecutar el seed
    await seedDatabase(options);
    
    return res.status(200).json({ 
      message: 'Base de datos inicializada exitosamente' 
    });
  } catch (error) {
    console.error('Error al ejecutar seed:', error);
    return res.status(500).json({ 
      error: 'Error al inicializar la base de datos',
      details: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

export default adminRoute;