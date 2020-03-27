"use strict";
window.addEventListener("load", () => {
  document.addEventListener("click", ev => mainHandler(ev));
  document.addEventListener("submit", ev => formSubmitHandler(ev));
  document.addEventListener("scroll", scrollHandler);
  document.querySelector(".iphone-vertical").addEventListener('click', event => toggleVertical(event));
  document.querySelector(".iphone-horizontal").addEventListener('click', event => toggleHorizontal(event));
  document.querySelector(".header-nav-menu-button").addEventListener('click', event => toggleBurgerMenu());
  const containsClass = (elem, cls) => elem.classList.contains(cls);
 
  scrollHandler(); //check if sticky header has to be enabled

  const slider       = document.querySelector(".slider");
  const slides       = [...document.querySelectorAll(".slide")];
  let currentSlide   = 0;
  let sliderEnabled  = true;

  function setUniqueInSiblings(target, cls) {
    if(containsClass(target, cls))
      return false;
    const siblings = document.querySelectorAll(`.${cls}`);
    siblings.forEach(sib => sib.classList.remove(cls));
    target.classList.add(cls);
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
      slider.style.backgroundColor = window.getComputedStyle(slides[currentSlide])['background-color'];
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
    screenContent.classList.toggle("hidden");
  }

  function toggleHorizontal(event) {
    if(containsClass(event.target, "iphone-shadow-horizontal")) return;
    const screenContent = document.querySelector(".iphone-horizontal > .iphone-screen-content-horizontal");
    screenContent.classList.toggle("hidden");
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

  function toggleBurgerMenu() {
    const menuIcon = document.querySelector(".header-nav-menu-button");
    const menu     = document.querySelector(".header-nav");
    const overlay  = document.querySelector(".overlay");
    const logo     = document.querySelector(".header-logo");
    menu.classList.toggle("hidden");
    menuIcon.classList.toggle("rotated");
    overlay.classList.toggle("hidden");
    logo.classList.toggle("moved-left");
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
    windowContainer.classList.toggle("hidden");
    const btn = document.querySelector("#form_submit-confirm_btn");
    btn.onclick = () => {
      windowContainer.classList.add("hidden");
      form.reset();
    }    
  }

  function scrollHandler() {
    const header       = document.querySelector(".header");
    const headerOff    = header.offsetTop;
    const pageYOffset  = window.pageYOffset;
    const menuLinks    = [...document.querySelectorAll(".header-nav-link")];
    const anchors      = [document.querySelector("#home"), ...document.querySelectorAll(".content > section")];
    const headerHeight = parseFloat(window.getComputedStyle(header, null).height);
    const curPos       = window.scrollY + headerHeight;
    
    anchors.forEach (anchor => {
      if(curPos >= anchor.offsetTop && (anchor.offsetTop + anchor.offsetHeight) >= curPos) {
        menuLinks
          .filter(ml => ml.getAttribute("href").substring(1) === anchor.getAttribute("id"))
          .forEach(ml => setUniqueInSiblings(ml, "active"));
      }
    })

    if(pageYOffset > headerOff) 
      header.classList.add("sticky");
    else 
      header.classList.remove("sticky");    
  }
});