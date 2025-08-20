import prisma from "../database/index.js";

async function categoryGoalSeed () {

    await prisma.categoryGoal.deleteMany();

    await prisma.categoryGoal.createMany({
        data: [
            { 
                room: "BATHROOM",
                subcategory: "HOME_CARE",
                requiredTasks: 2,
                frequency: "DAILY",
                isActive: true
            },
            { 
                room: "BATHROOM",
                subcategory: "PERSONAL_CARE",
                requiredTasks: 2,
                frequency: "DAILY",
                isActive: true
            },
            { 
                room: "BEDROOM",
                subcategory: "HOME_CARE",
                requiredTasks: 2,
                frequency: "DAILY",
                isActive: true
            },
            { 
                room: "BEDROOM",
                subcategory: "PERSONAL_CARE",
                requiredTasks: 2,
                frequency: "DAILY",
                isActive: true
            },
            { 
                room: "KITCHEN",
                subcategory: "HOME_CARE",
                requiredTasks: 2,
                frequency: "DAILY",
                isActive: true
            },
            { 
                room: "KITCHEN",
                subcategory: "PERSONAL_CARE",
                requiredTasks: 2,
                frequency: "DAILY",
                isActive: true
            },
            { 
                room: "LIVINGROOM",
                subcategory: "HOME_CARE",
                requiredTasks: 2,
                frequency: "DAILY",
                isActive: true
            },
            { 
                room: "LIVINGROOM",
                subcategory: "PERSONAL_CARE",
                requiredTasks: 2,
                frequency: "DAILY",
                isActive: true
            }
        ]
    });
}

categoryGoalSeed()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });