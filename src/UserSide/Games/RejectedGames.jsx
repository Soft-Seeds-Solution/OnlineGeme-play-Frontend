import { useContext } from "react"
import GameContext from "../../ContextApi/GameContext"
import { Table } from "react-bootstrap"
import ViewUploadedGame from "./ViewUploadedGame"

export default function RejectedGames() {
    const { AllStatusGames } = useContext(GameContext)
    const rejectedGames = AllStatusGames?.filter(gameData => gameData.status === "Rejected")
    return (
        <>
            {rejectedGames?.length > 0 ? (
                <Table striped bordered >
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rejectedGames.map((gameData, ind) => (
                            <tr key={ind}>
                                <td>{ind + 1}</td>
                                <td>{gameData.title}</td>
                                <td>{gameData.categoryId?.category}</td>
                                <td>
                                    <ViewUploadedGame gameId={gameData._id} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table >
            ) : (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                    <p style={{ fontSize: "30px" }}>No Rejected Game Found</p>
                </div>
            )}
        </>
    )
}
