const Base_Url = "https://icanhazdadjoke.com/"; 
const Joke = document.getElementById('joke');
const JokeButton = document.getElementById('jokeButton');

JokeButton.addEventListener('click', getJoke);

async function getJoke() {
    try {
        const response = await fetch(Base_Url, {
            headers: {
                'Accept': 'application/json'
            }
        });
        const data = await response.json();
        Joke.textContent = data.joke;
    } catch (error) {
        Joke.textContent = "Oops! Something went wrong. Please try again.";
    }
}

JokeButton.addEventListener('click', () => {
    Joke.textContent = "Loading...";
});