const form = document.getElementById("searchForm");
const input = document.getElementById("wordInput");
const result = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const word = input.value.trim();

  if (!word) {
    result.innerHTML = `<p class="error">Please enter a word.</p>`;
    return;
  }

  
  result.innerHTML = `<p class="loading">Loading... </p>`;

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    if (!response.ok) {
      throw new Error("Word not found");
    }

    const data = await response.json();

    
    if (!data || data.length === 0) {
      throw new Error("No data found");
    }

    const entry = data[0];

    const meanings = entry.meanings || [];
    const firstMeaning = meanings[0] || {};

    const partOfSpeech = firstMeaning.partOfSpeech || "N/A";

    const definitionsHTML = firstMeaning.definitions
      ?.slice(0, 3)
      .map(def => `<li>${def.definition}</li>`)
      .join("") || "<li>No definitions found</li>";


    const example =
      firstMeaning.definitions?.[0]?.example ||
      "No example available";


    result.innerHTML = `
      <div class="card">
        <h3>${entry.word}</h3>
        <p><strong>Part of Speech:</strong> ${partOfSpeech}</p>

        <p><strong>Definitions:</strong></p>
        <ul>${definitionsHTML}</ul>

        <p><strong>Example:</strong> ${example}</p>
      </div>
    `;

  } catch (error) {
    result.innerHTML = `<p class="error"> Word not found. Try another word.</p>`;
  }
});