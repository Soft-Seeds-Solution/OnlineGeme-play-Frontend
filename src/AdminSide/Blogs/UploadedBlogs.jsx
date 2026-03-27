import { useContext } from "react";
import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import UserContext from "../../ContextApi/UserContext";
import BlogContext from "../../ContextApi/BlogContext";
import ViewUploadedBlog from "./ViewBlogs";

export default function UploadedBlogs() {
    const { AllBlogs, deleteBlog } = useContext(BlogContext)
    const { signUser } = useContext(UserContext)

    // const filterGames = userGames?.filter(gameData => gameData.featureGame !== "Yes").filter(gameData => gameData.title.en.toLowerCase().includes(searchTitle.toLowerCase())).filter(gameData => gameData.categoryId?.category.includes(searchCategory))
    return (
        <>

            {/* Games table */}
            {AllBlogs.length > 0 ? (
                <div>
                    <Table striped bordered >
                        <thead>
                            <tr >
                                <th>#</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {AllBlogs?.reverse().map((blogData, ind) => (
                                <tr key={ind}>
                                    <td style={{ backgroundColor: "transparent", color: "black" }}>{ind + 1}</td>
                                    <td style={{ backgroundColor: "transparent", color: "black" }}>{blogData.title}</td>
                                    <td style={{ backgroundColor: "transparent", color: "black" }}>{blogData.categoryId?.category}</td>
                                    <td style={{ backgroundColor: "transparent", color: "black" }}>
                                        <ViewUploadedBlog blogId={blogData._id} />
                                        {/* <EditUploadedGame gameId={blogData._id} /> */}
                                        <FontAwesomeIcon icon={faTrash} onClick={() => deleteBlog(blogData._id)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table >
                </div>
            ) : (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                    <p style={{ fontSize: "30px" }}>No Blog Uploaded Yet</p>
                </div>
            )}
        </>
    )
}