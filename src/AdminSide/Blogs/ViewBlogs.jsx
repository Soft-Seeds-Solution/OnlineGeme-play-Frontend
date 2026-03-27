import { useContext, useState } from "react";
import { Form, Image, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import PropTypes from 'prop-types'
import ReactQuill from "react-quill";
import BlogContext from "../../ContextApi/BlogContext";

export default function ViewUploadedBlog({ blogId }) {
    const [BlogViewModal, setBlogViewModal] = useState(false)
    const { blogById, getBlogById } = useContext(BlogContext)

    const openViewBlog = () => {
        setBlogViewModal(true)
        getBlogById(blogId)
    }

    const BlogForm = [
        {
            name: "title", val: blogById?.title, type: "text", placeH: "Blog Title", conId: "floatingInput", lab: "Blog Title",
        },
        {
            name: "categoryId", val: blogById?.categoryId?.category, placeH: "Blog Category", conId: "floatingInput", lab: "Blog Category"
        },
        {
            name: "categoryId", val: blogById?.slug, placeH: "Blog Slug", conId: "floatingInput", lab: "Blog Slug"
        },
        {
            name: "categoryId", val: blogById?.meta, placeH: "Blog Meta", conId: "floatingInput", lab: "Blog Meta"
        },
        {
            name: "image", type: "file", placeH: "Image", conId: "floatingInput", lab: "Image",
        },
        {
            name: "content", val: blogById?.content, placeH: "How To Play", conId: "floatingInput", rows: 7,
        },
    ]

    return (
        <>
            <FontAwesomeIcon icon={faEye} className="me-3" onClick={() => openViewBlog()} />

            <Modal
                size="lg"
                show={BlogViewModal}
                onHide={() => setBlogViewModal(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-sm">
                        Blog Modal
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Modal.Body>
                        <Form>
                            <div id="gameDataError" className="text-danger text-center"></div>
                            {BlogForm?.map((formData, ind) => (
                                <Form.Group key={ind} className="mb-3">
                                    <Form.Label>{formData.lab}</Form.Label>
                                    {formData.type === "description" ? (
                                        <Form.Control as="textarea" rows={formData.rows} name={formData.name} value={formData.val} placeholder={formData.placeH} />
                                    ) : formData.name === "content" ? <div>
                                        <Form.Label>
                                            Content
                                            <span style={{ color: "red" }}>*</span>
                                        </Form.Label>
                                        <ReactQuill
                                            className="mb-3"
                                            theme="snow"
                                            name={formData.name}
                                            value={formData.val}
                                        />
                                    </div> : formData.type === "select" ? (
                                        <Form.Control as="select" name={formData.name} value={formData.val}>
                                            {formData.options?.map((option, idx) => (
                                                <option key={idx} value={option.val}>
                                                    {option.lab}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    ) : formData.type === "file" ? (
                                        <div className="d-flex justify-content-between">
                                            <Form.Control type={formData.type} name={formData.name} placeholder={formData.placeH} style={{ width: "70%" }} />
                                            <Image src={blogById?.image} style={{ width: "10%", height: "40px" }}></Image>
                                        </div>
                                    ) : (
                                        <Form.Control type={formData.type} name={formData.name} value={formData.val} placeholder={formData.placeH} />
                                    )}
                                </Form.Group>
                            ))}
                        </Form>
                    </Modal.Body>
                </Modal.Body>
            </Modal>
        </>
    )
}

ViewUploadedBlog.propTypes = {
    blogId: PropTypes.node.isRequired
}