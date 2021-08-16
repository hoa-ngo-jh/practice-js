const carouselSlide = document.querySelector('.carousel-slide');
const carouselImages = document.querySelectorAll('.carousel-slide img');
const prevBtn = document.querySelector('#prev-btn');
const nextBtn = document.querySelector('#next-btn');
const dotsContainer = document.querySelector('#my-dot');
const size = carouselImages[0].clientWidth + 1;
const dotIndex = {
  newIndex: 0,
  oldIndex: 0
};

let counter = 1;

carouselSlide.style.transform = `translateX(${(-size * counter)}px)`;

const nextSlide = (second) => {
  if (counter >= carouselImages.length - 1) return;
  dotIndex.newIndex = (counter == 5 ? 0 : counter) + 1;
  dotIndex.oldIndex = counter;
  handleChangeSlide(1, second);
};

const prevSlide = (second) => {
  if (counter <= 0) return;
  dotIndex.newIndex = (counter == 1 ? 6 : counter) - 1;
  dotIndex.oldIndex = counter;
  handleChangeSlide(-1, second);
}

const handleChangeSlide = (direction, second) => {
  counter += direction;
  changeSlide(second);
  changeDotBackground(dotIndex.oldIndex, dotIndex.newIndex);
};

const createDot = () => {
  for (let i = 0; i < carouselImages.length - 2; i++) {
    if (i != 0) {
      dotsContainer.innerHTML += `<span class="dot" onclick="changeSlideByDot(${i + 1}, 0.4)"></span> `;
    } else {
      dotsContainer.innerHTML += `<span class="dot active" onclick="changeSlideByDot(${i + 1}, 0.4)"></span> `;
    }
  }
};
createDot();
const dots = document.querySelectorAll('.dot');

const changeSlide = (second) => {
  carouselSlide.style.transition = `transform ${second}s ease-in-out`;
  carouselSlide.style.transform = `translateX(${(-size * counter)}px)`;
};

const changeSlideWithoutAnimation = () => {
  carouselSlide.style.transition = "none";
  carouselSlide.style.transform = `translateX(${(-size * counter)}px)`;
};

const changeDotBackground = (oldIndexDot, newIndexDot) => {
  dots[oldIndexDot - 1].classList.remove('active');
  dots[newIndexDot - 1].classList.add('active');
};

const changeSlideByDot = (newIndexDot, second) => {
  dotIndex.oldIndex = counter;
  counter = newIndexDot;
  changeSlide(second);
  changeDotBackground(dotIndex.oldIndex, newIndexDot);
};

const handleSlideTransition = () => {
  if (carouselImages[counter].id === 'last-clone') {
    counter = carouselImages.length - 2;
  }
  if (carouselImages[counter].id === 'first-clone') {
    counter = carouselImages.length - counter;
  }

  changeSlideWithoutAnimation();
};

nextBtn.addEventListener('click', () => nextSlide(0.4));
prevBtn.addEventListener('click', () => prevSlide(0.4));
carouselSlide.addEventListener('transitionend', handleSlideTransition);