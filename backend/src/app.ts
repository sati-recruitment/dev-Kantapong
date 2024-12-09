import express from "express";
import cors from "cors";
// import morgan from "morgan";
import { patientRouter } from "@/modules/patient";
import { encounterRouter } from "./modules/encounter";

export const app = express();

app.use(cors());
// app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/patients", patientRouter);
app.use("/encounters", encounterRouter);
