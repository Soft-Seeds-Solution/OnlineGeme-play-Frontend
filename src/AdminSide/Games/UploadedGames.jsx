import { useContext, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import GameContext from "../../ContextApi/GameContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import EditUploadedGame from "./EditUploadedGame";
import UserContext from "../../ContextApi/UserContext";
import apiUrl from "../../ApiEndpoint";
import Swal from "sweetalert2";

export default function UploadedGames() {
    const { AllGames, AllStatusGames, deleteGame, purgeGameCache, uploadedCacheGames } = useContext(GameContext)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;
    const { signUser } = useContext(UserContext)
    const [searchTitle, setSearchTitle] = useState("")

    const userGames = signUser?.role === "Admin" ? AllGames : AllStatusGames.filter(game => game.userId?._id === signUser?._id)

    const filterGames = userGames?.filter(game => game.gameStatus !== "UnPublish").filter(gameData => gameData.featureGame !== "Yes").filter(gameData => gameData.title.en.toLowerCase().includes(searchTitle.toLowerCase()))

    const filteredAndSortedGames = [...filterGames].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const updateGameToIndexFn = async (id) => {
        await fetch(`${apiUrl}/api/games/updateGameToIndex/${id}`, {
            method: "PUT"
        });
        purgeGameCache()
        uploadedCacheGames(true);
        Swal.fire("Indexed!", "This game add to index successfully.", "success");
    };
    const updateGameToNoIndexFn = async (id) => {
        await fetch(`${apiUrl}/api/games/updateGameToNoIndex/${id}`, {
            method: "PUT"
        });
        purgeGameCache()
        uploadedCacheGames(true);
        Swal.fire("NoIndexed!", "This game add to noIndex successfully.", "success");
    };

    const changeIndexFn = (gameIndex, id) => {
        if (gameIndex === "Index") {
            updateGameToNoIndexFn(id)
        } else {
            updateGameToIndexFn(id)
        }
    }

    const updateGameToUnPublishFn = async (id) => {
        await fetch(`${apiUrl}/api/games/updateGameToUnPublish/${id}`, {
            method: "PUT"
        });
        uploadedCacheGames();
        Swal.fire("UnPublished!", "This game unpublished successfully.", "success");
    };


    // pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentGames = filteredAndSortedGames.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredAndSortedGames.length / itemsPerPage);

    return (
        <>

            {/* Games table */}
            {filterGames.length > 0 ? (
                <div>
                    {signUser?.role === "Admin" && (
                        <div className="d-flex justify-content-between mb-4">
                            <Form.Control type="text" placeholder="Search Game By Title" style={{ border: "1px solid var(--theme-color)", width: "40%" }} onChange={(e) => {
                                setSearchTitle(e.target.value);
                                setCurrentPage(1);
                            }} />
                        </div >
                    )}
                    <Table striped bordered >
                        <thead>
                            <tr >
                                <th>#</th>
                                <th>Title</th>
                                <th>Category</th>
                                {signUser?.role !== "Admin" && (
                                    <th>Status</th>
                                )}
                                <td>Index</td>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentGames?.map((gameData, ind) => (
                                <tr key={ind}>
                                    <td style={{ backgroundColor: "transparent", color: "black" }}>{indexOfFirstItem + ind + 1}</td>
                                    <td style={{ backgroundColor: "transparent", color: "black" }}>{gameData.title.en}</td>
                                    <td style={{ backgroundColor: "transparent", color: "black" }}>{gameData.categories[0]?.category}</td>
                                    {signUser?.role !== "Admin" && (
                                        <td style={{ backgroundColor: "transparent", color: "black" }}>{gameData.status}</td>
                                    )}
                                    <td>
                                        <Form.Check
                                            type="switch"
                                            id={`index-switch-${ind}`}
                                            checked={gameData.gameIndex === "Index"}
                                            onChange={() => changeIndexFn(gameData.gameIndex, gameData._id)}
                                        />
                                    </td>

                                    {/* <td>{gameData.gameUrl}</td> */}
                                    <td style={{ backgroundColor: "transparent", color: "black" }}>
                                        <button className="me-2 text-white" style={{ backgroundColor: "red", border: "none", fontSize: "15px", borderRadius: "5px" }}
                                            onClick={() => updateGameToUnPublishFn(gameData._id)} >UnPublish</button>
                                        <a href={`https://www.khelogy.com/${gameData.title.en.toLowerCase().replace(/\s+/g, "-")}`} target="blnak"> <FontAwesomeIcon className="me-3 text-dark" icon={faEye} /></a>
                                        <EditUploadedGame gameId={gameData._id} />
                                        <FontAwesomeIcon icon={faTrash} onClick={() => deleteGame(gameData._id)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table >

                    <div className="d-flex justify-content-center mt-3">
                        <Button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="me-2"
                        >
                            Prev
                        </Button>

                        <span className="align-self-center">
                            Page {currentPage} of {totalPages}
                        </span>

                        <Button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="ms-2"
                        >
                            Next
                        </Button>
                    </div>
                </div >
            ) : (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                    <p style={{ fontSize: "30px" }}>No Game Uploaded Yet</p>
                </div>
            )
            }
        </>
    )
}
