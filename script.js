let courses = [];
let selectedCategory = "Todos";

const coursesContainer = document.getElementById("coursesContainer");
const searchInput = document.getElementById("searchInput");
const courseDetail = document.getElementById("courseDetail");
const modalContent = document.getElementById("modalContent");
const buttons = document.querySelectorAll(".buttons button");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");


courseDetail.style.display = "none";

fetch("courses.json")
  .then(response => response.json())
  .then(data => {
    courses = data;
    showCourses(courses);
  })
  .catch(error => {
    coursesContainer.innerHTML = "<p>Error al cargar los cursos.</p>";
    console.log(error);
  });

function showCourses(courseList) {
  coursesContainer.innerHTML = "";

  if (courseList.length === 0) {
    coursesContainer.innerHTML = "<p>No se encontraron cursos.</p>";
    return;
  }

  courseList.forEach(course => {
    const card = document.createElement("article");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${course.imagen}" alt="${course.nombre}">
      <div class="card-content">
        <h3>${course.nombre}</h3>
        <p><strong>Categoría:</strong> ${course.categoria}</p>
        <p><strong>Nivel:</strong> ${course.nivel}</p>
        <p><strong>Profesor:</strong> ${course.profesor}</p>
        <p><strong>Duración:</strong> ${course.duracion}</p>
        <p><strong>Precio:</strong> S/ ${course.precio}</p>
        <p>
          <strong>Estado:</strong> 
          <span class="${course.disponible ? "available" : "unavailable"}">
            ${course.disponible ? "Disponible" : "No disponible"}
          </span>
        </p>
        <button onclick="showDetail(${course.id})">Ver más</button>
      </div>
    `;

    coursesContainer.appendChild(card);
  });
}

function filterCourses() {
  const searchText = searchInput.value.toLowerCase();

  const filtered = courses.filter(course => {
    const matchesCategory =
      selectedCategory === "Todos" || course.categoria === selectedCategory;

    const matchesSearch =
      course.nombre.toLowerCase().includes(searchText);

    return matchesCategory && matchesSearch;
  });

  showCourses(filtered);
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;
    filterCourses();
  });
});

searchInput.addEventListener("input", filterCourses);

function showDetail(id) {
  const course = courses.find(item => item.id === id);

  courseDetail.style.display = "flex";

  modalContent.innerHTML = `
    <span class="close" onclick="closeDetail()">&times;</span>

    <h2>${course.nombre}</h2>

    <p>
      <span class="${course.disponible ? "available" : "unavailable"}">
        ${course.disponible ? "Disponible" : "No disponible"}
      </span>
    </p>

    <p>${course.descripcion}</p>
    <p><strong>Profesor:</strong> ${course.profesor}</p>
    <p><strong>Duración:</strong> ${course.duracion}</p>
    <p><strong>Nivel:</strong> ${course.nivel}</p>
    <p><strong>Precio:</strong> S/ ${course.precio}</p>

    <h3>Temario:</h3>
    <ul>
      ${course.temario.map(topic => `<li>${topic}</li>`).join("")}
    </ul>
  `;
}

function closeDetail() {
  courseDetail.style.display = "none";
}

contactForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const courseInterest = document.getElementById("courseInterest").value.trim();
  const message = document.getElementById("message").value.trim();

  if (name === "" || email === "" || courseInterest === "" || message === "") {
    formMessage.textContent = "Por favor, completa todos los campos.";
    formMessage.style.color = "red";
  } else {
    formMessage.textContent = "Consulta enviada correctamente.";
    formMessage.style.color = "green";
    contactForm.reset();
  }
});
