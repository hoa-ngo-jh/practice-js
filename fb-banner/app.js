(function() {
  const uploadBtn = document.querySelector('.upload-btn');
  const editBtn = document.querySelector('.edit-btn');
  const coverFileInput = document.querySelector('.cover-file');
  const coverPhoto = document.querySelector('.cover-photo');
  const saveOrCancelBtn = document.querySelector('.cover-save');
  const range = document.querySelector('#range');
  const rangeWrapper = document.querySelector('.range-wrap');
  const cancelBtn = document.querySelector('.cancel-btn');
  const saveBtn = document.querySelector('.save-btn');

  let photo, rangeValue = 0;
  let pos = { top: 0, left: 0, x: 0, y: 0 };
  let photoStored = {};

  const getPhotoFromStorage = () => {
    return JSON.parse(localStorage.getItem('photo'));
  };

  const scrollPhoto = () => {
    photo.style.width = 100 + photoStored.width * 2 + '%';
    rangeValue = photoStored.width;
    range.value = rangeValue;
    coverPhoto.scrollLeft = photoStored.scrollLeft;
    coverPhoto.scrollTop = photoStored.scrollTop;
  };

  const renderPhoto = () => {
    coverPhoto.innerHTML = `<img class="photo" src="${photoStored.src}" alt=""></img>`;
    photo = document.querySelector('.photo');
    scrollPhoto();
  };

  const init = () => {
    photoStored = getPhotoFromStorage();
    if (photoStored) {
      editBtn.style.display = 'block';
      uploadBtn.style.display = 'none';
      renderPhoto();
    }
  };
  init();

  const callCoverFileInput = () => {
    coverFileInput.click();
  };

  const uploadPhoto = (e) => {
    console.log(e.target.files)
    if (e.target.files.length > 0) {
      let src = URL.createObjectURL(e.target.files[0]);
      console.log(src);
      coverPhoto.innerHTML = `<img class="photo" src="${src}" alt=""></img>`;

      saveOrCancelBtn.style.display = 'block';
      uploadBtn.style.display = 'none';
      rangeWrapper.style.display = 'block';
      range.value = 0;
      photo = document.querySelector('.photo');
      coverPhoto.addEventListener('mousedown', mouseDown);
    }
  };

  const resizePhoto = () => {
    rangeValue = range.value;
    photo.style.width = 100 + rangeValue * 2 + '%';
  };

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

  const editPhoto = () => {
    saveOrCancelBtn.style.display = 'block';
    uploadBtn.style.display = 'block';
    editBtn.style.display = 'none';
    rangeWrapper.style.display = 'block';
    range.value = rangeValue;
    console.log(rangeValue);
    coverPhoto.addEventListener('mousedown', mouseDown);
  };

  const uneditPhoto = () => {
    saveOrCancelBtn.style.display = 'none';
    rangeWrapper.style.display = 'none';
  };

  const cancelUpload = () => {
    photoStored = getPhotoFromStorage();
    if (!photoStored) {
      photo.remove();
      coverPhoto.scrollTop = 0;
      coverPhoto.scrollLeft = 0;
      range.value = 0;
      uploadBtn.style.display = 'block';
    } else {
      renderPhoto();
      editBtn.style.display = 'block';
      uploadBtn.style.display = 'none';
    }

    coverPhoto.removeEventListener('mousedown', mouseDown);
    uneditPhoto();
  };

  const savePhoto = () => {
    const obj = {
      src: photo.src,
      scrollTop: coverPhoto.scrollTop,
      scrollLeft: coverPhoto.scrollLeft,
      width: rangeValue
    };

    localStorage.setItem('photo', JSON.stringify(obj));
    uneditPhoto();
    editBtn.style.display = 'block';
    uploadBtn.style.display = 'none';
    coverPhoto.removeEventListener('mousedown', mouseDown);
  };

  range.addEventListener('input', resizePhoto);
  coverFileInput.addEventListener('change', uploadPhoto);
  uploadBtn.addEventListener('click', callCoverFileInput);
  editBtn.addEventListener('click', editPhoto);
  cancelBtn.addEventListener('click', cancelUpload);
  saveBtn.addEventListener('click', savePhoto);
  coverPhoto && coverPhoto.addEventListener('load', scrollPhoto);
})();