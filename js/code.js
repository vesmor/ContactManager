const urlBase = "http://group23poosd2024.xyz/LAMPAPI/";
const extension = "php";

//
async function doLogin() {
  let login = document.getElementById("loginUsername").value;
  let password = document.getElementById("loginPassword").value;

  document.getElementById("loginError").innerHTML = "";

  let tmp = { login: login, password: password };
  let jsonPayload = JSON.stringify(tmp);

  let url = `${urlBase}login.${extension}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: jsonPayload,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const jsonObject = await response.json();

    // Store the user's ID and name in session storage
    const userId = parseInt(jsonObject.id, 10); // Convert userId to an integer
    sessionStorage.setItem("userId", userId); // Storing the user's ID as an integer
    sessionStorage.setItem("firstName", jsonObject.firstName);
    sessionStorage.setItem("lastName", jsonObject.lastName);

    if (userId < 1) {
      document.getElementById("loginError").innerHTML =
        "User/Password combination incorrect";
      document.getElementById("loginError").classList.remove("hidden");
      return;
    }

    console.log(jsonObject);

    window.location.href = "contacts_manager_page.html";
  } catch (err) {
    document.getElementById("loginError").innerHTML = err.message;
    document.getElementById("loginError").classList.remove("hidden");
  }
}

async function doSignup() {
  let username = document.getElementById("signupUsername").value;
  let password = document.getElementById("signupPassword").value;
  let firstName = document.getElementById("signupFirstName").value;
  let lastName = document.getElementById("signupLastName").value;

  document.getElementById("signupError").innerHTML = "";

  let tmp = {
    Username: username,
    Password: password,
    FirstName: firstName,
    LastName: lastName,
  };
  let jsonPayload = JSON.stringify(tmp);

  let url = `${urlBase}signup.${extension}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: jsonPayload,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const jsonObject = await response.json();
  } catch (err) {
    document.getElementById("signupError").innerHTML = err.message;
    document.getElementById("signupError").classList.remove("hidden");
  }
}

// function saveCookie() {
//   let minutes = 20;
//   let date = new Date();
//   date.setTime(date.getTime() + minutes * 60 * 1000);
//   document.cookie =
//     "firstName=" +
//     firstName +
//     ",lastName=" +
//     lastName +
//     ",userId=" +
//     userId +
//     ";expires=" +
//     date.toGMTString();
// }

function readCookie() {
  userId = -1;
  let data = document.cookie;
  let splits = data.split(",");
  for (var i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split("=");
    if (tokens[0] == "firstName") {
      firstName = tokens[1];
    } else if (tokens[0] == "lastName") {
      lastName = tokens[1];
    } else if (tokens[0] == "userId") {
      userId = parseInt(tokens[1].trim());
    }
  }

  if (userId < 0) {
    window.location.href = "index.html";
  } else {
    document.getElementById("userName").innerHTML =
      "Logged in as " + firstName + " " + lastName;
  }
}

function doLogout() {
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "index.html";
}

async function loadContacts() {
  let url = `${urlBase}SearchContacts.${extension}`;
  const userId = parseInt(sessionStorage.getItem("userId"), 10);

  const payload = {
    searchTerm: "",
    userID: userId,
  };

  let jsonPayload = JSON.stringify(payload);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonPayload,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (data.results) {
      sessionStorage.setItem("allContacts", JSON.stringify(data.results));
      populateContacts(data.results);
    } else {
      // Handle the scenario where no contacts are returned
      console.log("No contacts found");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function populateContacts(contacts) {
  const container = document.getElementById("contactCards");
  container.innerHTML = ""; // Clear any existing content

  contacts.forEach((contact, index) => {
    const contactCard = `
      <div class="card contact-card" data-index="${index}">
        <div class="card-body">
          <h5 class="card-title">${contact.FirstName} ${contact.LastName}</h5>
          <p class="card-text">Email: ${contact.Email}</p>
          <p class="card-text">Phone: ${contact.Phone}</p>
        </div>
      </div>
    `;
    container.innerHTML += contactCard;
  });

  document.querySelectorAll(".contact-card").forEach((card) => {
    card.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      const allContacts = JSON.parse(sessionStorage.getItem("allContacts"));
      const contact = allContacts[index];

      // Update right panel with contact details and edit button
      const contactDetailsElement = document.getElementById("contactDetails");
      contactDetailsElement.innerHTML = `
        <div class="text-right mb-2">
          <button id="editContactBtn" class="btn btn-primary">Edit</button>
        </div>
        <div class="row justify-content-center text-center mb-4">
          <div class="col">
            <img
              id="contactImage"
              src="images/default_img.png"  // Placeholder image
              alt="Contact Image"
              class="rounded-circle"
              style="width: 200px; height: 200px; object-fit: cover"
            />
            <h2 id="contactName">${contact.FirstName} ${contact.LastName}</h2>
          </div>
        </div>
        <div class="row">
          <div class="col-6 text-left">
            <p id="contactFirstName" class="contact-detail">
              <strong>First Name:</strong> ${contact.FirstName}
            </p>
            <p id="contactPhone" class="contact-detail">
              <strong>Phone:</strong> ${contact.Phone}
            </p>
            <p id="contactEmail" class="contact-detail">
              <strong>Email:</strong> ${contact.Email}
            </p>
          </div>
          <div class="col-6 text-left">
            <p id="contactLastName" class="contact-detail">
              <strong>Last Name:</strong> ${contact.LastName}
            </p>
            <p id="contactUserID" class="contact-detail">
              <strong>User ID:</strong> ${contact.UserID}
            </p>
          </div>
        </div>
      `;

      document
        .getElementById("editContactBtn")
        .addEventListener("click", function () {
          // Switch to editable form for contact details
          contactDetailsElement.innerHTML = `
          <div class="row justify-content-center text-center mb-4">
            <div class="col">
              <img
                id="contactImageDisplay"
                src="images/default_img.png"
                alt="Contact Image"
                class="rounded-circle mb-2"
                style="width: 200px; height: 200px; object-fit: cover"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-6 text-left">
              <input type="text" id="editFirstName" class="form-control mb-2" placeholder="First Name" value="${contact.FirstName}">
              <input type="text" id="editPhone" class="form-control mb-2" placeholder="Phone" value="${contact.Phone}">
              <input type="email" id="editEmail" class="form-control mb-2" placeholder="Email" value="${contact.Email}">
            </div>
            <div class="col-6 text-left">
              <input type="text" id="editLastName" class="form-control mb-2" placeholder="Last Name" value="${contact.LastName}">
              <input type="text" id="editUserID" class="form-control mb-2" placeholder="User ID" value="${contact.UserID}" readonly>
            </div>
          </div>
          <div class="text-center mt-3">
            <button type="button" id="saveEditedContactBtn" class="btn btn-primary">Save Contact</button>
          </div>
        `;

          // Add event listener for the save button
          document
            .getElementById("saveEditedContactBtn")
            .addEventListener("click", async function () {
              const editedFirstName =
                document.getElementById("editFirstName").value;
              const editedLastName =
                document.getElementById("editLastName").value;
              const editedPhone = document.getElementById("editPhone").value;
              const editedEmail = document.getElementById("editEmail").value;
              const editedUserID = contact.UserID; // Assuming UserID is not editable

              let url = `${urlBase}UpdateContacts.${extension}`;

              const updatePayload = {
                FirstName: editedFirstName,
                LastName: editedLastName,
                Phone: editedPhone,
                Email: editedEmail,
                ID: editedUserID,
              };

              try {
                const response = await fetch(url, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(updatePayload),
                });

                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }

                // Handle the successful update response
                // Possibly refresh or update the contact list
                loadContacts();
              } catch (error) {
                console.error("Error:", error);
                // Handle errors, e.g., show an error message
              }
            });
        });
    });
  });
}

// Call this function after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", (event) => {
  loadContacts();
  addContactButtonListener();
});

function updateSignedInAs() {
  document.addEventListener("DOMContentLoaded", () => {
    const firstName = sessionStorage.getItem("firstName");
    const lastName = sessionStorage.getItem("lastName");
    if (firstName && lastName && document.getElementById("username")) {
      document.getElementById(
        "username"
      ).textContent = `${firstName} ${lastName}`;
    }
  });
}

// Function to add an event listener to the "Add Contact" button
function addContactButtonListener() {
  const addContactBtn = document.getElementById("addContactBtn");
  if (addContactBtn) {
    addContactBtn.addEventListener("click", function () {
      document.getElementById("contactDetails").innerHTML = `
    <div class="row justify-content-center text-center mb-4">
      <div class="col">
        <img
          id="contactImageDisplay"
          src="images/default_img.png"
          alt="Contact Image"
          class="rounded-circle mb-2"
          style="width: 200px; height: 200px; object-fit: cover"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-6 text-left">
        <input type="text" id="contactFirstName" class="form-control mb-2" placeholder="First Name">
        <input type="text" id="contactPhoneInput" class="form-control mb-2" placeholder="Phone">
        <input type="email" id="contactEmailInput" class="form-control mb-2" placeholder="Email">
      </div>
      <div class="col-6 text-left">
        <input type="text" id="contactLastName" class="form-control mb-2" placeholder="Last Name">
        <input type="text" id="contactUserIDInput" class="form-control mb-2" placeholder="User ID">
      </div>
    </div>

    <div class="text-center mt-3">
      <button type="button" id="saveContactBtn" class="btn btn-primary">Save Contact</button>
    </div>
  `;

      document
        .getElementById("saveContactBtn")
        .addEventListener("click", async function (e) {
          e.preventDefault();

          const firstName = document.getElementById("contactFirstName").value;
          const lastName = document.getElementById("contactLastName").value;
          const phone = document.getElementById("contactPhoneInput").value;
          const email = document.getElementById("contactEmailInput").value;
          const userId = parseInt(
            document.getElementById("contactUserIDInput").value
          );

          const payload = {
            FirstName: firstName,
            LastName: lastName,
            Phone: phone,
            Email: email,
            UserID: userId,
          };
          const jsonPayload = JSON.stringify(payload);

          const url = `${urlBase}AddContacts.${extension}`;

          try {
            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json; charset=UTF-8",
              },
              body: jsonPayload,
            });

            if (!response.ok) {
              throw new Error("Network response was not ok");
            }

            const jsonObject = await response.json();
            // Handle the response here, e.g., show success message, clear the form, etc.
            loadContacts();
          } catch (error) {
            console.error("Error:", error);
            // Handle the error here, e.g., show error message
          }
        });
    });
  }
}
