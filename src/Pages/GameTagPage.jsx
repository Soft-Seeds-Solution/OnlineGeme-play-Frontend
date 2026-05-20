import { Link, useParams } from "react-router-dom";
import { useContext, useState } from "react";
import GameContext from "../ContextApi/GameContext";
import { Col, Container, Row } from "react-bootstrap";
import generalGameThumbnail from "../assets/defaultGameThumbnail.jpg";
import { Helmet } from "react-helmet-async";

export default function GameTagPage() {
    const { tagGames } = useParams();
    const { AllGames, updateViewsFn } = useContext(GameContext);
    const [hoveredId, setHoveredId] = useState(null);
    const changeTag = tagGames.replace(/-/g, " ");
    const handleMouseEnter = (id) => setHoveredId(id);
    const handleMouseLeave = () => setHoveredId(null);

    // Filter games that belong to this category
    const taggGames = AllGames?.filter((game) =>
        game.gameTags?.some((tag) => tag.tags.toLowerCase() === changeTag.toLowerCase())
    );

    const tagName =
        AllGames?.find(game =>
            game.gameTags?.some(tag =>
                tag.tags.toLowerCase() === tagGames.replace(/-/g, " ").toLowerCase()
            )
        )?.gameTags?.find(tag =>
            tag.tags.toLowerCase() === tagGames.replace(/-/g, " ").toLowerCase()
        )?.tags;

    return (
        <div className="pt-5 px-6">
            {tagName && (
                <Helmet>
                    <title>{tagName}</title>
                    <meta name="robots" content="index, follow" />
                </Helmet>
            )}
            {taggGames && taggGames.length > 0 ? (
                <>
                    <Container fluid style={{ marginTop: "50px" }}>
                        <Row className="g-3">

                            {/* Breadcrumb & Category Title */}
                            <Row className="mt-2 mb-3">
                                <span className="heading-color sub-heading">
                                    <Link to="/" className="heading-color">Home</Link>{" "}
                                    / {changeTag}
                                </span>
                                <h1 className="heading-color sub-heading">{tagGames}</h1>

                            </Row>

                            {/* Games Grid */}
                            <Row className="g-3 mt-3">
                                {taggGames.map((game, index) => (
                                    <Col md={2} xs={4} key={index}>
                                        <Link to={`/${game.title.en.toLowerCase().replace(/\s+/g, "-")}`}>
                                            <div
                                                className="GameThumbnail"
                                                style={{ backgroundImage: `url(${game.thumbnail || generalGameThumbnail})` }}
                                                onClick={() => updateViewsFn(game._id, game.gameUrl)}
                                                onMouseEnter={() => handleMouseEnter(game._id)}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                {game.video && hoveredId === game._id && (
                                                    <video
                                                        className="game-video"
                                                        src={game.video}
                                                        autoPlay
                                                        loop
                                                        muted
                                                        playsInline
                                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    />
                                                )}
                                            </div>
                                        </Link>
                                    </Col>
                                ))}
                            </Row>
                        </Row>
                    </Container>

                </>
            ) : (
                <>
                    <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                        <p style={{ fontSize: "30px" }}>No Games Found in &quot;{changeTag}&quot;</p>
                    </div>
                </>
            )}

        </div>
    );
}