import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import apiUrl from "../../ApiEndpoint";

export default function AddGameTags() {
    const [tags, setTags] = useState("")
    const [allTags, setAllTags] = useState([])
    const [TagAddModal, setTagAddModal] = useState(false)

    const fetchTags = async () => {
        const res = await fetch(`${apiUrl}/api/tags/allTags`);
        const data = await res.json();
        setAllTags(data);
    };

    useEffect(() => {
        fetchTags()
    }, [])

    const AddTags = async (e) => {
        e.preventDefault();

        const res = await fetch(`${apiUrl}/api/tags/addTags`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ tags }),
        });
        const data = await res.json()
        const tagError = document.getElementById('tagsError');
        data.message !== undefined ? tagError.innerText = data.message : tagError.innerText = ""
        if (res.ok) {
            setTags("")
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Tags added successfully!",
                showConfirmButton: true,
            });
            fetchTags()
        }
    }

    return (
        <>
            <div className="d-flex justify-content-start my-4">
                <Button className="primary-btn" onClick={() => setTagAddModal(true)}>Add Tags</Button>
            </div>

            {/* Edit Modal */}
            <Modal
                style={{ boxShadow: "4px 4px 4px black" }}
                size="md"
                show={TagAddModal}
                onHide={() => setTagAddModal(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-sm">
                        Tag Modal
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className='form-group admin-form p-3' style={{ boxShadow: "none" }}>
                        <div id='tagsError' className='text-center text-danger'></div>

                        <Form.Group className="my-3" controlId="category">
                            <Form.Label>Tags</Form.Label>
                            <Form.Control type='text' placeholder="Tags" name='tags' value={tags} onChange={(e) => setTags(e.target.value)} />
                        </Form.Group>

                        <div className="text-center" onClick={AddTags}>
                            <Button className='primary-btn mt-3 text-white'>Add Tags</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}
