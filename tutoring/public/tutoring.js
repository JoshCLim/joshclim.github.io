// ----- ANIMATIONS ----- //

// upon scroll past hero section, show fixed navbar

const header = document.getElementById("navbar"); // get header element
const heroSection = document.getElementById("hero__section");
const headerOffset = heroSection.offsetTop + heroSection.offsetHeight;

let scrolling = false;
window.addEventListener("scroll", function () {
  scrolling = true;
});

let manageScrollingHeader = setInterval(function () {
  // every 300ms, check for header management
  if (scrolling == true) {
    scrolling = false;

    // check if we have scrolled past the header
    if (window.scrollY >= headerOffset) {
      // we have scrolled past the header
      header.style.transform = "translateY(0px)";
    } else {
      // we can still see the header
      header.style.transform = "translateY(-100px)";
    }
  }
}, 30);

// ----- CONTENT ----- //

// fetch data about subjects offered from backend
const homeSubjectsURL = "https://ibexpert.alwaysdata.net/home/subjects";
fetch(homeSubjectsURL)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    // console.log(data);

    addSubjects(data.subjects, data.groups);
  });

// add subjects to container
function addSubjects(subjects, groups) {
  const subjectSource = document.getElementById(
    "subject__block_template"
  ).innerHTML;
  const subjectTemplate = Handlebars.compile(subjectSource);

  const subjectContainers = document.getElementsByClassName(
    "subject__containers"
  ); // console.log(subjectContainers);

  let subjectInfo = { name: "[empty]", level: "[empty]" };
  let subjectHTML;

  for (let i = 1; i < groups + 1; i++) {
    for (let j = 0; j < subjects[i - 1].length; j++) {
      subjectInfo.name = subjects[i - 1][j].name;

      if (subjects[i - 1][j].level == 1) {
        subjectInfo.level = "HL/SL";
      } else if (subjects[i - 1][j].level == 0) {
        subjectInfo.level = "SL";
      } else {
        subjectInfo.level = "SL";
        console.log("Error! Invalid Level");
      }

      subjectHTML = subjectTemplate(subjectInfo);

      subjectContainers[i - 1].innerHTML += subjectHTML;
    }
  }
}

// add tutors

// https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png" alt="profile-picture

const homeTutorsURL = "https://ibexpert.alwaysdata.net/home/tutors";
fetch(homeTutorsURL)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    // console.log(data);

    addTutors(data.tutors);
  });

function addTutors(tutors) {
  const tutorSource = document.getElementById("tutor__card_template").innerHTML;
  const tutorTemplate = Handlebars.compile(tutorSource);

  const tutorContainer = document.getElementById("tutors__container");

  let tutorHTML;

  for (let i = 0; i < tutors.length; i++) {
    tutorHTML = tutorTemplate(tutors[i]);
    tutorContainer.innerHTML += tutorHTML;
  }
}

// add FAQs
const homeFAQsURL = "https://ibexpert.alwaysdata.net/home/faqs";
fetch(homeFAQsURL)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    // console.log(data);

    addFAQs(data.faqs);
  });

function addFAQs(faqs) {
  const NUM_OF_QN_COLUMNS = 4;

  const qnSource = document.getElementById(
    "question__block_template"
  ).innerHTML;
  const qnTemplate = Handlebars.compile(qnSource);

  const qnContainers = document.getElementsByClassName("question__containers"); // console.log(qnContainers);

  let qnHTML = "";

  for (let i = 0; i < faqs.length; i++) {
    qnHTML = qnTemplate(faqs[i]);

    qnContainers[i % NUM_OF_QN_COLUMNS].innerHTML += qnHTML;
  }

  addFAQsInteraction();
}

// add FAQ interaction
function addFAQsInteraction() {
  const qnBlocks = document.getElementsByClassName("question__block"); //console.log(qnBlocks);

  for (let i = 0; i < qnBlocks.length; i++) {
    //console.log(qnBlocks[i].getElementsByTagName("span")[0]);

    qnBlocks[i]
      .getElementsByTagName("span")[0]
      .addEventListener("click", function (error) {
        if (this.dataset.open == "false") {
          //console.log('false');
          this.dataset.open = "true";
          this.innerHTML = "-";

          qnBlocks[i].getElementsByTagName("p")[0].style.height = "auto";
        } else {
          //console.log('true');
          this.dataset.open = "false";
          this.innerHTML = "+";

          qnBlocks[i].getElementsByTagName("p")[0].style.height = "0";
        }
      });
  }
}
