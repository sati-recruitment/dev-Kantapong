-- CreateTable
CREATE TABLE "patient" (
    "hospitalNumber" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthday" DATETIME NOT NULL,
    "sex" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "encounter" (
    "transactionNumber" TEXT NOT NULL PRIMARY KEY,
    "visitDate" DATETIME NOT NULL,
    "physicalExamination" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "presentIllness" TEXT NOT NULL,
    "patientHospitalNumber" TEXT NOT NULL,
    CONSTRAINT "encounter_patientHospitalNumber_fkey" FOREIGN KEY ("patientHospitalNumber") REFERENCES "patient" ("hospitalNumber") ON DELETE RESTRICT ON UPDATE CASCADE
);
