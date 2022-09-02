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

// add buttons
const tutorAddButton = document.getElementById("tutor-add-button");
const subjectAddButton = document.getElementById("subject-add-button");
const faqAddButton = document.getElementById("faq-add-button");
const itemAddButton = document.getElementById("item-add-button");
const tagAddButton = document.getElementById("tag-add-button");

// add form inputs
const tutorNameInput = document.getElementById("tutorInputName");
const tutorMarkInput = document.getElementById("tutorInputMark");
const tutorBioInput = document.getElementById("tutorInputBio");
const tutorSubmitInput = document.getElementById("tutorInputSubmit");

const subjectNameInput = document.getElementById("subjectInputName");
const subjectLevelInput = document.getElementById("subjectInputLevel");
const subjectGroupInput = document.getElementById("subjectInputGroup");
const subjectSubmitInput = document.getElementById("subjectInputSubmit");

const faqQnInput = document.getElementById("faqInputQn");
const faqAnsInput = document.getElementById("faqInputAns");
const faqSubmitInput = document.getElementById("faqInputSubmit");

const itemNameInput = document.getElementById("itemInputName");
const itemPriceInput = document.getElementById("itemInputPrice");
const itemDescriptionInput = document.getElementById("itemInputDescription");
const itemImageInput = document.getElementById("itemInputImage");
const itemTypeInput = document.getElementById("itemInputType");
const itemSubmitInput = document.getElementById("itemInputSubmit");

const tagNameInput = document.getElementById("tagInputName");
const tagSubmitInput = document.getElementById("tagInputSubmit");

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
      subject.group = parseInt(groupNum) + 1;

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

/* ---- ADD STUFF ---- */
tutorSubmitInput.addEventListener("click", function (event) {
  event.preventDefault();

  const name = tutorNameInput.value;
  const mark = tutorMarkInput.value;
  const bio = tutorBioInput.value;

  addHomeTutor(token, name, mark, bio);
});
subjectSubmitInput.addEventListener("click", function (event) {
  event.preventDefault();

  const name = subjectNameInput.value;
  const group = subjectGroupInput.value;
  const level = subjectLevelInput.value;

  addHomeSubject(token, name, level, group);
});
faqSubmitInput.addEventListener("click", function (event) {
  event.preventDefault();

  const question = faqQnInput.value;
  const answer = faqAnsInput.value;

  addHomeFaq(token, question, answer);
});
itemSubmitInput.addEventListener("click", function (event) {
  event.preventDefault();

  const name = itemNameInput.value;
  const price = itemPriceInput.value; // ? do i need to parseFloat()
  const imageUrl = itemImageInput.value;
  const description = itemDescriptionInput.value;
  const type = itemTypeInput.value;

  addStoreItem(token, name, price, imageUrl, description, type);
});
tagSubmitInput.addEventListener("click", function (event) {
  event.preventDefault();

  const name = tagNameInput.value;

  addStoreTag(token, name);
});

/* ---- FETCH API ---- */
// login
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

// get
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

// add
function addHomeTutor(token, name, mark, bio) {
  fetch(BASE_URL + "/siteadmin/home/addtutor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
    body: JSON.stringify({
      name: name,
      mark: mark,
      bio: bio,
    }),
  })
    .then((res) => {
      if (res.ok) {
        console.log("ADD TUTOR SUCCESSFUL");
      } else if (res.status == 500) {
        // ! change to appropriate status code (400 probably)
        console.log("BAD INPUT");
        // return { error: "error" };
      } else {
        console.log("INVALID TOKEN");
      }
      return res.json();
    })
    .then((data) => {
      // reload dashboard
      loadAdminDashboard(token);
    })
    .catch((error) => console.log(error));
}

function addHomeSubject(token, name, level, group) {
  fetch(BASE_URL + "/siteadmin/home/addsubject", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
    body: JSON.stringify({
      name: name,
      level: level,
      group: group,
    }),
  })
    .then((res) => {
      if (res.ok) {
        console.log("ADD SUBJECT SUCCESSFUL");
      } else if (res.status == 500) {
        // ! change to appropriate status code (400 probably)
        console.log("BAD INPUT");
        // return { error: "error" };
      } else {
        console.log("INVALID TOKEN");
      }
      return res.json();
    })
    .then((data) => {
      // reload dashboard
      loadAdminDashboard(token);
    })
    .catch((error) => console.log(error));
}

function addHomeFaq(token, question, answer) {
  fetch(BASE_URL + "/siteadmin/home/addfaq", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
    body: JSON.stringify({
      question: question,
      answer: answer,
    }),
  })
    .then((res) => {
      if (res.ok) {
        console.log("ADD FAQ SUCCESSFUL");
      } else if (res.status == 500) {
        // ! change to appropriate status code (400 probably)
        console.log("BAD INPUT");
        // return { error: "error" };
      } else {
        console.log("INVALID TOKEN");
      }
      return res.json();
    })
    .then((data) => {
      // reload dashboard
      loadAdminDashboard(token);
    })
    .catch((error) => console.log(error));
}

function addStoreItem(token, name, price, imageUrl, description, type) {
  fetch(BASE_URL + "/siteadmin/store/additem", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
    body: JSON.stringify({
      name: name,
      price: price,
      imageUrl: imageUrl,
      description: description,
      type: type,
    }),
  })
    .then((res) => {
      if (res.ok) {
        console.log("ADD ITEM SUCCESSFUL");
      } else if (res.status == 500) {
        // ! change to appropriate status code (400 probably)
        console.log("BAD INPUT");
        // return { error: "error" };
      } else {
        console.log("INVALID TOKEN");
      }
      return res.json();
    })
    .then((data) => {
      // reload dashboard
      loadAdminDashboard(token);
    })
    .catch((error) => console.log(error));
}

function addStoreTag(token, name) {
  fetch(BASE_URL + "/siteadmin/store/addtag", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
    body: JSON.stringify({
      name: name,
    }),
  })
    .then((res) => {
      if (res.ok) {
        console.log("ADD TAG SUCCESSFUL");
      } else if (res.status == 500) {
        // ! change to appropriate status code (400 probably)
        console.log("BAD INPUT");
        // return { error: "error" };
      } else {
        console.log("INVALID TOKEN");
      }
      return res.json();
    })
    .then((data) => {
      // reload dashboard
      loadAdminDashboard(token);
    })
    .catch((error) => console.log(error));
}
