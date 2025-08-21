import prisma from "../database/index.js";

async function plantStages () {
    await prisma.growthStageRequirement.deleteMany();

    const stages = [
        { stage: "SEED", requiredXp: 0 },
        { stage: "SPROUT", requiredXp: 100 },
        { stage: "MATURE", requiredXp: 250 },
        { stage: "BLOOM", requiredXp: 500 },
    ];

    for (const s of stages) {
        await prisma.growthStageRequirement.create({
            data: {
                stage: s.stage,
                requiredXp: s.requiredXp
            }
        })
    }
}

plantStages()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

