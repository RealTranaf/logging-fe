import axios from "axios";

const API_URL = 'http://localhost:8080/logs'

export async function logEvent(level, message) {
    try {
        await axios.post(`${API_URL}`, {
            level,
            message,
            timestamp: new Date().toISOString(),
            url: window.location.href
        })
    } catch (error) {
        console.error("Failed to send log", error)
    }
}