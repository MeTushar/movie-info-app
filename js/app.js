function ready(handleSubmit) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    handleSubmit();
  } else {
    document.addEventListener('DOMContentLoaded', handleSubmit);
  }
}

ready(handleSubmit);

const apiKey = "c447f21";

function handleSubmit() {
  const form = document.querySelector("#handle-form");
  form.addEventListener("submit", function(e){
    e.preventDefault();
    let inputVal = form.querySelector("input").value;
    document.querySelector("#pagination-container").innerHTML = "";
    getMovies(inputVal, apiKey, 1);
  })
}

function getMovies(inputVal, apiKey, pageNumber) {
  let url = `https://www.omdbapi.com/?s=${inputVal}&apikey=${apiKey}&page=${pageNumber}`;
  axios.get(url)
    .then((response) => {
      let totalResult = response.data.totalResults; //To calculate no. of pages in pagination
      let data = response.data.Search; //To get the movie data to show
      let responseStatus = response.data.Response; //To check if their is any response or not
      if(responseStatus === "True") { //if their is response show the movies & pagination
        createTemplate(data); // passing data to function creating template
        createPagination(totalResult, inputVal); /* passing totalResult & search value to function creating pagination
        */
      } else {
        createTemplate(null); //if their is no data show 404 no movie found
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

//To render movies after getting data from api
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

// To create pagination
function createPagination(totalResults, inputVal) {
  let numberOfPages = parseInt(totalResults/10) + 1 ; //Calculating number of pages to show
  let paginationTemplate = "<ul class='pagination'>";
  for(let i = 0; i < numberOfPages; i++) {
    paginationTemplate += `
      <li>
        <a href="javascript:void(0);" onclick="handlePagination(this);" data-page="${i + 1}" data-search-val="${inputVal}">
          ${i + 1}
        </a>
      </li>
    `;
  }
  paginationTemplate += "</ul>";
  document.querySelector("#pagination-container").innerHTML = paginationTemplate;
}

function handlePagination(item) {
  let pageNumber = item.dataset.page; //storing current page number getting from data attribute
  let searchValue = item.dataset.searchVal; //Search value getting from data attribute

  getMovies(searchValue, apiKey, pageNumber); //Calling the function responsible to do api calls
}

//To change class of movie container when there is data or no data
function changeClass(classAdd, classRemove) {
  document.querySelector("#movies").classList.add(classAdd);
  document.querySelector("#movies").classList.remove(classRemove);
}

//To remove hyphen from release year if present
function removeHyphen(str) {
  if(str.charAt(str.length - 1) == "–") {
    str = str.slice(0, str.length - 1);
    return str;
  }
  return str;
}
