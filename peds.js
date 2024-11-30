// Fetch JSON helper
async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Error fetching ${url}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

// Populate PEDs-Final Topics
async function populatePedsTopics() {
  const pedsContainer = document.getElementById("peds-container");
  pedsContainer.innerHTML = ""; // Clear previous content

  const data = await fetchJSON("peds-finals.json");
  if (data) {
    data.forEach((topic) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<h4><strong>${topic.Topic}</strong></h4>`; // Use Topic from JSON, in bold and h4 tag
      card.addEventListener("click", () => {
        loadPedsFlashcards(topic);
      });
      pedsContainer.appendChild(card);
    });
  }
}

// Load PEDs Flashcards
async function loadPedsFlashcards(topic) {
  const pedsContainer = document.getElementById("peds-container");
  const nextPedsButton = document.getElementById("next-peds");
  pedsContainer.innerHTML = ""; // Clear previous flashcards

  if (!topic.Cards || topic.Cards.length === 0) {
    pedsContainer.innerHTML = `<p>No flashcards found for this topic.</p>`;
    return;
  }

  topic.Cards.forEach((card) => {
    const flashcardDiv = document.createElement("div");
    flashcardDiv.className = "flashcard";
    flashcardDiv.innerHTML = `
            <p class="question">${card.Title}</p>
            <p class="answer hidden"></p>
            <div class="button-group">
                <button type="button" class="hint-btn">Hint</button>
                <button type="button" class="show-answer-btn">Show Answer</button>
            </div>
        `;

    const hintBtn = flashcardDiv.querySelector(".hint-btn");
    const showAnswerBtn = flashcardDiv.querySelector(".show-answer-btn");
    const answerElement = flashcardDiv.querySelector(".answer");

    // Toggle Hint Button
    hintBtn.addEventListener("click", () => {
      answerElement.classList.remove("hidden");
      if (hintBtn.textContent === "Hint") {
        hintBtn.textContent = "Hide Hint";
        answerElement.innerHTML = `
                    <ul class="hint-list">${card.Hint.map(
                      (hint) => `<li>${hint}</li>`
                    ).join("")}</ul>
                `;
      } else {
        hintBtn.textContent = "Hint";
        answerElement.classList.add("hidden");
      }
    });

    // Toggle Show Answer Button
    showAnswerBtn.addEventListener("click", () => {
      answerElement.classList.remove("hidden");
      if (showAnswerBtn.textContent === "Show Answer") {
        showAnswerBtn.textContent = "Hide Answer";
        const keysToExclude = ["Hint", "title"];
        const cardContent = Object.keys(card)
          .filter((key) => !keysToExclude.includes(key))
          .map((key) => `<p><strong>${key}:</strong> ${card[key]}</p>`)
          .join("");
        answerElement.innerHTML = cardContent;
      } else {
        showAnswerBtn.textContent = "Show Answer";
        answerElement.classList.add("hidden");
      }
    });

    pedsContainer.appendChild(flashcardDiv);
  });

  nextPedsButton.classList.toggle(
    "hidden",
    topic.Cards.length < 2 // Example condition to toggle the button
  );
  switchToPage("peds-section");
}

// Tab switching
document.getElementById("peds-tab").addEventListener("click", () => {
  switchToPage("peds-section");
  populatePedsTopics();
  document.getElementById("quiz-tab").classList.remove("active");
  document.getElementById("flashcards-tab").classList.remove("active");
  document.getElementById("peds-tab").classList.add("active");
});

document.getElementById("main-peds-page").addEventListener("click", () => {
  switchToPage("peds-section");
  populatePedsTopics();
});

// Utility to switch pages
function switchToPage(pageId) {
  document
    .querySelectorAll(".tab-content")
    .forEach((section) => section.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}
