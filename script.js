const apiKey = 'cc7386008a6b95498d05926c8c356942'; 
const searchInput = document.getElementById('searchInput');
const movieList = document.getElementById('movieList');
const loader = document.getElementById('loader');
const toggleBtn = document.getElementById('toggleTheme');

async function searchMovies() {
  const query = searchInput.value.trim();
  movieList.innerHTML = '';
  if (!query) return;

  loader.classList.remove('hidden');

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`
    );
    const data = await res.json();

    if (!res.ok) throw new Error(data.status_message || 'Error fetching');

    loader.classList.add('hidden');

    if (data.results.length === 0) {
      movieList.innerHTML = '<p>No movies found.</p>';
      return;
    }

    data.results.forEach(movie => {
      const card = document.createElement('div');
      card.className = 'movie-card';

      const poster = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/200x300?text=No+Image';

      card.innerHTML = `
        <img src="${poster}" alt="${movie.title}" />
        <div class="movie-info">
          <h3>${movie.title}</h3>
          <p>Year: ${movie.release_date?.split('-')[0] || 'N/A'}</p>
          <p>⭐ ${movie.vote_average || 'N/A'}</p>
          <p>${movie.overview?.slice(0, 100) || 'No overview'}...</p>
        </div>
      `;
      movieList.appendChild(card);
    });
  } catch (err) {
    loader.classList.add('hidden');
    movieList.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

// Search on Enter key
searchInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') searchMovies();
});

// Toggle Light/Dark theme
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');
  toggleBtn.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
});
