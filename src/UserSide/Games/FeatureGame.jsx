import { useContext, useState } from "react";
import { Form, Table } from "react-bootstrap";
import GameContext from "../../ContextApi/GameContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ViewUploadedGame from "./ViewUploadedGame";
import EditUploadedGame from "./EditUploadedGame";
import GameCatContext from "../../ContextApi/GameCatContext";

export default function FeatureGame() {
    const { AllGames, deleteGame } = useContext(GameContext)
    const { AllCategory } = useContext(GameCatContext)
    const [searchTitle, setSearchTitle] = useState("")
    const [searchCategory, setSearchCategory] = useState("")

    // const filterGames = AllGames?.filter(gameData => gameData.featureGame === "Yes").filter(gameData => gameData.title.en.toLowerCase().includes(searchTitle.toLowerCase())).filter(gameData => gameData.categoryId?.category.includes(searchCategory))
    const filterGames = AllGames?.filter(gameData => gameData.featureGame === "Yes").filter(gameData => gameData.title.en.toLowerCase().includes(searchTitle.toLowerCase()))

    return (
        <>
            {filterGames.length > 0 ? (
                <div>
                    <div className="d-flex justify-content-between mb-4">
                        <Form.Control type="text" placeholder="Search Game By Title" style={{ border: "1px solid var(--theme-color)", width: "40%" }} onChange={(e) => setSearchTitle(e.target.value)} />
                        <Form.Control as="select" style={{ border: "1px solid var(--theme-color)", width: "40%" }} onChange={(e) => setSearchCategory(e.target.value)}>
                            <option value="">Search Game By Category</option>
                            {AllCategory?.map((cat, ind) => (
                                <option key={ind} value={cat.category}>{cat.category}</option>
                            ))}
                        </Form.Control>
                    </div >
                    {/* Games table */}
                    <Table striped bordered >
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Feature Game</th>
                                <th>Feature Game Position</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterGames?.map((gameData, ind) => (
                                <tr key={ind}>
                                    <td>{ind + 1}</td>
                                    <td>{gameData.title.en}</td>
                                    {/* <td>{gameData.categoryId?.category}</td> */}
                                    <td>{gameData.featureGame}</td>
                                    <td>{gameData.gameUrl}</td>
                                    <td>{gameData.featureGamePosition}</td>
                                    <td>
                                        <ViewUploadedGame gameId={gameData._id} />
                                        <EditUploadedGame gameId={gameData._id} />
                                        <FontAwesomeIcon icon={faTrash} onClick={() => deleteGame(gameData._id)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table >
                </div>
            ) : (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                    <p style={{ fontSize: "30px" }}>No Feature Game Uploaded Yet</p>
                </div>
            )}
        </>
    )
}
