import express from "express";

const app = express();
const PORT = 8888;

app.use = express.json();

// app.get("/hello", async (request, response) => {
//     response.status(200).json({
//         success: "true",
//         message: "Hello world"
//     })
// })
//This was for test purposes only, will be removed later

app.listen(PORT, () => {
    console.log(`This app is listening on port ${PORT}`)
})