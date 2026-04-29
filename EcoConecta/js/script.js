let categoriaActual = "Todos";
// ======================
// IMAGEN POR DEFECTO (MEJORADA)
// ======================
function imagenPorDefecto(nombre, categoria) {
  nombre = nombre.toLowerCase();
  categoria = categoria.toLowerCase();

  // 💻 ELECTRÓNICOS
  if (
    categoria === "electronico" ||
    nombre.includes("laptop") ||
    nombre.includes("computadora") ||
    nombre.includes("celular")
  ) {
    return "https://images.unsplash.com/photo-1517336714731-489689fd1ca8";
  }

  // 🏯 HOGAR
  if (
    categoria === "hogar" ||
    nombre.includes("colchon") ||
    nombre.includes("cama") ||
    nombre.includes("mesa") ||
    nombre.includes("silla")
  ) {
    return "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85";
  }

  // 📚 LIBROS
  if (
    categoria === "libro" ||
    nombre.includes("libro")
  ) {
    return "https://images.unsplash.com/photo-1512820790803-83ca734da794";
  }

  // 👕 ROPA
  if (
    categoria === "ropa" ||
    nombre.includes("ropa") ||
    nombre.includes("camisa")
  ) {
    return "https://images.unsplash.com/photo-1521335629791-ce4aec67dd53";
  }

  // 🔄 DEFAULT
  return "https://images.unsplash.com/photo-1492724441997-5dc865305da7";
}

// ======================
// GUARDAR
// ======================
function guardar(event) {
  if (event) event.preventDefault();

  let nombre = document.getElementById("nombre").value.trim();
  let descripcion = document.getElementById("descripcion").value.trim();
  let tipo = document.getElementById("tipo").value;
  let categoria = document.getElementById("categoria").value;
  let archivos = document.getElementById("imagen").files;

  if (!nombre || !descripcion) {
    alert("Completa nombre y descripción");
    return;
  }

  let imagenes = [];

  // 🔥 SIN IMAGEN → USAR AUTOMÁTICA
  if (archivos.length === 0) {
    imagenes.push(imagenPorDefecto(nombre, categoria));
    guardarObjeto(nombre, descripcion, tipo, categoria, imagenes);
    return;
  }

  let contador = 0;

  for (let i = 0; i < archivos.length; i++) {
    let reader = new FileReader();

    reader.onload = function(e) {
      imagenes.push(e.target.result);
      contador++;

      if (contador === archivos.length) {
        guardarObjeto(nombre, descripcion, tipo, categoria, imagenes);
      }
    };

    reader.readAsDataURL(archivos[i]);
  }
}

// ======================
// GUARDAR OBJETO
// ======================
function guardarObjeto(nombre, descripcion, tipo, categoria, imagenes) {
  let objetos = JSON.parse(localStorage.getItem("objetos")) || [];

  let objeto = {
    nombre,
    descripcion,
    tipo,
    categoria,
    imagenes
  };

  objetos.push(objeto);
  localStorage.setItem("objetos", JSON.stringify(objetos));

  window.location.href = "index.html";
}

// ======================
// MOSTRAR
// ======================
function mostrar(lista = null) {
  let contenedor = document.getElementById("contenedor");
  if (!contenedor) return;

  let objetos = JSON.parse(localStorage.getItem("objetos")) || [];

  contenedor.innerHTML = "";

  let base = lista || objetos;

  let filtrados = base.filter(obj => {
    return categoriaActual === "Todos" || obj.categoria === categoriaActual;
  });

  if (filtrados.length === 0) {
    contenedor.innerHTML = "<p style='text-align:center'>No hay objetos publicados aún</p>";
    return;
  }

  filtrados.forEach((obj, index) => {
    let card = document.createElement("div");
    card.className = "card";

    let imgPrincipal = obj.imagenes[0]
      ? `<img src="${obj.imagenes[0]}" class="img-principal" onclick="verImagen('${obj.imagenes[0]}')">`
      : "";

    let miniaturas = "";
    if (obj.imagenes.length > 1) {
      miniaturas = `<div class="miniaturas">`;
      obj.imagenes.forEach(img => {
        miniaturas += `<img src="${img}" onclick="verImagen('${img}')">`;
      });
      miniaturas += `</div>`;
    }

    card.innerHTML = `
      ${imgPrincipal}
      <h3>${obj.nombre}</h3>
      <p>${obj.descripcion}</p>
      <button>${obj.tipo}</button>
      <button onclick="eliminar(${index})">Eliminar</button>
      ${miniaturas}
    `;

    contenedor.appendChild(card);
  });
}

// ======================
// ELIMINAR
// ======================
function eliminar(index) {
  let objetos = JSON.parse(localStorage.getItem("objetos")) || [];

  if (confirm("¿Eliminar este objeto?")) {
    objetos.splice(index, 1);
    localStorage.setItem("objetos", JSON.stringify(objetos));
    mostrar();
  }
}

// ======================
// MODAL
// ======================
function verImagen(src) {
  let modal = document.getElementById("modal");
  let img = document.getElementById("imgModal");

  modal.style.display = "flex";
  img.src = src;
}

function cerrarModal() {
  document.getElementById("modal").style.display = "none";
}

// ======================
// FILTRAR
// ======================
function filtrar(cat) {
  categoriaActual = cat;
  mostrar();
}

// ======================
// BUSCAR
// ======================
function buscar() {
  let texto = document.getElementById("buscador").value.toLowerCase();

  let objetos = JSON.parse(localStorage.getItem("objetos")) || [];

  let filtrados = objetos.filter(obj =>
    obj.nombre.toLowerCase().includes(texto) ||
    obj.descripcion.toLowerCase().includes(texto)
  );

  mostrar(filtrados);
}

// ======================
window.onload = function() {
  mostrar();
};