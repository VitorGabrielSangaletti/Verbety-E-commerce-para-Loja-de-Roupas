let slideIndex = 1;
let intervalId = null;
let isMoving = false;
let totalSlides = 0;

document.addEventListener("DOMContentLoaded", () => {
  // se a Home esta em modo dinamico, o home.js assume e chama iniciarSlider()
  if (window.homeDinamico) return;
  iniciarSlider();
});

function iniciarSlider() {
  const track = document.querySelector(".track");
  if (!track) return;

  // permite reiniciar com slides novos
  clearInterval(intervalId);
  isMoving = false;
  track.querySelectorAll(".slide.clone").forEach((clone) => clone.remove());

  const slides = track.querySelectorAll(".slide:not(.clone)");
  totalSlides = slides.length;
  if (totalSlides === 0) return;

  track.style.transition = "none";
  track.style.transform = "translateX(0)";

  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[totalSlides - 1].cloneNode(true);
  firstClone.classList.add("clone");
  lastClone.classList.add("clone");
  track.appendChild(firstClone);
  track.insertBefore(lastClone, track.firstChild);

  slideIndex = 1;
  jumpTo(slideIndex);

  track.removeEventListener("transitionend", handleTransitionEnd);
  track.addEventListener("transitionend", handleTransitionEnd);
  startAutoPlay();
}

// deixa o home.js chamar quando terminar de montar o carrossel
window.iniciarSlider = iniciarSlider;

function startAutoPlay() {
  clearInterval(intervalId);
  intervalId = setInterval(nextSlide, 5000);
}

function moveTo(index) {
  const track = document.querySelector(".track");
  if (track) track.style.transform = `translateX(-${index * 100}%)`;
}

function jumpTo(index) {
  const track = document.querySelector(".track");
  if (!track) return;
  track.style.transition = "none";
  moveTo(index);
  track.offsetWidth; // força o navegador a aplicar antes de religar a transição
  track.style.transition = "";
}

function nextSlide() {
  if (isMoving) return;
  isMoving = true;
  slideIndex++;
  moveTo(slideIndex);
}

function prevSlide() {
  if (isMoving) return;
  isMoving = true;
  slideIndex--;
  moveTo(slideIndex);
}

function handleTransitionEnd(e) {
  const track = document.querySelector(".track");
  if (!track || e.target !== track) return;

  if (slideIndex === totalSlides + 1) {
    slideIndex = 1;
    jumpTo(slideIndex);
  } else if (slideIndex === 0) {
    slideIndex = totalSlides;
    jumpTo(slideIndex);
  }
  isMoving = false;
}

// usados pelos botões com onclick no Home.html
function clickNext() {
  startAutoPlay();
  nextSlide();
}

function clickPrev() {
  startAutoPlay();
  prevSlide();
}
