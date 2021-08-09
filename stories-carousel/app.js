const data = [
  {
    name: 'Justin Bieber',
    avatar: 'https://www.geo.tv/assets/uploads/updates/2021-04-02/342868_1535578_updates.jpg',
    contents: [
      {
        id: 1,
        type: 'img',
        time: 3,
        src: 'https://www.hollywoodreporter.com/wp-content/uploads/2013/11/9713_01_0270.jpg'
      },
      {
        id: 2,
        type: 'img',
        time: 3,
        src: 'https://media.vov.vn/sites/default/files/styles/large/public/2020-09/j1_3.jpg'
      },
      {
        id: 3,
        type: 'video',
        time: 7,
        src: '/img/story1.mp4'
      }
    ]
  },
  {
    name: 'Taylor Swift',
    avatar: 'https://media1.popsugar-assets.com/files/thumbor/hnVKqXE-xPM5bi3w8RQLqFCDw_E/475x60:1974x1559/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2019/09/09/023/n/1922398/9f849ffa5d76e13d154137.01128738_/i/Taylor-Swift.jpg',
    contents: [
      {
        id: 1,
        type: 'img',
        time: 3,
        src: 'https://dep.com.vn/wp-content/uploads/2020/01/taylor-swift-1.jpg'
      },
      {
        id: 2,
        type: 'video',
        time: 8,
        src: '/img/story2.mp4'
      }
    ]
  },
  {
    name: 'Bruno Mars',
    avatar: 'https://i.iheart.com/v3/catalog/artist/337578?ops=fit(720%2C720)',
    contents: [
      {
        id: 1,
        type: 'img',
        time: 3,
        src: 'https://edgar.ae/media/images/RRxBM-L5-1-Vertical-PR.original.jpg'
      }
    ]
  },
  {
    name: 'Selena Gomez',
    avatar: 'https://media.vov.vn/sites/default/files/styles/large/public/2020-10/selena-gomez-1-1024x683.jpg',
    contents: [
      {
        id: 1,
        type: 'img',
        time: 3,
        src: 'https://kenh14cdn.com/203336854389633024/2021/6/10/s3-1623317175420236873065.jpeg'
      },
      {
        id: 2,
        type: 'video',
        time: 8,
        src: '/img/story3.mp4'
      },
      {
        id: 3,
        type: 'img',
        time: 3,
        src: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/selena-gomez-seen-on-the-set-of-only-murders-in-the-news-photo-1614265382.'
      }
    ]
  },
  {
    name: 'Jabbawockeez',
    avatar: 'https://i.pinimg.com/736x/11/74/ec/1174ecfe98ec35e46863321501d07115.jpg',
    contents: [
      {
        id: 1,
        type: 'img',
        time: 3,
        src: 'https://i.pinimg.com/originals/3e/93/a3/3e93a34c733186a98874f787b94264a6.jpg'
      },
      {
        id: 2,
        type: 'video',
        time: 12,
        src: '/img/story4.mp4'
      },
      {
        id: 3,
        type: 'img',
        time: 3,
        src: 'https://i.pinimg.com/originals/cd/c0/d2/cdc0d2d579d31b9b25d48d6a16045113.jpg'
      }
    ]
  }
];

const container = document.querySelector('.stories-container');
const stories = document.querySelector('.stories-slider');
const content = document.querySelector('.story-content');
const list = document.querySelector('.list-user');

const progressContainer = document.querySelector('.progress-container');
let currProgressLine, currChildElementCount;

const renderListUser = (data) => {
  for (let i = 0; i < data.length; i++) {
    list.innerHTML += `
      <ul>
        <li>
          <div class="outer-layer">
              <a href="#" onClick="changeStoriesOnList(${i})" href=""><img src="${data[i].avatar}" alt="user avatar"></a>
          </div>
        </li>
      </ul>
    `
    stories.innerHTML += `
      <div class="user">
        <div class="stories-bar">
          <div class="progress-container">
            ${data[i].contents.map(item => `<div style="animation-duration: ${item.time}s" class="progress prg-${i + 1}"></div>`).join('')}
          </div>
          <div class="user-detail">
            <div class="user-info">
              <img src="${data[i].avatar}" class="avatar" alt="user avatar">
              <span>${data[i].name}</span>
            </div>
            <div class="tools">
              <i class="pause-icon pause-${i + 1} fas fa-pause"></i>
            </div>
          </div>
        </div>
        <div id="st${i + 1}" class="story-content">
          ${data[i].contents.map(item => {
            let html = item.type === 'img' ? `<img id="${item.id}" src="${item.src}" alt="story image"></img>` : `<video id="${item.id}" width="500" height="900" muted loop src="${item.src}" type="video/mp4"></video>`; 
            return html;
          }).join('')}
        </div>
      </div>
    `;
  }
};
renderListUser(data);

const middle_of_story_screen = container.offsetLeft + stories.clientWidth / 2;
const height = stories.clientHeight + 5;
const width = stories.clientWidth;
const pauseBtn = Array.from(document.querySelectorAll('.pause-icon'));

let currStory = stories.firstElementChild.lastElementChild.firstElementChild;
let progress = Array.from(document.querySelectorAll(`.prg-${1}`));
let currProgressStory = 0, prevProgressStory = 0, index, indexUser = 0;
let prevVideo;

function playNext(e) {
  const current = e && e.target;

  if (current) {
    current.classList.remove('active');
    current.classList.add('passed');
    changeStories('next');
  } 
}

const play = () => {
  progress[currProgressStory].classList.add('active');
  progress.map((el) => {
    el.addEventListener("animationend", playNext, false);
  });
};
play();

const setDefaultProgress = (progress) => {
  if (progress.classList.contains('passed')) {
    progress.classList.remove('passed');
  }
  if (progress.classList.contains('active')) {
    progress.classList.remove('active');
  }
};

const removePassedProgess = () => {
  progress.forEach(item => {
    setDefaultProgress(item);
  });
};

const getIndexStoryPassed = () => {
  for (let i = progress.length - 1; i >= 0; i--) {
    if (progress[i].classList.contains('passed')) {
      return i;
    }
  }

  return 0;
};

const navigateToNextStory = (counter, element) => {
  element.style.transform = `translateY(${(-height * counter)}px)`;
};

const switchStoryUser = (index) => {
  stories.style.transition = 'transform 0.4s ease-in-out';
  stories.style.transform = `translateX(${(-width * index)}px)`;
};

const playVideo = (newVideo) => {
  if (newVideo.nodeName === 'VIDEO') {
    newVideo.currentTime = 0;
    newVideo.play();
    prevVideo = newVideo;
  }
};

const passedStory = (index) => {
  progress[index].classList.remove('active');
  progress[index].classList.add('passed');
};

const activeStory = (index) => {
  progress[index].classList.remove('passed');
  progress[index].classList.add('active');
};

const changeVideo = () => {
  if (prevVideo) prevVideo.pause();
  playVideo(currStory);
};

const changeStoriesOnList = (index) => {
  setStoryRunning(pauseBtn[prevProgressStory]);
  prevProgressStory = index;
  currStory = document.getElementById(`st${index + 1}`).firstElementChild;
  navigateToNextStory(0, currStory.parentElement);
  switchStoryUser(index);
  progress = Array.from(document.querySelectorAll(`.prg-${index + 1}`));
  removePassedProgess();
  currProgressStory = 0;
  play();
};
  
const goToNextUser = (story) => {
  indexUser = getIndexUser(story.parentElement);
  switchStoryUser(indexUser - 1);
  setStoryRunning(pauseBtn[indexUser - 2]);
  passedStory(currProgressStory);
  progress = Array.from(document.querySelectorAll(`.prg-${indexUser}`));
  currProgressStory = 0;

  if (progress[0].classList.contains('passed')) {
    navigateToNextStory(0, story.parentElement);
    removePassedProgess();
  }

  play();
};

const goToPrevUser = (story) => {
  indexUser = getIndexUser(story);
  switchStoryUser(indexUser - 1);
  setStoryRunning(pauseBtn[indexUser]);
  progress[0].classList.remove('active');
  progress = Array.from(document.querySelectorAll(`.prg-${indexUser}`));
  currProgressStory = getIndexStoryPassed();

  if (currProgressStory) {
    currStory = story.lastElementChild; 
    progress[currProgressStory].classList.remove('passed');
  } else {
    currStory = story.firstElementChild;
  }

  play();
};

const nextStory = (story) => {
  handleStoryNavigation(story);
  currProgressStory += 1;
  passedStory(currProgressStory - 1);
  progress[currProgressStory].classList.add('active');
};

const prevStory = (story) => {
  handleStoryNavigation(story);
  currProgressStory -= 1;
  setDefaultProgress(progress[currProgressStory + 1]);
  activeStory(currProgressStory);
};

const handleStoryNavigation = (story) => {
  indexUser = getIndexUser(story.parentElement);
  index = story.getAttribute('id');

  setStoryRunning(pauseBtn[indexUser - 1]);
  navigateToNextStory(index - 1, story.parentElement);
};

const getIndexUser = (user) => {
  return user.getAttribute('id').charAt(2);
};

const pause = (currentPause) => {
  currentPause.classList.remove('fa-pause');
  currentPause.classList.add('fa-play');
  progress[currProgressStory].style.animationPlayState = 'paused';
};

const run = (currentPause) => {
  currentPause.classList.remove('fa-play');
  currentPause.classList.add('fa-pause');
  progress[currProgressStory].style.animationPlayState = 'running';
};

const setStoryRunning = (currentPause) => {
  if (currentPause.classList.contains('fa-play')) {
    run(currentPause);
  }
};

const handlePauseStory = (e) => {
  e.stopPropagation();
  let currentPause = e.target;

  if (currentPause.classList.contains('fa-pause')) {
    pause(currentPause);

    if (currStory.nodeName === 'VIDEO') {
      currStory.pause();
    }
  } else {
    run(currentPause);

    if (currStory.nodeName === 'VIDEO') {
      currStory.play();
    }
  }
};

pauseBtn.map((el) => {
  el.addEventListener("click", handlePauseStory);
});

const changeStories = (direction) => {
  const story = currStory;
  const firstItemInUserStory = story.parentNode.firstElementChild;
  const lastItemInUserStory = story.parentNode.lastElementChild;
  const existNextUserStory = story.parentElement.parentElement.nextElementSibling;
  const existPrevUserStory = story.parentElement.parentElement.previousElementSibling;

  if (direction === 'next') {
    if (lastItemInUserStory === story && !existNextUserStory) {
      return;
    } else if (lastItemInUserStory === story && existNextUserStory) {
      currStory = existNextUserStory.lastElementChild.firstElementChild;
      goToNextUser(currStory);
    } else {
      currStory = story.nextElementSibling;
      nextStory(currStory);
    }
  } else if (direction === 'prev') {
    if (firstItemInUserStory === story && !existPrevUserStory) {
      return;
    } else if (firstItemInUserStory === story && existPrevUserStory) {
      const contentStory = existPrevUserStory.lastElementChild;
      goToPrevUser(contentStory);
    } else {
      currStory = story.previousElementSibling;
      prevStory(currStory);
    }
  }
  changeVideo();
};

const clickStories = (e) => {
  changeStories(e.clientX > middle_of_story_screen ? 'next' : 'prev')
};

stories.addEventListener('click', clickStories);
