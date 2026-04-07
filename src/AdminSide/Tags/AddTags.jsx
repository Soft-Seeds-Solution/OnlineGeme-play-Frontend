import { useEffect, useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import apiUrl from "../../ApiEndpoint";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function AddTags() {
    const [tags, setTags] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;
    const [searchTitle, setSearchTitle] = useState("")
    const [allTags, setAllTags] = useState([])
    const [catEditModal, setCatEditModal] = useState(false)
    const [getTagById, setGetTagById] = useState([])

    const fetchTags = async () => {
        const res = await fetch("https://edge.khelogy.com/api/tags/allTags");
        const data = await res.json();
        setAllTags(data);
    };

    useEffect(() => {
        fetchTags()
    }, [])

    const filterTags = allTags?.filter(tagData => tagData.tags.toLowerCase().includes(searchTitle.toLowerCase()))

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

    // Update Category & Modal Logic
    const openEditTag = async (id) => {
        const res = await fetch(`${apiUrl}/api/tags/tagById/${id}`);
        const data = await res.json();

        setGetTagById(data);

        setCatEditModal(true);
    };

    const updateTagFn = async (e) => {
        e.preventDefault();

        if (!getTagById?._id) {
            Swal.fire("Tag ID missing", "", "error");
            return;
        }

        const { isConfirmed } = await Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: "Don't save",
        });

        if (!isConfirmed) return;

        const tags = getTagById.tags;

        const res = await fetch(
            `${apiUrl}/api/tags/updateTagById/${getTagById?._id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ tags }),
            }
        );

        if (res.ok) {
            Swal.fire("Saved!", "", "success");
            fetchTags();
            setCatEditModal(false);
        } else {
            Swal.fire("Error saving changes", "", "error");
        }
    };

    // Delete Tags
    const deleteTag = async (id) => {
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
            await fetch(`${apiUrl}/api/tags/delTag/${id}`, {
                method: "DELETE"
            });
            Swal.fire("Deleted!", "This game deleted successfully.", "success");
            fetchTags();
        }
    };

    // tag
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentTags = filterTags?.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(allTags.length / itemsPerPage);

    return (
        <>
            <Form className='form-group admin-form p-3' onSubmit={AddTags} style={{ boxShadow: "none" }}>
                <div id='tagsError' className='text-center text-danger'></div>

                <Form.Group className="my-3" controlId="category">
                    <Form.Label>Tags</Form.Label>
                    <Form.Control type='text' placeholder="Tags" name='tags' value={tags} onChange={(e) => setTags(e.target.value)} />
                </Form.Group>

                <div className="text-center">
                    <Button type='submit' className='primary-btn mt-3 text-white'>Add Tags</Button>
                </div>
            </Form>

            <Form.Control type="text" className="mb-3" placeholder="Search Game By Title" style={{ border: "1px solid var(--theme-color)", width: "40%" }} onChange={(e) => {
                setSearchTitle(e.target.value);
                setCurrentPage(1);
            }} />

            <Table striped bordered>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tags</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentTags?.map((tag, ind) => (
                        <tr key={tag._id}>
                            <td>{indexOfFirstItem + ind + 1}</td>
                            <td>
                                {tag.tags}
                            </td>
                            <td>
                                <FontAwesomeIcon icon={faEdit} className="me-3" onClick={() => openEditTag(tag._id)} />
                                <FontAwesomeIcon icon={faTrash} onClick={() => deleteTag(tag._id)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="d-flex justify-content-center mt-3">
                <Button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="me-2"
                >
                    Prev
                </Button>

                <span className="align-self-center">
                    Page {currentPage} of {totalPages}
                </span>

                <Button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="ms-2"
                >
                    Next
                </Button>
            </div>

            {/* Edit Modal */}
            <Modal
                size="lg"
                show={catEditModal}
                onHide={() => setCatEditModal(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-sm">
                        Tag Modal
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <Form className='form-group admin-form p-3' onSubmit={updateCatFn} style={{ boxShadow: "none" }}> */}
                    <Form className='form-group admin-form p-3' onSubmit={updateTagFn} style={{ boxShadow: "none" }}>
                        <div id='tagError' className='text-center text-danger'></div>
                        <Form.Group className="my-3" controlId="category">
                            <Form.Label>Tags</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Tags"
                                name="tags"
                                value={getTagById?.tags || ""}
                                onChange={(e) =>
                                    setGetTagById(prev => ({
                                        ...prev,
                                        tags: e.target.value
                                    }))
                                }
                            />
                        </Form.Group>

                        <div className="text-center">
                            <Button type='submit' className='primary-btn mt-3 text-white'>Update Tag</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}
