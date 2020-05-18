import shows from './shows.js';

const songsElements = document.querySelector('#songs');
const showsElements = document.querySelector('#shows');

showsElements.innerHTML = shows.map(show => `
<div class='show'>
  <input type='checkbox'>
  <span class='show-date'>${show.date}</span>
  <span class='show-title'>${show.name}</span>
</div>
`).join('\n');

const checkboxes = document.querySelectorAll('input[type=checkbox]');

document.querySelector('#render').addEventListener('click', () => {
  renderSongs(
    getSongs(
      shows.filter((show, i) => checkboxes[i].checked)
    )
  );
});

/****************************************/

function renderSongs(songs) {
  const sortedSongs = songs.sort((a, b) => b.count - a.count);
  songsElements.innerHTML = sortedSongs.map(song => `
  <div class='song'>
    <span class='song-name'>${song.name}</span>
    <span class='song-count'>${song.count}</span>
  </div>
`).join('\n');
}

function getSongs(shows) {
  const songs = {};
  for (let show of shows) {
    for (let song of show.songs) {
      if (songs[song]) {
        songs[song]++;
      } else {
        songs[song] = 1;
      }
    }
  }
  return Object.keys(songs).map(song => ({ name: song, count: songs[song] }));
}