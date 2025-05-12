import mongoose from "mongoose";
import libros from "../models/libro.model.js"; // Asegúrate de que la ruta sea correcta

class BookController {
  static async bookRating(req, res) {
    try {
      // Obtener algunos libros destacados para la página de inicio
      const destacados = await libros
        .find()
        .sort({ yearReleased: -1 })
        .limit(3);
      res.json({ libros: destacados }).status(200);
    } catch (error) {
      console.error("Error al cargar la página de inicio:", error);
      res.status(500).render("error", {
        message: "Error al cargar la página de inicio",
      });
    }
  }

  static async book(req, res) {
    try {
      // Obtener todos los libros para la página principal
      const libros = await libros.find().sort({ title: 1 });
      res.status(200).json({ libros: libros });
    } catch (error) {
      console.error("Error al obtener los libros:", error);
      res.status(500).render("error", {
        message: "Error al obtener la lista de libros",
      });
    }
  }

  // Obtener todos los libros (API)
  static async getAllBooks(req, res) {
    try {
      const books = await libros.find();
      res.status(200).json({ data: books });
    } catch (error) {
      console.error("Error al obtener todos los libros:", error);
      res.status(500).json({
        error: "Error al obtener los libros",
      });
    }
  }

  // Obtener un libro por su ID
  static async getBookById(req, res) {
    try {
      const { id } = req.params;

      const book = await libros.findOne({ id: id });

      if (!book) {
        return res.status(404).json({ error: "Libro no encontrado" });
      }

      res.status(200).json(book);
    } catch (error) {
      console.error("Error al obtener el libro por ID:", error);
      res.status(500).json({
        error: "Error al obtener el libro",
      });
    }
  }

  static async getInfoBookById(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID de libro no válido" });
      }

      const libro = await libros.findById(id);

      if (!libro) {
        return res.status(404).json({ error: "Libro no encontrado" });
      }

      res.status(200).json(libro);
    } catch (error) {
      console.error("Error al obtener el libro por ID:", error);
      res.status(500).json({
        error: "Error al obtener el libro",
      });
    }
  }

  // Obtener libros por año de publicación
  static async getBooksByYear(req, res) {
    try {
      const { year } = req.params;
      const yearNumber = parseInt(year);

      if (isNaN(yearNumber)) {
        return res.status(400).json({ error: "Año no válido" });
      }

      const booksFounds = await libros.find({ yearReleased: yearNumber });

      if (booksFounds.length === 0) {
        return res.status(404).json({
          message: "No se encontraron libros publicados en ese año",
        });
      }

      res.status(200).json(booksFounds);
    } catch (error) {
      console.error("Error al obtener libros por año:", error);
      res.status(500).json({
        error: "Error al obtener libros por año",
      });
    }
  }

  // Obtener libros por número de edición
  static async getBooksByEdition(req, res) {
    try {
      const { edition } = req.params;
      const editionNumber = parseInt(edition);

      if (isNaN(editionNumber)) {
        return res.status(400).json({ error: "Número de edición no válido" });
      }

      const booksFounds = await libros.find({ editionNumber: editionNumber });
      if (booksFounds.length === 0) {
        return res.status(404).json({
          message: `No se encontraron libros con la edición número ${editionNumber}`,
        });
      }

      res.status(200).json(booksFounds);
    } catch (error) {
      console.error("Error al obtener libros por edición:", error);
      res.status(500).json({
        error: "Error al obtener libros por edición",
      });
    }
  }

  // Crear un nuevo libro
  static async createBook(req, res) {
    try {
      const { title, author, yearReleased, editionNumber, genre, description } =
        req.body;

      // Validación básica
      if (
        !title ||
        !author ||
        !yearReleased ||
        !editionNumber ||
        !genre ||
        !description
      ) {
        return res.status(400).json({
          error: "Todos los campos son requeridos",
        });
      }

      const booksCreates = await libros.find();
      const idNewBook = booksCreates.length + 1;

      const nuevoLibro = new libros({
        title,
        author,
        yearReleased,
        editionNumber,
        genre,
        description,
        id: idNewBook,
      });

      const libroGuardado = await nuevoLibro.save();
      res.status(201).json(libroGuardado);
    } catch (error) {
      console.error("Error al crear el libro:", error);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          error: error.message,
        });
      }

      res.status(500).json({
        error: "Error al crear el libro",
      });
    }
  }

  // Actualizar un libro existente
  static async updateBook(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID de libro no válido" });
      }

      const { title, author, yearReleased, editionNumber, genre, description } =
        req.body;

      const libroActualizado = await libros.findByIdAndUpdate(
        id,
        { title, author, yearReleased, editionNumber, genre, description },
        { new: true, runValidators: true }
      );

      if (!libroActualizado) {
        return res.status(404).json({ error: "Libro no encontrado" });
      }

      res.status(200).json(libroActualizado);
    } catch (error) {
      console.error("Error al actualizar el libro:", error);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          error: error.message,
        });
      }

      res.status(500).json({
        error: "Error al actualizar el libro",
      });
    }
  }

  // Eliminar un libro
  static async deleteBook(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID de libro no válido" });
      }

      const libroEliminado = await libros.findByIdAndDelete(id);

      if (!libroEliminado) {
        return res.status(404).json({ error: "Libro no encontrado" });
      }

      res.status(200).json({
        message: "Libro eliminado correctamente",
      });
    } catch (error) {
      console.error("Error al eliminar el libro:", error);
      res.status(500).json({
        error: "Error al eliminar el libro",
      });
    }
  }
}

export default BookController;
