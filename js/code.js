const urlBase = "http://group23poosd2024.xyz";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

async function doLogin() {
  let userId = document.getElementById("loginUserId").value;
  let password = document.getElementById("loginPassword").value;

  document.getElementById("loginError").innerHTML = "";

  let tmp = { userId: userId, password: password };
  let jsonPayload = JSON.stringify(tmp);

  let url = `${urlBase}LAMPAPI/login.${extension}`;

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

    // Assuming jsonObject contains an ID to indicate successful login
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
  // Assuming you have the necessary elements in your form like signupUserId, signupPassword, etc.
  let userId = document.getElementById("signupUserId").value;
  let password = document.getElementById("signupPassword").value;
  // Add other fields as necessary

  document.getElementById("signupError").innerHTML = ""; // Assuming you have a signupError div in your HTML

  let tmp = { userId: userId, password: password }; // Add other fields as necessary
  let jsonPayload = JSON.stringify(tmp);

  let url = `${urlBase}/LAMPAPI/signup.${extension}`; // Adjust the endpoint as per your API

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

    // Handle successful signup here. Adjust based on your API response structure
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
