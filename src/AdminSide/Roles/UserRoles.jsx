import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal, Row, Col, Card, Table } from "react-bootstrap";
import apiUrl from "../../ApiEndpoint";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import UserContext from "../../ContextApi/UserContext";

export default function UserRoles() {

    const [roles, setRoles] = useState([]);
    const [roleEditModal, setRoleEditModal] = useState(false);
    const { signUser } = useContext(UserContext)
    const [editRoleId, setEditRoleId] = useState("");
    const [editRoleName, setEditRoleName] = useState("");
    const [editPermissions, setEditPermissions] = useState([]);

    const permissionList = {
        ApprovedUsers: [ // ✅ separate section
            "approved user"
        ],

        Users: ["view users", "create users", "edit users", "delete users"],
        Games: ["view games", "create games", "edit games", "delete games", "publish games"],
        Categories: ["view games category", "create games category", "edit games category", "delete games category"],
        Tags: ["view games tag", "create games tag", "edit games tag", "delete games tag"],
    };

    // FETCH ROLES
    const fetchRoles = async () => {
        const res = await fetch(`${apiUrl}/api/role/allRoles`);
        const data = await res.json();
        setRoles(data);
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    // OPEN EDIT MODAL
    const openEditModal = (roleData) => {
        setEditRoleId(roleData._id);
        setEditRoleName(roleData.role);
        setEditPermissions(roleData.permissions);

        setRoleEditModal(true);
    };

    // HANDLE CHECKBOX
    const handleCheck = (perm) => {
        if (editPermissions.includes(perm)) {
            setEditPermissions(editPermissions.filter((p) => p !== perm));
        } else {
            setEditPermissions([...editPermissions, perm]);
        }
    };

    // SELECT ALL
    const selectAll = () => {
        const allPermissions = Object.values(permissionList).flat();
        setEditPermissions(allPermissions);
    };

    // DESELECT ALL
    const deselectAll = () => {
        setEditPermissions([]);
    };

    // UPDATE ROLE
    const updateRoleFn = async (e) => {
        e.preventDefault();

        try {

            const res = await fetch(`${apiUrl}/api/role/updateRole/${editRoleId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    role: editRoleName,
                    permissions: editPermissions
                })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Something went wrong");
                return;
            }

            alert("Role updated successfully");

            setRoleEditModal(false);

            fetchRoles();

        } catch (error) {
            console.log(error);
            alert("Server Error");
        }
    };

    // Delete Category
    const deleteRole = async (id) => {
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
            await fetch(`${apiUrl}/api/role/delRole/${id}`, {
                method: "DELETE"
            });
            Swal.fire("Deleted!", "This game deleted successfully.", "success");
            fetchRoles(true);
        }
    };

    return (
        <>
            <Table striped bordered>
                <thead>
                    <tr>
                        <th>Role Name</th>
                        <th>Permissions</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {roles?.map((roleData, ind) => (
                        <tr key={ind}>

                            <td
                                style={{
                                    backgroundColor: "transparent",
                                    color: "black"
                                }}
                            >
                                {roleData.role}
                            </td>

                            <td>
                                {roleData.permissions?.map((perm, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            background: "#007bff",
                                            color: "#fff",
                                            padding: "4px 8px",
                                            margin: "2px",
                                            borderRadius: "5px",
                                            display: "inline-block",
                                            fontSize: "12px"
                                        }}
                                    >
                                        {perm}
                                    </span>
                                ))}
                            </td>

                            <td>
                                {signUser?.role?.permissions?.includes("edit games tag") && (
                                    <FontAwesomeIcon
                                        icon={faEdit}
                                        className="me-3"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => openEditModal(roleData)}
                                    />
                                )}

                                {signUser?.role?.permissions?.includes("delete games tag") && (
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => deleteRole(roleData._id)}
                                    />
                                )}
                            </td>

                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* EDIT ROLE MODAL */}
            <Modal
                size="lg"
                show={roleEditModal}
                onHide={() => setRoleEditModal(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Edit Role
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <Form
                        className='form-group admin-form p-3'
                        onSubmit={updateRoleFn}
                        style={{ boxShadow: "none" }}
                    >

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5>Assign Permissions</h5>

                            <div>
                                <Button
                                    variant="link"
                                    className="text-white"
                                    onClick={selectAll}
                                >
                                    Select All
                                </Button>

                                |

                                <Button
                                    variant="link"
                                    className="text-white"
                                    onClick={deselectAll}
                                >
                                    Deselect All
                                </Button>
                            </div>
                        </div>

                        {/* ROLE NAME */}
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label
                                        style={{
                                            fontSize: "15px",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Role Name
                                    </Form.Label>

                                    <Form.Control
                                        type="text"
                                        value={editRoleName}
                                        onChange={(e) => setEditRoleName(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* PERMISSIONS */}
                        {Object.keys(permissionList).map((group, index) => (
                            <Card
                                key={index}
                                className="mb-3 p-3"
                            >
                                <h6 style={{ fontWeight: "bold" }}>
                                    {group}
                                </h6>

                                <Row>
                                    {permissionList[group].map((perm, i) => (
                                        <Col md={3} key={i}>
                                            <Form.Check
                                                type="checkbox"
                                                label={perm}
                                                checked={editPermissions.includes(perm)}
                                                onChange={() => handleCheck(perm)}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </Card>
                        ))}

                        <div className="text-end">
                            <Button
                                type='submit'
                                className='primary-btn mt-3 text-white'
                            >
                                Update Role
                            </Button>
                        </div>

                    </Form>

                </Modal.Body>
            </Modal>
        </>
    );
}