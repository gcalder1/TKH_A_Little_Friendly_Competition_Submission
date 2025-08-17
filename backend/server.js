import express from "express";
import cors from "cors";
import prisma from "./database/index.js";
import usersRouter from "./routes/users.js";
import plantsRouter from "./routes/plants.js";
import tasksRouter from "./routes/tasks.js";
import userTasks from "./routes/userTasks.js";
import xpEvents from "./routes/xpEvents.js";
import growthStagesRouter from "./routes/growthStages.js"


const app = express();
const PORT = 8888;

app.use(cors())
app.use(express.json())

// app.get("/hello", async (request, response) => {
//     response.status(200).json({
//         success: "true",
//         message: "Hello world"
//     })
// })
//This was for test purposes only, will be removed later

app.use("/api/users", usersRouter);
app.use("/api/userTasks", userTasks);
app.use("/api/plants", plantsRouter);
app.use("/api/xpEvents", xpEvents);
// app.use("/api/categoryGoals");
app.use("/api/growthStages", growthStagesRouter);
app.use("/api/tasks", tasksRouter);


app.listen(PORT, () => {
    console.log(`This server is listening on port ${PORT}`)
})