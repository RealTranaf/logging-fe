import './App.css'
import { useState, useEffect } from 'react'
import { getAllGames, getGameById, deleteGame, updateGame, addGame } from './services/game-service'
import GameModal from "./modals/GameModal"

import { logInfo, logError, logWarn } from './services/log-utils'
import { gameSearchCounter, errorCounter, requestDuration } from './services/metric-utils'

function App() {
    const [games, setGames] = useState([])
    const [platform, setPlatform] = useState("")
    const [status, setStatus] = useState("")

    const [selectedGame, setSelectedGame] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState("edit")

    const fetchGames = async () => {

        const startTime = performance.now()

        try {
            const response = await getAllGames(platform, status)
            setGames(response.data)

            gameSearchCounter.add(1, { platform, status })
            logInfo('Lấy data game.', { platform, status })

            const duration = (performance.now() - startTime) / 1000 // Convert to seconds
            requestDuration.record(duration, {
                'http.request.method': 'GET',
                'http.response.status_code': response.status,
                'http.route': `/games?platform=${platform}&status=${status}`,
                'url.path': `/games?platform=${platform}&status=${status}`,
                'url.scheme': window.location.protocol.replace(':', ''),
            })

        } catch (error) {
            console.log(error)
            errorCounter.add(1, { operation: 'fetchGames' })
            logError('Lấy data fail.', { error: error.message })

            const duration = (performance.now() - startTime) / 1000 // Convert to seconds
            requestDuration.record(duration, {
                'http.request.method': 'GET',
                'http.response.status_code': 0,
                'http.route': `/games?platform=${platform}&status=${status}`,
                'url.path': `/games?platform=${platform}&status=${status}`,
                'url.scheme': window.location.protocol.replace(':', ''),
            })
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
            setModalOpen(false)
            fetchGames()
            logInfo('Thêm game.', { selectedGame })
        } catch (error) {
            console.error(error)
            logError('Thêm game fail.', { error: error.message })
        }
    }

    const handleUpdate = async () => {
        try {
            await updateGame(selectedGame.id, selectedGame.name, selectedGame.description, selectedGame.platform, selectedGame.status)
            setModalOpen(false)
            fetchGames()
            logInfo('Cập nhật game.', { selectedGame })
        } catch (error) {
            console.error(error)
            logError('Cập nhật game fail.', { error: error.message })
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Xóa game này?")) return

        try {
            await deleteGame(id)
            setModalOpen(false)
            fetchGames()
            logInfo('Xóa game.', { id })
        } catch (error) {
            console.error(error)
            logError('Xóa game fail.', { error: error.message })
        }
    }

    const openAddModal = () => {
        setSelectedGame({
            name: "",
            description: "",
            platform: "",
            status: ""
        })

        setModalMode("add")
        setModalOpen(true)
        logInfo('Mở ô thêm game.', {})
    }

    const openEditModal = async (id) => {
        try {
            const game = await getGameById(id)
            setSelectedGame(game.data)
            setModalMode("edit")
            setModalOpen(true)
            logInfo('Mở ô cập nhật game.', { id })
        } catch (error) {
            console.log(error)
            logInfo('Mở ô cập nhật game fail.', { error: error.message })
        }
    }

    const closeModal = () => {
        setModalOpen(false)
        setSelectedGame(null)
        logInfo('Đóng ô.', {})
    }

    return (
        <div className='container'>
            <div className="page-header">
                <h1>Game Management</h1>
                <p>Quản lý danh sách game phát hành</p>
            </div>
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
                    <div className="game-card" key={game.id} onClick={() => openEditModal(game.id)}>
                        <div className={`platform-badge ${game.platform.toLowerCase()}`}>
                            {game.platform}
                        </div>
                        <div className={`status ${game.status.toLowerCase()}`}>
                            {game.status}
                        </div>
                        <div className="game-title">{game.name}</div>
                        <p className="game-desc">{game.description}</p>
                        {/* <button
                            className="game-btn"
                            onClick={() => openEditModal(game.id)}
                        >
                            Chi tiết
                        </button> */}
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
