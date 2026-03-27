import { useContext } from "react";
import { Button, Container, Image, Row } from "react-bootstrap";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TrackContext from "../ContextApi/TrackContext";
import { Link } from "react-router-dom";
import UserContext from "../ContextApi/UserContext";
import FavouriteContext from "../ContextApi/FavouriteContext";

export default function Favourites() {
    const { signUser } = useContext(UserContext)
    const { allFavourites, deleteGame } = useContext(FavouriteContext)
    const { trackRecordFn } = useContext(TrackContext)
    const favourites = allFavourites?.filter(favRecord => favRecord.userId?._id === signUser?._id).map(favRecord => favRecord.productId)

    return (
        <>
            <Container>
                <Row>
                    {favourites?.length > 0 ? (
                        <>
                            <h3 className="mb-4 text-dark">Favourites</h3>
                            {favourites?.map((gameData, ind) => (
                                <div style={{ backgroundColor: "var(--light-bg)", borderRadius: "10px" }} className="d-flex justify-content-between align-items-center px-3 py-2 mb-3" key={ind}>
                                    <div className="d-flex" style={{ width: "50%" }}>
                                        <Image className="me-3" src={gameData.thumbnail} style={{ width: "40px", height: "40px", borderRadius: "5px" }} />
                                        <div>
                                            <p>{gameData.title}</p>
                                            <p style={{ color: "var(--border)" }}>Category : {gameData.categoryId?.category}</p>
                                        </div>
                                    </div>
                                    <Button as={Link} to={`/${gameData.title.replace(/\s+/g, "-")}`} onClick={() => trackRecordFn(signUser?._id, gameData._id)} className="primary-btn">Play Game</Button>
                                    <FontAwesomeIcon icon={faClose} size="2x" style={{ cursor: "pointer" }} onClick={() => deleteGame(signUser?._id, gameData._id)} />
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                            <h2>No Games Added In Favourites Yet</h2>
                        </div>
                    )}
                </Row>
            </Container>
        </>
    )
}