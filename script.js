window.addEventListener("load", () => {
  document.addEventListener("click", ev => mainHandler(ev));
  document.addEventListener("submit", ev => formSubmitHandler(ev));
  document.querySelector(".iphone-vertical").onclick = () => toggleVertical(event);
  document.querySelector(".iphone-horizontal").onclick = () => toggleHorizontal(event);

  const getElementLeftOffset = elem => Number(elem.style.left.replace(/[^\-\d]/g, ""));
  const getElementWidth      = elem => Number(window.getComputedStyle(elem).width.replace(/[^\d\-]/g, ""));
  const slider       = document.querySelector(".slider");
  const sliderScreen = document.querySelector(".slider-screen");
  const offset       = getElementWidth(sliderScreen);
  const slides       = document.querySelectorAll(".slider-screen > div");
  const sliderSpeed  = 10;

  //init slides
  slides.forEach((s, i) => s.style.left = (i * offset) + "px");
  let timer = undefined;

  function setUniqueInSiblings(target, cls) {
    if([...target.classList].some(e => e === cls))
      return false;
    const siblings = [...document.getElementsByClassName(cls)].filter(e => e.id !== target.id);
    target.classList.add(cls);
    siblings.forEach(sib => sib.classList.remove(cls));
    return true; 
  }

  function fromArray (arr, beginIndex, requiredLength) {
    if(arr.length === 0) return arr;
    else return loop([], requiredLength, beginIndex);
    function loop(acc, rem, curIndex) {
      if(rem == 0) return acc;
      if(arr[curIndex] === undefined) return loop(acc, rem, 0);
      else return loop([...acc, arr[curIndex]], rem - 1, curIndex + 1);      
    }
  }

  function portfolioShuffle(beginIndex = 0) {
    const illustrations = document.querySelector(".portfolio-illustration");
    const images        = [...illustrations.children];
    const mixed         = fromArray(images, beginIndex, images.length);
    while(illustrations.firstChild) {
      illustrations.firstChild.remove();
    }
    illustrations.append(...mixed);
  }

  function moveSlider(rate) {
    if(timer !== undefined) return;
    slides.forEach(s => {
      const curOffset = getElementLeftOffset(s);
      if(rate < 0 && curOffset < 0) s.style.left = (curOffset * -1) + "px";
      if(rate > 0 && curOffset > 0) s.style.left = (curOffset * -1) + "px";  
    });
    let i = offset;
    timer = setInterval(() => {
      slides.forEach(s => s.style.left = (getElementLeftOffset(s) + rate) + "px");
      i -= Math.abs(rate);
      if(i <= 0) { //move finished
        clearInterval(timer);
        timer = undefined;
        const curSlide = [...slides].filter(s => getElementLeftOffset(s) === 0)[0];
        const bgColor = window.getComputedStyle(curSlide, null).getPropertyValue("background-color");
        slider.style.backgroundColor = bgColor;
      }
    }, 5);    
  }
  
  function toggleVertical(event) {
    if(event.target.classList[0] === "iphone-shadow-vertical") return;
    const screenContent = document.querySelector(".iphone-vertical > .iphone-screen-content-vertical");
    screenContent.style.display = screenContent.style.display === "none" ? "block" : "none";
  }

  function toggleHorizontal(event) {
    if(event.target.classList[0] === "iphone-shadow-horizontal") return;
    const screenContent = document.querySelector(".iphone-horizontal > .iphone-screen-content-horizontal");
    screenContent.style.display = screenContent.style.display === "none" ? "block" : "none";
  }

  function mainHandler(event) {
    switch(event.target.classList[0]) {
      case "header-nav-link":
        event.preventDefault();
        setUniqueInSiblings(event.target, "active");        
        const scrollTarget = document.querySelector(event.target.getAttribute("href"));
        scrollTarget.scrollIntoView({behavior: "smooth"});
        break;
      case "portfolio-nav-button":
        if(setUniqueInSiblings(event.target, "portfolio-nav-button-active")) {
          const index = [...event.target.parentElement.children].indexOf(event.target) + 1;
          portfolioShuffle(index);
        }
        break;
      case "portfolio-illustration-item":
        setUniqueInSiblings(event.target, "portfolio-image-outlined");
        break;
      case "arrow-left":
        moveSlider(sliderSpeed * -1);
        break;
      case "arrow-right":
        moveSlider(sliderSpeed);
        break;    
      default:      
        break;
    }
  }

  function formSubmitHandler(event) {
    event.preventDefault();
    const form    = document.querySelector("#get_a_quote-form");
    const subject = document.querySelector("#get_a_quote-form-subject").value;
    const descr   = document.querySelector("#get_a_quote-form-description").value;

    const resSubject = document.querySelector("#form_submit-res-subject");
    const resDescr   = document.querySelector("#form_submit-res-description");

    resSubject.textContent = subject !== "" ? `Subject: ${subject}` : "Without subject";
    resDescr.textContent   = descr !== "" ? `Description: ${descr}` : "Without description";

    const windowContainer = document.querySelector("#form_submit_res-container");
    windowContainer.style.display = "block";
    const btn = document.querySelector("#form_submit-confirm_btn");
    btn.onclick = () => {
      windowContainer.style.display = "none";
      form.reset();
    }    
  }
});