import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";
import plantsRouter from "./routes/plants.js";
import tasksRouter from "./routes/tasks.js";
import userTasks from "./routes/userTasks.js";
import xpEvents from "./routes/xpEvents.js";
import growthStageRequirementRouter from "./routes/growthStageRequirement.js"
import categoryGoalsRouter from "./routes/categoryGoals.js"

const app = express();
const PORT = 8888;

app.use(cors())
app.use(express.json())

app.use("/api/users", usersRouter);
app.use("/api/userTasks", userTasks);
app.use("/api/plants", plantsRouter);
app.use("/api/xpEvents", xpEvents);
app.use("/api/categoryGoals", categoryGoalsRouter);
app.use("/api/growthStageRequirement", growthStageRequirementRouter);
app.use("/api/tasks", tasksRouter);


app.listen(PORT, () => {
    console.log(`This server is listening on port ${PORT}`)
});