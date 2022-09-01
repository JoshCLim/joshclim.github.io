const BASE_URL = "https://ibexpert.alwaysdata.net";
let token = "0";

const globalContainer = document.getElementById("global-container");
globalContainer.style.display = "none";
const headerContainer = document.getElementById("header-container");

// login form elements
const loginEmailInput = document.getElementById("loginInputEmail");
const loginPasswordInput = document.getElementById("loginInputPassword");
const loginSubmitInput = document.getElementById("loginInputSubmit");
const loginCloseBtn = document.querySelector("#loginModal button.btn-close");

// items get container -- container is a table
const tutorsTable = document.querySelector("#tutors-table tbody");
const subjectsTable = document.querySelector("#subjects-table tbody");
const faqsTable = document.querySelector("#faqs-table tbody");
const itemsTable = document.querySelector("#items-table tbody");
const tagsTable = document.querySelector("#tags-table tbody");
const subjectsGroupCountSpan = document.getElementById("subjects-group-count");

// handlebars templates
const tutorRowSource = document.getElementById("tutor-row").innerHTML;
const tutorRowTemplate = Handlebars.compile(tutorRowSource);
const subjectRowSource = document.getElementById("subject-row").innerHTML;
const subjectRowTemplate = Handlebars.compile(subjectRowSource);
const faqRowSource = document.getElementById("faq-row").innerHTML;
const faqRowTemplate = Handlebars.compile(faqRowSource);
const itemRowSource = document.getElementById("item-row").innerHTML;
const itemRowTemplate = Handlebars.compile(itemRowSource);
const tagRowSource = document.getElementById("tag-row").innerHTML;
const tagRowTemplate = Handlebars.compile(tagRowSource);

/* ---- LOGIN ---- */
// login button clicked
loginSubmitInput.addEventListener("click", function (event) {
  event.preventDefault();

  const email = loginEmailInput.value;
  const password = loginPasswordInput.value;

  loginEmailInput.value = "";
  loginPasswordInput.value = "";

  siteAdminLogin(email, password);
});

// if login form closes, clear input fields
loginCloseBtn.addEventListener("click", function (event) {
  loginEmailInput.value = "";
  loginPasswordInput.value = "";
});

/* ---- LOAD STUFF ---- */
// upon successful login
function loadAdminDashboard(token) {
  globalContainer.style.display = "block";
  headerContainer.classList.add("d-none");

  getHomeTutors();
  getHomeFaqs();
  getHomeSubjects();
  getStoreItems();
  getStoreTags();

  console.log(token);
}

function loadHomeTutors(tutors) {
  tutorsTable.innerHTML = "";

  tutors.tutors.forEach((tutor) => {
    let tutorRowHTML = tutorRowTemplate(tutor);
    tutorsTable.innerHTML += tutorRowHTML;
  });
}

function loadHomeSubjects(subjects) {
  subjectsTable.innerHTML = "";

  const groups = subjects.groups;
  subjectsGroupCountSpan.innerText = groups;

  for (const groupNum in subjects.subjects) {
    const formatted = subjects.subjects[groupNum].map((subject) => {
      subject.group = groupNum + 1;

      if (subject.level === 1) {
        subject.level = "HL/SL";
      } else {
        subject.level = "SL";
      }

      return subject;
    });

    formatted.forEach((subject) => {
      let subjectRowHTML = subjectRowTemplate(subject);
      subjectsTable.innerHTML += subjectRowHTML;
    });
  }
}

function loadHomeFaqs(faqs) {
  faqsTable.innerHTML = "";

  for (const val of faqs.faqs) {
    let faqRowHTML = faqRowTemplate(val);
    faqsTable.innerHTML += faqRowHTML;
  }
}

function loadStoreItems(items) {
  itemsTable.innerHTML = "";

  const formatted = items.items.map((item) => {
    item.type = item.type.toLowerCase();

    item.tags = item.tags.map((tagId) => {
      return items.tags.filter((tag) => tag.id === tagId)[0].name;
    });

    return item;
  });
  formatted.forEach((item) => {
    let itemRowHTML = itemRowTemplate(item);
    itemsTable.innerHTML += itemRowHTML;
  });
}

function loadStoreTags(tags) {
  tagsTable.innerHTML = "";

  tags.tags.forEach((tag) => {
    let tagRowHTML = tagRowTemplate(tag);
    tagsTable.innerHTML += tagRowHTML;
  });
}

/* ---- FETCH API ---- */
function siteAdminLogin(email, password) {
  fetch(BASE_URL + "/siteadmin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((res) => {
      if (res.ok) {
        console.log("LOGIN SUCCESSFUL");
      } else if (res.status == 500) {
        // ! change to appropriate status code (403 probably)
        console.log("INCORRECT LOGIN");
        // return { error: "error" };
      } else {
        console.log("LOGIN FAILED");
      }
      return res.json();
    })
    .then((data) => {
      token = data.token;
      loadAdminDashboard(token);
    })
    .catch((error) => console.log(error));
}

function siteAdminLogout(token) {
  fetch(BASE_URL + "/siteadmin/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
    body: JSON.stringify({}),
  })
    .then((res) => {
      if (res.ok) {
        console.log("LOGOUT SUCCESSFUL");
      } else {
        console.log("LOGOUT FAILED");
        // return { error: "error" };
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => console.log(error));
}

function getHomeTutors() {
  fetch(BASE_URL + "/home/tutors")
    .then((res) => {
      if (res.ok) {
        console.log("GET TUTORS SUCCESSFUL");
      } else {
        console.log("GET TUTORS FAILED");
        // return { error: "error" };
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      loadHomeTutors(data);
    })
    .catch((error) => console.log(error));
}

function getHomeSubjects() {
  fetch(BASE_URL + "/home/subjects")
    .then((res) => {
      if (res.ok) {
        console.log("GET SUBJECTS SUCCESSFUL");
      } else {
        console.log("GET SUBJECTS FAILED");
        // return { error: "error" };
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      loadHomeSubjects(data);
    })
    .catch((error) => console.log(error));
}

function getHomeFaqs() {
  fetch(BASE_URL + "/home/faqs")
    .then((res) => {
      if (res.ok) {
        console.log("GET FAQs SUCCESSFUL");
      } else {
        console.log("GET FAQs FAILED");
        // return { error: "error" };
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      loadHomeFaqs(data);
    })
    .catch((error) => console.log(error));
}

function getStoreItems() {
  fetch(BASE_URL + "/store/items")
    .then((res) => {
      if (res.ok) {
        console.log("GET STORE ITEMS SUCCESSFUL");
      } else {
        console.log("GET STORE ITEMS FAILED");
        // return { error: "error" };
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      loadStoreItems(data);
    })
    .catch((error) => console.log(error));
}

function getStoreTags() {
  fetch(BASE_URL + "/store/tags")
    .then((res) => {
      if (res.ok) {
        console.log("GET STORE TAGS SUCCESSFUL");
      } else {
        console.log("GET STORE TAGS FAILED");
        // return { error: "error" };
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      loadStoreTags(data);
    })
    .catch((error) => console.log(error));
}
