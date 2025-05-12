import app from "./app.js";
import "dotenv/config.js";
import connectDB from "./db/mongo.js";

connectDB();

app.listen(process.env.PORT,()=>{
  console.log("El servidor esta en el purto "+process.env.PORT);
});