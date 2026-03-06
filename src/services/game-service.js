import axios from 'axios'

const API_URL = 'http://localhost:8080/games'

export async function getAllGames(platform, status) {
    let url = `${API_URL}?platform=${platform}&status=${status}`
    return await axios.get(url)
}

export async function getGameById(id) {
    let url = `${API_URL}/${id}`
    return await axios.get(url)
}

export async function addGame(name, description, platform, status) {
    return await axios.post(`${API_URL}`, {name, description, platform, status})
}

export async function updateGame(id, name, description, platform, status) {
    let url = `${API_URL}/${id}`
    return await axios.put(url, {name, description, platform, status})
}

export async function deleteGame(id) {
    let url = `${API_URL}/${id}`
    return await axios.delete(url)
}




