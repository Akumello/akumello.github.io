let carefreeButton = document.querySelector('#carefree');
let linksBar = document.querySelector('.links');
let links = linksBar.querySelectorAll('.header-link');
let rightPane = document.querySelector('.right-pane');
let leftPane = document.querySelector('.left-pane');
let projects = document.querySelector('.projects');
const Areas = {
  Home: 0,
  HomeImage: 1,
  About: 2
};
let currentArea = Areas.Home;
let headerCurSelected = Areas.Home;
let carefreeVideo = document.querySelector('#carefree_video');

let curScrollX = 0;
let curScrollY = 0;

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}

//Execute
function setLinkBarToCenter() {
  let screenWidth = window.innerWidth;
  let linksStyle = getComputedStyle(linksBar);
  let linkPercent = (1 - (screenWidth - parseFloat(linksStyle.width)) / screenWidth) * 100;
  let leftPercent = 50 - (linkPercent / 2);
  console.log(screenWidth);
  linksBar.setAttribute('style', `left: ${leftPercent}%; opacity: 1;`);
}

function setLinkBold(area) {
  links[headerCurSelected].classList.add('header-link');
  links[headerCurSelected].classList.remove('header-link-selected');
  headerCurSelected = area;
  links[area].classList.remove('header-link');
  links[area].classList.add('header-link-selected');
}

addEventListener('resize', e => {
  //setLinkBarToCenter();
});

carefreeButton.addEventListener('click', e => {
  window.open('http://carefree.michaelgallahan.com', '_self');
});

function scroll(scrollDelta) {
  // Keep track of the users current position
  curScrollY += scrollDelta;

  // How far the user must scroll to finish home animation and dismiss the home image
  let homeAnimDepth = 1000;
  let imgDismissDepth = 2000;
  let imgStickDuration = 10;
  let titleFadeLocation = 42;

  switch(true) {
    case curScrollY < 0:
      curScrollY = 0;
    case curScrollY < homeAnimDepth:                     // Image scrolling horizontal
      // Perform these lines one time upon entry into Home area
      if(!(currentArea == Areas.Home)) {
        leftPane.style.display = 'block';
        projects.style.display = 'none';
        document.body.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--light');
      }
      currentArea = Areas.Home;
      break;
    case curScrollY < (homeAnimDepth + imgDismissDepth): // Image scrolling vertical
      // Perform these lines one time upon entry into HomeImage area
      if(!(currentArea == Areas.HomeImage)) {
        leftPane.style.display = 'none';
        document.body.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--dark-accent');
        projects.style.display = 'block';
        projects.style.opacity = 0;
      }
      currentArea = Areas.HomeImage;
      break;
    default:                                             // Image no longer visible
      break;
  }

  

  let newLeft = clamp(50 * (1 - curScrollY / homeAnimDepth), 0, 50);
  let newBottom = clamp(100 * ((curScrollY - homeAnimDepth) / imgDismissDepth), 0, 100 + imgStickDuration);

  leftPane.style.opacity = (newLeft < titleFadeLocation) ? 0 : 1;

  rightPane.style.left = newLeft + '%';
  rightPane.style.bottom = (newBottom > imgStickDuration) ? newBottom - imgStickDuration + '%' : '';

  // Display projects pane when home image is halfway dismissed
  if (curScrollY > (homeAnimDepth + (imgDismissDepth / 2))) {
    setLinkBold(Areas.HomeImage);
    projects.style.opacity = 1;
    carefreeVideo.play();
  }
  else {
    setLinkBold(Areas.Home);
    projects.style.opacity = 0;
  }
}

window.onwheel = e => {
  scroll(e.deltaY);
};

setLinkBold(Areas.Home);
linksBar.setAttribute('style', 'opacity: 1;');