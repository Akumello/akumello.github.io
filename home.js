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

let carefreeButton = document.querySelector('#carefree');
let linksBar = document.querySelector('.links');
let links = linksBar.querySelectorAll('.header-link');
let rightPane = document.querySelector('.right-pane');
let leftPane = document.querySelector('.left-pane');
let projects = document.querySelector('.projects');
let carefreeVideo = document.querySelector('#carefree_video');

//#region Utility Functions
function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
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

function setActiveLink(area) {
  links[headerCurSelected].classList.add('header-link');
  links[headerCurSelected].classList.remove('header-link-selected');
  headerCurSelected = area;
  links[area].classList.remove('header-link');
  links[area].classList.add('header-link-selected');
}

function scroll(scrollDelta) {
  // Keep track of the users current position
  curScrollY += scrollDelta;
  console.log(curScrollY);

  let homeAnimDepth = 1000;   // Scroll distance to finish home image horizontal translate
  let imgDismissDepth = 2000; // Scroll distance to finish home image vertical translate
  let imgStickDuration = 10;  // Scroll distance to begin vertical translate
  let titleFadeLocation = 42; // Fade home title when home image left has reached this percent of the viewport

  switch(true) {
    case curScrollY < 0:
      curScrollY = 0;
    case curScrollY < homeAnimDepth:                     // Image scrolling horizontally
      // Perform these lines one time upon entry into Home area
      if(!(currentArea == Areas.Home)) {
        leftPane.style.display = 'block';
        projects.style.display = 'none';
        document.body.classList.remove('gradient');
        document.body.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--light');
      }
      currentArea = Areas.Home;
      break;
    case curScrollY < (homeAnimDepth + imgDismissDepth): // Image scrolling vertically
      // Perform these lines one time upon entry into Projects area
      if(!(currentArea == Areas.Projects)) {
        leftPane.style.display = 'none';
        document.body.classList.add('gradient');
        document.body.style.backgroundColor = '';
        projects.style.display = 'block';
        projects.style.opacity = 0;
      }
      currentArea = Areas.Projects;
      break;
    case curScrollY > (homeAnimDepth + imgDismissDepth + 500):
      curScrollY = (homeAnimDepth + imgDismissDepth + 500);
      break;
  }

  

  let newLeft = clamp(50 * (1 - curScrollY / homeAnimDepth), 0, 50);
  let newBottom = clamp(100 * ((curScrollY - homeAnimDepth) / imgDismissDepth), 0, 100 + imgStickDuration);
  rightPane.style.left = newLeft + '%';
  rightPane.style.bottom = (newBottom > imgStickDuration) ? newBottom - imgStickDuration + '%' : '';

  leftPane.style.opacity = (newLeft < titleFadeLocation) ? 0 : 1;

  // Display projects pane when home image is halfway dismissed
  if (curScrollY > (homeAnimDepth + (imgDismissDepth / 1.5))) {
    setActiveLink(Areas.Projects);
    projects.style.opacity = 1;
    carefreeVideo.play();
  }
  else {
    setActiveLink(Areas.Home);
    projects.style.opacity = 0;
  }
}

//#region Input Handling
window.onwheel = e => {
  scroll(e.deltaY);
};

//#endregion

//#region Buttons
carefreeButton.addEventListener('click', e => {
  window.open('http://carefree.michaelgallahan.com', '_self');
});

//#endregion

//#region Execution
setActiveLink(Areas.Home);
linksBar.setAttribute('style', 'opacity: 1;');
//#endregion