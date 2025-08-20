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

//This will show us use progress based on growth reqs & user xp stats
router.get("/user/:userId/progress", async (request, response) => {
    const { userId } = request.params;
    
    try {

        //total xp
        const { _sum } = await prisma.userTask.aggregate({
            where: {
                userId,
                status: "COMPLETED"
            },
            _sum: {
                xpAwarded: true
            }
        });

        const totalXP = _sum.xpAwarded;

        //growth stages
        const stage = await prisma.growthStageRequirement.findMany({
            orderBy: {
                stage: "asc"
            }
        });

        //find the values current stage and the next stage based on user xp
        let currentStage = null;
        let nextStage = null;
        
        for (let i = 0; i < stage.length; i++) {
            if (totalXP >= stage[i].requiredXp) {
                currentStage = stage[i],
                nextStage = stage[i + 1] || null;
            }
        }

        response.json({
            userId,
            totalXP,
            currentStage,
            nextStage,
            progressToNext: nextStage ? 
            ((totalXP - currentStage.requiredXp) / (nextStage.requiredXp - currentStage.requiredXp)) * 100 
            : 
            100
        });

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

export default router;