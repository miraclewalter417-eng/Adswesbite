let isLogin = true;

const nameField = document.getElementById("name");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const toggleText = document.querySelector(".toggle");
const message = document.getElementById("message");

function toggleForm() {
  isLogin = !isLogin;
  nameField.style.display = isLogin ? "none" : "block";
  formTitle.textContent = isLogin ? "Login" : "Register";
  submitBtn.textContent = isLogin ? "Login" : "Register";
  toggleText.textContent = isLogin
    ? "Don't have an account? Register"
    : "Already have an account? Login";
  message.textContent = "";
}

function togglePassword() {
  const pass = document.getElementById("password");
  pass.type = pass.type === "password" ? "text" : "password";
}

submitBtn.addEventListener("click", () => {
  const name = nameField.value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password || (!isLogin && !name)) {
    message.textContent = "Please fill all fields.";
    return;
  }

  if (isLogin) {
    const users = JSON.parse(localStorage.getItem("users"));
    if (!users) {
      return (message.textContent = "Invalid email or password.");
    }
    const userByEmail = users.find((user) => user.email === email);
    if (!userByEmail) {
      return (message.textContent = "Invalid email or password.");
    }
    console.log({ userByEmail });

    if (userByEmail && userByEmail.password === password) {
      localStorage.setItem("currentUser", JSON.stringify(userByEmail));
      // const currentUser =
      message.style.color = "green";
      message.textContent = "Login successful!";
      setTimeout(() => {
        window.location.href = "user.html";
      }, 1000);
    } else {
      message.textContent = "Invalid email or password.";
    }
  } else {
    const newUser = { name, email, password, balance: 0 };
    const users = JSON.parse(localStorage.getItem("users")) ?? [];

    const latestUsers = [...users, newUser];
    console.log({ latestUsers });

    localStorage.setItem("users", JSON.stringify(latestUsers));
    message.style.color = "green";
    message.textContent = "Registration successful!";
    setTimeout(() => {
      window.location.href = "user.html";
    }, 1000);
  }
});
