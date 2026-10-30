document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const animal = params.get("animal");
  const animalName = document.getElementById("visit-animal-name");
  const heading = document.getElementById("visit-form-title");
  if (animal && animalName) {
    const displayName = animal.toLowerCase() === "thor" ? "Thor" : animal;
    animalName.textContent = displayName;
    if (heading) heading.textContent = `Vamos combinar uma visita para conhecer ${displayName}?`;
  }
  const date = document.getElementById("preferred-date");
  if (date) {
    const now = new Date();
    date.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }
  const phone = document.getElementById("phone");
  phone?.addEventListener("input", () => {
    let digits = phone.value.replace(/\D/g, "").slice(0, 11);
    if (digits.length > 10) digits = digits.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    else if (digits.length > 6) digits = digits.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    else if (digits.length > 2) digits = digits.replace(/^(\d{2})(\d+)/, "($1) $2");
    else if (digits.length) digits = digits.replace(/^(\d+)/, "($1");
    phone.value = digits;
  });
});
