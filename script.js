window.addEventListener("load", () => {
  document.addEventListener("click", ev => mainHandler(ev));
  document.addEventListener("submit", ev => formSubmitHandler(ev));
  document.addEventListener("scroll", scrollHandler);
  document.querySelector(".iphone-vertical").addEventListener('click', event => toggleVertical(event));
  document.querySelector(".iphone-horizontal").addEventListener('click', event => toggleHorizontal(event));

  const containsClass      = (elem, cls) => elem.classList.contains(cls);
 
  const slider       = document.querySelector(".slider");
  const slides       = [...document.querySelectorAll(".slide")];
  let currentSlide   = 0;
  let sliderEnabled  = true;

  const headerLinks  = [...document.querySelectorAll(".header-nav-link")];
  //react to scroll via intersection observer api
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.55
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

  function setUniqueInSiblings(target, cls) {
    if([...target.classList].some(e => e === cls))
      return false;
    const siblings = [...document.getElementsByClassName(cls)].filter(e => e.id !== target.id);
    target.classList.add(cls);
    siblings.forEach(sib => sib.classList.remove(cls));
    return true; 
  }

  function portfolioShuffle() {
    const illustrations = document.querySelector(".portfolio-illustration");
    const images        = [...illustrations.children];
    images.unshift(images.pop());
    while(illustrations.firstChild) {
      illustrations.firstChild.remove();
    }
    illustrations.append(...images);
  }

  function hideSlide(direction) {
    sliderEnabled = false;
    slides[currentSlide].classList.add(direction);
    slides[currentSlide].addEventListener("animationend", function() {
      this.classList.remove("current-slide", direction);
    })
  }

  function showSlide(direction) {
    slides[currentSlide].classList.add("next-slide", direction);
    slides[currentSlide].addEventListener("animationend", function() {
      this.classList.remove("next-slide", direction);
      this.classList.add("current-slide");
      sliderEnabled = true;
    })
  }

  function changeCurrentSlide(n) {
    currentSlide = (slides.length + n) % slides.length;
  }

  function previousSlide() {
    hideSlide("to-right");
    changeCurrentSlide(currentSlide - 1);
    showSlide("from-left");
  }

  function nextSlide() {
    hideSlide("to-left");
    changeCurrentSlide(currentSlide + 1);
    showSlide("from-right");
  }

  function toggleVertical(event) {
    if(containsClass(event.target, "iphone-shadow-vertical")) return;
    const screenContent = document.querySelector(".iphone-vertical > .iphone-screen-content-vertical");
    screenContent.style.display = screenContent.style.display === "none" ? "block" : "none";
  }

  function toggleHorizontal(event) {
    if(containsClass(event.target, "iphone-shadow-horizontal")) return;
    const screenContent = document.querySelector(".iphone-horizontal > .iphone-screen-content-horizontal");
    screenContent.style.display = screenContent.style.display === "none" ? "block" : "none";
  }

  function mainHandler(event) {
    const target = event.target;

    if(containsClass(target, "header-nav-link")) {
      event.preventDefault();
      const scrollTarget = document.querySelector(event.target.getAttribute("href"));
      scrollTarget.scrollIntoView({behavior: "smooth"});
    } else if(containsClass(target, "portfolio-nav-button")) {
      if(setUniqueInSiblings(event.target, "portfolio-nav-button-active")) {
        portfolioShuffle();
      }
    } else if (containsClass(target, "portfolio-illustration-item")) {
      setUniqueInSiblings(event.target, "portfolio-image-outlined");
    } else if (containsClass(target, "arrow-left")) {
      if(sliderEnabled) previousSlide();
    } else if (containsClass(target, "arrow-right")) {
      if(sliderEnabled) nextSlide();
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