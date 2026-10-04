/* =========================================================
   ARIF & MUSKAN — WEDDING INVITATION
   PAGE NAVIGATION
========================================================= */

const pages = [...document.querySelectorAll(".page")];
const dots = document.getElementById("dots");
const book = document.getElementById("book");

const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const replayButton = document.getElementById("replay");

let current = 0;
let locked = false;


/* =========================================================
   CREATE PAGE DOTS
========================================================= */

pages.forEach((_, index) => {

  const dot = document.createElement("span");

  dot.className =
    index === 0
      ? "dot active"
      : "dot";

  dot.setAttribute(
    "aria-label",
    `Go to page ${index + 1}`
  );

  dot.addEventListener("click", () => {
    goTo(index);
  });

  dots.appendChild(dot);

});


/* =========================================================
   UPDATE NAVIGATION
========================================================= */

function updateNavigation() {

  /* Update dots */

  [...dots.children].forEach((dot, index) => {

    dot.classList.toggle(
      "active",
      index === current
    );

  });


  /* Disable Previous on first page */

  if (prevButton) {

    prevButton.disabled =
      current === 0;

    prevButton.style.opacity =
      current === 0
        ? "0.35"
        : "1";

  }


  /* Disable Next on last page */

  if (nextButton) {

    nextButton.disabled =
      current === pages.length - 1;

    nextButton.style.opacity =
      current === pages.length - 1
        ? "0.35"
        : "1";

  }

}


/* =========================================================
   GO TO PAGE
========================================================= */

function goTo(nextPage) {

  /*
    Stop if:
    - animation is running
    - same page
    - invalid page
  */

  if (
    locked ||
    nextPage === current ||
    nextPage < 0 ||
    nextPage >= pages.length
  ) {
    return;
  }


  locked = true;


  const oldPage =
    pages[current];

  const newPage =
    pages[nextPage];


  const movingForward =
    nextPage > current;


  /* Remove current state */

  oldPage.classList.remove(
    "active"
  );


  /* Exit animation */

  oldPage.classList.add(
    movingForward
      ? "exit-left"
      : "exit-right"
  );


  /* Prepare new page */

  newPage.classList.add(
    movingForward
      ? "enter-right"
      : "enter-left"
  );


  /*
    Start new page animation
  */

  requestAnimationFrame(() => {

    requestAnimationFrame(() => {

      newPage.classList.remove(
        "enter-right",
        "enter-left"
      );

      newPage.classList.add(
        "active"
      );

    });

  });


  /*
    Wait for CSS animation
  */

  setTimeout(() => {

    oldPage.classList.remove(
      "exit-left",
      "exit-right"
    );


    current =
      nextPage;


    updateNavigation();


    locked = false;

  }, 900);

}


/* =========================================================
   NEXT / PREVIOUS BUTTONS
========================================================= */

if (nextButton) {

  nextButton.addEventListener(
    "click",
    () => {

      goTo(
        current + 1
      );

    }
  );

}


if (prevButton) {

  prevButton.addEventListener(
    "click",
    () => {

      goTo(
        current - 1
      );

    }
  );

}


/* =========================================================
   REPLAY
========================================================= */

if (replayButton) {

  replayButton.addEventListener(
    "click",
    () => {

      if (current !== 0) {

        goTo(0);

      }

    }
  );

}


/* =========================================================
   TAP LEFT / RIGHT SIDE
========================================================= */

book.addEventListener(
  "click",
  (event) => {

    /*
      Don't navigate when clicking:
      - buttons
      - dots
    */

    if (
      event.target.closest("button") ||
      event.target.closest(".dot")
    ) {

      return;

    }


    const rect =
      book.getBoundingClientRect();


    const clickX =
      event.clientX -
      rect.left;


    const width =
      rect.width;


    /*
      Right side = next
    */

    if (
      clickX >
      width * 0.62
    ) {

      goTo(
        current + 1
      );

    }


    /*
      Left side = previous
    */

    else if (
      clickX <
      width * 0.38
    ) {

      goTo(
        current - 1
      );

    }

  }
);


/* =========================================================
   SWIPE
========================================================= */

let startX = 0;
let startY = 0;


book.addEventListener(
  "touchstart",
  (event) => {

    const touch =
      event.changedTouches[0];

    startX =
      touch.clientX;

    startY =
      touch.clientY;

  },
  {
    passive: true
  }
);


book.addEventListener(
  "touchend",
  (event) => {

    const touch =
      event.changedTouches[0];


    const deltaX =
      touch.clientX -
      startX;


    const deltaY =
      touch.clientY -
      startY;


    /*
      Only horizontal swipe
    */

    if (
      Math.abs(deltaX) > 45 &&
      Math.abs(deltaX) >
      Math.abs(deltaY)
    ) {

      if (deltaX < 0) {

        /* Swipe left → next */

        goTo(
          current + 1
        );

      } else {

        /* Swipe right → previous */

        goTo(
          current - 1
        );

      }

    }

  },
  {
    passive: true
  }
);


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "ArrowRight" ||
      event.key === " "
    ) {

      event.preventDefault();

      goTo(
        current + 1
      );

    }


    if (
      event.key === "ArrowLeft"
    ) {

      event.preventDefault();

      goTo(
        current - 1
      );

    }

  }
);


/* =========================================================
   MOUSE WHEEL
========================================================= */

let lastWheelTime = 0;


book.addEventListener(
  "wheel",
  (event) => {

    event.preventDefault();


    const now =
      Date.now();


    /*
      Prevent very fast page switching
    */

    if (
      now - lastWheelTime <
      700
    ) {

      return;

    }


    lastWheelTime =
      now;


    if (
      event.deltaY > 0
    ) {

      /* Scroll down → next */

      goTo(
        current + 1
      );

    } else {

      /* Scroll up → previous */

      goTo(
        current - 1
      );

    }

  },
  {
    passive: false
  }
);


/* =========================================================
   INITIAL STATE
========================================================= */

updateNavigation();
// =========================
// WEDDING MUSIC
// =========================

const weddingMusic = document.getElementById("weddingMusic");

function startWeddingMusic() {
  if (!weddingMusic) return;

  weddingMusic.volume = 0.45;

  weddingMusic.play().catch(() => {
    // Browser autoplay blocked — music will start after user interaction
  });
}

// Start music on first user interaction
document.addEventListener("click", startWeddingMusic, { once: true });
document.addEventListener("touchstart", startWeddingMusic, { once: true });