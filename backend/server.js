import express from "express";
import cors from "cors";
import usersRouter from "./routes/users.js";
import plantsRouter from "./routes/plants.js";
import tasksRouter from "./routes/tasks.js";
import userTasks from "./routes/userTasks.js";
import xpEvents from "./routes/xpEvents.js";
import growthStageRequirementRouter from "./routes/growthStageRequirement.js"
import categoryGoalsRouter from "./routes/categoryGoals.js"
import { authentication } from "./middleware/auth.js";

const app = express();
const PORT = 8888;

app.use(cors())
app.use(express.json())

app.use("/api/users", authentication, usersRouter);
app.use("/api/userTasks", authentication, userTasks);
app.use("/api/plants", authentication, plantsRouter);
app.use("/api/xpEvents", authentication, xpEvents);
app.use("/api/categoryGoals", authentication, categoryGoalsRouter);
app.use("/api/growthStageRequirement", authentication, growthStageRequirementRouter);
app.use("/api/tasks", authentication, tasksRouter);

//we're using the auth middleware on every endpoint because each endpoint
//exposes user personal information in some way in response obj


app.listen(PORT, () => {
    console.log(`This server is listening on port ${PORT}`)
});