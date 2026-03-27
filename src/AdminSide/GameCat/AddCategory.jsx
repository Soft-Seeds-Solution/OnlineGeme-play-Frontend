import { useContext, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import apiUrl from '../../ApiEndpoint';
import GameCatContext from '../../ContextApi/GameCatContext';

function AddCategory() {
    const [show, setShow] = useState(false);
    const { allCategory } = useContext(GameCatContext)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [catCredentials, setCatCredentials] = useState({
        category: "",
        logo: "",
        description: "",
        faqs: [{ question: "", answer: "" }]
    });

    const addFaq = () => {
        setCatCredentials(prev => ({
            ...prev,
            faqs: [...prev.faqs, { question: "", answer: "" }]
        }));
    };

    const updateFaq = (index, field, value) => {
        const updatedFaqs = [...catCredentials.faqs];
        updatedFaqs[index][field] = value;
        setCatCredentials(prev => ({ ...prev, faqs: updatedFaqs }));
    };

    const removeFaq = (index) => {
        const updatedFaqs = catCredentials.faqs.filter((_, i) => i !== index);
        setCatCredentials(prev => ({ ...prev, faqs: updatedFaqs }));
    };

    const AddCategory = async (e) => {
        e.preventDefault();
        const { logo, category, faqs, description } = catCredentials
        const formData = new FormData()
        formData.append("category", category)
        formData.append("logo", logo)
        formData.append("description", description)
        formData.append("faqs", JSON.stringify(faqs));

        const res = await fetch(`${apiUrl}/api/gameCat/addCategory`, {
            method: "POST",
            body: formData,
        });
        const data = await res.json()
        const cate = document.getElementById('categoryError');
        data.message !== undefined ? cate.innerText = data.message : cate.innerText = ""
        if (res.ok) {
            setCatCredentials({
                category: "",
                description: "",
                faqs: [{ question: "", answer: "" }]
            })
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Category added successfully!",
                showConfirmButton: true,
            });
            allCategory();
        }
    };

    const onchange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'logo' && files) {
            setCatCredentials({ ...catCredentials, logo: files[0] });
        } else {
            setCatCredentials({ ...catCredentials, [name]: value });
        }
    };

    return (
        <>
            <div className="d-flex justify-content-end mb-5">
                <Button className='primary-btn' onClick={handleShow}>
                    Add Category
                </Button>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    {/* <Modal.Title></Modal.Title> */}
                </Modal.Header>
                <Modal.Body>
                    <Form className='form-group admin-form p-3' onSubmit={AddCategory} style={{ boxShadow: "none" }}>
                        <div id='categoryError' className='text-center text-danger'></div>
                        <Form.Group className="mb-3" controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control type='text' placeholder="Add Category" name='category' value={catCredentials.category} onChange={onchange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="category">
                            <Form.Label>Category Logo</Form.Label>
                            <Form.Control type='file' placeholder="Add Category" name='logo' onChange={onchange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Add category description"
                                name="description"
                                value={catCredentials.description}
                                onChange={onchange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>FAQs</Form.Label>
                            {catCredentials.faqs?.map((faq, i) => (
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

                        <div className="text-center">
                            <Button type='submit' className='primary-btn mt-3 text-white'>Add Category</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default AddCategory;