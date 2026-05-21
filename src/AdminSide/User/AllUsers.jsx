import { useContext, useEffect, useState } from "react";
import {
    Button,
    Modal,
    Table,
    Form,
    Row,
    Col
} from "react-bootstrap";
import apiUrl from "../../ApiEndpoint";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import UserContext from "../../ContextApi/UserContext";

export default function User() {

    const [user, setUser] = useState([]);
    const [roles, setRoles] = useState([]);
    const { signUser } = useContext(UserContext)
    const [userEditModal, setUserEditModal] = useState(false);

    // EDIT STATES
    const [editUserId, setEditUserId] = useState("");
    const [editUserData, setEditUserData] = useState({
        name: "",
        email: "",
        number: "",
        role: ""
    });

    // FETCH USERS
    const fetchUser = async () => {
        try {
            const res = await fetch(`${apiUrl}/api/user/getUser`);
            const data = await res.json();

            setUser(data);

        } catch (err) {
            console.log(err);
        }
    };

    // FETCH ROLES
    const fetchRoles = async () => {
        try {

            const res = await fetch(`${apiUrl}/api/role/allRoles`);

            const data = await res.json();

            setRoles(data);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchRoles();
    }, []);

    // OPEN EDIT MODAL
    const openEditModal = (userData) => {

        setEditUserId(userData._id);

        setEditUserData({
            name: userData.name || "",
            email: userData.email || "",
            number: userData.number || "",
            role: userData.role?._id || ""
        });

        setUserEditModal(true);
    };

    // HANDLE INPUT CHANGE
    const onchange = (e) => {

        const { name, value } = e.target;

        setEditUserData({
            ...editUserData,
            [name]: value
        });
    };

    // UPDATE USER
    const updateUserFn = async (e) => {

        e.preventDefault();

        try {

            const res = await fetch(`${apiUrl}/api/user/updateUser/${editUserId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(editUserData)
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Something went wrong");
                return;
            }

            alert("User updated successfully");

            setUserEditModal(false);

            fetchUser();

        } catch (err) {

            console.log(err);

            alert("Server Error");
        }
    };

    // Delete Category
    const deleteUser = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (isConfirmed) {
            await fetch(`${apiUrl}/api/user/delUser/${id}`, {
                method: "DELETE"
            });
            Swal.fire("Deleted!", "This game deleted successfully.", "success");
            fetchUser();
        }
    };

    return (
        <>
            <Table striped bordered>

                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {user?.map((userData, ind) => (

                        <tr key={ind}>

                            <td>{userData.name}</td>

                            <td>{userData.email}</td>

                            <td>{userData.role?.role}</td>

                            <td>
                                {signUser?.role?.permissions?.includes("edit users") && (
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                        className="me-3"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => openEditModal(userData)}
                                    />
                                )}

                                {signUser?.role?.permissions?.includes("delete users") && (
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => deleteUser(userData._id)}
                                    />
                                )}

                            </td>

                        </tr>
                    ))}

                </tbody>

            </Table>

            {/* EDIT USER MODAL */}
            <Modal
                size="lg"
                show={userEditModal}
                onHide={() => setUserEditModal(false)}
            >

                <Modal.Header closeButton>
                    <Modal.Title>
                        Edit User
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <Form onSubmit={updateUserFn}>

                        <Row>

                            <Col md={6}>
                                <Form.Group className="mb-3">

                                    <Form.Label>
                                        Full Name
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={editUserData.name}
                                        onChange={onchange}
                                    />

                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">

                                    <Form.Label>
                                        Email
                                    </Form.Label>

                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={editUserData.email}
                                        onChange={onchange}
                                    />

                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">

                                    <Form.Label>
                                        Phone Number
                                    </Form.Label>

                                    <Form.Control
                                        type="number"
                                        name="number"
                                        value={editUserData.number}
                                        onChange={onchange}
                                    />

                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">

                                    <Form.Label>
                                        Role
                                    </Form.Label>

                                    <Form.Control
                                        as="select"
                                        name="role"
                                        value={editUserData.role}
                                        onChange={onchange}
                                    >

                                        <option value="">
                                            Select Role
                                        </option>

                                        {roles?.map((roleData) => (

                                            <option
                                                key={roleData._id}
                                                value={roleData._id}
                                            >
                                                {roleData.role}
                                            </option>

                                        ))}

                                    </Form.Control>

                                </Form.Group>
                            </Col>

                        </Row>

                        <div className="text-end">

                            <Button
                                type="submit"
                                className="text-white"
                            >
                                Update User
                            </Button>

                        </div>

                    </Form>

                </Modal.Body>

            </Modal>
        </>
    );
}