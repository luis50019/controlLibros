import { Router } from "express";
import ViewBookContoller from "../controllers/views.controllers.js";
const RouterView = Router();

RouterView.get("/",ViewBookContoller.home);
RouterView.get("/book",ViewBookContoller.book);

export default RouterView;