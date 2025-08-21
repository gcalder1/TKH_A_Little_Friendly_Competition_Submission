import prisma from "../database/index.js";
import express from "express";

const router = express.Router();

//XP log of all xp events for specified user
router.get("/user/:userId/xpEvents", async (request, response) => {
    const { userId } = request.params;
    const { source, startDate, endDate } = request.query; //can also filter
    //by using ?source=taskCompletion&startDate=2025-08-16&endDate=2025-08-18
    //for example
    
    try {
        const filter = { userId };

        if (source) {
            filter.source = source;
        }

        if (startDate || endDate) {
            filter.createdAt = {};

            if (startDate) {
                filter.createdAt.gte = new Date(startDate);
            }

            if (endDate) {
                filter.createdAt.lte = new Date(endDate)
            }
        }

        const events = await prisma.xPEvent.findMany({
            where: filter,
            orderBy: {
                createdAt: "desc"
            },
            include: {
                userTask: {
                    include: {
                        task: true
                    }
                }
            }
        });

        response.json(events);

    } catch (error) {
        response.status(500).json({
            error: error.message
        });
    }
});

//We SHOULD NOT be deleting or UPDATING XPEvents. All XP, because they
//fixed within our table, should be fine as is. This table should only
//be server as a long. 

//If we feel in the future that we need to change the XP data or delete
//records of XP, then we can add a simple route that deletes the record
//by it's ID.
//                  - George C.

export default router;