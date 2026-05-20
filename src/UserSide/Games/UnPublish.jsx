import { useContext } from "react"
import GameContext from "../../ContextApi/GameContext"
import { Table } from "react-bootstrap"
import apiUrl from "../../ApiEndpoint"
import Swal from "sweetalert2"

export default function UnPublish() {
    const { AllStatusGames, uploadedGames } = useContext(GameContext)

    const filterGames = AllStatusGames?.filter(game => game.gameStatus === "UnPublish")
    const updateGameToPublishFn = async (id) => {
        await fetch(`${apiUrl}/api/games/updateGameToPublish/${id}`, {
            method: "PUT"
        });
        uploadedGames();
        Swal.fire("Published!", "This game published successfully.", "success");
    };
    return (
        <>
            {filterGames.length > 0 ? (
                <div>
                    <Table striped bordered >
                        <thead>
                            <tr >
                                <th>#</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterGames?.map((gameData, ind) => (
                                <tr key={ind}>
                                    <td style={{ backgroundColor: "transparent", color: "black" }}>{ind + 1}</td>
                                    <td style={{ backgroundColor: "transparent", color: "black" }}>{gameData.title.en}</td>
                                    <td style={{ backgroundColor: "transparent", color: "black" }}>{gameData.categoryId?.category}</td>
                                    <td>{gameData.userId?.role}</td>
                                    <td><button className="me-2 text-white" style={{ backgroundColor: "green", border: "none", fontSize: "15px", borderRadius: "5px" }}
                                        onClick={() => updateGameToPublishFn(gameData._id)} >Publish</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table >
                </div>
            ) : (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                    <p style={{ fontSize: "30px" }}>No UnPublished Game Yet</p>
                </div>
            )}
        </>
    )
}
