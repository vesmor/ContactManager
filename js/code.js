const urlBase = "http://group23poosd2024.xyz/LAMPAPI/";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

async function doLogin() {
  let userId = document.getElementById("loginUserId").value;
  let password = document.getElementById("loginPassword").value;

  document.getElementById("loginError").innerHTML = "";

  let tmp = { login: userId, password: password };
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

    saveCookie();

    window.location.href = "contacts_manager_page.html";
  } catch (err) {
    document.getElementById("loginError").innerHTML = err.message;
    document.getElementById("loginError").classList.remove("hidden");
  }
}

async function doSignup() {
  let userId = document.getElementById("signupUserId").value;
  let password = document.getElementById("signupPassword").value;
  let firstName = document.getElementById("signupFirstName").value;
  let lastName = document.getElementById("signupLastName").value;

  document.getElementById("signupError").innerHTML = "";

  let tmp = {
    Username: userId,
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

function saveCookie() {
  let minutes = 20;
  let date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie =
    "firstName=" +
    firstName +
    ",lastName=" +
    lastName +
    ",userId=" +
    userId +
    ";expires=" +
    date.toGMTString();
}

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

function addColor() {
  let newColor = document.getElementById("colorText").value;
  document.getElementById("colorAddResult").innerHTML = "";

  let tmp = { color: newColor, userId, userId };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/AddColor." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("colorAddResult").innerHTML =
          "Color has been added";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("colorAddResult").innerHTML = err.message;
  }
}

function searchColor() {
  let srch = document.getElementById("searchText").value;
  document.getElementById("colorSearchResult").innerHTML = "";

  let colorList = "";

  let tmp = { search: srch, userId: userId };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/SearchColors." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("colorSearchResult").innerHTML =
          "Color(s) has been retrieved";
        let jsonObject = JSON.parse(xhr.responseText);

        for (let i = 0; i < jsonObject.results.length; i++) {
          colorList += jsonObject.results[i];
          if (i < jsonObject.results.length - 1) {
            colorList += "<br />\r\n";
          }
        }

        document.getElementsByTagName("p")[0].innerHTML = colorList;
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("colorSearchResult").innerHTML = err.message;
  }
}

document.querySelectorAll(".contact-card").forEach((card) => {
  card.addEventListener("click", function () {
    // Example of retrieving data - replace this with actual data retrieval
    const contactData = {
      firstName: "John",
      lastName: "Doe",
      phone: "123-456-7890",
      email: "johndoe@example.com",
      userId: "1001",
    };

    // Update the right column with the contact's information
    document.getElementById("contactFirstName").textContent =
      "First Name: " + contactData.firstName;
    document.getElementById("contactLastName").textContent =
      "Last Name: " + contactData.lastName;
    document.getElementById("contactPhone").textContent =
      "Phone: " + contactData.phone;
    document.getElementById("contactEmail").textContent =
      "Email: " + contactData.email;
    document.getElementById("contactUserID").textContent =
      "UserID: " + contactData.userId;
  });
});
