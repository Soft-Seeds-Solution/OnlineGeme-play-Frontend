import { useContext, useMemo, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import apiUrl from "../../ApiEndpoint";
import GameCatContext from "../../ContextApi/GameCatContext";
import { Link } from "react-router-dom";

export default function PendingUpdatedApprovalCat() {

    const {
        categories,
        fetchCategories
    } = useContext(GameCatContext);

    const [loadingId, setLoadingId] = useState("");

    // ====================================
    // FLATTEN NESTED CATEGORIES
    // ====================================

    const flattenCategories = (cats = [], level = 0) => {

        let result = [];

        cats.forEach(cat => {

            result.push({
                ...cat,
                level
            });

            if (cat.children?.length > 0) {

                result = result.concat(
                    flattenCategories(cat.children, level + 1)
                );
            }
        });

        return result;
    };

    // ====================================
    // GET ALL CATEGORIES INCLUDING CHILDREN
    // ====================================

    const allFlatCategories = useMemo(() => {
        return flattenCategories(categories || []);
    }, [categories]);

    // ====================================
    // PENDING CATEGORIES
    // ====================================

    const pendingApprovalCats = allFlatCategories.filter(cat =>
        cat.publishedByAdmin === false ||
        cat.pendingChanges
    );

    // ====================================
    // APPROVE CATEGORY
    // ====================================

    const approveCategory = async (catId) => {

        const confirm = await Swal.fire({
            title: "Approve Pending Changes?",
            text: "This will publish all pending updates.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Publish",
        });

        if (!confirm.isConfirmed) return;

        try {

            setLoadingId(catId);

            const res = await fetch(
                `${apiUrl}/api/category/approvePendingCat/${catId}`,
                {
                    method: "PUT",
                }
            );

            const data = await res.json();

            if (res.ok) {

                Swal.fire({
                    icon: "success",
                    title: "Published",
                    text: data.message || "Category approved successfully",
                });

                fetchCategories(true);

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
    const rejectCategory = async (catId) => {

        const confirm = await Swal.fire({
            title: "Approve Pending Changes?",
            text: "This will reject all pending updates.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Publish",
        });

        if (!confirm.isConfirmed) return;

        try {

            setLoadingId(catId);

            const res = await fetch(
                `${apiUrl}/api/category/rejectPendingCat/${catId}`,
                {
                    method: "PUT",
                }
            );

            const data = await res.json();

            if (res.ok) {

                Swal.fire({
                    icon: "success",
                    title: "Published",
                    text: data.message || "Category Rejected successfully",
                });

                fetchCategories(true);

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
                                Pending Updated Categories
                            </h3>

                            {
                                pendingApprovalCats?.length === 0 ? (

                                    <h5 className="text-center py-5">
                                        No Pending Category Found
                                    </h5>

                                ) : (

                                    <Table bordered hover responsive>

                                        <thead>

                                            <tr>
                                                <th>#</th>
                                                <th>Current Category</th>
                                                <th>Pending Category</th>
                                                <th>Submitted At</th>
                                                <th>Actions</th>
                                            </tr>

                                        </thead>

                                        <tbody>

                                            {
                                                pendingApprovalCats.map((catData, index) => (

                                                    <tr key={catData._id}>

                                                        <td>
                                                            {index + 1}
                                                        </td>

                                                        {/* CURRENT CATEGORY */}
                                                        <td>

                                                            <h6 className="mb-1">

                                                                {
                                                                    "— ".repeat(catData.level)
                                                                }

                                                                {
                                                                    catData.category || "-"
                                                                }

                                                            </h6>

                                                        </td>

                                                        {/* PENDING CATEGORY */}
                                                        <td>

                                                            <h6 className="mb-1">

                                                                {
                                                                    catData.pendingChanges?.category ||
                                                                    catData.category ||
                                                                    "-"
                                                                }

                                                            </h6>

                                                        </td>

                                                        {/* DATE */}
                                                        <td>

                                                            {
                                                                catData?.pendingAt
                                                                    ? new Date(
                                                                        catData.pendingAt
                                                                    ).toLocaleString()
                                                                    : "-"
                                                            }

                                                        </td>

                                                        {/* ACTIONS */}
                                                        <td>

                                                            <Link to={`/adminPanel/pending-approval-category-Data/${catData.category.toLowerCase().replace(/\s+/g, "-")}`}> <Button
                                                                variant="success"
                                                                size="sm"
                                                                disabled={loadingId === catData._id}
                                                                className="me-2"
                                                            >
                                                                Review Changes
                                                            </Button></Link>

                                                            <Button
                                                                variant="success"
                                                                size="sm"
                                                                disabled={loadingId === catData._id}
                                                                className="me-2"
                                                                onClick={() =>
                                                                    approveCategory(catData._id)
                                                                }
                                                            >
                                                                {
                                                                    loadingId === catData._id
                                                                        ? "Publishing..."
                                                                        : "Approve"
                                                                }
                                                            </Button>

                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                disabled={loadingId === catData._id}
                                                                onClick={() =>
                                                                    rejectCategory(catData._id)
                                                                }
                                                            >
                                                                Reject
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