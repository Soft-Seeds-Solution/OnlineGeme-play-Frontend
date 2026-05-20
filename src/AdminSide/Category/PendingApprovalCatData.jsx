import { useEffect, useState } from "react";
import { Nav, Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import { useContext } from "react";
import { useMemo } from "react";
import Swal from "sweetalert2";
import apiUrl from "../../ApiEndpoint";
import UserContext from "../../ContextApi/UserContext";

export default function PendingApprovalCatData() {
    const [categories, setCategories] = useState([]);
    const { category } = useParams();
    const { signUser } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState("form");
    const [getCatDataById, setGetCatDataById] = useState({});

    const gameCat = category
        ?.replace(/-/g, " ")
        ?.replace(/\b\w/g, (c) => c.toUpperCase());

    const fetchCategories = async (forceFresh = false) => {
        const url = forceFresh
            ? "https://edge.khelogy.com/api/category/nestedCategories?fresh=1"
            : "https://edge.khelogy.com/api/category/nestedCategories";

        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();
        setCategories(data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const flattenCategories = (cats = [], level = 0) => {
        let result = [];

        cats.forEach((cat) => {
            result.push({ ...cat, level });

            if (cat.children?.length > 0) {
                result = result.concat(flattenCategories(cat.children, level + 1));
            }
        });

        return result;
    };

    const allFlatCategories = useMemo(() => {
        return flattenCategories(categories || []);
    }, [categories]);

    const pendingApprovalCats = allFlatCategories.find(
        (cat) => cat.category?.toLowerCase() === gameCat?.toLowerCase()
    );

    // =========================
    // INIT DATA (IMPORTANT FIX)
    // =========================
    useEffect(() => {
        if (!pendingApprovalCats) return;

        setGetCatDataById(pendingApprovalCats);
    }, [pendingApprovalCats]);

    const renderOptions = (cats, level = 0) => {
        let options = [];

        cats.forEach((cat) => {
            options.push(
                <option key={cat._id} value={cat._id}>
                    {"— ".repeat(level)} {cat.category}
                </option>
            );

            if (cat.children?.length > 0) {
                options = options.concat(renderOptions(cat.children, level + 1));
            }
        });

        return options;
    };

    // =========================
    // SAFE FIELD PICKER (CORE FIX)
    // =========================
    const field = (key) => {
        return getCatDataById?.pendingChanges?.[key] ?? getCatDataById?.[key] ?? "";
    };

    const setField = (key, value) => {
        setGetCatDataById((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const addFaq = () => {
        setGetCatDataById((prev) => ({
            ...prev,
            faqs: [...(prev.faqs || []), { question: "", answer: "" }],
        }));
    };

    const updateFaq = (index, fieldName, value) => {
        setGetCatDataById((prev) => {
            const faqs = [...(prev.faqs || [])];
            faqs[index] = { ...faqs[index], [fieldName]: value };
            return { ...prev, faqs };
        });
    };

    const removeFaq = (index) => {
        setGetCatDataById((prev) => ({
            ...prev,
            faqs: (prev.faqs || []).filter((_, i) => i !== index),
        }));
    };

    const handleDesChange = (html) => setField("description", html);
    const handleShortDesChange = (html) => setField("shortDes", html);

    const onchange = (e) => {
        const { name, value, files } = e.target;

        if (name === "logo" && files) {
            setField("logo", files[0]);
        } else {
            setField(name, value);
        }
    };

    const updateCatFn = async (e) => {
        e.preventDefault();

        const { isConfirmed } = await Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: "Don't save",
        });

        if (!isConfirmed) return;

        const formData = new FormData();

        formData.append("category", field("category"));
        formData.append("description", field("description"));
        formData.append("shortDes", field("shortDes"));
        formData.append("metaTitle", field("metaTitle"));
        formData.append("role", signUser?._id);
        formData.append("catIndex", field("catIndex"));
        formData.append("metaDes", field("metaDes"));
        formData.append("catUrl", field("catUrl"));

        const keywords = field("keywords");
        formData.append(
            "keywords",
            Array.isArray(keywords) ? keywords.join(",") : keywords || ""
        );

        formData.append("faqs", JSON.stringify(field("faqs") || []));

        if (field("parentId")) {
            formData.append("parentId", field("parentId"));
        }

        if (field("logo") instanceof File) {
            formData.append("logo", field("logo"));
        }

        const res = await fetch(
            `${apiUrl}/api/category/updateCategoryById/${getCatDataById._id}`,
            {
                method: "PUT",
                body: formData,
            }
        );

        if (res.ok) {
            Swal.fire("Category Sent For Review!", "", "success");
            fetchCategories(true);
        } else {
            Swal.fire("Error saving changes", "", "error");
        }
    };

    const rejectCategory = async (catId) => {

        const confirm = await Swal.fire({
            title: "Approve Pending Changes?",
            text: "This will reject all pending updates.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Publish",
        });

        if (!confirm.isConfirmed) return;

        try {

            const res = await fetch(
                `${apiUrl}/api/category/rejectPendingCat/${catId}`,
                {
                    method: "PUT",
                }
            );

            const data = await res.json();

            if (res.ok) {

                Swal.fire({
                    icon: "success",
                    title: "Published",
                    text: data.message || "Category Rejected successfully",
                });

                fetchCategories(true);

            } else {

                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.message,
                });
            }

        } catch (err) {

            console.log(err);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Something went wrong",
            });

        }
    };

    return (
        <Form className="p-3" onSubmit={updateCatFn}>
            <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
                <Nav.Item>
                    <Nav.Link eventKey="form">Category Form</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="seo">SEO</Nav.Link>
                </Nav.Item>
            </Nav>

            {activeTab === "form" && (
                <>
                    <Form.Group className="my-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            name="category"
                            value={field("category")}
                            onChange={onchange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Short Description</Form.Label>
                        <ReactQuill
                            value={field("shortDes")}
                            onChange={handleShortDesChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <ReactQuill
                            value={field("description")}
                            onChange={handleDesChange}
                        />
                    </Form.Group>

                    <Form.Select
                        name="parentId"
                        value={field("parentId")}
                        onChange={onchange}
                    >
                        <option value="">Parent</option>
                        {renderOptions(categories)}
                    </Form.Select>

                    <Form.Group className="mt-3">
                        <Form.Label>FAQs</Form.Label>

                        {(field("faqs") || []).map((faq, i) => (
                            <div key={i}>
                                <Form.Control
                                    placeholder="Question"
                                    value={faq.question}
                                    onChange={(e) =>
                                        updateFaq(i, "question", e.target.value)
                                    }
                                />
                                <ReactQuill
                                    value={faq.answer}
                                    onChange={(v) => updateFaq(i, "answer", v)}
                                />
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => removeFaq(i)}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}

                        <Button onClick={addFaq}>+ Add FAQ</Button>
                    </Form.Group>
                </>
            )}

            {activeTab === "seo" && (
                <>
                    <Form.Control
                        name="metaTitle"
                        value={field("metaTitle")}
                        onChange={onchange}
                        placeholder="Meta Title"
                    />

                    <Form.Control
                        name="catUrl"
                        value={field("catUrl")}
                        onChange={onchange}
                        placeholder="Category URL"
                    />

                    <Form.Control
                        as="textarea"
                        rows={4}
                        name="metaDes"
                        value={field("metaDes")}
                        onChange={onchange}
                        placeholder="Meta Description"
                    />

                    <Form.Control
                        name="keywords"
                        value={field("keywords")}
                        onChange={onchange}
                        placeholder="keywords"
                    />
                </>
            )}

            <div className="text-center mt-3">
                <Button type="submit">Update Category</Button>
                <Button
                    variant="danger"
                    size="sm"
                    onClick={() =>
                        rejectCategory(getCatDataById._id)
                    }
                >
                    Reject
                </Button>
            </div>
        </Form>
    );
}