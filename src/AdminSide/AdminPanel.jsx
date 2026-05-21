import {
    Button,
    Col,
    Container,
    Accordion,
    Row,
} from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGamepad,
    faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "./Sidebar";

export default function AdminPanel() {
    const adminBar = [
        // {
        //     path: "manage-categories",
        //     title: "Manage Game Categories",
        //     type: "adminLinks",
        //     icon: faListCheck,
        // },
        {
            path: "add-user-roles",
            title: "Add User Roles",
            type: "adminLinks",
            icon: faListCheck,
        },
        {
            path: "user-roles",
            title: "User Roles",
            type: "adminLinks",
            icon: faListCheck,
        },
        {
            path: "add-user",
            title: "Add User",
            type: "adminLinks",
            icon: faListCheck,
        },
        {
            path: "all-users",
            title: "Users",
            type: "adminLinks",
            icon: faListCheck,
        },
        {
            path: "add-category",
            title: "Add Category",
            type: "adminLinks",
            icon: faListCheck,
        },
        {
            path: "all-categories",
            title: "All Categories",
            type: "adminLinks",
            icon: faListCheck,
        },
        {
            path: "manage-tags",
            title: "Manage Tags",
            type: "adminLinks",
            icon: faGamepad,
        },
        {
            path: "manage-games",
            title: "Manage Games",
            type: "adminLinks",
            icon: faGamepad,
        },
        {
            path: "feature-games",
            title: "Feature Games",
            type: "adminLinks",
            icon: faGamepad,
        },
        {
            path: "unpublish-games",
            title: "UnPublish Games",
            type: "adminLinks",
            icon: faGamepad,
        },
        {
            path: "pending-games",
            title: "Pending Games",
            type: "adminLinks",
            icon: faGamepad,
        },
        {
            path: "rejected-games",
            title: "Rejected Games",
            type: "adminLinks",
            icon: faGamepad,
        },
        {
            path: "upload-blog",
            title: "Upload Blog",
            type: "adminLinks",
            icon: faGamepad,
        },
    ];

    return (
        <>
            <Container fluid style={{ backgroundColor: "#f2f5f8" }}>
                <Row className="admin-links ">
                    <Col md={3}>
                        <Sidebar />
                        {/* {adminBar &&
                            adminBar.map((admin, index) => {
                                return (
                                    <div key={index} className="admin-sidebar">
                                        {admin.type === "adminLinks" ? (
                                            <div className="d-flex my-3" style={{ borderBottom: '1px solid #ccc' }}>
                                                <FontAwesomeIcon icon={admin.icon} className="admin-icons" />
                                                <Link to={admin.path}> <p className="mx-md-3 admin-btn" style={{ fontSize: '1rem' }}>
                                                    {admin.title}
                                                </p></Link>
                                            </div>
                                        ) : (
                                            <Accordion defaultActiveKey={null} alwaysOpen >
                                                <Accordion.Item eventKey={index} className="mb-3 all-accordions" >
                                                    <Accordion.Header>
                                                        <FontAwesomeIcon icon={admin.icon} className="mt-2 admin-icons" />&nbsp; {admin.title}
                                                    </Accordion.Header>
                                                    <Accordion.Body>
                                                        {admin.dropDownList.map((dropdown, subIndex) => (
                                                            <div key={subIndex} className="d-flex">
                                                                <FontAwesomeIcon icon={dropdown.icon} className="mt-2 me-3 admin-icons" />
                                                                <Button as={Link} to={dropdown.path} className="mb-3 admin-btn">
                                                                    {dropdown.title}
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        )}
                                    </div>
                                );
                            })} */}
                    </Col>
                    <Col md={9} className="content-col-admin py-5">
                        <Outlet />
                    </Col>
                </Row>
            </Container>
        </>
    );
}
