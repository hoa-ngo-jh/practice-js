const data = [
  {
    name: 'Justin Bieber',
    avatar: 'https://www.geo.tv/assets/uploads/updates/2021-04-02/342868_1535578_updates.jpg',
    contents: [
      {
        id: 1,
        type: 'img',
        src: 'https://www.hollywoodreporter.com/wp-content/uploads/2013/11/9713_01_0270.jpg'
      },
      {
        id: 2,
        type: 'img',
        src: 'https://media.vov.vn/sites/default/files/styles/large/public/2020-09/j1_3.jpg'
      },
      {
        id: 3,
        type: 'video',
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
        src: 'https://dep.com.vn/wp-content/uploads/2020/01/taylor-swift-1.jpg'
      },
      {
        id: 2,
        type: 'video',
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
        src: 'https://kenh14cdn.com/203336854389633024/2021/6/10/s3-1623317175420236873065.jpeg'
      },
      {
        id: 2,
        type: 'video',
        src: '/img/story3.mp4'
      },
      {
        id: 3,
        type: 'img',
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
        src: 'https://i.pinimg.com/originals/3e/93/a3/3e93a34c733186a98874f787b94264a6.jpg'
      },
      {
        id: 2,
        type: 'video',
        src: '/img/story4.mp4'
      },
      {
        id: 3,
        type: 'img',
        src: 'https://i.pinimg.com/originals/cd/c0/d2/cdc0d2d579d31b9b25d48d6a16045113.jpg'
      }
    ]
  }
];

const container = document.querySelector('.stories-container');
const stories = document.querySelector('.stories-slider');
const content = document.querySelector('.story-content');
const list = document.querySelector('.list-user');

// PROGRESS LINE
const progressContainer = document.querySelector('.progress-container');
let currProgressLine, currChildElementCount;

// ---------
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
          </div>
          <div class="user-detail">
            <div class="user-info">
              <img src="${data[i].avatar}" class="avatar" alt="user avatar">
              <span>${data[i].name}</span>
            </div>
          </div>
        </div>
        <div id="st${i + 1}" class="story-content">
          ${data[i].contents.map(item => {
            let html = item.type === 'img' ? `<img id="${item.id}" src="${item.src}" alt="story image"></img>` : `<video id="${item.id}" width="500" height="900" muted loop src="${item.src}" type="video/mp4"></video>`; 
            return html;
            // return `${item.type === 'img' ? `<img id="${item.id}" src="${item.src}" alt="story image"></img>` : `<video id="${item.id}" width="500" height="900" muted loop src="${item.src}" type="video/mp4"></video>`}`;
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

let currStory = stories.firstElementChild.lastElementChild.firstElementChild;

const renderProgressLine = () => {
  currProgressLine = currStory.parentElement.previousElementSibling.firstElementChild;
  currChildElementCount = currStory.parentElement.childElementCount;
  // let index = currStory.parentElement.getAttribute('id').charAt(2);

  for (let i = 0; i < currChildElementCount; i++) {
    currProgressLine.innerHTML += `<div style="animation-duration: 2s" class="progress"></div>`;
  }
};
// renderProgressLine();

const progress = Array.from(document.querySelectorAll(`.progress`));

function playNext(e) {
  const current = e && e.target;
  let next = progress[0];

  if (current) {
    const currentIndex = progress.indexOf(current);
    if (currentIndex < progress.length) {
      next = progress[currentIndex+1];
    }
    current.classList.remove('active');
    current.classList.add('passed');
    changeStories('next');
  } 
  
  // if (!next) {
  //   progress.map((el) => {
  //     el.classList.remove('active');
  //     el.classList.remove('passed');
  //   })
  //   console.log(next);
  //   next = progress[0];
  // } 
  //next = progress[0];
  if (next) next.classList.add('active'); 
}

// playNext();
progress.map(el => {
  el.addEventListener("animationend", playNext, false);
});

let prevVideo;

const changeStoryInUser = (counter, element) => {
  element.style.transform = `translateY(${(-height * counter)}px)`;
};

const switchStoryUser = (index) => {
  stories.style.transition = 'transform 0.4s ease-in-out';
  stories.style.transform = `translateX(${(-width * index)}px)`;
};

const togglePlayVideo = (newVideo) => {
  if (newVideo.nodeName === 'VIDEO') {
    newVideo.currentTime = 0;
    newVideo.play();
    prevVideo = newVideo;
  }
};

const changeStoriesOnList = (index) => {
  currStory = document.getElementById(`st${index + 1}`).firstElementChild;
  changeStoryInUser(0, currStory.parentElement);
  switchStoryUser(index);
};
  
const changeStories = (direction) => {
  const story = currStory;
  const firstItemInUserStory = story.parentNode.firstElementChild;
  const lastItemInUserStory = story.parentNode.lastElementChild;
  const existNextUserStory = story.parentElement.parentElement.nextElementSibling;
  const existPrevUserStory = story.parentElement.parentElement.previousElementSibling;

  if (direction === 'next') {
    console.log('next');
    if (lastItemInUserStory === story && !existNextUserStory) {
      return;
    } else if (lastItemInUserStory === story && existNextUserStory) {
      currStory = existNextUserStory.lastElementChild.firstElementChild;
      let index = currStory.parentElement.getAttribute('id').charAt(2);
      switchStoryUser(index - 1);

      if (prevVideo) prevVideo.pause();
      togglePlayVideo(currStory);
    } else {
      currStory = story.nextElementSibling;
      let index = currStory.getAttribute('id');
      changeStoryInUser(index - 1, currStory.parentElement);

      if (prevVideo) prevVideo.pause();
      togglePlayVideo(currStory);
    }
  } else if (direction === 'prev') {
    console.log('prev');
    if (firstItemInUserStory === story && !existPrevUserStory) {
      return;
    } else if (firstItemInUserStory === story && existPrevUserStory) {
      currStory = existPrevUserStory.lastElementChild.lastElementChild;
      let index = currStory.parentElement.getAttribute('id').charAt(2);
      switchStoryUser(index - 1);

      if (prevVideo) prevVideo.pause();
      togglePlayVideo(currStory);
    } else {
      currStory = story.previousElementSibling;
      let index = currStory.getAttribute('id');
      changeStoryInUser(index - 1, currStory.parentElement);

      if (prevVideo) prevVideo.pause();
      togglePlayVideo(currStory);
    }
  }
};

stories.addEventListener('click', e => {
  changeStories(e.clientX > middle_of_story_screen ? 'next' : 'prev')
});
