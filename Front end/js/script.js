const track = document.querySelector(".track");
const slides = document.querySelectorAll(".track .slide");
const total = slides.length;

let slideIndex = 1;       
let intervalId = null;
let isMoving = false;    

document.addEventListener("DOMContentLoaded", initializeSlider);

function initializeSlider() {
  if (total === 0) return;


  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[total - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.insertBefore(lastClone, track.firstChild);

  jumpTo(slideIndex);     
  track.addEventListener("transitionend", handleTransitionEnd);
  startAutoPlay();
}

function startAutoPlay() {
  clearInterval(intervalId);
  intervalId = setInterval(nextSlide, 5000);
}

function moveTo(index) {
  track.style.transform = `translateX(-${index * 100}%)`;
}


function jumpTo(index) {
  track.style.transition = "none";
  moveTo(index);
  track.offsetWidth;                 
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
  if (e.target !== track) return;

  if (slideIndex === total + 1) {    
    slideIndex = 1;
    jumpTo(slideIndex);              
  }
  else if (slideIndex === 0) {       
    slideIndex = total;
    jumpTo(slideIndex);
  }

  isMoving = false;
}
function stopAutoPlay() {
  clearInterval(intervalId);
  intervalId = null;
}

function clickNext() {
  stopAutoPlay();     
  nextSlide();
}

function clickPrev() {
  stopAutoPlay();
  prevSlide();
}

function clickNext() {
  startAutoPlay();    
  nextSlide();
}

function clickPrev() {
  startAutoPlay();
  prevSlide();
}