import { Form, Button, Nav } from "react-bootstrap";
import Swal from "sweetalert2";
import apiUrl from "../../ApiEndpoint";
import { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import GameCatContext from "../../ContextApi/GameCatContext";

export default function AddCategory() {
    const [activeTab, setActiveTab] = useState("form");
    const { fetchCacheCategories, purgeCache } = useContext(GameCatContext)
    const [shortDescriptionHtml, setShortDescriptionHtml] = useState("");
    const [descriptionHtml, setDescriptionHtml] = useState("");
    const [selectParentUrl, setSelectParentUrl] = useState("")
    const [catCredentials, setCatCredentials] = useState({
        category: "",
        logo: "",
        description: "",
        
        shortDes: "",
        parentId: "",
        faqs: [{ question: "", answer: "" }],
        catIndex: "",
        metaDes: "",
        metaTitle: "",
        keywords: "",
        catUrl: "",
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

    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        const res = await fetch(`${apiUrl}/api/category/nestedCategories`);
        const data = await res.json();
        setCategories(data);
    };
    useEffect(() => {
        fetchCategories();
    }, []);

    const AddCategory = async (e) => {
        e.preventDefault();
        const { logo, category, faqs, parentId, metaTitle, metaDes, catIndex, keywords, catUrl } = catCredentials

        const formData = new FormData()
        formData.append("category", category)
        formData.append("logo", logo)
        formData.append("description", descriptionHtml);
        formData.append("metaTitle", metaTitle)
        formData.append("shortDes", shortDescriptionHtml)
        formData.append("metaDes", metaDes)
        formData.append("catIndex", catIndex)
        formData.append("catUrl", catUrl)
        formData.append("keywords", keywords);
        if (parentId) {
            formData.append("parentId", parentId);
        }
        formData.append("faqs", JSON.stringify(faqs));

        const res = await fetch(`${apiUrl}/api/category/addCategory`, {
            method: "POST",
            body: formData,
        });
        const data = await res.json()
        const cate = document.getElementById('categoryError');
        data.message !== undefined ? cate.innerText = data.message : cate.innerText = ""
        if (res.ok) {
            setCatCredentials({
                category: "",
                setDescriptionHtml: "",
                setShortDescriptionHtml: "",
                shortDes: "",
                parentId: "",
                faqs: [{ question: "", answer: "" }],
                catIndex: "",
                metaDes: "",
                metaTitle: "",
                keywords: "",
                catUrl: "",
            })
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Category added successfully!",
                showConfirmButton: true,
            });
            purgeCache()
            fetchCacheCategories()
        }
    };

    const onchange = async (e) => {
        const { name, value, files } = e.target;
        if (name === "parentId") {
            const res = await fetch(`${apiUrl}/api/category/categoryById/${value}`);
            const data = await res.json();
            setSelectParentUrl(data.catUrl)
        }
        if (name === 'logo' && files) {
            setCatCredentials({ ...catCredentials, logo: files[0] });
        } else {
            setCatCredentials({ ...catCredentials, [name]: value });
        }
    };

    // Update catUrl whenever parent/category changes
    useEffect(() => {
        const parts = [];

        if (selectParentUrl) {
            parts.push(selectParentUrl)
        }

        // Add current category
        if (catCredentials.category) {
            parts.push(catCredentials.category.toLowerCase().replace(/\s+/g, '-'));
        }

        setCatCredentials(prev => ({
            ...prev,
            catUrl: parts.join('/')
        }));
    }, [selectParentUrl, catCredentials.category]);

    const handleDesChange = (html) => {
        setDescriptionHtml(html);
    };
    const handleShortDesChange = (html) => {
        setShortDescriptionHtml(html);
    };

    const renderOptions = (cats, level = 0) => {
        let options = [];

        cats.forEach(cat => {
            options.push(
                <option key={cat._id} value={cat._id}>
                    {"— ".repeat(level)} {cat.category}
                </option>
            );

            if (cat.children && cat.children.length > 0) {
                options = options.concat(renderOptions(cat.children, level + 1));
            }
        });

        return options;
    };

    return (
        <>

            <Form className='form-group admin-form p-3' onSubmit={AddCategory} style={{ boxShadow: "none" }}>
                <div id='categoryError' className='text-center text-danger'></div>
                <Nav variant="tabs"
                    activeKey={activeTab}
                    onSelect={(selectedKey) => setActiveTab(selectedKey)}>
                    <Nav.Item>
                        <Nav.Link eventKey="form">Category Form</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="seo">SEO Specific</Nav.Link>
                    </Nav.Item>
                </Nav>
                {activeTab === "form" && (
                    <>
                        <Form.Group className="my-3" controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control type='text' placeholder="Add Category" name='category' value={catCredentials.category} onChange={onchange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="category">
                            <Form.Label>Category Logo</Form.Label>
                            <Form.Control type='file' placeholder="Add Category" name='logo' onChange={onchange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>Short Description</Form.Label>
                            <ReactQuill theme="snow" value={shortDescriptionHtml} onChange={handleShortDesChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <ReactQuill theme="snow" value={descriptionHtml} onChange={handleDesChange} />
                        </Form.Group>
                        <Form.Select
                            className="mb-3"
                            name="parentId"
                            value={catCredentials.parentId}
                            onChange={onchange}
                        >
                            <option value="">Parent</option>
                            {renderOptions(categories)}
                        </Form.Select>

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
                                    <ReactQuill
                                        theme="snow"
                                        value={faq.answer}
                                        onChange={(value) => updateFaq(i, "answer", value)}
                                    />
                                    <div className="mt-3" style={{ fontSize: "12px", border: "1px solid red", display: "inline-block" }} size="sm" type="button" onClick={() => removeFaq(i)}>Remove -</div>
                                </div>
                            ))}
                            <Button type="button" onClick={addFaq}>+ Add FAQ</Button>
                        </Form.Group>
                    </>
                )}

                {activeTab === "seo" && (
                    <>
                        <Form.Group className="my-3" controlId="category">
                            <Form.Label>Meta Title</Form.Label>
                            <Form.Control type='text' placeholder="Meta Title" name='metaTitle' value={catCredentials.metaTitle} onChange={onchange} />
                        </Form.Group>

                        <Form.Group className="my-3" controlId="category">
                            <Form.Label>Category Url</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder="Category URL"
                                name='catUrl'
                                value={catCredentials.catUrl}
                                onChange={onchange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>Meta Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Add category description"
                                name="metaDes"
                                value={catCredentials.metaDes}
                                onChange={onchange}
                            />
                        </Form.Group>
                        <Form.Group className="my-3" controlId="category">
                            <Form.Label>Meta Keywords</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder="keyword1, keyword2, keyword3"
                                name='keywords'
                                value={catCredentials.keywords}
                                onChange={onchange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Indexing</Form.Label>
                            <Form.Select
                                name="catIndex"
                                value={catCredentials.catIndex}
                                onChange={onchange}
                            >
                                <option value="">Select Category Indexing</option>
                                <option value="index">Index</option>
                                <option value="noIndex">No Index</option>
                            </Form.Select>
                        </Form.Group>

                    </>
                )}

                <div className="text-center">
                    <Button type='submit' className='primary-btn mt-3 text-white'>Add Category</Button>
                </div>
            </Form>
        </>
    )
}
