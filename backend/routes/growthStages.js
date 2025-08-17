import prisma from "../database/index.js";
import express from "express";

const router = express.Router();

//grabs available growth stage and xprequirements
router.get("/", async (request, response) => {
    try {
        const stage = await prisma.growthStageRequirement.findMany({
            orderBy: {
                stage: "asc"
            }
        });

        response.json(stage);
    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});