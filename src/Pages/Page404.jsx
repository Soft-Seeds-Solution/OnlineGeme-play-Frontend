import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Page404() {
    const navigate = useNavigate();

    return (
        <Container className="text-center mt-5">
            <h1 className="display-3 text-danger">404</h1>
            <h2 className="mb-3">Page Not Found</h2>
            <p className="text-muted">The page you are looking for does not exist.</p>
            <Button variant="primary" onClick={() => navigate("/")}>
                Go to Home
            </Button>
        </Container>
    );
}
