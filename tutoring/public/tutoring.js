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

// add subjects
// 1 = HL and SL, 0 = SL only

const IB_GROUPS = 6;

const SUBJECTS = [
  [
    { name: "English A: Language and Literature", level: 1 },
    { name: "English A: Literature", level: 1 },
  ],
  [
    { name: "French B", level: 0 },
    { name: "Latin B", level: 0 },
  ],
  [
    { name: "Business Management", level: 1 },
    { name: "Economics", level: 1 },
    { name: "Psychology", level: 1 },
  ],
  [
    { name: "Chemistry", level: 0 },
    { name: "Physics", level: 1 },
  ],
  [
    { name: "Mathematics: Applications and Interpretations", level: 0 },
    { name: "Mathematics: Analysis and Approaches", level: 1 },
  ],
  [{ name: "Visual Arts", level: 1 }],
];

const subjectSource = document.getElementById(
  "subject__block_template"
).innerHTML;
const subjectTemplate = Handlebars.compile(subjectSource);

const subjectContainers = document.getElementsByClassName(
  "subject__containers"
); // console.log(subjectContainers);

let subjectInfo = { name: "[empty]", level: "[empty]" };
let subjectHTML;

for (let i = 1; i < IB_GROUPS + 1; i++) {
  for (let j = 0; j < SUBJECTS[i - 1].length; j++) {
    subjectInfo.name = SUBJECTS[i - 1][j].name;

    if (SUBJECTS[i - 1][j].level == 1) {
      subjectInfo.level = "HL/SL";
    } else if (SUBJECTS[i - 1][j].level == 0) {
      subjectInfo.level = "SL";
    } else {
      console.log("Error! Invalid Level");
    }

    subjectHTML = subjectTemplate(subjectInfo);

    subjectContainers[i - 1].innerHTML += subjectHTML;
  }
}

// add tutors

// https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png" alt="profile-picture

const TUTORS = [
  {
    name: "Josh Lim",
    mark: 45,
    description: "pretty good lookin guy if you ask me",
    picURL:
      "https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png",
  },
  {
    name: "Joe",
    mark: 69,
    description: "hehe nice",
    picURL:
      "https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png",
  },
  {
    name: "Mr Madoofi",
    mark: 45,
    description: "to die for",
    picURL:
      "https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png",
  },
  {
    name: "Lord Voldemort",
    mark: 45,
    description: "black hoodies ftw",
    picURL:
      "https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png",
  },
  {
    name: "Mrs Chan",
    mark: 45,
    description: "My favourite type of men: ramen",
    picURL:
      "https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png",
  },
];

const tutorSource = document.getElementById("tutor__card_template").innerHTML;
const tutorTemplate = Handlebars.compile(tutorSource);

const tutorContainer = document.getElementById("tutors__container"); // console.log(tutorContainer);

let tutorHTML;

for (let i = 0; i < TUTORS.length; i++) {
  tutorHTML = tutorTemplate(TUTORS[i]);
  tutorContainer.innerHTML += tutorHTML;
}

// add FAQs

const FAQS = [
  {
    question: "Heya",
    answer: "How u doin",
  },
  {
    question: "Why IBExpert?",
    answer:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente id officia porro fugit necessitatibus commodi, impedit suscipit. Earum recusandae numquam officia aspernatur quod debitis! Praesentium voluptates alias eos nulla facilis?",
  },
  {
    question: "Yeeto",
    answer:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente id officia porro fugit necessitatibus commodi, impedit suscipit. Earum recusandae numquam officia aspernatur quod debitis! Praesentium voluptates alias eos nulla facilis?",
  },
  {
    question: "adfjklsdfl;kajsf",
    answer:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente id officia porro fugit necessitatibus commodi, impedit suscipit. Earum recusandae numquam officia aspernatur quod debitis! Praesentium voluptates alias eos nulla facilis?",
  },
  {
    question: "adfjklsdfl;kajsf",
    answer:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente id officia porro fugit necessitatibus commodi, impedit suscipit. Earum recusandae numquam officia aspernatur quod debitis! Praesentium voluptates alias eos nulla facilis?",
  },
  {
    question: "adfjklsdfl;kajsf",
    answer:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente id officia porro fugit necessitatibus commodi, impedit suscipit. Earum recusandae numquam officia aspernatur quod debitis! Praesentium voluptates alias eos nulla facilis?",
  },
  {
    question: "adfjklsdfl;kajsf",
    answer:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente id officia porro fugit necessitatibus commodi, impedit suscipit. Earum recusandae numquam officia aspernatur quod debitis! Praesentium voluptates alias eos nulla facilis?",
  },
  {
    question: "adfjklsdfl;kajsf",
    answer:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente id officia porro fugit necessitatibus commodi, impedit suscipit. Earum recusandae numquam officia aspernatur quod debitis! Praesentium voluptates alias eos nulla facilis?",
  },
  {
    question: "adfjklsdfl;kajsf",
    answer:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente id officia porro fugit necessitatibus commodi, impedit suscipit. Earum recusandae numquam officia aspernatur quod debitis! Praesentium voluptates alias eos nulla facilis?",
  },
  {
    question: "adfjklsdfl;kajsf",
    answer:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente id officia porro fugit necessitatibus commodi, impedit suscipit. Earum recusandae numquam officia aspernatur quod debitis! Praesentium voluptates alias eos nulla facilis?",
  },
  {
    question: "adfjklsdfl;kajsf",
    answer:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente id officia porro fugit necessitatibus commodi, impedit suscipit. Earum recusandae numquam officia aspernatur quod debitis! Praesentium voluptates alias eos nulla facilis?",
  },
  {
    question: "adfjklsdfl;kajsf",
    answer:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente id officia porro fugit necessitatibus commodi, impedit suscipit. Earum recusandae numquam officia aspernatur quod debitis! Praesentium voluptates alias eos nulla facilis?",
  },
  {
    question: "adfjklsdfl;kajsf",
    answer:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente id officia porro fugit necessitatibus commodi, impedit suscipit. Earum recusandae numquam officia aspernatur quod debitis! Praesentium voluptates alias eos nulla facilis?",
  },
  {
    question: "adfjklsdfl;kajsf",
    answer:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente id officia porro fugit necessitatibus commodi, impedit suscipit. Earum recusandae numquam officia aspernatur quod debitis! Praesentium voluptates alias eos nulla facilis?",
  },
  {
    question: "adfjklsdfl;kajsf",
    answer:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente id officia porro fugit necessitatibus commodi, impedit suscipit. Earum recusandae numquam officia aspernatur quod debitis! Praesentium voluptates alias eos nulla facilis?",
  },
  {
    question: "adfjklsdfl;kajsf",
    answer:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente id officia porro fugit necessitatibus commodi, impedit suscipit. Earum recusandae numquam officia aspernatur quod debitis! Praesentium voluptates alias eos nulla facilis?",
  },
];

const NUM_OF_QN_COLUMNS = 4;

const qnSource = document.getElementById("question__block_template").innerHTML;
const qnTemplate = Handlebars.compile(qnSource);

const qnContainers = document.getElementsByClassName("question__containers"); // console.log(qnContainers);

let qnHTML;

for (let i = 0; i < FAQS.length; i++) {
  qnHTML = qnTemplate(FAQS[i]);

  qnContainers[i % NUM_OF_QN_COLUMNS].innerHTML += qnHTML;
}

// add FAQ interaction

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
