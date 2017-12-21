function ready(handleSubmit) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    handleSubmit();
  } else {
    document.addEventListener('DOMContentLoaded', handleSubmit);
  }
}

ready(handleSubmit);

function handleSubmit() {
  const form = document.querySelector("#handle-form");
  form.addEventListener("submit", function(e){
    e.preventDefault();
    let inputVal = form.querySelector("input").value;
    const apiKey = "c447f21";
    getMovies(inputVal, apiKey);
  })
}

function getMovies(inputVal, apiKey) {
  let url = `https://www.omdbapi.com/?s=${inputVal}&apikey=${apiKey}`;
  axios.get(url)
    .then((response) => {
      let data = response.data.Search;
      let responseStatus = response.data.Response;
      if(responseStatus === "True") {
        createTemplate(data);
      } else {
        createTemplate(null);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function createTemplate(movies) {
  let output = '';
  if(movies !== null) {
    movies.map((movie, index) => {
      output += `
        <div class="movie-container">
          <img src="${movie.Poster}" alt="${movie.Title}"/>
          <h5 class="movie-title margin-0">${movie.Title}</h5>
          <p class="margin-0"><span>Release Year:</span> ${removeHyphen(movie.Year)}</p>
          <p class="margin-0"><span>Type:</span> ${movie.Type}</p>
          <a href="movies.html" class="view-details item-${index}">View Details</a>
        </div>
      `;
    });
    changeClass("data", "noData");
  } else {
    output += `<p class="no-movies margin-0"><span>404</span>Movie not found</p>`;
    changeClass("noData", "data");
  }
  document.querySelector("#movies").innerHTML = output;  
}

function changeClass(classAdd, classRemove) {
  document.querySelector("#movies").classList.add(classAdd);
  document.querySelector("#movies").classList.remove(classRemove);
}

function removeHyphen(str) {
  if(str.charAt(str.length - 1) == "–") {
    str = str.slice(0, str.length - 1);
    return str;
  }
  return str;
}
