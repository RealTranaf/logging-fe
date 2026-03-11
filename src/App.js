import './App.css'
import { useState, useEffect } from 'react'
import { getAllGames, getGameById, deleteGame, updateGame, addGame } from './services/game-service'
import { logEvent } from './services/log-service'
import GameModal from "./modals/GameModal"

function App() {
    const [games, setGames] = useState([])
    const [platform, setPlatform] = useState("")
    const [status, setStatus] = useState("")

    const [selectedGame, setSelectedGame] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState("edit")

    const fetchGames = async () => {
        try {
            logEvent("INFO", "Fetching game list")
            const response = await getAllGames(platform, status)
            setGames(response.data)
            
            logEvent("INFO", `Fetched ${response.data.length} games`)
        } catch (error) {
            logEvent("ERROR", "Failed to fetch games")
            console.log(error)
        }
    }

    useEffect(() => {
        fetchGames()
    }, [])

    const handleAdd = async () => {
        try {
            await addGame(
                selectedGame.name,
                selectedGame.description,
                selectedGame.platform,
                selectedGame.status
            )
            logEvent("INFO", `Game added: ${selectedGame.name}`)
            setModalOpen(false)
            fetchGames()
        } catch (error) {
            logEvent("ERROR", `Failed to add game: ${selectedGame?.name}`)
            console.error(error)
        }
    }

    const handleUpdate = async () => {
        try {
            await updateGame(selectedGame.id, selectedGame.name, selectedGame.description, selectedGame.platform, selectedGame.status)
            logEvent("INFO", `Game updated: ${selectedGame.name}`)
            setModalOpen(false)
            fetchGames()
        } catch (error) {
            logEvent("ERROR", `Failed to update game: ${selectedGame?.name}`)   
            console.error(error)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Xóa game này?")) return

        try {
            await deleteGame(id)
            logEvent("WARN", `Game deleted with id ${id}`)
            setModalOpen(false)
            fetchGames()
        } catch (error) {
            logEvent("ERROR", `Failed to delete game with id ${id}`)
            console.error(error)
        }
    }

    const openAddModal = () => {
        logEvent("INFO", "Opened add game modal")
        setSelectedGame({
            name: "",
            description: "",
            platform: "",
            status: ""
        })

        setModalMode("add")
        setModalOpen(true)
    }

    const openEditModal = async (id) => {
        try {
            const game = await getGameById(id)
            logEvent("INFO", `Opened edit game modal for game ${game.data.name}`)
            setSelectedGame(game.data)
            setModalMode("edit")
            setModalOpen(true)
        } catch (error) {
            logEvent("ERROR", `Failed to load game ${id}`)
        }
    }

    const closeModal = () => {
        setModalOpen(false)
        setSelectedGame(null)
    }

    return (
        <div className='container'>
            <div className="filters">
                <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                    <option value="">Loại game</option>
                    <option value="PC">Game PC</option>
                    <option value="MOBILE">Game Mobile</option>
                </select>

                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Chọn trạng thái</option>
                    <option value="ONGOING">Đang phát hành</option>
                    <option value="PUBLISHED">Đã phát hành</option>
                </select>
                <button onClick={fetchGames}>Search</button>

                <button onClick={openAddModal}>
                    Thêm Game
                </button>
            </div>

            <div className="game-grid">
                {games.map((game) => (
                    <div className="game-card" key={game.id}>

                        <div className="platform-badge">
                            Game {game.platform}
                        </div>
                        <div className="game-title">{game.name}</div>
                        <p className="game-desc">{game.description}</p>
                        <button
                            className="game-btn"
                            onClick={() => openEditModal(game.id)}
                        >
                            Chi tiết
                        </button>
                    </div>
                ))}
            </div>

            {modalOpen && (
                <GameModal
                    mode={modalMode}
                    game={selectedGame}
                    setGame={setSelectedGame}
                    handleAdd={handleAdd}
                    handleUpdate={handleUpdate}
                    handleDelete={handleDelete}
                    closeModal={closeModal}
                />
            )}
        </div>
    )
}

export default App
