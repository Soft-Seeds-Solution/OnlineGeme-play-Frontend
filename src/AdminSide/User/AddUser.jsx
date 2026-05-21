import { useState, useEffect } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import apiUrl from "../../ApiEndpoint";

export default function AddUser() {
    const [roles, setRoles] = useState([]);

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        number: "",
        role: ""   // ✅ will store role _id
    });

    // ✅ Fetch roles
    const fetchRoles = async () => {
        try {
            const res = await fetch(`${apiUrl}/api/role/allRoles`);
            const data = await res.json();

            console.log("Roles:", data);

            setRoles(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    // ✅ Create user
    const createUser = async (e) => {
        e.preventDefault();

        const { name, email, password, confirmPassword, number, role } = userData;

        const res = await fetch(`${apiUrl}/api/user/addUser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                confirmPassword,
                number,
                role   // ✅ sending role _id
            })
        });

        const data = await res.json();

        const userError = document.getElementById("userError");
        data.message ? userError.innerText = data.message : userError.innerText = "";
    };

    // ✅ Handle input change
    const onchange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    return (
        <section>
            <Container>
                <Row className="justify-content-center bg-white p-3" style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.1)", borderRadius: "5px" }}>
                    <Col md={8}>
                        <Form onSubmit={createUser} className="rounded login-form">

                            <div id="userError" className="text-danger text-center mb-2"></div>

                            <Form.Group className="mb-3 input">
                                <Form.Control
                                    name="name"
                                    type="text"
                                    placeholder="Full Name"
                                    value={userData.name}
                                    onChange={onchange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3 input">
                                <Form.Control
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    value={userData.email}
                                    onChange={onchange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3 input">
                                <Form.Control
                                    name="number"
                                    type="number"
                                    placeholder="Phone Number"
                                    value={userData.number}
                                    onChange={onchange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3 input">
                                <Form.Control
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    value={userData.password}
                                    onChange={onchange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3 input">
                                <Form.Control
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={userData.confirmPassword}
                                    onChange={onchange}
                                />
                            </Form.Group>

                            {/* ✅ ROLE SELECT */}
                            <Form.Group className="mb-3 input">
                                <Form.Control
                                    as="select"
                                    name="role"
                                    value={userData.role}
                                    onChange={onchange}
                                >
                                    <option value="">Select Role</option>

                                    {roles.map((roleData) => (
                                        <option key={roleData._id} value={roleData._id}>
                                            {roleData.role}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Button
                                className="mt-3 w-100"
                                type="submit"
                                disabled={!userData.role}
                            >
                                Create User
                            </Button>

                        </Form>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}