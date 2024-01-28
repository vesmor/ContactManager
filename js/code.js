const urlBase = "http://group23poosd2024.xyz/LAMPAPI/";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

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

    userId = jsonObject.id;

    if (userId < 1) {
      document.getElementById("loginError").innerHTML =
        "User/Password combination incorrect";
      document.getElementById("loginError").classList.remove("hidden");
      return;
    }

    firstName = jsonObject.firstName;
    lastName = jsonObject.lastName;
    userId = jsonObject.id;

    console.log(jsonObject);

    saveCookie();

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

// function readCookie() {
//   userId = -1;
//   let data = document.cookie;
//   let splits = data.split(",");
//   for (var i = 0; i < splits.length; i++) {
//     let thisOne = splits[i].trim();
//     let tokens = thisOne.split("=");
//     if (tokens[0] == "firstName") {
//       firstName = tokens[1];
//     } else if (tokens[0] == "lastName") {
//       lastName = tokens[1];
//     } else if (tokens[0] == "userId") {
//       userId = parseInt(tokens[1].trim());
//     }
//   }

//   if (userId < 0) {
//     window.location.href = "index.html";
//   } else {
//     document.getElementById("userName").innerHTML =
//       "Logged in as " + firstName + " " + lastName;
//   }
// }

function doLogout() {
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "index.html";
}

document.getElementById("addContactBtn").addEventListener("click", function () {
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
      } catch (error) {
        console.error("Error:", error);
        // Handle the error here, e.g., show error message
      }
    });
});

// async function loadContacts() {
//   let url = `${urlBase}SearchContacts.${extension}`;

//   const payload = {
//     searchTerm: "",
//     userID: userId,
//   };

//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }

//     const data = await response.json();
//     allContacts = data.results;
//     populateContacts(data.results);

//     // Optionally, store the contacts in local storage
//     localStorage.setItem("contacts", JSON.stringify(data.results));
//   } catch (error) {
//     console.error("Error:", error);
//     // Handle errors, e.g., show an error message
//   }
// }

// function populateContacts(contacts) {
//   const container = document.getElementById(contactCards);
//   container.innerHTML = ""; // Clear any existing content

//   contacts.forEach((contact) => {
//     const contactCard = `
//             <div class="card">
//               <div class="card-body">
//                 <h5 class="card-title">${contact.FirstName} ${contact.LastName}</h5>
//                 <p class="card-text">Email: ${contact.Email}</p>
//                 <p class="card-text">Phone: ${contact.Phone}</p>
//               </div>
//             </div>
//         `;
//     container.innerHTML += contactCard;
//   });

//   // Add event listeners to each contact card
//   document.querySelectorAll(".contact-card").forEach((card) => {
//     card.addEventListener("click", function () {
//       const contactId = this.getAttribute("data-id");
//       // Find the contact details by contactId or fetch from the server
//       // For example: const contactDetails = contacts.find(c => c.ID === contactId);
//       // Then populate the right panel
//       // ...
//     });
//   });
// }

document.addEventListener("DOMContentLoaded", (event) => {
  loadContacts();
});
