import React from "react";

function GameModal({
    mode,
    game,
    setGame,
    handleAdd,
    handleUpdate,
    handleDelete,
    closeModal
}) {
    if (!game) return null

    const isEdit = mode === "edit"

    return (
        <div className="modal-backdrop" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>

                <h2>{isEdit ? "Chỉnh sửa Game" : "Thêm Game"}</h2>

                <input
                    className="modal-input"
                    placeholder="Tên game"
                    value={game.name}
                    onChange={(e) =>
                        setGame({ ...game, name: e.target.value })
                    }
                />

                <textarea
                    className="modal-textarea"
                    placeholder="Mô tả"
                    value={game.description}
                    onChange={(e) =>
                        setGame({ ...game, description: e.target.value })
                    }
                />

                <select
                    className="modal-input"
                    value={game.platform}
                    onChange={(e) =>
                        setGame({ ...game, platform: e.target.value })
                    }
                >
                    <option value="">Chọn nền tảng</option>
                    <option value="PC">PC</option>
                    <option value="MOBILE">Mobile</option>
                </select>

                <select
                    className="modal-input"
                    value={game.status}
                    onChange={(e) =>
                        setGame({ ...game, status: e.target.value })
                    }
                >
                    <option value="">Chọn trạng thái</option>
                    <option value="ONGOING">ONGOING</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                </select>

                <div className="modal-actions">
                    {!isEdit && (
                        <button className="game-btn" onClick={handleAdd}>
                            Thêm
                        </button>
                    )}
                    {isEdit && (
                        <>
                            <button className="game-btn" onClick={handleUpdate}>
                                Cập nhật
                            </button>
                            <button
                                className="game-btn"
                                onClick={() => handleDelete(game.id)}
                            >
                                Xóa
                            </button>
                        </>
                    )}
                    <button className="game-btn" onClick={closeModal}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    )
}

export default GameModal