const movieSearchBox = document.getElementById("search-box");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");
const savedMoviesList = document.getElementById("saved-movies-list");

//Fetching movies from the OMDB api using fetch

async function loadMovies(title) {
  const apiKey = "13555f01";
  const URL = `https://www.omdbapi.com/?s=${title}&page=2&apikey=${apiKey}`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  if (data.Response == "True") {
    displayMovieList(data.Search);
  }
}

//This will check if the length of the entered input in search bar is greater than 0 or not and add and remove class on basis of that
function findMovies() {
  let searchTerm = movieSearchBox.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-search-list");
    loadMovies(searchTerm); //run load Movies if length is not 0
  } else {
    searchList.classList.add("hide-search-list");
  }
}

//It displays the movies below the search option that matches the search list value

function displayMovieList(movies) {
  searchList.innerHTML = "";
  for (let i = 0; i < movies.length; i++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movies[i].imdbID;
    movieListItem.classList.add("search-list-item");
    let moviePoster;
    if (movies[i].Poster != "N/A") {
      moviePoster = movies[i].Poster;
    } else {
      moviePoster = "notfound.png";
    }
    movieListItem.innerHTML = `
      <div class="search-item-thumbnail">
        <img src="${moviePoster}">
      </div>
      <div class="search-item-info">
        <h3>${movies[i].Title}</h3>
        <p>${movies[i].Year}</p>
        
    `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
}

//It fetches the details of the particular movie that is clicked
function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll(".search-list-item");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      searchList.classList.add("hide-search-list");
      movieSearchBox.value = "";
      const result = await fetch(
        `https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=13555f01`
      );
      const movieDetails = await result.json();

      displayMovieDetails(movieDetails);
    });
  });
}

//Displays the complete data of the particular movie with add to Favorite button

function displayMovieDetails(details) {
  resultGrid.innerHTML = `<div class="movie-poster">
  <img src="${details.Poster != "N/A" ? details.Poster : "notfound.png"}" />
  
    </div>
    <div class="movie-info">
      <h3 class="movie-title">${details.Title}</h3>
      
      <ul class="movie-misc-info">
        <li class="movie-year"><strong>Year :</strong> ${details.Year}</li>
        <li class="movie-type"><strong>Type :</strong> ${details.Type}</li>
        <li class="movie-genre"><strong>Genre :</strong> ${details.Genre}</li>
        <li class="movie-director"><strong>Director :</strong> ${
          details.Director
        }</li>
        <li class="movie-actors"><strong>Actors :</strong> ${
          details.Actors
        }</li>
        <li class="movie-plot"><strong>Plot :</strong> ${details.Plot}</li>
      </ul>
      <button class="add-to-favorites" data-imdbid="${
        details.imdbID
      }">Add to Favorites</button>
    </div>`;
  const addToFavoritesBtn = resultGrid.querySelector(".add-to-favorites");
  //Adding Evemt listener Click to Add to Favorite Button
  addToFavoritesBtn.addEventListener("click", function () {
    addToFavoritesBtn.innerText = "Added to Favorites"; //when add to favourite button is clicked its text changes to "Added to favorites"
    addToFavoritesBtn.disabled = true;

    const movie = {
      imdbID: details.imdbID,
      title: details.Title,
      poster: details.Poster != "N/A" ? details.Poster : "notfound.png",
      year: details.Year,
      type: details.Type,
      genre: details.Genre,
      director: details.Director,
      actors: details.Actors,
      plot: details.Plot,
    };
    //Get and Store Data in Local Storage of the browser
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (!favorites.some((favorite) => favorite.imdbID === movie.imdbID)) {
      favorites.push(movie);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  });
}
//Display Saved Movies that were added after clicking Add to Favorite in the Browser
function displaySavedMovies() {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const savedMoviesList = document.getElementById("saved-movies-list");

  if (favorites.length === 0) {
    savedMoviesList.innerHTML = `<li id="no-movie-heading">No saved movies found.</li>`;
    return;
  }

  savedMoviesList.innerHTML = "";

  favorites.forEach((movie) => {
    let savedMovieListItem = document.createElement("li");
    savedMovieListItem.dataset.id = movie.imdbID;
    let moviePoster;
    if (movie.poster != "N/A") {
      moviePoster = movie.poster;
    } else {
      moviePoster = "notfound.png";
    }
    savedMovieListItem.innerHTML = ` <div class="saved-item-thumbnail"> <img src="${moviePoster}"> </div> <div class="saved-item-info"> <h3>${movie.title}</h3> <p><b>Year : </b>${movie.year}</p> <p><b>Genre : </b>${movie.genre}</p><p><b>Type : </b>${movie.type}</p><p><b>Actors : </b>${movie.actors}</p><p><b>Plot : </b>${movie.plot}</p> </div> <button class="remove-from-favorites">Remove from Favorites</button>`;
    savedMoviesList.appendChild(savedMovieListItem);

    const removeFromFavoritesBtn = savedMovieListItem.querySelector(
      ".remove-from-favorites"
    );
    //Remove From Favorite Button when clicked Removes the Movie from local Storage and Favorite List
    removeFromFavoritesBtn.addEventListener("click", function () {
      removeFromFavoritesBtn.closest("li").remove();
      let favorites = JSON.parse(localStorage.getItem("favorites"));
      favorites = favorites.filter(
        (favorite) => favorite.imdbID !== movie.imdbID
      );
      localStorage.setItem("favorites", JSON.stringify(favorites));
    });
  });
}
// Add event listener for each favorite movie to display details
displaySavedMovies();
