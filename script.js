window.addEventListener("load", () => {
  document.addEventListener("click", ev => mainHandler(ev));
  document.addEventListener("submit", ev => formSubmitHandler(ev));

  function setUniqueInSiblings(target, cls) {
    if([...target.classList].some(e => e === cls))
      return false;
    const siblings = [...document.getElementsByClassName(cls)].filter(e => e.id !== target.id);
    target.classList.add(cls);
    siblings.map(sib => sib.classList.remove(cls)); 
  }

  function portfolioNav() {
    const illustrations = document.querySelector(".portfolio-illustration");
    const images = [...illustrations.children];
    const sorted = images.sort(() => 0.5 - Math.random());
    while(illustrations.firstChild) {
      illustrations.firstChild.remove();
    }
    sorted.forEach(img => illustrations.appendChild(img));
  }

  const slides = [...document.querySelectorAll(".slider-screen > div")];

  function moveSliderByX(rate = 1.0) {  
    const offset = 880;
    slides[0].style.left = (offset * rate) + "px";
    slides[1].style.left = (offset * rate * -1) + "px";
    slides[1].style.left = "0";
    slides.reverse();
  }

  function mainHandler(event) {
    switch(event.target.classList[0]) {
      case "header-nav-link":
        setUniqueInSiblings(event.target, "active");
        break;
      case "portfolio-nav-button":
        setUniqueInSiblings(event.target, "portfolio-nav-button-active");
        portfolioNav();
        break;
      case "portfolio-illustration-item":
        setUniqueInSiblings(event.target, "portfolio-image-outlined");
        break;
        case "arrow-left":
          moveSliderByX(-1.0);
          break;
        case "arrow-right":
          moveSliderByX(1.0);
          break;
      default:
        break;
    }
  }

  function formSubmitHandler(event) {
    event.preventDefault();
    console.log("from submit prevented");
    const subject = document.querySelector("#get_a_quote-form-subject").value;
    const descr   = document.querySelector("#get_a_quote-form-description").value;
    console.log(`subject: ${subject} descr: ${descr}`);
    const resSubject = document.querySelector("#form_submit-res-subject");
    const resDescr   = document.querySelector("#form_submit-res-description");

    resSubject.textContent = subject !== "" ? `Тема: ${subject}` : "Без темы";
    resDescr.textContent   = descr !== "" ? `Описание: ${descr}` : "Без описания";

    const windowContainer = document.querySelector("#form_submit_res-container");
    windowContainer.style.display = "block";
    const btn = document.querySelector("#form_submit-confirm_btn");
    btn.onclick = () => windowContainer.style.display = "none";
    return false;
  }
});