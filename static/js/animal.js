document.addEventListener("DOMContentLoaded", () => {
  const mainImage = document.getElementById("main-animal-image");
  const thumbnails = [...document.querySelectorAll(".thumbnail")];
  const counter = document.getElementById("photo-counter");
  let currentIndex = 0, toastTimer;
  const notify = (message) => {
    const toast = document.getElementById("page-toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3200);
  };
  function showPhoto(index) {
    if (!thumbnails.length || !mainImage) return;
    currentIndex = (index + thumbnails.length) % thumbnails.length;
    const item = thumbnails[currentIndex];
    mainImage.src = item.dataset.image;
    mainImage.alt = item.dataset.alt || `Foto ${currentIndex + 1} do animal`;
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle("is-active", i === currentIndex);
      thumb.setAttribute("aria-pressed", String(i === currentIndex));
    });
    if (counter) counter.textContent = `${currentIndex + 1}/${thumbnails.length}`;
  }
  thumbnails.forEach((thumb, i) => thumb.addEventListener("click", () => showPhoto(i)));
  document.getElementById("photo-prev")?.addEventListener("click", () => showPhoto(currentIndex - 1));
  document.getElementById("photo-next")?.addEventListener("click", () => showPhoto(currentIndex + 1));
  const favorite = document.getElementById("favorite-animal");
  favorite?.addEventListener("click", () => {
    const on = favorite.getAttribute("aria-pressed") === "true";
    favorite.setAttribute("aria-pressed", String(!on));
    favorite.setAttribute("aria-label", on ? "Adicionar Thor aos favoritos" : "Remover Thor dos favoritos");
    notify(on ? "Thor foi removido dos favoritos." : "Thor foi adicionado aos favoritos.");
  });
  const follow = document.getElementById("follow-organization");
  follow?.addEventListener("click", () => {
    const on = follow.classList.toggle("is-following");
    follow.textContent = on ? "Seguindo" : "Seguir";
    notify(on ? "Você começou a seguir a ONG Patinhas Felizes." : "Você deixou de seguir a ONG.");
  });
  const dialog = document.getElementById("visit-dialog");
  document.getElementById("schedule-visit")?.addEventListener("click", () => dialog?.showModal());
  const dateInput = document.getElementById("visit-date");
  if (dateInput) {
    const today = new Date();
    dateInput.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }
  document.getElementById("visit-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    document.getElementById("visit-feedback").textContent =
      "Demonstração: conecte este formulário a uma view Django para registrar a solicitação.";
    notify("Solicitação demonstrativa. O envio real precisa ser conectado ao Django.");
  });
  document.addEventListener("keydown", (event) => {
    if (event.altKey && event.key === "ArrowLeft") showPhoto(currentIndex - 1);
    if (event.altKey && event.key === "ArrowRight") showPhoto(currentIndex + 1);
  });
});
