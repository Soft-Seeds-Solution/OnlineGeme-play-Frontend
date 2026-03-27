import { Button, Form, Modal, Table } from "react-bootstrap";
import AddCategory from "./AddCategory";
import { useContext, useState } from "react";
import GameCatContext from "../../ContextApi/GameCatContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import apiUrl from "../../ApiEndpoint";
import Swal from "sweetalert2";

export default function Category() {
    const { AllCategory, deleteCategory, allCategory, gameCatId, setGameCatId, getCatId } = useContext(GameCatContext)
    const [gameCatEditModal, setGameCatEditModal] = useState(false)

    const openEditGameCat = (id) => {
        setGameCatEditModal(true)
        getCatId(id)
    }

    const addFaq = () => {
        setGameCatId(prev => ({
            ...prev,
            faqs: [...(prev.faqs || []), { question: "", answer: "" }]
        }));
    };

    const updateFaq = (index, field, value) => {
        const updatedFaqs = [...(gameCatId.faqs || [])];
        updatedFaqs[index][field] = value;
        setGameCatId(prev => ({ ...prev, faqs: updatedFaqs }));
    };

    const removeFaq = (index) => {
        const updatedFaqs = gameCatId.faqs.filter((_, i) => i !== index);
        setGameCatId(prev => ({ ...prev, faqs: updatedFaqs }));
    };

    const updateCatFn = async (e) => {
        e.preventDefault()
        const { isConfirmed } = await Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`,
        });

        if (isConfirmed) {
            const { logo, category, description, faqs, shortDes } = gameCatId
            const formData = new FormData()
            formData.append("category", category)
            formData.append("logo", logo)
            formData.append("faqs", JSON.stringify(faqs));
            formData.append("description", JSON.stringify(description));
            formData.append("shortDes", JSON.stringify(shortDes));

            const res = await fetch(`${apiUrl}/api/gameCat/editCategory/${gameCatId._id}`, {
                method: "PUT",
                body: formData
            })
            // const data = await res.json()
            if (res.ok) {
                Swal.fire("Saved!", "", "success");
                allCategory();
            }
        } else {
            Swal.fire("Error saving changes", "", "error");
        }
    }

    const onchange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'logo' && files) {
            setGameCatId({ ...gameCatId, logo: files[0] });
        } else {
            setGameCatId({ ...gameCatId, [name]: value });
        }
    };
    return (
        <>
            <AddCategory />
            {AllCategory.length > 0 ? (
                <Table striped bordered>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {AllCategory?.map((cat, ind) => (
                            <tr key={ind}>
                                <td>{ind + 1}</td>
                                <td>{cat.category}</td>
                                <td>
                                    <FontAwesomeIcon icon={faEdit} className="me-3" onClick={() => openEditGameCat(cat._id)} />
                                    <FontAwesomeIcon icon={faTrash} onClick={() => deleteCategory(cat._id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

            ) : (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                    <p style={{ fontSize: "30px" }}>No Category Uploaded Yet</p>
                </div>
            )}

            {/* edit cat modal */}
            <Modal
                size="lg"
                show={gameCatEditModal}
                onHide={() => setGameCatEditModal(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-sm">
                        {/* Game Modal */}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={updateCatFn}>
                        <Form.Group>
                            <Form.Label>Category</Form.Label>
                            <Form.Control name="category" value={gameCatId.category} onChange={onchange}></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Category Logo</Form.Label>
                            <Form.Control type="file" name="logo" onChange={onchange}></Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>Short Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Add category description"
                                name="shortDes"
                                value={gameCatId.shortDes}
                                onChange={onchange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>Long Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Add category description"
                                name="description"
                                value={gameCatId.description}
                                onChange={onchange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>FAQs</Form.Label>
                            {gameCatId.faqs?.map((faq, i) => (
                                <div key={i} className="mb-2">
                                    <Form.Control
                                        type="text"
                                        placeholder="Question"
                                        value={faq.question}
                                        onChange={(e) => updateFaq(i, "question", e.target.value)}
                                        className="mb-1"
                                    />
                                    <Form.Control
                                        type="text"
                                        placeholder="Answer"
                                        value={faq.answer}
                                        onChange={(e) => updateFaq(i, "answer", e.target.value)}
                                    />
                                    <div className="mt-3" style={{ fontSize: "12px", border: "1px solid red", display: "inline-block" }} size="sm" type="button" onClick={() => removeFaq(i)}>Remove -</div>
                                </div>
                            ))}
                            <Button type="button" onClick={addFaq}>+ Add FAQ</Button>
                        </Form.Group>
                        <div className="d-flex justify-content-center mt-3">
                            <Button type="submit">Update Category</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}
