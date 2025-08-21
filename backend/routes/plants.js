import prisma from "../database/index.js";
import express from "express";

const router = express.Router();

//Gets all plants for the current user
router.get("/", async (request, response) => {
    try {
        const plants = await prisma.plant.findMany({
            include: {
                owner: true
            }
        });

        response.json(plants);

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

//This will get a single plant based on plant id
router.get("/:id", async (request, response) => {
    try {
        const plant = await prisma.plant.findUnique({
            where: {
                id: request.params.id
            },
            include: {
                owner: true
            }
        });

        //and show the associated owner

        if (!plant) {
            return response.status(404).json({
                error: "Plant not found"
            });
        }

        response.json(plant);

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

//We are creating a plant for a specific user
router.post("/:id/generate", async (request, response) => {

    const { nickname, growthStage, ownerId } = request.body; //destructuring for values

    if(!growthStage || typeof growthStage !== "string") {
        return response.status(400).json({
            error: "Growth State is required and must be a string"
        })
    }

    if (!ownerId || typeof ownerId != "string") {
        return response.status(400).json({
            error: "Owner ID is required and must be a string"
        })
    }

    //err checking

    try {
        const newPlant = await prisma.plant.create({
            data: {
                nickname, 
                growthStage, 
                ownerId
            }
        });
        //creating new plant using data from req, returning it in response

        response.status(201).json(newPlant);

    } catch (error) {
        response.status(500).json({
            error: "Failed to create plant"
        });
    }
});

//We are updating a specific plant based on that plant's id
router.put("/:id/updatePlantUnique", async (request, response) => {

    const { nickname, growthStage, health, xp } = request.body;

    try {
        const updatedPlant = await prisma.plant.update({
            where: {
                id: request.params.id
            },
            data: {
                nickname, 
                growthStage, 
                health: parseInt(health, 10), 
                xp: parseInt(xp, 10)
            }
        });

        response.json(updatedPlant);

    } catch (error) {
        response.status(500).json({
            error: "Failed to update plant"
        });
    }
});

//We are deleting a plant based on plant id
router.delete("/:id/delete", async (request, response) => {
    try {
        await prisma.plant.delete({
            where: {
                id: request.params.id
            }
        });

        response.json({
            message: "Plant deleted successfully"
        });

    } catch (error) {
        response.status(500).json({
            error: "Failed to delete plant"
        });
    }
});

export default router;