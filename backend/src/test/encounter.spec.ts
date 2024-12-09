import { app } from "../app";
import { PrismaClient } from "@prisma/client";
import request from "supertest";
import dayjs from "dayjs";

describe("Test Suit for Encounter Module", () => {
    const agent = request(app);

    const db = new PrismaClient();

    beforeAll(async () => {
        const mockPatient = [
            {
                hospitalNumber: "0000001",
                firstName: "John",
                lastName: "Doe",
                birthday: dayjs("1990-01-01").toDate(),
                sex: "male",
            },
            {
                hospitalNumber: "0000002",
                firstName: "Jane",
                lastName: "Doe",
                birthday: dayjs("1990-01-01").toDate(),
                sex: "female",
            },
        ];

        const mockEncounter = [
            {
                transactionNumber: "0000002",
                visitDate: dayjs().startOf("day").toDate(),
                physicalExamination: "normal",
                diagnosis: "normal",
                presentIllness: "normal",
                patientHospitalNumber: "0000001",
            },
            {
                transactionNumber: "0000001",
                visitDate: dayjs().startOf("day").toDate(),
                physicalExamination: "abnormal",
                diagnosis: "fever",
                presentIllness: "feeling unwell",
                patientHospitalNumber: "0000002",
            },
        ];

        await db.$connect();

        await db.$transaction(
            mockPatient.map((i) => {
                return db.patient.create({
                    data: i,
                });
            })
        );

        await db.$transaction(
            mockEncounter.map((i) => {
                return db.encounter.create({
                    data: i,
                });
            })
        );
    });

    afterAll(async () => {
        await db.encounter.deleteMany();
        await db.patient.deleteMany();
        await db.$disconnect();
    });

    it("should return 200 status for get all encounters", async () => {
        const res = await agent.get("/encounters");
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it("should return 200 status for get encounters by transaction number #1", async () => {
        const res = await agent.get("/encounters/0000002");
        expect(res.status).toBe(200);
        expect({
            ...res.body,
            visitDate: dayjs(res.body.visitDate).format("YYYY-MM-DD"),
        }).toEqual({
            transactionNumber: "0000002",
            visitDate: dayjs().startOf("day").format("YYYY-MM-DD"),
            physicalExamination: "normal",
            diagnosis: "normal",
            presentIllness: "normal",
            patientHospitalNumber: "0000001",
            patient: {
                hospitalNumber: "0000001",
                firstName: "John",
                lastName: "Doe",
            },
        });
    });

    it("should return 200 status for get encounters by transaction number #2", async () => {
        const res = await agent.get("/encounters/0000001");
        expect(res.status).toBe(200);
        expect(res.status).toBe(200);
        expect({
            ...res.body,
            visitDate: dayjs(res.body.visitDate).format("YYYY-MM-DD"),
        }).toEqual({
            transactionNumber: "0000001",
            visitDate: dayjs().startOf("day").format("YYYY-MM-DD"),
            physicalExamination: "abnormal",
            diagnosis: "fever",
            presentIllness: "feeling unwell",
            patientHospitalNumber: "0000002",
            patient: {
                hospitalNumber: "0000002",
                firstName: "Jane",
                lastName: "Doe",
            },
        });
    });

    it("should return 404 status for not found encounter", async () => {
        const res = await agent.get("/encounters/999999");
        expect(res.status).toBe(404);
    });

    it("should return 201 for create new encounter", async () => {
        const res = await agent.post("/encounters").send({
            transactionNumber: "0000003",
            visitDate: dayjs().startOf("day").toDate(),
            physicalExamination: "normal",
            diagnosis: "normal",
            presentIllness: "normal",
            patientHospitalNumber: "0000001",
        });

        const data = await db.encounter.findFirst({
            where: {
                transactionNumber: "0000003",
            },
        });

        expect(res.status).toBe(201);
        expect(data?.transactionNumber).toBe("0000003");
        expect(data?.patientHospitalNumber).toBe("0000001");
        expect(data?.visitDate).toEqual(dayjs().startOf("day").toDate());
        expect(data?.physicalExamination).toBe("normal");
        expect(data?.diagnosis).toBe("normal");
        expect(data?.presentIllness).toBe("normal");
    });

    it("should return 204 for update encounter", async () => {
        const res = await agent
            .put("/encounters/0000002")
            .set("Content-Type", "application/json")
            .send({
                diagnosis: "influenza",
            });

        const data = await db.encounter.findFirst({
            where: {
                transactionNumber: "0000002",
            },
        });
        expect(res.status).toBe(204);
        expect(data?.diagnosis).toBe("influenza");
    });

    it("should return 404 for not existed encounter", async () => {
        const res = await agent.put("/encounters/999999").send({
            transactionNumber: "0000002",
            visitDate: dayjs().startOf("day").toDate(),
            physicalExamination: "normal",
            presentIllness: "normal",
            patientHospitalNumber: "0000001",
            diagnosis: "influenza",
        });

        expect(res.status).toBe(404);
    });

    it("should return 500 status for invalid payload on update operation", async () => {
        const res = await agent
            .put("/encounters/0000001")
            .set("Content-Type", "application/json")
            .send({
                transactionNumber: "0000002",
                visitDate: dayjs().startOf("day").toDate(),
                physicalExamination: "normal",
                presentIllness: "normal",
                patientHospitalNumber: "0000001",
                diagnosis: "influenza",
            });

        expect(res.status).toBe(500);
    });

    it("should return 405 status for not allowed method", async () => {
        const res = await agent.delete("/encounters");
        expect(res.status).toBe(405);
    });
});
