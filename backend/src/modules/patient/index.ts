import { patientInfo } from "@/dto/patientInfo";
import { Router, Request, Response } from "express";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
export const patientRouter = Router();

patientRouter.get("/", async (req: Request, res: Response) => {
    try {
        // Find all patients
        const patients = await prisma.patient.findMany();
        res.status(200).json(patients);
    } catch (error) {
        console.error("Error fetching patients:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

patientRouter.get("/:hospitalNumber", async (req: Request, res: Response) => {
    try {
        const { hospitalNumber } = req.params;

        // Find unique patient by hospitalNumber
        const patient = await prisma.patient.findUnique({
            where: { hospitalNumber },
        });

        // If patient not found, return 404
        if (!patient) {
            return res.status(404).json({ error: "Patient not found" });
        }

        res.status(200).json(patient);
    } catch (error) {
        console.error("Error fetching patient:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

patientRouter.post("/", async (req: Request, res: Response) => {
    try {
        const { hospitalNumber, firstName, lastName, birthday, sex } =
            req.body as patientInfo;

        // Validate required fields
        if (!hospitalNumber || !firstName || !lastName || !birthday || !sex) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if hospitalNumber duplicate
        const existingPatient = await prisma.patient.findUnique({
            where: { hospitalNumber },
        });

        if (existingPatient) {
            return res.status(500).json({ error: "Duplicate patient found" });
        }

        // Create a new patient
        const newPatient = await prisma.patient.create({
            data: { ...req.body, birthday: new Date(birthday) },
        });

        res.status(201).json(newPatient);
    } catch (error) {
        console.error("Error creating patient:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

patientRouter.put("/:hospitalNumber", async (req: Request, res: Response) => {
    try {
        const { hospitalNumber } = req.params;
        const { birthday } = req.body;

        // Find unique patient by id
        const patient = await prisma.patient.findUnique({
            where: { hospitalNumber },
        });

        // If the patient is not found, return 404
        if (!patient) {
            return res.status(404).json({ error: "Patient not found" });
        }

        // Update the patient data
        await prisma.patient.update({
            where: { hospitalNumber },
            data: {
                ...req.body,
                birthday: birthday ? new Date(birthday) : patient.birtday,
            },
        });

        // If successful, return 204 No Content (No Response Body)
        res.status(204).send();
    } catch (error) {
        console.error("Error updating patient:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

patientRouter.all("/", (req: Request, res: Response) => {
    res.status(405).json({ error: "Method Not Allowed" });
});
