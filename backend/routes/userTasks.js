import prisma from "../database/index.js";
import express from "express";

const router = express.Router();

//Grabs all tasks for a user based on the user's id
router.get("/user/:userId", async (request, response) => {
    const { userId } = request.params;
    const { status } = request.query; //incase we want to filter by
    // ?status=PENDING or ?status=COMPLETED or ?status=EXIPIRED

    try {
        const completionFilter = { userId };

        if (status) {
            completionFilter.status = status;
        }
        //If we are using the query to filter tasks, then we can filter this way
        //if not we wont filter and just grab them all

        const userTasks = await prisma.userTask.findMany({
            where: completionFilter,
            include: {
                task: true
            }
        });

        response.json(userTasks)

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

//assigns a task to a user
router.post("/createUserTask", async (request, response) => {

    const { userId, taskId } = request.body;

    try {
        const userTasks = await prisma.userTask.create({
            data: {
                userId,
                taskId,
                status: "PENDING",
                completedAt: null,
                xpAwarded: 0
            },
            include: {
                task: true,
                user: true
            }
        });
        //what is returned is the task information for that user and the user
        //information as well

        response.status(201).json(userTasks);

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

//Updates the userTask by marking a single userTask as complete and awards
//relevant XP [one task at a time]
router.put("/:id/complete", async (request, response) => {

    const { id } = request.params;

    try {
        
        const existingTask = await prisma.userTask.findUnique({
            where: {
                id
            },
            include: {
                task: true,
                user: true
            }
       });
       //We're looking for a task by it's id so that we can get the xp val from it

        if (!existingTask) {
            return response.status(404).json({
                error: "UserTask not found!"
            });
       }
       
        if (existingTask.status == "COMPLETED") {
            return response.status(400).json({
                error: "Task already completed!"
            });
        }

        if (existingTask.status == "EXPIRED") {
            return response.status(400).json({
                error: "This task is expired!"
            });
        }

        const xpValue = existingTask.task.baseXp || 0;
        //getting the xp val out of the task that our userTask is pointing
        //to to get the baseXp out of that task

        const updatedTask = await prisma.userTask.update({
            where: {
                id
            },
            data: {
                completedAt: new Date(),
                xpAwarded: xpValue,
                status: "COMPLETED"
            },
            include: {
                task: true,
                user: true
            }
        });

        //everytime a userTask is marked as completed, we create a new
        //log in our xpevent table, and we just want it to happen on it's
        //own
        await prisma.xPEvent.create({
            data: {
                userId: updatedTask.userId,
                amount: xpValue,
                source: "taskCompletion",
                meta: {
                    taskId: updatedTask.taskId,
                    taskName: updatedTask.task.name
                },
                userTaskId: updatedTask.id
            }
        });

        response.json(updatedTask);

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

//Alex sugg: Using the XP for frontend xp bar - Grabbing how much the user 
//has in xp so far
router.get("/user/:userId/totalXP", async (request, response) => {
    const { userId } = request.params;

    try {
        const { _sum } = await prisma.userTask.aggregate({
            where: {
                userId,
                status: "COMPLETED"
            },
            _sum: {
                xpAwarded: true
            }
        });
        //calcing the sum of all userTasks that are completed for specific user

        response.json({
            totalXP: _sum.xpAwarded || 0
        });

    } catch (error) {
        response.status(500).json({
            error: error.message
        })
    }
});

//We're deleting all userTasks once they've all been completed
//[===ONLY USE THIS AFTER CALC-ING PLAYER XP===]//
                    //[===DESTRUCTIVE ACTION===]//
router.delete("/user/:userId", async (request, response) => {
    const { userId } = request.params;

    try {
        const deletedUserTask = await prisma.userTask.deleteMany({
            where: {
                userId
            }
        });
        //deleting all the ones attached that that userId

        response.json({
            message: `Deleted ${deletedUserTask.count} task(s) for user ${userId}`
        });

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

export default router;