import prisma from "../database/index.js";
import express from "express";

const router = express.Router();

//Grabs all tasks
router.get("/", async (request, response) => {
    try {
        const tasks = await prisma.task.findMany({
            select: {
                id: true,
                name: true,
                room: true,
                subcategory: true,
                baseXp: true,
                isActive: true
            }
    });

    response.json(tasks);
        
    } catch (error) {
        response.status(500).json({
            error: error.message
        })
    }
    
});

//grabs a task by that tasks ID
router.get("/:id", async (request, response) => {
    try {
        const task = await prisma.task.findUnique({
            where: {
                id: request.params.id
            }
        });

        if (!task) {
            return response.status(404).json({
                error: "Task not found"
            });
        }

        response.json(task);

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

//grabbing tasks by room
router.get("/room/:room", async (request, response) => {
    const { room } = request.params;

    try {
        const roomTask = await prisma.task.findMany({
            where: {
                room: {
                    equals: room
                }
            },
            select: {
                id: true,
                name: true,
                room: true,
                subcategory: true,
                baseXp: true,
                isActive: true
            }
        });

        response.json(roomTask);

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

export default router;