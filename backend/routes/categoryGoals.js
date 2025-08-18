import prisma from "../database/index.js";
import express from "express";

const router = express.Router();

//Grabs all CategoryGoals
router.get("/", async (request, response) => {
    try {
        const goals = await prisma.categoryGoal.findMany({
            orderBy: {
                room: 'asc'
            }
        });

        response.json(goals);

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

//Grabs a single CategoryGoal by it's id
router.get("/:id", async (response, request) => {
    const { id } = request.params;

    try {
        const goal = await prisma.categoryGoal.findUnique({
            where: {
                id
            }
        });

        if (!goal) {
            return response.status(404).json({
                error: "CategoryGoal not found"
            });
        }

        response.json(goal);

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

//Checking for CategoryGoal completion based on per-cycle rotation
router.post("/checkProgress/:userId", async (request, response) => {
    const { userId } = request.params;

    try {
        const goals = await prisma.categoryGoal.findMany({
            where: {
                isActive: true
            }
        });

        const completedGoals = [];
        const now = new Date();

        for (const goal of goals) {
            let dateFilter = {};

            //finding current time window for related goal
            if (goal.frequency === "DAILY") {

                dateFilter = {
                    gte: new Date(now.setHours(0,0,0,0))
                };
            } else if (goal.frequency === "WEEKLY") {
                const startOfWeek = new Date();

                startOfWeek.setDate(now.getDate() - now.getDay()); //starting on sunday
                startOfWeek.setHours(0,0,0,0);
                
                dateFilter = {
                    gte: startOfWeek
                };
            } else if (goal.frequency === "MONTHLY") {
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); 
                
                dateFilter = {
                    gte: startOfMonth
                };
            }

            //count matching tasks in current time window
            const taskCount = await prisma.userTask.count({
                where: {
                    userId,
                    task: {
                        room: goal.room,
                        subcategory: goal.subcategory
                    },
                    completedAt: dateFilter
                }
            });

            //checking if requirements for category goal have been met, task wise
            if (taskCount >= goal.requiredTasks) {
                completedGoals.push(goal);

                //if they were already rewarded based on current cycle
                const alreadyAwarded = await prisma.xPEvent.findFirst({
                    where: {
                        userId,
                        source: "categoryGoal",
                        meta: {
                            path: ["goalId"],
                            equals: goal.id
                        },
                        createdAt: dateFilter
                    }
                });

                if (!alreadyAwarded) {
                    await prisma.xPEvent.create({
                        data: {
                            userId,
                            amount: 25,
                            source: `${goal.id}-${goal.frequency}`,
                            meta: {
                                goalId: goal.id,
                                room: goal.room,
                                subcategory: goal.subcategory,
                                frequency: goal.frequency
                            }
                        }
                    });
                }
            }
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                username: true
            }
        });

        response.json({
            message: `Progress checked for ${user.username ?? "Unknown User"}`,
            completedGoals
        });

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

//Updating a CategoryGoal via ID
router.put("/:id", async (request, response) => {
    const { id } = request.params;
    const { room, subcategory, frequency, requiredTasks, isActive } = request.body;

    try {
        const updatedGoal = await prisma.categoryGoal.update({
            where: {
                id
            },
            data: {
                room,
                subcategory,
                frequency,
                requiredTasks,
                isActive
            }
        });
        
        response.json(updatedGoal)
        
    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

export default router;