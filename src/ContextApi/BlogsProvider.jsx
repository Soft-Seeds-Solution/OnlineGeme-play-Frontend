import { useState, useEffect } from 'react';
import BlogContext from './BlogContext';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import apiUrl from '../ApiEndpoint';

function BlogsProvider({ children }) {
    const [AllBlogs, setAllBlogs] = useState([]);
    const [blogById, setBlogById] = useState([]);
    const [uniqueCategory, setUniqueCategory] = useState([]);
    const [gameSearch, setGameSearch] = useState("");
    const [alreadyPlayed, setAlreadyPlayed] = useState(false)
    const [category, setCategory] = useState(null);
    const [filterPosts, setFilterPosts] = useState([]);
    const uploadedBlogs = async () => {
        const res = await fetch(`${apiUrl}/api/blogs/uploaded-blogs`);
        const data = await res.json();

        setAllBlogs(data);

        // ✅ Extract unique categories
        const categoriesMap = new Map();

        const newCategory = new Set(data.map((post) => post.category));
        setUniqueCategory(newCategory);
        if (newCategory.size > 0) {
            setCategory([...newCategory][0]);
        }
        setUniqueCategory([...categoriesMap.values()]);
    };

    const getBlogById = async (id) => {
        const blogView = AllBlogs.find(blog => blog._id === id);
        console.log(blogView);
        setBlogById(blogView);
    };

    const deleteBlog = async (id) => {
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
            await fetch(`${apiUrl}/api/blogs/delBlog/${id}`, {
                method: "DELETE"
            });
            Swal.fire("Deleted!", "This game deleted successfully.", "success");
            uploadedBlogs();
        }
    };

    useEffect(() => {
        if (category === null) {
            setFilterPosts([]);
        } else {
            const filterpost = AllBlogs.filter((post) => post.category === category);
            setFilterPosts(filterpost);
        }
    }, [category, AllBlogs]);

    const updateViewsFn = async (id, url) => {
        const playedGames = JSON.parse(localStorage.getItem("playedGames")) || []

        if (playedGames.includes(url)) {
            setAlreadyPlayed(true)
        }
        await fetch(`${apiUrl}/api/games/updateGameViews/${id}`, {
            method: "PUT"
        });
        uploadedBlogs();
    };

    const updatePlayedFn = async (id, url) => {
        const playedGames = JSON.parse(localStorage.getItem("playedGames")) || []
        if (!playedGames.includes(url)) {
            playedGames.push(url)
            localStorage.setItem("playedGames", JSON.stringify(playedGames))
        }

        await fetch(`${apiUrl}/api/games/updateGamePlayed/${id}`, {
            method: "PUT"
        });
        uploadedBlogs();
    };

    const updateLikesFn = async (id) => {
        await fetch(`${apiUrl}/api/games/updateGameLikes/${id}`, {
            method: "PUT"
        });
        uploadedBlogs();
    };

    const updateBackLikesFn = async (id) => {
        await fetch(`${apiUrl}/api/games/updateBackLikes/${id}`, {
            method: "PUT"
        });
        uploadedBlogs();
    };

    const updateGameDisLikes = async (id) => {
        await fetch(`${apiUrl}/api/games/updateGameDisLikes/${id}`, {
            method: "PUT"
        });
        uploadedBlogs();
    };

    const updateBackDisLikes = async (id) => {
        await fetch(`${apiUrl}/api/games/updateBackDisLikes/${id}`, {
            method: "PUT"
        });
        uploadedBlogs();
    };

    const ApproveGameFn = async (id) => {
        await fetch(`${apiUrl}/api/games/gameApprove/${id}`, {
            method: "PUT"
        });
        uploadedBlogs();
    };

    const RejectGameFn = async (id) => {
        await fetch(`${apiUrl}/api/games/gameReject/${id}`, {
            method: "PUT"
        });
        uploadedBlogs();
    };

    useEffect(() => {
        uploadedBlogs();
    }, []);

    return (
        <BlogContext.Provider value={{
            AllBlogs,
            uploadedBlogs,
            deleteBlog,
            setBlogById,
            blogById,
            uniqueCategory,
            getBlogById,
            updateViewsFn,
            updateLikesFn,
            updateGameDisLikes,
            updateBackLikesFn,
            updateBackDisLikes,
            setGameSearch,
            gameSearch,
            ApproveGameFn,
            RejectGameFn,
            updatePlayedFn,
            alreadyPlayed,
            setAlreadyPlayed,
            filterPosts
        }}>
            {children}
        </BlogContext.Provider>
    );
}

BlogsProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default BlogsProvider;