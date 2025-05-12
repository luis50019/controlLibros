const booksContainer = document.getElementById("books-container");
const bookModal = document.getElementById("book-modal");
const modalTitle = document.getElementById("modal-title");
const bookForm = document.getElementById("book-form");
const addBookBtn = document.getElementById("add-book-btn");
const closeModalBtn = document.querySelector(".close-modal");
const cancelBtn = document.getElementById("cancel-btn");
const loadingElement = document.getElementById("loading");
const buttonSerch = document.getElementById("btn-search");
// Filtros
const searchInput = document.getElementById("search");
const year = document.getElementById("year-from");

// URL base de tu API
const API_URL = "https://controllibros.onrender.com"; // Ajusta según tu configuración

// Mostrar estado de carga
function showLoading(show) {
  loadingElement.style.display = show ? "block" : "none";
  booksContainer.style.display = show ? "none" : "grid";
}

// Mostrar libros en la página
async function renderBooks() {
  showLoading(true);

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Error al obtener los libros");
    }
    const libros = await response.json();
    booksContainer.innerHTML = "";
    if (libros.data.length === 0) {
      booksContainer.innerHTML = `
                        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #7f8c8d;">
                            No se encontraron libros en la biblioteca.
                        </div>
                    `;
      return;
    }

    libros.data.forEach((book) => {
      const bookCard = document.createElement("div");
      bookCard.className = "book-card";
      bookCard.innerHTML = `
                        <div class="book-cover">
                            ${book.title.charAt(0)}${book.author.charAt(0)}
                        </div>
                        <div class="book-info">
                            <h3 class="book-title">${book.title}</h3>
                            <p class="book-author">${book.author}</p>
                            <div class="book-meta">
                                <span>Año: ${book.yearReleased}</span>
                                <span>Edición: ${book.editionNumber}ª</span>
                            </div>
                            <p class="book-description">${book.description}</p>
                            <div class="book-actions">
                                <button class="btn edit-btn" data-id="${
                                  book._id
                                }">Editar</button>
                                <button class="btn btn-danger delete-btn" data-id="${
                                  book._id
                                }">Eliminar</button>
                            </div>
                        </div>
                    `;

      booksContainer.appendChild(bookCard);
    });

    // Agregar event listeners a los botones de editar y eliminar
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const bookId = e.target.getAttribute("data-id");
        editBook(bookId);
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const bookId = e.target.getAttribute("data-id");
        if (confirm("¿Estás seguro de que deseas eliminar este libro?")) {
          deleteBook(bookId);
        }
      });
    });
  } catch (error) {
    console.log("Error:", error);
    booksContainer.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #e74c3c;">
                        Error al cargar los libros: ${error.message}
                    </div>
                `;
  } finally {
    showLoading(false);
  }
}

// Filtrar libros localmente (podrías implementar filtrado en el backend)
document.getElementById("btn-search-id").addEventListener("click", async () => {
  const id = document.getElementById("search-id").value.trim();
  if (!id) return alert("Ingresa un ID");

  try {
    showLoading(true);
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Libro no encontrado");
    const book = await res.json();

    booksContainer.innerHTML = "";
    renderSingleBook(book);
  } catch (error) {
    booksContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
  } finally {
    showLoading(false);
  }
});

document
  .getElementById("btn-search-year")
  .addEventListener("click", async () => {
    const year = document.getElementById("search-year").value.trim();
    if (!year) return alert("Ingresa un año");

    try {
      showLoading(true);
      const res = await fetch(`${API_URL}/year/${year}`);
      const books = await res.json();

      booksContainer.innerHTML = "";
      books.forEach(renderSingleBook);
    } catch (error) {
      booksContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
    } finally {
      showLoading(false);
    }
  });

document
  .getElementById("btn-search-edition")
  .addEventListener("click", async () => {
    const edition = document.getElementById("search-edition").value.trim();
    if (!edition) return alert("Ingresa un número de edición");

    try {
      showLoading(true);
      const res = await fetch(`${API_URL}/edition/${edition}`);
      const books = await res.json();

      booksContainer.innerHTML = "";
      books.forEach(renderSingleBook);
    } catch (error) {
      booksContainer.innerHTML = `<p style="color:red;">${error.message}</p>`;
    } finally {
      showLoading(false);
    }
  });
function renderSingleBook(book) {
  const bookCard = document.createElement("div");
  bookCard.className = "book-card";
  bookCard.innerHTML = `
        <div class="book-cover">${book.title.charAt(0)}${book.author.charAt(
    0
  )}</div>
        <div class="book-info">
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">${book.author}</p>
            <div class="book-meta">
                <span>Año: ${book.yearReleased}</span>
                <span>Edición: ${book.editionNumber}ª</span>
            </div>
            <p class="book-description">${book.description}</p>
            <div class="book-actions">
                <button class="btn edit-btn" data-id="${
                  book._id
                }">Editar</button>
                <button class="btn btn-danger delete-btn" data-id="${
                  book._id
                }">Eliminar</button>
            </div>
        </div>
    `;
  booksContainer.appendChild(bookCard);
}

// Abrir modal para agregar libro
function openAddBookModal() {
  modalTitle.textContent = "Agregar Nuevo Libro";
  bookForm.reset();
  document.getElementById("book-id").value = "";
  bookModal.style.display = "flex";
}

// Abrir modal para editar libro
async function editBook(bookId) {
  try {
    showLoading(true);
    const response = await fetch(`${API_URL}/info/${bookId}`);

    if (!response.ok) {
      throw new Error("Libro no encontrado");
    }

    const book = await response.json();

    modalTitle.textContent = "Editar Libro";
    document.getElementById("book-id").value = book._id;
    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("year").value = book.yearReleased;
    document.getElementById("edition").value = book.editionNumber;
    document.getElementById("genre").value = book.genre;
    document.getElementById("description").value = book.description;

    bookModal.style.display = "flex";
  } catch (error) {
    console.error("Error al cargar el libro:", error);
    alert(`Error al cargar el libro: ${error.message}`);
  } finally {
    showLoading(false);
  }
}

// Eliminar libro
async function deleteBook(bookId) {
  try {
    showLoading(true);
    const response = await fetch(`${API_URL}/${bookId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el libro");
    }

    await renderBooks();
    alert("Libro eliminado correctamente");
  } catch (error) {
    console.error("Error:", error);
    alert(`Error al eliminar el libro: ${error.message}`);
  } finally {
    showLoading(false);
  }
}

// Guardar libro (agregar o actualizar)
async function saveBook(event) {
  event.preventDefault();

  const bookId = document.getElementById("book-id").value;
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const edition = document.getElementById("edition").value;
  const genre = document.getElementById("genre").value;
  const description = document.getElementById("description").value;

  const bookData = {
    title,
    author,
    yearReleased: parseInt(year),
    editionNumber: parseInt(edition),
    genre,
    description,
  };

  try {
    showLoading(true);
    let response;

    if (bookId) {
      // Actualizar libro existente
      response = await fetch(`${API_URL}/${bookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });
    } else {
      // Crear nuevo libro
      response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al guardar el libro");
    }

    await renderBooks();
    bookModal.style.display = "none";
    alert(`Libro ${bookId ? "actualizado" : "agregado"} correctamente`);
  } catch (error) {
    console.error("Error:", error);
    alert(`Error: ${error.message}`);
  } finally {
    showLoading(false);
  }
}

addBookBtn.addEventListener("click", openAddBookModal);
closeModalBtn.addEventListener(
  "click",
  () => (bookModal.style.display = "none")
);
cancelBtn.addEventListener("click", () => (bookModal.style.display = "none"));
bookForm.addEventListener("submit", saveBook);

// Cerrar modal al hacer clic fuera del contenido
bookModal.addEventListener("click", (e) => {
  if (e.target === bookModal) {
    bookModal.style.display = "none";
  }
});

// Inicializar la página
document.addEventListener("DOMContentLoaded", renderBooks);
