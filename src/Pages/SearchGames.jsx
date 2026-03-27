import { useContext } from "react"
import GameContext from "../ContextApi/GameContext"
import { Col, Container, Row } from "react-bootstrap"
import { Link, useSearchParams } from "react-router-dom"
import generalGameThumbnail from "../assets/defaultGameThumbnail.jpg";

export default function SearchGames() {
    const { AllGames, updateViewsFn } = useContext(GameContext)
    const [searchParams] = useSearchParams();

    const query = searchParams.get("query");

    const filterSearchGames = AllGames?.filter(gameData =>
        gameData.description.en.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <>
            <Container className="page-content">
                <div className="d-flex justify-content-between my-4" style={{ zIndex: 999 }}>
                    <h3 className="heading-color text-dark">Search: {query}</h3>
                </div>
                <Row className="g-3">
                    {[...filterSearchGames]?.map((gameData, ind) => (
                        <Col md={2} xs={4} key={ind}>
                            <Link
                                to={`/${gameData.title.en.toLowerCase().replace(/\s+/g, "-")}`}
                            >
                                <div
                                    className="GameThumbnail"
                                    onClick={() => updateViewsFn(gameData._id, gameData.gameUrl)}
                                    style={{
                                        backgroundImage: `url(${gameData.thumbnail ? gameData.thumbnail : generalGameThumbnail})`,
                                    }}
                                >
                                </div>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    )
}
