import { useContext } from "react";
import { Table } from "react-bootstrap";
import GameContext from "../ContextApi/GameContext";
import UserContext from "../ContextApi/UserContext";

export default function UploadedGamesRecord() {
    const { AllStatusGames } = useContext(GameContext)
    const { signUser } = useContext(UserContext)

    const userGames = signUser && AllStatusGames.filter(game => game.userId?._id === signUser?._id)

    return (
        <>
            <Table striped bordered >
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Total Views</th>
                        <th>Played Count</th>
                    </tr>
                </thead>
                <tbody>
                    {userGames?.map((gameData, ind) => (
                        <tr key={ind}>
                            <td style={{ backgroundColor: "transparent", color: "black" }}>{ind + 1}</td>
                            <td style={{ backgroundColor: "transparent", color: "black" }}>{gameData.title}</td>
                            <td style={{ backgroundColor: "transparent", color: "black" }}>{gameData.status}</td>
                            <td style={{ backgroundColor: "transparent", color: "black" }}>{gameData.views}</td>
                            <td style={{ backgroundColor: "transparent", color: "black" }}>{gameData.played}</td>
                        </tr>
                    ))}
                </tbody>
            </Table >
        </>
    )
}
