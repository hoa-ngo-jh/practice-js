const uploadBtn = document.querySelector('.upload-btn');
const coverFileInput = document.querySelector('.cover-file');
const coverPhoto = document.querySelector('.cover-photo');
const saveOrCancelBtn = document.querySelector('.cover-save');
const range = document.querySelector('#range');
const rangeWrapper = document.querySelector('.range-wrap');
const cancelBtn = document.querySelector('.cancel-btn');
const saveBtn = document.querySelector('.save-btn');

let photo;
let pos = { top: 0, left: 0, x: 0, y: 0 };

const callCoverFileInput = () => {
    coverFileInput.click();
};
uploadBtn.addEventListener('click', callCoverFileInput);

const uploadPhoto = (e) => {
  console.log(e.target.files)
  if (e.target.files.length > 0) {
    let src = URL.createObjectURL(e.target.files[0]);
    coverPhoto.innerHTML = `<img class="photo" src="${src}" alt=""></img>`;

    saveOrCancelBtn.style.display = 'block';
    uploadBtn.style.display = 'none';
    rangeWrapper.style.display = 'block';
    photo = document.querySelector('.photo');
    coverPhoto.addEventListener('mousedown', mouseDown);
  }
};
coverFileInput.addEventListener('change', uploadPhoto);

const resizePhoto = () => {
  let value = range.value * 2;
  photo.style.width = 100 + value + '%';
};
range.addEventListener('input', resizePhoto);

const mouseMove = (e) => {
  e.preventDefault();
  const newX = e.clientX - pos.x;
  const newY = e.clientY - pos.y;

  coverPhoto.scrollTop = pos.top - newY;
  coverPhoto.scrollLeft = pos.left - newX;
};

const mouseUp = () => {
  window.removeEventListener('mousemove', mouseMove);
};

const mouseDown = (e) => {
  pos = {
    left: coverPhoto.scrollLeft,
    top: coverPhoto.scrollTop,

    x: e.clientX,
    y: e.clientY
  };

  window.addEventListener('mousemove', mouseMove);
  window.addEventListener('mouseup', mouseUp);
};

const uneditPhoto = () => {
  saveOrCancelBtn.style.display = 'none';
  uploadBtn.style.display = 'block';
  rangeWrapper.style.display = 'none';
  range.value = 0;
};

cancelBtn.addEventListener('click', () => {
  photo.remove();
  coverPhoto.scrollTop = 0;
  coverPhoto.scrollLeft = 0;
  uneditPhoto();
});

saveBtn.addEventListener('click', () => {
  uneditPhoto();
  coverPhoto.removeEventListener('mousedown', mouseDown);
});