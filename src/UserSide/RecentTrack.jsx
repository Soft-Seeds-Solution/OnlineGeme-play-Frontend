import { useContext } from "react"
import TrackContext from "../ContextApi/TrackContext"
import UserContext from "../ContextApi/UserContext"
import { Col, Container, Row } from "react-bootstrap"
import generalGameTHumbnail from "../assets/defaultGameThumbnail.jpg";

export default function RecentTrack() {
    const { signUser } = useContext(UserContext)
    const { allRecords } = useContext(TrackContext)
    const filterUserRecords = allRecords?.filter(record => record.userId?._id === signUser?._id)

    return (
        <>
            <Container fluid className="pt-4">
                <Row>
                    <h3 className="mb-4 text-dark">Recent Played Games</h3>
                    {filterUserRecords?.reverse().map((gameData, ind) => (
                        <Col md={2} key={ind}> <div
                            className="GameThumbnail"
                            style={{
                                backgroundImage: `url(${gameData.productId?.thumbnail ? gameData.productId?.thumbnail : generalGameTHumbnail})`,
                            }}
                        >
                        </div>
                            <div className="d-flex justify-content-center ">
                                <h6 className="p-2" style={{ color: "black", borderLeft: "1px solid var(--border)", display: "inline-block", borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>{gameData.productId?.title.length > 14 ? gameData.productId?.title.slice(0, 14) + "..." : gameData.productId?.title}</h6>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    )
}
