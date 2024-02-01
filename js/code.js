const urlBase = "http://group23poosd2024.xyz/LAMPAPI/";
const extension = "php";

//remove user id field when creating contact
//clear right column after delete success
//add logout button
//add logout function
//add click effect on contact cards
async function doLogin(usernameParam = null, passwordParam = null) {
  // Use parameters if provided; otherwise, get from document
  let loginUsername =
    usernameParam || document.getElementById("loginUsername").value;
  let loginPassword =
    passwordParam || document.getElementById("loginPassword").value;

  document.getElementById("loginError").innerHTML = "";

  let tmp = { login: loginUsername, password: loginPassword };
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

    if (parseInt(jsonObject.id) < 1) {
      document.getElementById("loginError").innerHTML =
        "User/Password combination incorrect";
      return;
    }

    // Assuming session storage logic here is correct
    sessionStorage.setItem("userId", parseInt(jsonObject.id));
    sessionStorage.setItem("firstName", jsonObject.firstName);
    sessionStorage.setItem("lastName", jsonObject.lastName);

    window.location.href = "contacts_manager_page.html";
  } catch (err) {
    document.getElementById("loginError").innerHTML = err.message;
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

    if (jsonObject.error === "") {
      // Handle signup success
      await doLogin(username, password);
    } else {
      // Handle signup error
      document.getElementById("signupError").innerHTML = jsonObject.error;
    }
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

  contacts.forEach((contact) => {
    const contactCard = `
            <div class="card contact-card" data-contact-id="${contact.ID}">
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
      const contactId = this.getAttribute("data-contact-id");
      const allContacts = JSON.parse(sessionStorage.getItem("allContacts"));
      const contact = allContacts.find((c) => c.ID === parseInt(contactId, 10));

      // Populate contact details and add Edit and Delete buttons
      const contactDetailsElement = document.getElementById("contactDetails");
      contactDetailsElement.innerHTML = `
                <div class="text-right mb-2">
                    <button id="editContactBtn" class="btn btn-primary">Edit</button>
                    <button id="deleteContactBtn" class="btn btn-danger" data-contact-id="${contact.ID}">Delete</button>
                </div>
                <div class="row justify-content-center text-center mb-4">
                    <div class="col">
                        <img
                            id="contactImage"
                            src="images/default_img.png"
                            alt="Contact Image"
                            class="rounded-circle"
                            style="width: 200px; height: 200px; object-fit: cover"
                        />
                        <h2 id="contactName">${contact.FirstName} ${contact.LastName}</h2>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6 text-left">
                        <p id="contactPhone" class="contact-detail">
                            <strong>Phone:</strong> ${contact.Phone}
                        </p>
                        <p id="contactEmail" class="contact-detail">
                            <strong>Email:</strong> ${contact.Email}
                        </p>
                    </div>
                </div>
            `;


      //reusable html for the non-editing version of contact details
      const contactDetailsHome = ` <div class="text-right mb-2">
      <button id="editContactBtn" class="btn btn-primary">Edit</button>
      <button id="deleteContactBtn" class="btn btn-danger" data-contact-id="${contact.ID}">Delete</button>
      </div>
      <div class="row justify-content-center text-center mb-4">
          <div class="col">
              <img
                  id="contactImage"
                  src="images/default_img.png"
                  alt="Contact Image"
                  class="rounded-circle"
                  style="width: 200px; height: 200px; object-fit: cover"
              />
              <h2 id="contactName">${contact.FirstName} ${contact.LastName}</h2>
          </div>
      </div>
      <div class="row">
          <div class="col-6 text-left">
              <p id="contactPhone" class="contact-detail">
                  <strong>Phone:</strong> ${contact.Phone}
              </p>
              <p id="contactEmail" class="contact-detail">
                  <strong>Email:</strong> ${contact.Email}
              </p>
          </div>
      </div>
    `;

      document
        .getElementById("deleteContactBtn")
        .addEventListener("click", function () {
          if (confirm("Are you sure you want to delete this contact?") == true){
            deleteContact(this.getAttribute("data-contact-id"));
          }
          else{
            //do nothing
          }
        });

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
                                <input type="hidden" id="editContactID" value="${contact.ID}">
                            </div>
                        </div>
                        <div class="text-center mt-3">
                            <button type="button" id="saveEditedContactBtn" class="btn btn-primary">Save Contact</button>
                        </div>
                        <div class="text-center mt-3">
                            <button type="button" id="discardEditedContactBtn" class="btn btn-danger">Cancel</button>
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
              const editedContactID =
                document.getElementById("editContactID").value;

              let url = `${urlBase}UpdateContacts.${extension}`;

              const updatePayload = {
                FirstName: editedFirstName,
                LastName: editedLastName,
                Phone: editedPhone,
                Email: editedEmail,
                ID: parseInt(editedContactID, 10),
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


          //binding discard changes button to actually discard them
          document
            .getElementById("discardEditedContactBtn")
            .addEventListener("click", async function(){

              //switch back to the non-editable contact details
              contactDetailsElement.innerHTML =  ` <div class="text-right mb-2">
              <button id="editContactBtn" class="btn btn-primary">Edit</button>
              <button id="deleteContactBtn" class="btn btn-danger" data-contact-id="${contact.ID}">Delete</button>
              </div>
              <div class="row justify-content-center text-center mb-4">
                  <div class="col">
                      <img
                          id="contactImage"
                          src="images/default_img.png"
                          alt="Contact Image"
                          class="rounded-circle"
                          style="width: 200px; height: 200px; object-fit: cover"
                      />
                      <h2 id="contactName">${contact.FirstName} ${contact.LastName}</h2>
                  </div>
              </div>
              <div class="row">
                  <div class="col-6 text-left">
                      <p id="contactPhone" class="contact-detail">
                          <strong>Phone:</strong> ${contact.Phone}
                      </p>
                      <p id="contactEmail" class="contact-detail">
                          <strong>Email:</strong> ${contact.Email}
                      </p>
                  </div>
              </div>
            `;
            
            })
          ;

        });
    });
  });
}



function deleteContact(contactId) {
  const url = `${urlBase}DeleteContact.${extension}`;
  const payload = { ID: parseInt(contactId, 10) };

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.error) {
        console.error("Error:", data.error);
      } else {
        // Successfully deleted, update contact list
        loadContacts();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Call this function after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", (event) => {
  loadContacts();
  addContactButtonListener();

  // Search button event listener
  const searchButton = document.getElementById("searchButton");
  if (searchButton) {
    searchButton.addEventListener("click", handleSearch);
  }

  // Enter key event listener for search input
  const searchInput = document.getElementById("searchContact");
  if (searchInput) {
    searchInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter" && this.value.trim() !== "") {
        event.preventDefault();
        handleSearch();
      }
    });
  }
});

function handleSearch() {
  const searchTerm = document.getElementById("searchContact").value;
  searchContacts(searchTerm);
}

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
            sessionStorage.getItem("userId"), 10
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

async function searchContacts(searchTerm) {
  let url = `${urlBase}SearchContacts.${extension}`;
  const userId = parseInt(sessionStorage.getItem("userId"), 10);

  const payload = {
    searchTerm: searchTerm,
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
      populateContacts(data.results);
    } else {
      console.log("No contacts found");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

