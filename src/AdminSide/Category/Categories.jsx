import { useEffect, useMemo, useState } from "react";
import { Button, Form, Modal, Nav, Table } from "react-bootstrap";
import apiUrl from "../../ApiEndpoint";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import GameCatContext from "../../ContextApi/GameCatContext";
import { useContext } from "react";
import GameContext from "../../ContextApi/GameContext";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [searchTitle, setSearchTitle] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState(null);
    const { AllGames } = useContext(GameContext)
    const itemsPerPage = 25;
    const { purgeCache } = useContext(GameCatContext)
    const [getCatDataById, setGetCatDataById] = useState({});
    const [activeTab, setActiveTab] = useState("form");
    const [catEditModal, setCatEditModal] = useState(false)
    const fetchCategories = async (forceFresh = false) => {
        const url = forceFresh
            ? "https://edge.khelogy.com/api/category/nestedCategories?fresh=1"
            : "https://edge.khelogy.com/api/category/nestedCategories";

        const res = await fetch(url, {
            cache: "no-store"
        });
        const data = await res.json();
        setCategories(data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const updateCatToIndexFn = async (id) => {
        await fetch(`${apiUrl}/api/category/updateCatToIndex/${id}`, {
            method: "PUT"
        });
        purgeCache()
        fetchCategories(true);
        Swal.fire("Indexed!", "This game add to index successfully.", "success");
    };
    const updateCatToNoIndexFn = async (id) => {
        await fetch(`${apiUrl}/api/category/updateCatToNoIndex/${id}`, {
            method: "PUT"
        });
        purgeCache()
        fetchCategories(true);
        Swal.fire("NoIndexed!", "This game add to noIndex successfully.", "success");
    };

    // ✅ Move this function ABOVE usage
    const flattenCategories = (cats, level = 0) => {
        let result = [];

        cats.forEach(cat => {
            result.push({
                ...cat,
                level
            });

            if (cat.children && cat.children.length > 0) {
                result = result.concat(flattenCategories(cat.children, level + 1));
            }
        });

        return result;
    };

    // ✅ Flatten ALL categories first
    const flatCategories = flattenCategories(categories);

    // ✅ Then filter (this fixes subcategory search)
    const filteredCategories = flatCategories.filter(cat =>
        cat.category.toLowerCase().includes(searchTitle.toLowerCase())
    );

    const changeIndexFn = (gameIndex, id) => {
        if (gameIndex === "index") {
            updateCatToNoIndexFn(id)
            fetchCategories(true)
        } else {
            updateCatToIndexFn(id)
            fetchCategories(true)
        }
    }

    // Update Category & Modal Logic
    const openEditCat = async (id) => {
        const res = await fetch(`${apiUrl}/api/category/categoryById/${id}`);
        const data = await res.json();

        setGetCatDataById({
            ...data,
            parentId: data.parent?._id || ""
        });

        setCatEditModal(true);
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

    const addFaq = () => {
        setGetCatDataById(prev => ({
            ...prev,
            faqs: [...(prev.faqs || []), { question: "", answer: "" }]
        }));
    };

    const updateFaq = (index, field, value) => {
        setGetCatDataById(prev => {
            const updatedFaqs = [...(prev.faqs || [])];
            updatedFaqs[index] = {
                ...updatedFaqs[index],
                [field]: value
            };
            return { ...prev, faqs: updatedFaqs };
        });
    };

    const removeFaq = (index) => {
        const updatedFaqs = getCatDataById.faqs.filter((_, i) => i !== index);
        setGetCatDataById(prev => ({ ...prev, faqs: updatedFaqs }));
    };

    const handleDesChange = (html) => {
        setGetCatDataById({ ...getCatDataById, description: html });
    };
    const handleShortDesChange = (html) => {
        setGetCatDataById({ ...getCatDataById, shortDes: html });
    };

    const updateCatFn = async (e) => {
        handleShortDesChange
        e.preventDefault();

        const { isConfirmed } = await Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: "Don't save",
        });

        if (!isConfirmed) return;

        const { logo, category, faqs, parentId, metaTitle, metaDes, shortDes, keywords, description, catUrl, catIndex } = getCatDataById;

        const formData = new FormData();
        formData.append("category", category);
        formData.append("description", description);
        formData.append("shortDes", shortDes);
        formData.append("metaTitle", metaTitle);
        formData.append("catIndex", catIndex);
        formData.append("metaDes", metaDes);
        formData.append("catUrl", catUrl);
        formData.append(
            "keywords",
            Array.isArray(keywords) ? keywords.join(",") : keywords || ""
        );
        formData.append("faqs", JSON.stringify(faqs || []));

        if (parentId !== undefined) {
            formData.append("parentId", parentId || "");
        }

        if (logo instanceof File) {
            formData.append("logo", logo);
        }

        const res = await fetch(
            `${apiUrl}/api/category/updateCategoryById/${getCatDataById._id}`,
            {
                method: "PUT",
                body: formData,
            }
        );

        if (res.ok) {
            Swal.fire("Saved!", "", "success");
            purgeCache()
            fetchCategories(true);
            setCatEditModal(false);
        } else {
            Swal.fire("Error saving changes", "", "error");
        }
    };

    const onchange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'logo' && files) {
            setGetCatDataById({ ...getCatDataById, logo: files[0] });
        } else {
            setGetCatDataById({ ...getCatDataById, [name]: value });
        }
    };

    // Delete Category
    const deleteCat = async (id) => {
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
            await fetch(`${apiUrl}/api/category/delCat/${id}`, {
                method: "DELETE"
            });
            Swal.fire("Deleted!", "This game deleted successfully.", "success");
            purgeCache()
            fetchCategories(true);
        }
    };

    // pagination
    const categoryGameCount = useMemo(() => {
        const map = {};

        AllGames?.forEach(game => {
            game.categories?.forEach(cat => {
                const id = typeof cat === "object" ? cat._id : cat;

                if (!map[id]) map[id] = 0;
                map[id]++;
            });
        });

        return map;
    }, [AllGames]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    let sortedCategories = [...filteredCategories];

    if (sortOrder === "asc") {
        sortedCategories.sort((a, b) =>
            (categoryGameCount[a._id] || 0) - (categoryGameCount[b._id] || 0)
        );
    } else if (sortOrder === "desc") {
        sortedCategories.sort((a, b) =>
            (categoryGameCount[b._id] || 0) - (categoryGameCount[a._id] || 0)
        );
    }

    const currentCategories = sortedCategories.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

    return (
        <>
            <Form.Control type="text" className="mb-3" placeholder="Search Game By Title" style={{ border: "1px solid var(--theme-color)", width: "40%" }} onChange={(e) => {
                setSearchTitle(e.target.value);
                setCurrentPage(1);
            }} />
            {flatCategories.length > 0 ? (
                <>
                    <Table striped bordered>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                                        Category

                                        <span
                                            style={{
                                                display: "inline-flex",
                                                flexDirection: "column",
                                                marginLeft: "6px",
                                                cursor: "pointer",
                                                lineHeight: "8px",
                                                fontSize: "10px"
                                            }}
                                        >
                                            <span
                                                onClick={() => setSortOrder("asc")}
                                                style={{ color: sortOrder === "asc" ? "#000" : "#ccc" }}
                                            >
                                                ▲
                                            </span>
                                            <span
                                                onClick={() => setSortOrder("desc")}
                                                style={{ color: sortOrder === "desc" ? "#000" : "#ccc" }}
                                            >
                                                ▼
                                            </span>
                                        </span>
                                    </span>
                                </th>
                                <td>Index</td>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCategories?.map((cat, ind) => (
                                <tr key={cat._id}>
                                    <td>{indexOfFirstItem + ind + 1}</td>
                                    <td>
                                        {"— ".repeat(cat.level)} {cat.category} ({categoryGameCount[cat._id] || 0})
                                    </td>
                                    <td>
                                        <Form.Check
                                            type="switch"
                                            id={`index-switch-${ind}`}
                                            checked={cat.catIndex === "index"}
                                            onChange={() => changeIndexFn(cat.catIndex, cat._id)}
                                        />
                                    </td>
                                    <td>
                                        <a href={`https://www.khelogy.com/category/${cat.catUrl}`} target="blank">
                                            <FontAwesomeIcon icon={faEye} className="me-3" style={{ color: "black" }} />
                                        </a>
                                        <FontAwesomeIcon icon={faEdit} className="me-3" onClick={() => openEditCat(cat._id)} />
                                        <FontAwesomeIcon icon={faTrash} onClick={() => deleteCat(cat._id)} />
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
                </>
            ) : (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                    <p style={{ fontSize: "30px" }}>No Category Uploaded Yet</p>
                </div>
            )}


            {/* Edit Modal */}
            <Modal
                size="lg"
                show={catEditModal}
                onHide={() => setCatEditModal(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-sm">
                        Game Modal
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className='form-group admin-form p-3' onSubmit={updateCatFn} style={{ boxShadow: "none" }}>
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
                                    <Form.Control type='text' placeholder="Add Category" name='category' value={getCatDataById.category} onChange={onchange} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="category">
                                    <Form.Label>Category Logo</Form.Label>
                                    <Form.Control type='file' placeholder="Add Category" name='logo' onChange={onchange} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="description">
                                    <Form.Label>Short Description</Form.Label>
                                    <ReactQuill theme="snow" value={getCatDataById.shortDes} onChange={handleShortDesChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <ReactQuill theme="snow" value={getCatDataById.description} onChange={handleDesChange} />
                                </Form.Group>
                                <Form.Select
                                    className="mb-3"
                                    name="parentId"
                                    value={getCatDataById.parentId}
                                    onChange={onchange}
                                >
                                    <option value="">Parent</option>
                                    {renderOptions(categories)}
                                </Form.Select>

                                <Form.Group className="mb-3">
                                    <Form.Label>FAQs</Form.Label>
                                    {getCatDataById.faqs?.map((faq, i) => (
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
                                    <Form.Control type='text' placeholder="Meta Title" name='metaTitle' value={getCatDataById.metaTitle} onChange={onchange} />
                                </Form.Group>
                                <Form.Control
                                    type='text'
                                    placeholder="Category URL"
                                    name='catUrl'
                                    value={getCatDataById.catUrl}
                                    onChange={onchange}
                                />
                                <Form.Group className="mb-3" controlId="description">
                                    <Form.Label>Meta Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        placeholder="Add category description"
                                        name="metaDes"
                                        value={getCatDataById.metaDes}
                                        onChange={onchange}
                                    />
                                </Form.Group>
                                <Form.Group className="my-3" controlId="category">
                                    <Form.Label>Meta Keywords</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder="keyword1, keyword2, keyword3"
                                        name='keywords'
                                        value={getCatDataById.keywords}
                                        onChange={onchange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Indexing</Form.Label>
                                    <Form.Select
                                        name="catIndex"
                                        value={getCatDataById.catIndex}
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
                            <Button type='submit' className='primary-btn mt-3 text-white'>Update Category</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

        </>
    );
}