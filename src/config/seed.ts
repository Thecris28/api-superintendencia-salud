import { prisma } from "@/config/prisma";


export async function seedDatabase(options = {}) {
    console.log('Iniciando seed de la base de datos...');

    // Crear profesionales
  const profesionales = [
    {
      nroRegistro: "10001-A",
      nombre: "María Fernanda",
      apellidoPaterno: "González",
      apellidoMaterno: "Rodríguez",
      fechaNacimiento: new Date("1985-06-15"),
      fechaRegistro: new Date("2015-03-10"),
      nacionalidad: "Chilena",
      rut: "12.345.678-9",
      universidad: "Universidad de Chile",
      titulo: "Licenciado(a) en Psicología.",
      especialidad: "Psicología Clínica ",
      observaciones: "Graduada con distinción máxima"
    },
    {
      nroRegistro: "10002-B",
      nombre: "Juan Carlos",
      apellidoPaterno: "Pérez",
      apellidoMaterno: "Soto",
      fechaNacimiento: new Date("1978-11-22"),
      fechaRegistro: new Date("2010-07-15"),
      nacionalidad: "Chilena",
      rut: "9.876.543-2",
      universidad: "Universidad Católica",
      titulo: "Licenciado(a) en Psicología.",
      especialidad: "Psicología Experimental y Neurociencia",
      observaciones: null
    },
    {
      nroRegistro: "10003-C",
      nombre: "Javiera Andrea",
      apellidoPaterno: "Muñoz",
      apellidoMaterno: "Vargas",
      fechaNacimiento: new Date("1990-03-28"),
      fechaRegistro: new Date("2018-05-02"),
      nacionalidad: "Chilena",
      rut: "17.654.321-0",
      universidad: "Universidad de Concepción",
      titulo: "Médico Cirujano",
      especialidad: "Psicología Infantil y de Adolescencia",
      observaciones: "Internado en Hospital Roberto del Río"
    },
  ];

  console.log('Creando profesionales...');
  for (const profesional of profesionales) {
    // Verificar si ya existe un profesional con el mismo rut
    const existingProfesional = await prisma.profesional.findUnique({
      where: { rut: profesional.rut }
    });

    if (!existingProfesional) {
      await prisma.profesional.create({
        data: profesional
      });
      console.log(`Profesional creado: ${profesional.nombre} ${profesional.apellidoPaterno}`);
    } else {
      console.log(`Profesional con RUT ${profesional.rut} ya existe, omitiendo...`);
    }
  }

  console.log('¡Seed completado con éxito!');
  return { success: true };
}

// Si se ejecuta directamente como script (desde CLI)
if (require.main === module) {
  seedDatabase()
    .catch((e) => {
      console.error('Error durante el seed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}