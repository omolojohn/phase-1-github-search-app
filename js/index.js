const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchQuery = searchInput.value.trim();
    if (searchQuery) {
        const users = await searchUsers(searchQuery);
        displayUsers(users);
    }
});

async function searchUsers(query) {
    const response = await fetch(`https://api.github.com/search/users?q=${query}`);
    const data = await response.json();
    return data.items;
}

function displayUsers(users) {
    searchResults.innerHTML = '';
    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.innerHTML = `
            <img src="${user.avatar_url}" alt="${user.login}" style="width: 50px; height: 50px;">
            <a href="${user.html_url}" target="_blank">${user.login}</a>
        `;
        userElement.addEventListener('click', async () => {
            const repos = await getUserRepos(user.login);
            displayRepos(repos);
        });
        searchResults.appendChild(userElement);
    });
}

async function getUserRepos(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    return response.json();
}

function displayRepos(repos) {
    searchResults.innerHTML = '';
    repos.forEach(repo => {
        const repoElement = document.createElement('div');
        repoElement.textContent = repo.full_name;
        searchResults.appendChild(repoElement);
    });
}
