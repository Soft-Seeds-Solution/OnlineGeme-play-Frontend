import { useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import GameContext from "../ContextApi/GameContext";

export default function GameLinks() {
    const { AllGames } = useContext(GameContext);

    return (

        <div className="page-content">
            <Container fluid>
                <Row>
                    {AllGames?.map((game, ind) => {
                        return <Col md={4} key={ind} >
                            <h5>{game?.title?.en}</h5>
                            <p>{game?.gameUrl}</p>
                        </Col>
                    })}
                </Row>
            </Container>
        </div >
    );
}