import express, { json } from "express";
import expressLayouts from "express-ejs-layouts";
import path from "node:path";
import { fileURLToPath } from "node:url";
import morgan from "morgan";
import RouterView from "./routes/viewBook.router.js";
import RouterBook from "./routes/book.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/layout");


app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);
app.use(json());
app.use(morgan("dev"));

app.use("/", RouterView);
app.use("/api",RouterBook);

export default app;
