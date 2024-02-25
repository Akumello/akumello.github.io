const verbose = false; // enable 
const Areas = {
  Home: 0,
  Projects: 1,
  Blog: 2,
  Contact: 3
};
let currentArea = Areas.Home;
let headerCurSelected = Areas.Home;
let curScrollX = 0;
let curScrollY = 0;
let scrollSpeed = 20;
let homeAnimDepth = 1000;   // Scroll distance to finish home image horizontal translate
let imgDismissDepth = 1000; // Scroll distance to finish home image vertical translate
let imgStickDuration = 0;   // Scroll distance to begin vertical translate
let titleFadeLocation = 38; // Fade home title when home image left has reached this percent of the viewport

let html = document.querySelector('html');
let carefreeButton = document.querySelector('#btn-carefree');
let homeButton = document.querySelector('#btn-home');
let foodPhasesButton = document.querySelector('#btn-blog');
let projectsButton = document.querySelector('#btn-projects');
let linksBar = document.querySelector('.links');
let links = linksBar.querySelectorAll('.header-link');
let rightPane = document.querySelector('.right-pane');
let leftPane = document.querySelector('.left-pane');
let projectsPane = document.querySelector('#projects-pane');
let carefreeVideo = document.querySelector('#carefree_video');

//#region Utility Functions
function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

function log(output) {
  if (verbose) console.log(output);
}
//#endregion

//#region Center Link Bar (Unused after redesign)
function setLinkBarToCenter() {
  let screenWidth = window.innerWidth;
  let linksStyle = getComputedStyle(linksBar);
  let linkPercent = (1 - (screenWidth - parseFloat(linksStyle.width)) / screenWidth) * 100;
  let leftPercent = 50 - (linkPercent / 2);
  console.log(screenWidth);
  linksBar.setAttribute('style', `left: ${leftPercent}%; opacity: 1;`);
}
addEventListener('resize', e => {
  //setLinkBarToCenter();
});
//#endregion

//#region Scroll Logic
function setActiveLink(area) {
  // Remove previous area link selected css
  links[headerCurSelected].classList.add('header-link');
  links[headerCurSelected].classList.remove('header-link-selected');
  headerCurSelected = area;

  // Set new area link selected css
  links[area].classList.remove('header-link');
  links[area].classList.add('header-link-selected');
}

function switchAreas() {
  switch(true) {
    // Scroll is at the beginning and can't go negative
    case curScrollY < 0:
      curScrollY = 0;

    // Home Image is scrolling horizontally to cover viewport
    case curScrollY < homeAnimDepth:
      // Perform these lines one time upon entry into Home area
      if(!(currentArea == Areas.Home)) {
        leftPane.style.display = 'block';
        projectsPane.style.display = 'none';
        document.body.classList.remove('gradient');
        document.body.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--light');
      }
      currentArea = Areas.Home;
      break;

    // Home image is scrolling vertically off the viewport
    case curScrollY <= (homeAnimDepth + imgDismissDepth  + 500):
      // Perform these lines one time upon entry into Projects area
      if(!(currentArea == Areas.Projects)) {
        leftPane.style.display = 'none';
        document.body.classList.add('gradient');
        document.body.style.backgroundColor = '';
        projectsPane.style.display = 'block';
        projectsPane.style.opacity = 0;
      }
      currentArea = Areas.Projects;
      break;

    // Home image has been fully dismissed, so lock scroll
    // case curScrollY > (homeAnimDepth + imgDismissDepth + 500):
    //   curScrollY = (homeAnimDepth + imgDismissDepth + 500);
    //   break;
  }
}

function homeAnimation() {
  // Home image's 'left' attribute moving from 50% towards 0% based on curScrollY
  let newLeft = clamp(50 * (1 - curScrollY / homeAnimDepth), 0, 50);
  // Home image's 'bottom' attribute moving from 0% towards 100% based on curScrollY
  let newBottom = clamp(100 * ((curScrollY - homeAnimDepth) / imgDismissDepth), 0, 100 + imgStickDuration);

  // Perform movements
  rightPane.style.left = newLeft + '%';
  rightPane.style.bottom = (newBottom > imgStickDuration) ? newBottom - imgStickDuration + '%' : '';

  // Fade left pane title in/out at trigger point
  leftPane.style.opacity = (newLeft < titleFadeLocation) ? 0 : 1;
}

function triggerProjectsPane() {
  let paneVhRatio = projectsPane.clientHeight / window.innerHeight;
  let newBottom = (curScrollY - (homeAnimDepth + (imgDismissDepth * paneVhRatio)));
  log(`new bot: ${newBottom}`);

  // Display projects pane when home image is mostly dismissed
  if (curScrollY > (homeAnimDepth + (imgDismissDepth * paneVhRatio))) {
    setActiveLink(Areas.Projects);
    projectsPane.style.opacity = 1;
    carefreeVideo.play();
  }
  else {
    setActiveLink(Areas.Home);
    projectsPane.style.opacity = 0;
  }

  projectsPane.style.bottom = (newBottom < 0) ? '' : (newBottom / scrollSpeed) + '%';

}

function verticalScroll(scrollDelta) {
  // Keep track of the users current position
  curScrollY += scrollDelta;
  log(`curScrollY: ${curScrollY}`);

  switchAreas();
  homeAnimation();
  triggerProjectsPane();
}

function horizontalScroll(scrollDelta) {
  curScrollX += scrollDelta;
  log(`curScrollX: ${curScrollX}`);
}
//#endregion

//#region Input Handling
window.onwheel = e => {
  verticalScroll(e.deltaY);
  horizontalScroll(e.deltaX);
};

let prevTouchY = 0;
let prevTouchX = 0;
window.ontouchstart = e => {
  prevTouchX = e.touches[0].pageX;
  prevTouchY = e.touches[0].pageY;
}

window.ontouchmove = e => {
  let speed = 1.8;
  let deltaX = prevTouchX - e.touches[0].pageX;
  let deltaY = prevTouchY - e.touches[0].pageY;

  verticalScroll(deltaY * speed);
  horizontalScroll(deltaX * speed);

  prevTouchX = e.touches[0].pageX;
  prevTouchY = e.touches[0].pageY;
}

// window.ontouchend = e => {

// }

document.onkeydown = e => {
  if (e.key === 'ArrowUp')        verticalScroll(-125);
  else if (e.key == 'ArrowDown')  verticalScroll(125);
  else if (e.key == 'ArrowLeft')  horizontalScroll(100);
  else if (e.key == 'ArrowRight') horizontalScroll(-100);
}
//#endregion

//#region Buttons
carefreeButton.addEventListener('click', e => {
  window.open('http://carefree.michaelgallahan.com', '_self');
});

foodPhasesButton.addEventListener('click', e => {
  window.open('http://www.foodphases.com', '_self');
});

homeButton.addEventListener('click', e => {
  verticalScroll(-curScrollY);
});

projectsButton.addEventListener('click', e => {
  verticalScroll((homeAnimDepth + imgDismissDepth) - curScrollY);
});

//#endregion

//#region Execution
setActiveLink(Areas.Home);
linksBar.setAttribute('style', 'opacity: 1;');
//#endregion