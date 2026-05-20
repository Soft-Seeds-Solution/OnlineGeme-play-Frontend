import { useContext, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import GameContext from "../../ContextApi/GameContext";
import apiUrl from "../../ApiEndpoint";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function PendingUpdatedApprovalGames() {
    const {
        uploadedGames
    } = useContext(GameContext);

    const [pendingData, setPendingData] = useState([])
    const uploadedPendingGames = async () => {
        try {
            const res = await fetch(`${apiUrl}/api/games/uploadedd-games-with-pending-data`, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            })

            const data = await res.json();

            setPendingData(data);

        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        uploadedPendingGames()
    }, [])

    const [loadingId, setLoadingId] = useState("");

    // =========================
    // APPROVE GAME
    // =========================
    const approveGame = async (gameId) => {

        const confirm = await Swal.fire({
            title: "Approve Pending Changes?",
            text: "This will publish all pending updates.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Publish",
        });

        if (!confirm.isConfirmed) return;

        try {

            setLoadingId(gameId);

            const res = await fetch(
                `${apiUrl}/api/games/approvePendingGame/${gameId}`,
                {
                    method: "PUT",
                }
            );

            const data = await res.json();

            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Published",
                    text: data.message,
                });
                uploadedGames()

            } else {

                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.message,
                });

            }

        } catch (err) {

            console.log(err);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong",
            });

        } finally {

            setLoadingId("");

        }
    };
    const rejectGame = async (gameId) => {

        const confirm = await Swal.fire({
            title: "Approve Pending Changes?",
            text: "This will remove all pending updates.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Publish",
        });

        if (!confirm.isConfirmed) return;

        try {

            setLoadingId(gameId);

            const res = await fetch(
                `${apiUrl}/api/games/rejectPendingGame/${gameId}`,
                {
                    method: "PUT",
                }
            );

            const data = await res.json();

            if (res.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Removed",
                    text: data.message,
                });
                uploadedGames()

            } else {

                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.message,
                });

            }

        } catch (err) {

            console.log(err);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong",
            });

        } finally {

            setLoadingId("");

        }
    };

    return (
        <Container fluid>

            <Row>

                <Col lg={12}>

                    <Card className="shadow-sm border-0">

                        <Card.Body>

                            <h3 className="mb-4">
                                Pending Updated Games
                            </h3>

                            {
                                pendingData?.length === 0 ? (
                                    <h5 className="text-center py-5">
                                        No Pending Games Found
                                    </h5>
                                ) : (
                                    <Table bordered hover responsive>

                                        <thead>

                                            <tr>
                                                <th>#</th>
                                                <th>Cuurent Name</th>
                                                <th>Pending Date</th>
                                                <th>Action</th>
                                            </tr>

                                        </thead>

                                        <tbody>

                                            {
                                                pendingData.map((gameData, index) => (

                                                    <tr key={gameData._id}>

                                                        <td>
                                                            {index + 1}
                                                        </td>

                                                        <td>

                                                            <h6 className="mb-1">
                                                                {
                                                                    gameData?.title?.en
                                                                }
                                                            </h6>

                                                        </td>

                                                        <td>
                                                            {
                                                                gameData?.pendingAt
                                                                    ? new Date(gameData.pendingAt).toLocaleString()
                                                                    : "-"
                                                            }
                                                        </td>

                                                        <td>
                                                            <Link to={`/adminPanel/pending-approval-data/${gameData.title?.en.toLowerCase().replace(/\s+/g, "-")}`}><Button
                                                                variant="success"
                                                                size="sm"
                                                                className="me-3"
                                                            >

                                                                Review Changes
                                                            </Button></Link>

                                                            <Button
                                                                variant="success"
                                                                size="sm"
                                                                disabled={loadingId === gameData._id}
                                                                className="me-3"
                                                                onClick={() =>
                                                                    approveGame(gameData._id)
                                                                }
                                                            >
                                                                {
                                                                    loadingId === gameData._id
                                                                        ? "Publishing..."
                                                                        : "Publish"
                                                                }
                                                            </Button>
                                                            <Button
                                                                variant="success"
                                                                size="sm"
                                                                disabled={loadingId === gameData._id}
                                                                className="me-3"
                                                                onClick={() =>
                                                                    rejectGame(gameData._id)
                                                                }
                                                            >
                                                                {
                                                                    loadingId === gameData._id
                                                                        ? "Rejecting..."
                                                                        : "Reject"
                                                                }
                                                            </Button>

                                                        </td>

                                                    </tr>

                                                ))
                                            }

                                        </tbody>

                                    </Table>
                                )
                            }

                        </Card.Body>

                    </Card>

                </Col>

            </Row>

        </Container>
    );
}