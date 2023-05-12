const container = document.querySelector(".container");
const seats = document.querySelectorAll(".row .seat:not(.occupied)");
const count = document.getElementById("count");
const total = document.getElementById("total");
const movieSelect = document.getElementById("movie");
const nextShowTime = new Date("May 12, 2023 19:30:00").getTime();

const form = document.querySelector("form");
const submitBtn = document.querySelector('button[type="submit"]');


submitBtn.addEventListener("click", (event) => {
  
  const selectedSeats = document.querySelectorAll(".row .seat.selected");


  if (selectedSeats.length === 0) {
   
    event.preventDefault();
    alert("Please select at least one seat.");
    form.insertBefore(errorMessage, submitBtn.nextSibling);
  }
});

const movies = [
  {title: "PS II", genre: "Action"},
  {title: "Love Again", genre: "Romance"},
  {title: "Thunivu", genre: "Drama"},
  {title: "Varisu", genre: "Action"}
];

function searchMovies() {
  const query = document.getElementById("search").value.toLowerCase();
  const results = movies.filter(movie => movie.title.toLowerCase().includes(query));

  const movieContainer = document.querySelector(".movie-containers");
  movieContainer.innerHTML = "";

  if (results.length === 0) {
    movieContainer.innerHTML = "<p>No movies found with that title.</p>";
  } else {
    for (let i = 0; i < results.length; i++) {
      const movieOption = document.createElement("option");
      movieOption.value = results[i].genre;
      movieOption.innerText = `${results[i].title} (${results[i].genre})`;
      movieContainer.appendChild(movieOption);
    }
  }
}

populateUI();

let ticketPrice = +movieSelect.value;


function setMovieData(movieIndex, moviePrice) {
  localStorage.setItem("selectedMovieIndex", movieIndex);
  localStorage.setItem("selectedMoviePrice", moviePrice);
}


function updateSelectedCount() {
  const selectedSeats = document.querySelectorAll(".row .seat.selected");

  const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));

  localStorage.setItem("selectedSeats", JSON.stringify(seatsIndex));

  const selectedSeatsCount = selectedSeats.length;

  count.innerText = selectedSeatsCount;
  total.innerText = selectedSeatsCount * ticketPrice;

  setMovieData(movieSelect.selectedIndex, movieSelect.value);
}


function populateUI() {
  const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));

  if (selectedSeats !== null && selectedSeats.length > 0) {
    seats.forEach((seat, index) => {
      if (selectedSeats.indexOf(index) > -1) {
        seat.classList.add("selected");
      }
    });
  }

  const selectedMovieIndex = localStorage.getItem("selectedMovieIndex");

  if (selectedMovieIndex !== null) {
    movieSelect.selectedIndex = selectedMovieIndex;
  }
}


movieSelect.addEventListener("change", (e) => {
  ticketPrice = +e.target.value;
  setMovieData(e.target.selectedIndex, e.target.value);
  updateSelectedCount();
});


container.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("seat") &&
    !e.target.classList.contains("occupied")
  ) {
    e.target.classList.toggle("selected");

    updateSelectedCount();
  }
});


updateSelectedCount();

const countdown = setInterval(() => {
  const now = new Date().getTime();

  const timeLeft = nextShowTime - now;

  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const countdownTimer = document.getElementById("countdown-timer");
  countdownTimer.innerHTML = `Next show starts in: ${daysLeft}d ${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`;

  if (timeLeft < 0) {
    clearInterval(countdown);
    countdownTimer.innerHTML = "The show has already started!";
  }
}, 1000);
