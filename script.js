document.addEventListener("click", ev => mainHandler(ev));
document.addEventListener("submit", ev => {ev.preventDefault();return false});

function setUniqueInSiblings(target, cls) {
  const siblings = [...document.getElementsByClassName(cls)].filter(e => e.id !== target.id);
  target.className += " " + cls;
  siblings.map(sib => sib.classList = [...sib.classList].filter(c => c !== cls)); 
}

function headerNav(target, activeClassName) {
  if([...target.classList].some(e => e === activeClassName))
    return false;
  setUniqueInSiblings(target, activeClassName);  
}

function portfolioNav(target, activeClassName) {
  if([...target.classList].some(e => e === activeClassName)) return false;

  setUniqueInSiblings(target, activeClassName);
  
  const illustrations = document.getElementsByClassName("portfolio-illustration")[0];
  const images = [...illustrations.children];
  const sorted = images.sort(() => 0.5 - Math.random());
  while(illustrations.firstChild) {
    illustrations.firstChild.remove();
  }
  sorted.forEach(img => illustrations.appendChild(img));
}

function portfolioImgSelect(target, activeClassName) {
  if([...target.classList].some(e => e === activeClassName)) return false;
  setUniqueInSiblings(target, activeClassName);
}

function mainHandler(event) {
  switch([...event.target.classList][0]) {
    case "header-nav-link":
      headerNav(event.target, "active");
      break;
    case "portfolio-nav-button":
      portfolioNav(event.target, "active");
      break;
    case "portfolio-illustration-item":
      portfolioImgSelect(event.target, "portfolio-image-outlined");
      break;
    default:
      break;
  }
}