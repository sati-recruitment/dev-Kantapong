import { encounterInfo } from "@/dto/encounterInfo";
import dayjs from "dayjs";
import { Router, Request, Response } from "express";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
export const encounterRouter = Router();

encounterRouter.get("/", async (req: Request, res: Response) => {
    try {
        // Find all encounters
        const encounters = await prisma.encounter.findMany();
        res.status(200).json(encounters);
    } catch (error) {
        console.error("Error fetching encounters:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

encounterRouter.get(
    "/:transactionNumber",
    async (req: Request, res: Response) => {
        try {
            const { transactionNumber } = req.params;

            // Find unique encounter by transactionNumber
            const encounter = await prisma.encounter.findUnique({
                where: { transactionNumber },
            });

            // If encounter not found, return 404
            if (!encounter) {
                return res.status(404).json({ error: "encounter not found" });
            }

            // Find unique patient by hospitalNumber
            const patient = await prisma.patient.findUnique({
                where: { hospitalNumber: encounter.patientHospitalNumber },
                select: {
                    hospitalNumber: true,
                    firstName: true,
                    lastName: true,
                },
            });

            res.status(200).json({
                ...encounter,
                patient: patient || null,
            });
        } catch (error) {
            console.error("Error fetching encounter:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

encounterRouter.post("/", async (req: Request, res: Response) => {
    try {
        const {
            transactionNumber,
            visitDate,
            physicalExamination,
            diagnosis,
            presentIllness,
            patientHospitalNumber,
        } = req.body as encounterInfo;

        // Validate required fields
        if (
            !transactionNumber ||
            !visitDate ||
            !physicalExamination ||
            !diagnosis ||
            !presentIllness ||
            !patientHospitalNumber
        ) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Create a new patient
        const newEncounter = await prisma.encounter.create({
            data: {
                ...req.body,
                visitDate: new Date(visitDate),
            },
        });

        res.status(201).json(newEncounter);
    } catch (error) {
        console.error("Error creating encounter:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

encounterRouter.put(
    "/:transactionNumber",
    async (req: Request, res: Response) => {
        try {
            const { transactionNumber } = req.params;
            const { visitDate } = req.body;

            // Find unique encounter by id
            const encounter = await prisma.encounter.findUnique({
                where: { transactionNumber },
            });

            // If the encounter is not found, return 404
            if (!encounter) {
                return res.status(404).json({ error: "encounter not found" });
            }

            // Update the encounter data
            await prisma.encounter.update({
                where: { transactionNumber },
                data: visitDate
                    ? {
                          ...req.body,
                          visitDate: new Date(visitDate),
                      }
                    : {
                          ...req.body,
                      },
            });

            // If successful, return 204 No Content (No Response Body)
            res.status(204).send();
        } catch (error) {
            console.error("Error updating encounter:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

encounterRouter.all("/", (req: Request, res: Response) => {
    res.status(405).json({ error: "Method Not Allowed" });
});
