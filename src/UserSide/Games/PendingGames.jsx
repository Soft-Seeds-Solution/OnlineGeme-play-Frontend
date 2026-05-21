import { useContext } from "react"
import GameContext from "../../ContextApi/GameContext"
import { Table } from "react-bootstrap"
import ViewUploadedGame from "./ViewUploadedGame"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faClose } from "@fortawesome/free-solid-svg-icons"

export default function PendingGames() {
    const { AllStatusGames, ApproveGameFn, RejectGameFn } = useContext(GameContext)
    const pendingGames = AllStatusGames?.filter(gameData => gameData.status === "Pending")
    return (
        <>
            {pendingGames?.length > 0 ? (
                <Table striped bordered >
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Actions</th>
                            <th>Approve/Reject</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingGames.map((gameData, ind) => (
                            <tr key={ind}>
                                <td>{ind + 1}</td>
                                <td>{gameData.title}</td>
                                <td>{gameData.categoryId?.category}</td>
                                <td>
                                    <ViewUploadedGame gameId={gameData._id} />
                                </td>
                                <td>
                                    <FontAwesomeIcon icon={faCheck} className="me-3" onClick={() => ApproveGameFn(gameData._id)} />
                                    <FontAwesomeIcon icon={faClose} onClick={() => RejectGameFn(gameData._id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table >
            ) : (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                    <p style={{ fontSize: "30px" }}>No Pending Game Found</p>
                </div>
            )}
        </>
    )
}
