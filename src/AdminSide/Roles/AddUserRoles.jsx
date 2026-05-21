import { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import apiUrl from "../../ApiEndpoint";

export default function AddUserRoles() {

    const [permissions, setPermissions] = useState([]);
    const [roleName, setRoleName] = useState("");

    const permissionList = {
        ApprovedUsers: [ // ✅ separate section
            "approved user"
        ],

        Users: ["view users", "create users", "edit users", "delete users"],
        Games: ["view games", "create games", "edit games", "delete games", "publish games"],
        Categories: ["view games category", "create games category", "edit games category", "delete games category"],
        Tags: ["view games tag", "create games tag", "edit games tag", "delete games tag"],
    };

    const handleCheck = (perm) => {
        if (permissions.includes(perm)) {
            setPermissions(permissions.filter(p => p !== perm));
        } else {
            setPermissions([...permissions, perm]);
        }
    };

    const selectAll = () => {
        const all = Object.values(permissionList).flat();
        setPermissions(all);
    };

    const deselectAll = () => {
        setPermissions([]);
    };

    // ✅ CREATE ROLE FUNCTION
    const createRoleFn = async () => {
        try {
            if (!roleName.trim()) {
                alert("Role name is required");
                return;
            }

            if (permissions.length === 0) {
                alert("Select at least one permission");
                return;
            }

            const res = await fetch(`${apiUrl}/api/role/addRole`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    role: roleName,
                    permissions: permissions,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Error creating role");
                return;
            }

            alert("Role created successfully");

            // ✅ RESET FORM
            setRoleName("");
            setPermissions([]);

        } catch (err) {
            console.log(err);
            alert("Something went wrong");
        }
    };

    return (
        <section className="py-4">
            <Container>

                <h5>Create Role</h5>
                <p className="text-muted">Define a new set of permissions for your team members.</p>

                <Card className="p-4 mt-3 shadow-sm">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6>Assign Permissions</h6>
                        <div>
                            <Button className="text-white" variant="link" onClick={selectAll}>
                                Select All
                            </Button>
                            |
                            <Button className="text-white" variant="link" onClick={deselectAll}>
                                Deselect All
                            </Button>
                        </div>
                    </div>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label style={{ fontSize: "15px", fontWeight: "bold" }}>
                                    Role Name
                                </Form.Label>
                                <Form.Control
                                    placeholder="e.g. Content Manager"
                                    value={roleName}
                                    onChange={(e) => setRoleName(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    {Object.keys(permissionList).map((group, index) => (
                        <Card key={index} className="mb-3 p-3">
                            <h6 style={{ fontWeight: "bold" }}>{group}</h6>
                            <Row>
                                {permissionList[group].map((perm, i) => (
                                    <Col md={3} key={i}>
                                        <Form.Check
                                            type="checkbox"
                                            label={perm}
                                            checked={permissions.includes(perm)}
                                            onChange={() => handleCheck(perm)}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    ))}

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={deselectAll}>
                            Cancel
                        </Button>

                        <Button
                            variant="primary"
                            onClick={createRoleFn}
                            disabled={!roleName || permissions.length === 0}
                        >
                            Save Role
                        </Button>
                    </div>

                </Card>

            </Container>
        </section>
    );
}