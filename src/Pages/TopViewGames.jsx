import { useContext, useState } from "react";
import GameContext from "../ContextApi/GameContext";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import generalGameThumbnail from "../assets/defaultGameThumbnail.jpg";

export default function TopViewGames() {
    const { AllGames, updateViewsFn } = useContext(GameContext);
    const [hoveredId, setHoveredId] = useState(null);

    const handleMouseEnter = (index) => {
        setHoveredId(index);
    };

    const handleMouseLeave = () => {
        setHoveredId(null);
    };

    return (
        <>
            <Container className="page-content">
                <Row className="g-3 pt-5">
                    <h1 className="heading-color sub-heading">Top View Games</h1>
                    {AllGames?.sort((a, b) => b.views - a.views).map((gameData, ind) => (
                        <Col md={2} xs={4} key={ind}>
                            <Link
                                to={`/${gameData.title.en.toLowerCase().replace(/\s+/g, "-")}`}
                            >
                                <div
                                    className="GameThumbnail"
                                    style={{
                                        backgroundImage: `url(${gameData.thumbnail ? gameData.thumbnail : generalGameThumbnail})`,
                                    }}
                                    onClick={() => updateViewsFn(gameData._id, gameData.gameUrl)}
                                    onMouseEnter={() => handleMouseEnter(gameData._id)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {gameData.video && hoveredId === gameData._id && (
                                        <video
                                            className="game-video"
                                            src={gameData.video}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    )}
                                </div>
                                {/* <div className="d-flex justify-content-center">
                                    <h6 className="p-2 game-Titles" style={{ color: "black", borderLeft: "1px solid var(--border)", display: "inline-block", borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>{gameData.title.en.length > 14 ? gameData.title.en.slice(0, 14) + "..." : gameData.title.en}</h6>
                                </div> */}
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    )
}
