let carefreeButton = document.querySelector('#carefree');
let linksBar = document.querySelector('.links');
let links = linksBar.querySelectorAll('.header-link');
let rightPane = document.querySelector('.right-pane');
let leftPane = document.querySelector('.left-pane');

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

function setLinkBold() {
  console.log(links);
  links[0].classList.remove('header-link');
  links[0].classList.add('header-link-selected');
}

addEventListener('resize', e => {
  //setLinkBarToCenter();
});

carefreeButton.addEventListener('click', e => {
  window.open('http://carefree.michaelgallahan.com', '_self');
});

window.onwheel = e => {
  curScrollY += e.deltaY;
  let newLeft = clamp(50 * (1 - curScrollY / 2000), 0, 50);
  let newBottom = clamp(100 * ((curScrollY - 2000) / 2000), 0, 105);
  if (curScrollY < 0)
    curScrollY = 0;
  if (newLeft < 42)
    leftPane.style.opacity = 0;  
  else
    leftPane.style.opacity = 1;

  if (curScrollY > 2000)
    document.body.style.backgroundColor = '#2B2C28';
  else
    document.body.style.backgroundColor = '#E5E4E2';

  console.log(`y: ${curScrollY}`);

  let bottomText = (newBottom > 5) ? `bottom: ${newBottom - 5}%;` : '';
  rightPane.setAttribute('style', `left: ${newLeft}%; ${bottomText}`);
};

setLinkBold();
linksBar.setAttribute('style', `opacity: 1;`);