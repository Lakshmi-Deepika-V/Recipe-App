document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "9dedcb62460a41ee8b2a8acf4428a593";
  const recipeContainer = document.getElementById("recipeContainer");
  const favoritesContainer = document.getElementById("favoritesContainer");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const favoritesBtn = document.getElementById("toggleFavorites");
  const backBtn = document.getElementById("backBtn");

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Render Recipe Cards
  function renderRecipes(recipes) {
    recipeContainer.innerHTML = "";
    if (!recipes || recipes.length === 0) {
      recipeContainer.innerHTML = "<p>No recipes found.</p>";
      return;
    }
    recipes.forEach((recipe) => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${recipe.title === 'Shrimp, Bacon, Avocado Pasta Salad' ? 'food.jpeg' : recipe.image}" alt="${recipe.title}" />

        <h3>${recipe.title}</h3>
        <a href="${recipe.sourceUrl}" target="_blank">View Recipe</a>
        <button onclick="toggleFavorite(${recipe.id})">
          ${isFavorite(recipe.id) ? "★ Remove Favorite" : "☆ Add to Favorites"}
        </button>
      `;
      recipeContainer.appendChild(card);
    });
  }

  // Toggle Favorite
  window.toggleFavorite = function (id) {
    if (isFavorite(id)) {
      favorites = favorites.filter((r) => r.id !== id);
    } else {
      const recipe = currentRecipes.find((r) => r.id === id);
      if (recipe) favorites.push(recipe);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
    renderRecipes(currentRecipes);
  };

  // Check if recipe is favorite
  function isFavorite(id) {
    return favorites.some((r) => r.id === id);
  }

  // Render Favorites
  function renderFavorites() {
    if (!favoritesContainer) return;
    favoritesContainer.innerHTML = "";
    if (favorites.length === 0) {
      favoritesContainer.innerHTML = "<p>No favorites yet.</p>";
      return;
    }
    favorites.forEach((recipe) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}" />
        <h3>${recipe.title}</h3>
        <a href="${recipe.sourceUrl}" target="_blank">View Recipe</a>
        <button onclick="toggleFavorite(${recipe.id})">★ Remove Favorite</button>
      `;
      favoritesContainer.appendChild(card);
    });
  }

  // Search Recipes
  let currentRecipes = [];

  async function searchRecipes(query) {
    try {
      const res = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=12&addRecipeInformation=true&apiKey=${API_KEY}`);
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        currentRecipes = data.results;
        renderRecipes(currentRecipes);
      } else {
        recipeContainer.innerHTML = "<p>No recipes found for your search.</p>";
      }
    } catch (err) {
      console.error("API error:", err);
      // Fallback to sample data
      currentRecipes = [
        {
          id: 1,
          title: "Sample Spaghetti",
          image: "https://via.placeholder.com/200",
          sourceUrl: "#"
        },
        {
          id: 2,
          title: "Sample Salad",
          image: "https://via.placeholder.com/200",
          sourceUrl: "#"
        }
      ];
      renderRecipes(currentRecipes);
    }
  }

  // Event Listeners
  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
      searchRecipes(query);
      recipeContainer.classList.remove("hidden");
      favoritesContainer.classList.add("hidden");
    }
  });

  favoritesBtn.addEventListener("click", () => {
  renderFavorites();
  recipeContainer.classList.add("hidden");
  favoritesContainer.classList.remove("hidden");
  backBtn.classList.remove("hidden"); // Show Back button
});

backBtn.addEventListener("click", () => {
  recipeContainer.classList.remove("hidden");
  favoritesContainer.classList.add("hidden");
  backBtn.classList.add("hidden"); // Hide Back button again
});

  // Default search
  searchRecipes("pasta");
});
