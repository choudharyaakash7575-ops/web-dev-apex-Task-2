// =====================================================
// Task 2 - Form validation + dynamic to-do list
// =====================================================

// ---------- Contact form validation ----------
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function setError(input, message) {
  const errorEl = document.getElementById(input.id + "Error");
  errorEl.textContent = message;
  input.classList.toggle("invalid", Boolean(message));
  input.classList.toggle("valid", !message);
  return !message;
}

function validateName() {
  const field = document.getElementById("name");
  const value = field.value.trim();
  if (!value) return setError(field, "Name is required.");
  if (value.length < 2) return setError(field, "Name must be at least 2 characters.");
  return setError(field, "");
}

function validateEmail() {
  const field = document.getElementById("email");
  const value = field.value.trim();
  if (!value) return setError(field, "Email is required.");
  if (!emailPattern.test(value)) return setError(field, "Please enter a valid email (e.g. name@example.com).");
  return setError(field, "");
}

function validateSubject() {
  const field = document.getElementById("subject");
  if (!field.value) return setError(field, "Please select a subject.");
  return setError(field, "");
}

function validateMessage() {
  const field = document.getElementById("message");
  const value = field.value.trim();
  if (!value) return setError(field, "Message is required.");
  if (value.length < 10) return setError(field, "Message must be at least 10 characters.");
  return setError(field, "");
}

// Live feedback when leaving a field
document.getElementById("name").addEventListener("blur", validateName);
document.getElementById("email").addEventListener("blur", validateEmail);
document.getElementById("subject").addEventListener("change", validateSubject);
document.getElementById("message").addEventListener("blur", validateMessage);

contactForm.addEventListener("submit", function (event) {
  event.preventDefault();
  formSuccess.textContent = "";

  // Run every check (no short-circuit) so all errors show together
  const results = [validateName(), validateEmail(), validateSubject(), validateMessage()];
  const allValid = results.every(Boolean);

  if (allValid) {
    formSuccess.textContent = "✅ Thank you, " + document.getElementById("name").value.trim() + "! Your message has been sent.";
    contactForm.reset();
    contactForm.querySelectorAll(".valid, .invalid").forEach(function (el) {
      el.classList.remove("valid", "invalid");
    });
  }
});

// ---------- Dynamic to-do list ----------
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoError = document.getElementById("todoError");
const todoCount = document.getElementById("todoCount");
const clearAllBtn = document.getElementById("clearAll");

function updateTodoState() {
  const items = todoList.querySelectorAll("li.task");
  const remaining = todoList.querySelectorAll("li.task:not(.done)").length;

  todoCount.textContent = items.length === 0
    ? "0 tasks"
    : remaining + " of " + items.length + " tasks left";

  const emptyMsg = todoList.querySelector(".empty");
  if (items.length === 0 && !emptyMsg) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "No tasks yet. Add your first one!";
    todoList.appendChild(li);
  } else if (items.length > 0 && emptyMsg) {
    emptyMsg.remove();
  }
}

function addTask(text) {
  const li = document.createElement("li");
  li.className = "task";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.setAttribute("aria-label", "Mark task as done");
  checkbox.addEventListener("change", function () {
    li.classList.toggle("done", checkbox.checked);
    updateTodoState();
  });

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = text; // textContent keeps user input safe from HTML injection

  const del = document.createElement("button");
  del.type = "button";
  del.className = "delete-btn";
  del.textContent = "✕";
  del.setAttribute("aria-label", "Delete task");
  del.addEventListener("click", function () {
    li.remove();
    updateTodoState();
  });

  li.append(checkbox, span, del);
  todoList.appendChild(li);
  updateTodoState();
}

todoForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const text = todoInput.value.trim();

  if (!text) {
    todoError.textContent = "Please type a task before adding.";
    return;
  }

  todoError.textContent = "";
  addTask(text);
  todoInput.value = "";
  todoInput.focus();
});

clearAllBtn.addEventListener("click", function () {
  todoList.querySelectorAll("li.task").forEach(function (li) { li.remove(); });
  updateTodoState();
});

updateTodoState();
