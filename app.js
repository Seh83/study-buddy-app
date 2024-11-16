// Global variables
let currentQuizIndex = 0;
let currentFlashCardIndex = 0;
let quizData = [];
const quizFiles = ["q1.json"];
const flashCardFiles = [
  "fc8.json",
  "fc1.json",
  "fc2.json",
  "fc3.json",
  "fc4.json",
  "fc5.json",
  "fc6.json",
  "fc7.json",
];

// Fetch JSON helper
function fetchJSON(url) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error fetching ${url}: ${response.statusText}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error);
    });
}

// Populate Quiz Topics
async function populateQuizTopics() {
  const quizContainer = document.getElementById("quiz-topics-container");
  quizContainer.innerHTML = ""; // Clear previous content

  for (const file of quizFiles) {
    const data = await fetchJSON(`quiz-json/${file}`);
    if (data) {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<strong>${data.title}</strong>`; // Use title from JSON
      card.addEventListener("click", () => {
        loadQuiz(file);
      });
      quizContainer.appendChild(card);
    }
  }
}

// Populate Flash Card Topics
async function populateFlashCardTopics() {
  const flashCardContainer = document.getElementById(
    "flashcards-topics-container"
  );
  flashCardContainer.innerHTML = ""; // Clear previous content

  for (const file of flashCardFiles) {
    const data = await fetchJSON(`flash-cards-json/${file}`);
    if (data) {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<strong>${data.title}</strong>`; // Use title from JSON
      card.addEventListener("click", () => {
        loadFlashcards(file);
      });
      flashCardContainer.appendChild(card);
    }
  }
}

// Load Quiz
async function loadQuiz(file) {
  const data = await fetchJSON(`quiz-json/${file}`);
  if (data) {
    quizData = data.questions;
    const quizForm = document.getElementById("quiz-form");
    const nextQuizButton = document.getElementById("next-quiz");
    quizForm.innerHTML = ""; // Clear previous quiz

    data.questions.forEach((q) => {
      const questionDiv = document.createElement("div");
      questionDiv.className = "card";
      questionDiv.innerHTML = `<p class="question">${q.question}</p>`;
      if (q.type === "radio") {
        q.options.forEach((option) => {
          questionDiv.innerHTML += `
            <label>
              <input type="radio" name="q${q.id}" value="${option}"> ${option}
            </label>`;
        });
      } else if (q.type === "checkbox") {
        q.options.forEach((option) => {
          questionDiv.innerHTML += `
            <label>
              <input type="checkbox" name="q${q.id}" value="${option}"> ${option}
            </label>`;
        });
      }
      quizForm.appendChild(questionDiv);
    });

    nextQuizButton.classList.toggle(
      "hidden",
      currentQuizIndex === quizFiles.length - 1
    );
    switchToPage("quiz-page");
  }
}

// Submit Quiz
document.getElementById("submit-quiz").addEventListener("click", () => {
  quizData.forEach((q, index) => {
    const questionDiv = document.querySelectorAll("#quiz-form .card")[index];
    const inputs = questionDiv.querySelectorAll(`input[name="q${q.id}"]`);
    const selected = Array.from(inputs)
      .filter((input) => input.checked)
      .map((input) => input.value);

    const isCorrect =
      (q.type === "radio" && selected[0] === q.answer) ||
      (q.type === "checkbox" &&
        selected.length === q.answer.length &&
        selected.every((ans) => q.answer.includes(ans)));

    if (isCorrect) {
      questionDiv.classList.add("correct");
      questionDiv.classList.remove("incorrect");
    } else {
      questionDiv.classList.add("incorrect");
      questionDiv.classList.remove("correct");
    }
  });
});

// Load Flashcards
async function loadFlashcards(file) {
  const data = await fetchJSON(`flash-cards-json/${file}`);
  if (data) {
    const flashcardContainer = document.getElementById("flashcard-container");
    const nextFlashButton = document.getElementById("next-flash");
    flashcardContainer.innerHTML = ""; // Clear previous flashcards

    if (!data.cards || data.cards.length === 0) {
      flashcardContainer.innerHTML = `<p>No flashcards found for this topic.</p>`;
      return;
    }

    data.cards.forEach((card) => {
      const flashcardDiv = document.createElement("div");
      flashcardDiv.className = "flashcard";
      flashcardDiv.innerHTML = `
        <p class="question">${card.question}</p>
        <p class="answer hidden">${card.answer}</p>
      `;
      flashcardDiv.addEventListener("click", () => {
        const answerElement = flashcardDiv.querySelector(".answer");
        answerElement.classList.toggle("hidden");
      });
      flashcardContainer.appendChild(flashcardDiv);
    });

    nextFlashButton.classList.toggle(
      "hidden",
      currentFlashCardIndex === flashCardFiles.length - 1
    );
    switchToPage("flashcards-page");
  }
}

// Load Next Flashcards
document.getElementById("next-flash").addEventListener("click", () => {
  if (currentFlashCardIndex < flashCardFiles.length - 1) {
    currentFlashCardIndex++;
    loadFlashcards(flashCardFiles[currentFlashCardIndex]);
  }
});

// Tab switching
document.getElementById("quiz-tab").addEventListener("click", () => {
  switchToPage("quiz-section");
  populateQuizTopics();
  document.getElementById("quiz-tab").classList.add("active");
  document.getElementById("flashcards-tab").classList.remove("active");
});

document.getElementById("flashcards-tab").addEventListener("click", () => {
  switchToPage("flashcards-section");
  populateFlashCardTopics();
  document.getElementById("flashcards-tab").classList.add("active");
  document.getElementById("quiz-tab").classList.remove("active");
});

document.getElementById("main-quiz-page").addEventListener("click", () => {
  switchToPage("quiz-section");
  populateQuizTopics();
});

document.getElementById("main-flash-page").addEventListener("click", () => {
  switchToPage("flashcards-section");
  populateFlashCardTopics();
});

// Utility to switch pages
function switchToPage(pageId) {
  document
    .querySelectorAll(".tab-content")
    .forEach((section) => section.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

// Initialize
populateQuizTopics();
populateFlashCardTopics();
