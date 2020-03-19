window.addEventListener("load", () => {
  document.addEventListener("click", ev => mainHandler(ev));
  document.addEventListener("submit", ev => formSubmitHandler(ev));
  document.addEventListener("scroll", scrollHandler);
  document.querySelector(".iphone-vertical").addEventListener('click', event => toggleVertical(event));
  document.querySelector(".iphone-horizontal").addEventListener('click', event => toggleHorizontal(event));

  const getElementLeftOffset = elem => Number(elem.style.left.replace(/[^\-\d]/g, ""));
  const getElementWidth      = elem => Number(window.getComputedStyle(elem).width.replace(/[^\d\-]/g, ""));
  const isContainsClass      = (elem, cls) => elem.classList.contains(cls);

  const slider       = document.querySelector(".slider");
  const sliderScreen = document.querySelector(".slider-screen");
  const offset       = getElementWidth(sliderScreen);
  const slides       = document.querySelectorAll(".slider-screen > div");
  const sliderSpeed  = 10;
  const headerLinks  = [...document.querySelectorAll(".header-nav-link")];
  //scroll via intersection observer api
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0
  }
  const observeCallback = (entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        const elem     = entry.target;
        const targetId = elem.getAttribute("id");
        headerLinks
          .filter(l => l.getAttribute("href").substring(1) === targetId)
          .forEach(l => setUniqueInSiblings(l, "active"));
      }
    });
  };
  const observer  = new IntersectionObserver(observeCallback, options); 
  const navPoints = document.querySelectorAll(".content > section");
  const homeA     = document.querySelector("#home");
  observer.observe(homeA);
  navPoints.forEach(c => observer.observe(c));
  
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
  
  /**
   * 
   * @param {*} array source array
   * @param {*} beginIndex index in source array to start from
   * @param {*} requiredLength required result array length
   */
  function fromArray (array, beginIndex, requiredLength) {
    if(array.length === 0) return array;
    else return loop([], requiredLength, beginIndex);
    function loop(acc, rem, curIndex) {
      if(rem == 0) return acc;
      if(array[curIndex] === undefined) return loop(acc, rem, 0);
      else return loop([...acc, array[curIndex]], rem - 1, curIndex + 1);      
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
    if(isContainsClass(event.target, "iphone-shadow-vertical")) return;
    const screenContent = document.querySelector(".iphone-vertical > .iphone-screen-content-vertical");
    screenContent.style.display = screenContent.style.display === "none" ? "block" : "none";
  }

  function toggleHorizontal(event) {
    if(isContainsClass(event.target, "iphone-shadow-horizontal")) return;
    const screenContent = document.querySelector(".iphone-horizontal > .iphone-screen-content-horizontal");
    screenContent.style.display = screenContent.style.display === "none" ? "block" : "none";
  }

  function mainHandler(event) {
    const target = event.target;

    if(isContainsClass(target, "header-nav-link")) {
      event.preventDefault();
      const scrollTarget = document.querySelector(event.target.getAttribute("href"));
      scrollTarget.scrollIntoView({behavior: "smooth"});
    } else if(isContainsClass(target, "portfolio-nav-button")) {
      if(setUniqueInSiblings(event.target, "portfolio-nav-button-active")) {
        const index = [...event.target.parentElement.children].indexOf(event.target) + 1;
        portfolioShuffle(index);
      }
    } else if (isContainsClass(target, "portfolio-illustration-item")) {
      setUniqueInSiblings(event.target, "portfolio-image-outlined");
    } else if (isContainsClass(target, "arrow-left")) {
      moveSlider(sliderSpeed * -1);
    } else if (isContainsClass(target, "arrow-right")) {
      moveSlider(sliderSpeed);
    }
  }

  function formSubmitHandler(event) {
    event.preventDefault();
    const form    = document.querySelector("#get_a_quote-form");
    const subject = document.querySelector("#get_a_quote-form-subject").value.toString();
    const descr   = document.querySelector("#get_a_quote-form-description").value.toString();

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

  function scrollHandler() {
    const header      = document.querySelector(".header");
    const headerOff   = header.offsetTop;
    const pageYOffset = window.pageYOffset;

    if(pageYOffset > headerOff) 
      header.classList.add("sticky");
    else 
      header.classList.remove("sticky");    
  }
});