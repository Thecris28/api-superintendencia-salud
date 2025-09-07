import { Router, Request, Response } from "express";
import { prisma } from "@/config/prisma";
import { connect } from "http2";


interface ProfesionalRequestBody {
  nroRegistro: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: Date;
  fechaRegistro?: Date; 
  nacionalidad: string;
  rut: string;
  universidad: string;
  titulo: string;
  especialidad: string;
  observaciones?: string;
}

// Extiende Request para incluir tipado en body
interface ProfesionalRequest extends Request {
  body: ProfesionalRequestBody;
}

const profesionalRoute = Router();

// Obtiene todos los profesionales
profesionalRoute.get("/", async(req: Request, res: Response) => {
    const profesional = await prisma.profesional.findMany({
        include: { antecedentes: true }
    });
    res.json(profesional);
});

// Crear un nuevo profesional
profesionalRoute.post("/", async(req: ProfesionalRequest, res: Response) => {
    try {
        const { 
            nroRegistro, 
            nombre, 
            apellidoPaterno, 
            apellidoMaterno, 
            fechaNacimiento, 
            nacionalidad,
            rut,
            universidad,
            titulo,
            especialidad,
            observaciones
        } = req.body;
        

        const newprofesional = await prisma.profesional.create({
            data: {
                nroRegistro,
                nombre,
                apellidoPaterno,
                apellidoMaterno,
                fechaNacimiento: new Date(fechaNacimiento),
                fechaRegistro: new Date(), 
                nacionalidad,
                rut,
                universidad,
                titulo,
                especialidad,
                observaciones: observaciones || null // Convertir undefined a null
            }
        });
        
        res.status(201).json(newprofesional);
    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2002' && error.meta?.target?.includes('nroRegistro')) {
            return res.status(400).json({
                error: `Ya existe un profesional con el número de registro: ${req.body.nroRegistro}`
            });
        }
        if (error.code === 'P2002' && error.meta?.target?.includes('rut')) {
            return res.status(400).json({
                error: `Ya existe un profesional con el RUT: ${req.body.rut}`
            });
        }
        res.status(500).json({ error: "Error al crear el profesional" });
    }
});

// Busca un profesional por ID o RUT
profesionalRoute.get("/buscar/:identificador", async(req: Request<{identificador: string}>, res: Response) => {
    try {
        const identificador = req.params.identificador;
        
        if (!identificador) {
            return res.status(400).json({ error: "Id o Rut no proporcionado" });
        }
        
        // Primero, verificar si el identificador es un número (ID)
        const idNumerico = parseInt(identificador);
        let profesional = null;
        
        if (!isNaN(idNumerico)) {
            // Buscar por ID
            profesional = await prisma.profesional.findUnique({
                where: { idProfesional: idNumerico },
                include: { antecedentes: true }
            });
        }
        
        
        if (!profesional) {
            // Buscar por RUT
            profesional = await prisma.profesional.findUnique({
                where: { rut: identificador },
                include: { antecedentes: true }
            });
        }
        
        if (!profesional) {
            return res.status(404).json({ message: "Profesional no encontrado" });
        }
        
        res.json({
            message: "Profesional encontrado",
            result: 'ok',
            profesional: profesional,

        });
    } catch (error) {
        console.error("Error al buscar profesional:", error);
        res.status(500).json({ error: "Error al buscar el profesional" });
    }
});

// Crear Antecedentes por RUT de profesional
profesionalRoute.post("/antecedentes/:rut", async(req:Request<{ rut: string }>, res: Response) => {
    try {
        const rutProfesional = req.params.rut;
        const { descripcion, tipoAntecedente, estadoAntecedente } = req.body;

        if (!descripcion || !tipoAntecedente) {
            return res.status(400).json({ error: "Descripción y tipo de antecedente son requeridos" });
        }

        const antecedente = await prisma.antecedentes.create({
            data: {
                descripcion,
                fechaAntecedente: new Date(),
                tipoAntecedente: tipoAntecedente || 'General',
                estadoAntecedente: estadoAntecedente || null,
                profesional: {
                    connect: { rut: rutProfesional }
                }
            }
        });

        res.status(201).json(antecedente);
    } catch (error) {
        
    }
});

// // Obtener profesional por ID
// profesionalRoute.get("/profesional/:id", async(req: Request<{ id: string }>, res: Response) => {
//     try {
//         const id = parseInt(req.params.id);
        
//         if (isNaN(id)) {
//             return res.status(400).json({ error: "ID inválido" });
//         }
        
//         const profesional = await prisma.profesional.findUnique({
//             where: { idProfesional: id },
//             include: { antecedentes: true }
//         });
        
//         if (!profesional) {
//             return res.status(404).json({ error: "Profesional no encontrado" });
//         }
        
//         res.json(profesional);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Error al obtener el profesional" });
//     }
// });

// // Obtener profesional por rut

// profesionalRoute.get("/profesional/rut/:rut", async(req: Request<{rut: string}> , res: Response) => {
//     try {
//         const rut = req.params.rut;
//         console.log("RUT recibido:", rut); // Log para verificar el valor de rut
        
//         if (!rut) {
//             return res.status(400).json({ error: "RUT inválido" });
//         }
//         const profesional = await prisma.profesional.findUnique({
//             where: { rut: rut},
//             include: { antecedentes: true }
//         })
//         if (!profesional) {
//             return res.status(404).json({ error: "Profesional no encontrado" });
//         }
//         res.json(profesional);

//     } catch (error: any) {
//         console.error(error);
//         res.status(500).json({ error: "Error al obtener el profesional" });
//     }
// })



export default profesionalRoute;