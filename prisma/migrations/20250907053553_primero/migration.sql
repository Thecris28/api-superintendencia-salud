-- CreateTable
CREATE TABLE "public"."Profesional" (
    "idProfesional" SERIAL NOT NULL,
    "nroRegistro" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidoPaterno" TEXT NOT NULL,
    "apellidoMaterno" TEXT NOT NULL,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "fechaRegistro" TIMESTAMP(3) NOT NULL,
    "nacionalidad" TEXT NOT NULL,
    "rut" TEXT NOT NULL,
    "universidad" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "especialidad" TEXT NOT NULL,
    "observaciones" TEXT,

    CONSTRAINT "Profesional_pkey" PRIMARY KEY ("idProfesional")
);

-- CreateTable
CREATE TABLE "public"."Antecedentes" (
    "idAntecedente" SERIAL NOT NULL,
    "descripcion" TEXT,
    "tipoAntecedente" TEXT,
    "fechaAntecedente" TIMESTAMP(3),
    "estadoAntecedente" TEXT,
    "profesionalId" INTEGER NOT NULL,

    CONSTRAINT "Antecedentes_pkey" PRIMARY KEY ("idAntecedente")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profesional_nroRegistro_key" ON "public"."Profesional"("nroRegistro");

-- CreateIndex
CREATE UNIQUE INDEX "Profesional_rut_key" ON "public"."Profesional"("rut");

-- CreateIndex
CREATE INDEX "Antecedentes_profesionalId_idx" ON "public"."Antecedentes"("profesionalId");

-- AddForeignKey
ALTER TABLE "public"."Antecedentes" ADD CONSTRAINT "Antecedentes_profesionalId_fkey" FOREIGN KEY ("profesionalId") REFERENCES "public"."Profesional"("idProfesional") ON DELETE CASCADE ON UPDATE CASCADE;
