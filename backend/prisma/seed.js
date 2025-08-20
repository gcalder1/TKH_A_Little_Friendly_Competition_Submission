import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Path to your JSON catalog of tasks
const TASKS_JSON_PATH = path.join(process.cwd(), 'tasks.json');

const XP_BY_FREQ = { DAILY: 5, WEEKLY: 10, MONTHLY: 15 };

function flattenTasks(catalog) {
  const out = [];
  const FREQS = ['DAILY', 'WEEKLY', 'MONTHLY'];

  for (const [room, branch] of Object.entries(catalog)) {
    for (const [subcategory, leaf] of Object.entries(branch)) {
      for (const freq of FREQS) {
        const items = leaf[freq] || [];
        for (const t of items) {
          const baseXp = typeof t.xp === 'number' ? t.xp : (XP_BY_FREQ[freq] ?? 5);
          out.push({
            name: t.name,
            room,                // must match RoomType enum
            subcategory,         // must match SubcategoryType enum
            frequency: freq,     // must match Frequency enum
            baseXp,
            isActive: true,
          });
        }
      }
    }
  }
  return out;
}

async function main() {
  if (!fs.existsSync(TASKS_JSON_PATH)) {
    throw new Error(
      `Missing tasks JSON at ${TASKS_JSON_PATH}. Copy your canvas JSON to prisma/tasks.json`
    );
  }

  const raw = fs.readFileSync(TASKS_JSON_PATH, 'utf-8');
  const catalog = JSON.parse(raw);
  const tasks = flattenTasks(catalog);

  if (!Array.isArray(tasks) || tasks.length === 0) {
    console.log('No tasks to insert. Exiting.');
    return;
  }

  const result = await prisma.task.createMany({
    data: tasks,
    skipDuplicates: true, // respects @@unique([name, room, subcategory, frequency])
  });

  console.log(`Inserted ${result.count} tasks (duplicates, if any, were skipped).`);
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
