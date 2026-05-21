import { useState, useEffect } from 'react'
import GameCatContext from './GameCatContext';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types'
import apiUrl from '../ApiEndpoint';

function GameCatProvider({ children }) {
    const [AllCategory, setAllCategory] = useState([])
    const [gameCatId, setGameCatId] = useState([])
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);

    const fetchCategories = async () => {
        const url = "https://edge.khelogy.com/api/category/nestedCategories"
        const res = await fetch(url);

        const data = await res.json();
        setCategories(data);
    };
    const fetchCacheCategories = async () => {
        const url = "https://edge.khelogy.com/api/category/nestedCategories?fresh=1"

        const res = await fetch(url, {
            cache: "no-store"
        });

        const data = await res.json();
        setCategories(data);
    };

    const purgeCache = async () => {
        await fetch(`${apiUrl}/api/purgeCache/purgeCat`, {
            method: "POST"
        })
    };

    // get all courses
    const allCategory = async () => {
        await fetch(`${apiUrl}/api/gameCat/getCategory`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(data => setAllCategory(data))
    }

    const getCatId = async (id) => {
        const res = await fetch(`${apiUrl}/api/gameCat/categoryById/${id}`, {
            method: "GET",
        })
        const data = await res.json()
        setGameCatId(data)
    }

    const deleteCategory = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Deleted!",
                    text: "This course category has been deleted successfully.",
                    icon: "success",
                });
            }
            return result;
        });

        if (isConfirmed) {
            await fetch(`${apiUrl}/api/gameCat/delCategory/${id}`, {
                method: "delete"
            })
            allCategory()
        }
    }

    useEffect(() => {
        allCategory();
        fetchCategories();
    }, []);

    return (
        <GameCatContext.Provider value={{ AllCategory, allCategory, deleteCategory, setGameCatId, gameCatId, getCatId, categories, fetchCategories, setSelectedCategory, selectedCategory, purgeCache, fetchCacheCategories }}>
            {children}
        </GameCatContext.Provider>
    )
}

export default GameCatProvider;

GameCatProvider.propTypes = {
    children: PropTypes.node.isRequired
}