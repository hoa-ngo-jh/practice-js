const carouselSlide = document.querySelector('.carousel-slide');
const carouselImages = document.querySelectorAll('.carousel-slide img');

// Buttons
const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');
const dots = document.querySelectorAll('.dot');

let counter = 1;
const size = carouselImages[0].clientWidth;

carouselSlide.style.transform = `translateX(${(-size * counter)}px)`;

nextBtn.addEventListener('click', () => {
  if (counter >= carouselImages.length - 1) return;
  let newIndexDot = (counter == 5 ? 0 : counter) + 1;
  let oldIndexDot = counter;
  counter++;
  changeSlide();
  changeDotBackground(oldIndexDot, newIndexDot);
});

prevBtn.addEventListener('click', () => {
  if (counter <= 0) return;
  let newIndexDot = (counter == 1 ? 6 : counter) - 1;
  let oldIndexDot = counter;
  counter--;
  changeSlide();
  changeDotBackground(oldIndexDot, newIndexDot);
});

carouselSlide.addEventListener('transitionend', () => {
  if (carouselImages[counter].id === 'lastClone') {
    counter = carouselImages.length - 2;
    changeSlideWithoutAnimation();
  }
  if (carouselImages[counter].id === 'firstClone') {
    counter = carouselImages.length - counter;
    changeSlideWithoutAnimation();
  }
});

function changeSlide() {
  carouselSlide.style.transition = 'transform 0.4s ease-in-out';
  carouselSlide.style.transform = `translateX(${(-size * counter)}px)`;
}

function changeSlideWithoutAnimation() {
  carouselSlide.style.transition = "none";
  carouselSlide.style.transform = `translateX(${(-size * counter)}px)`;
}

function changeDotBackground (oldIndexDot, newIndexDot) {
  dots[oldIndexDot - 1].classList.remove('active');
  dots[newIndexDot - 1].classList.add('active');
}

function changeSlideByDot(newIndexDot) {
  let oldIndexDot = counter;
  counter = newIndexDot;
  changeSlide();
  changeDotBackground(oldIndexDot, newIndexDot);
}