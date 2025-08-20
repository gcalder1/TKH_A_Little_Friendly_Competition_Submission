import prisma from "../database/index.js";
import express from "express";

const router = express.Router();


//We're going to get all existing users
router.get("/", async (request, response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                plants: true,
                userTasks: true,
                xpEvents: true
            },
        });

        //Grabbing necessary user data to share with the frontend

        response.json(users);

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

//We will create users
router.post("/", async (request, response) => {
    try {
        const { username, email, passwordHash } = request.body;

        const user = await prisma.user.create({
            data: {
                username,
                email,
                passwordHash
            },
        });

        response.json(user);

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

//This will grab a single user
router.get("/:id", async (request, response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { 
                id: request.params.id 
            },
            include: {
                plants: true,
                userTasks: true,
                xpEvents: true
            },
        });

        //We're grabbing the user by their id to retrieve specific user info
        //that frontend will use to display relevant game details

        if (!user) {
            return response.status(404).json({
                error: "User not found"
            });
        }

        response.json(user);

    } catch (error) {
        response.status(500).json({
            error: error.message
        })
    }
})

//This updates users
router.put("/:id", async (request, response) => {
    try {
        const user = await prisma.user.update({
            where: { id: request.params.id },
            data: request.body,
        });

        //We can have the frontend send changes to different plant, userTask, or
        //XP related details, which the backend will use to update that record?

        response.json(user);

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

//This is to delete users
router.delete("/:id", async (request, response) => {
    try {
        await prisma.user.delete({
            where: { id: request.params.id },
        });

        response.json({
            message: "User deleted"
        });

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

export default router;