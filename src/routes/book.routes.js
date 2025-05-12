import { Router } from "express";
import BookController from "../controllers/book.controller.js";
const RouterBook  = Router();

RouterBook.get("/book/", BookController.getAllBooks);
RouterBook.get("/book/:id", BookController.getBookById);
RouterBook.get("/book/info/:id", BookController.getInfoBookById);
RouterBook.post("/book/", BookController.createBook);
RouterBook.put("/book/:id", BookController.updateBook);
RouterBook.delete("/book/:id", BookController.deleteBook);
RouterBook.get("/book/year/:year", BookController.getBooksByYear);
RouterBook.get("/book/edition/:edition", BookController.getBooksByEdition);


export default RouterBook;
