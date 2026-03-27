import { useContext, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import apiUrl from "../../ApiEndpoint";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import UserContext from "../../ContextApi/UserContext";
import GameCatContext from "../../ContextApi/GameCatContext";
import UploadedBlogs from "./UploadedBlogs";
import BlogContext from "../../ContextApi/BlogContext";

export default function UploadBlog() {
    const { signUser } = useContext(UserContext);
    const { AllCategory } = useContext(GameCatContext);
    const { uploadedBlogs } = useContext(BlogContext);

    const [uploadBlogModal, setUploadBlogModal] = useState(false);
    const [ContentHtml, setContentHtml] = useState("");

    const [blogData, setBlogData] = useState({
        title: "",
        image: "",
        categoryId: "",
        content: "",
        slug: "",
        meta: "",
    });

    const allGamesCategories = AllCategory?.map(cat => ({
        lab: cat.category,
        val: cat._id,
    }));

    const uploadGameFn = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("title", blogData.title);
        formData.append("categoryId", blogData.categoryId);
        formData.append("content", ContentHtml);
        formData.append("image", blogData.image);
        formData.append("meta", blogData.meta);
        formData.append("slug", blogData.slug);
        formData.append("userId", signUser?._id);

        const res = await fetch(`${apiUrl}/api/blogs/upload-blog`, {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        const errorBox = document.getElementById("blogDataError");
        errorBox.innerText = data.message || "";

        if (res.ok) {
            Swal.fire({
                icon: "success",
                title: "Game uploaded successfully!",
                showConfirmButton: true,
                timer: 1500,
            });
            uploadedBlogs()
            setBlogData({
                title: "",
                Image: "",
                categoryId: "",
                content: "",
                slug: "",
                meta: "",
            });
            setContentHtml("");

        }
    };
    //  MongoDb_Url="mongodb+srv://gamingSite:gamingSite1234@cluster0.ti2oy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

    const onchange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setBlogData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setBlogData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleContentChange = (html) => {
        setContentHtml(html);
    };

    return (
        <>
            <div className="d-flex justify-content-end mb-4">
                <Button className="primary-btn" onClick={() => setUploadBlogModal(true)}>Upload Blog</Button>
            </div>

            <Modal size="lg" show={uploadBlogModal} onHide={() => setUploadBlogModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload Blog</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={uploadGameFn}>
                        <div id="blogDataError" className="text-danger text-center mb-3"></div>

                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={blogData.title}
                                onChange={onchange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Category *</Form.Label>
                            <Form.Control
                                as="select"
                                name="categoryId"
                                value={blogData.categoryId}
                                onChange={onchange}
                            >
                                <option value="">Select Game Category</option>
                                {allGamesCategories?.map((opt, i) => (
                                    <option key={i} value={opt.val}>{opt.lab}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Slug</Form.Label>
                            <Form.Control
                                type="text"
                                name="slug"
                                value={blogData.slug}
                                onChange={onchange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Meta</Form.Label>
                            <Form.Control
                                type="text"
                                name="meta"
                                value={blogData.meta}
                                onChange={onchange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" name="image" onChange={onchange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Content</Form.Label>
                            <ReactQuill theme="snow" value={ContentHtml} onChange={handleContentChange} />
                        </Form.Group>

                        <div className="d-flex justify-content-center">
                            <Button type="submit" className="primary-btn">Upload Blog</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* uploaded Blogs */}
            <UploadedBlogs />
        </>
    );
}