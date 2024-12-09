import { app } from "../app";
import { PrismaClient } from "@prisma/client";
import request from "supertest";
import dayjs from "dayjs";

describe("Test Suit for Patient Module", () => {
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

        await db.$connect();

        await db.$transaction(
            mockPatient.map((i) => {
                return db.patient.create({
                    data: i,
                });
            })
        );
    });

    afterAll(async () => {
        await db.patient.deleteMany();
        await db.$disconnect();
    });

    it("should return 200 status for get all patients", async () => {
        const res = await agent.get("/patients");
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it("should return patient with given hospital number #1", async () => {
        const res = await agent.get("/patients/0000001");
        expect(res.status).toBe(200);
        expect({
            ...res.body,
            birthday: dayjs(res.body.birthday).format("YYYY-MM-DD"),
        }).toEqual({
            hospitalNumber: "0000001",
            firstName: "John",
            lastName: "Doe",
            birthday: dayjs("1990-01-01").format("YYYY-MM-DD"),
            sex: "male",
        });
    });

    it("should return patient with given hospital number #2", async () => {
        const res = await agent.get("/patients/0000002");
        expect(res.status).toBe(200);
        expect({
            ...res.body,
            birthday: dayjs(res.body.birthday).format("YYYY-MM-DD"),
        }).toEqual({
            hospitalNumber: "0000002",
            firstName: "Jane",
            lastName: "Doe",
            birthday: dayjs("1990-01-01").format("YYYY-MM-DD"),
            sex: "female",
        });
    });

    it("should return 404 status for not found", async () => {
        const res = await agent.get("/patients/999999");
        expect(res.status).toBe(404);
    });

    it("should return 201 status for create new patient", async () => {
        const res = await agent
            .post("/patients")
            .set("Content-Type", "application/json")
            .send({
                hospitalNumber: "0000003",
                firstName: "Smith",
                lastName: "Tower",
                birthday: dayjs("1990-01-01").toDate(),
                sex: "male",
            });

        const data = await db.patient.findFirst({
            where: {
                hospitalNumber: "0000003",
            },
        });

        expect(res.status).toBe(201);
        expect(data?.hospitalNumber).toBe("0000003");
        expect(data?.firstName).toBe("Smith");
        expect(data?.lastName).toBe("Tower");
        expect(data?.sex).toBe("male");
    });

    it("should return 204 status for update existed patient", async () => {
        const res = await agent
            .put("/patients/0000001")
            .set("Content-Type", "application/json")
            .send({
                hospitalNumber: "0000001",
                firstName: "John",
                lastName: "Smith",
                birthday: dayjs("1990-01-01").toISOString(),
                sex: "male",
            });
        expect(res.status).toBe(204);
        const data = await db.patient.findFirst({
            where: {
                hospitalNumber: "0000001",
            },
        });

        expect(data?.hospitalNumber).toBe("0000001");
        expect(data?.lastName).toBe("Smith");
    });

    it("should return 404 status for update not existed patient", async () => {
        const res = await agent
            .put("/patients/99999999")
            .set("Content-Type", "application/json")
            .send({
                hospitalNumber: "99999999",
                firstName: "Update",
                lastName: "Update",
                birthday: dayjs("1990-01-01").toISOString(),
                sex: "male",
            });

        expect(res.status).toBe(404);
    });

    it("should return 500 status for invalid payload on update operation", async () => {
        const res = await agent
            .put("/patients/0000001")
            .set("Content-Type", "application/json")
            .send({
                hospitalNumber: "0000002",
                firstName: "John",
                lastName: "Doe",
                birthday: dayjs("1990-01-01").toISOString(),
                sex: "male",
            });

        expect(res.status).toBe(500);
    });

    it("should return 500 status for duplicate creation", async () => {
        const res = await agent
            .post("/patients")
            .set("Content-Type", "application/json")
            .send({
                hospitalNumber: "0000002",
                firstName: "Jane",
                lastName: "Doe",
                birthday: dayjs("1990-01-01").toDate(),
                sex: "female",
            });
        expect(res.status).toBe(500);
    });

    it("should return 405 status for not allowed method", async () => {
        const res = await agent.delete("/patients");
        expect(res.status).toBe(405);
    });
});
