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
  let url = `http://www.omdbapi.com/?s=${inputVal}&apikey=${apiKey}`;
  axios.get(url)
    .then((response) => {
      let data = response.data.Search;
      createTemplate(data);
    })
    .catch((err) => {
      console.log(err);
    });
}

function createTemplate(movies) {
  let output = '';
  movies.map((movie, index) => {
    output += `
      <div class="movie-container">
        <img src="${movie.Poster}" alt="${movie.Title}"/>
        <h5 class="movie-title margin-0">${movie.Title}</h5>
        <p class="margin-0"><span>Release Year:</span> ${movie.Year}</p>
        <p class="margin-0"><span>Type:</span> ${movie.Type}</p>
        <a href="movies.html" class="view-details item-${index}">View Details</a>
      </div>
    `;
  });
  document.querySelector("#movies").innerHTML = output;  
}
