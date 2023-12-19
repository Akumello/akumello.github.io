let carefreeButton = document.querySelector('#carefree');
let linksBar = document.querySelector('.links');
let links = linksBar.querySelectorAll('.header-link');

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
  setLinkBarToCenter();
});

carefreeButton.addEventListener('click', e => {
  window.open('http://carefree.michaelgallahan.com', '_self');
});

function disableScrollX() {  
  // Get the current page scroll position in the horizontal direction 
  scrollLeft = window.scrollX || document.documentElement.scrollLeft;
  
  
  // If horizontal scroll is attempted,
  // Set the original value
  window.onscroll = function() {
  window.scrollTo(scrollLeft, window.scrollY);
  };
}

// setLinkBarToCenter();
setLinkBold();
disableScrollX();
linksBar.setAttribute('style', `opacity: 1;`);