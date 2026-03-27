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

export default function UserPanel() {
    const adminBar = [
        {
            path: "favourites",
            title: "Favourites",
            type: "adminLinks",
            icon: faListCheck,
        },
        {
            path: "recent-played-games",
            title: "Recent Played Games",
            type: "adminLinks",
            icon: faGamepad,
        },
        {
            path: "user-manage-game",
            title: "Manage Games",
            type: "adminLinks",
            icon: faGamepad,
        },
        {
            path: "user-uploaded-games-record",
            title: "Uploaded Games Record",
            type: "adminLinks",
            icon: faGamepad,
        },
    ];

    return (
        <>
            <Container fluid className="page-content">
                <Row className="admin-links">
                    <Col md={3} className=" pt-5" style={{ backgroundColor: "var(--light-bg)", height: "100vh" }}>
                        {adminBar &&
                            adminBar.map((admin, index) => {
                                return (
                                    <div key={index} className="admin-sidebar">
                                        {admin.type === "adminLinks" ? (
                                            <div className="d-flex my-3" style={{ borderBottom: '1px solid #ccc' }}>
                                                <FontAwesomeIcon icon={admin.icon} className="admin-icons" />
                                                <Link to={admin.path}> <p className="mx-3 admin-btn" style={{ fontSize: '1rem' }}>
                                                    <p className=""> {admin.title}</p>
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
                            })}
                    </Col>
                    <Col md={9} className="content-col-admin py-5">
                        <Outlet />
                    </Col>
                </Row>
            </Container>
        </>
    );
}