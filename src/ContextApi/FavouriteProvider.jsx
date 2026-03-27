import { useEffect, useState } from "react";
import apiUrl from "../ApiEndpoint";
import PropTypes from 'prop-types'
import Swal from "sweetalert2";
import FavouriteContext from "./FavouriteContext";

export default function TrackFavourites({ children }) {
    const [allFavourites, setAllFavourites] = useState([])
    const trackFavouriteFn = async (userId, productId) => {
        if (!userId) {
            Swal.fire({
                position: "center",
                icon: "info",
                title: "Sign In First",
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }
        const res = await fetch(`${apiUrl}/api/fav/addFavourites`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId, productId })
        })
        const data = await res.json()
        data.message === "Game already in favourites" ?
            Swal.fire({
                position: "center",
                icon: "info",
                title: data.message,
                showConfirmButton: false,
                timer: 3000
            })
            : (
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Add to favourites successfully",
                    showConfirmButton: false,
                    timer: 3000
                })
            )
        allTrackFavouriteFn()
    }
    const allTrackFavouriteFn = async () => {
        const res = await fetch(`${apiUrl}/api/fav/allFavourites`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        setAllFavourites(data)
    }

    const deleteGame = async (userId, productId) => {
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
            await fetch(`${apiUrl}/api/fav/delFavourite`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId, productId })
            });
            Swal.fire("Deleted!", "This game deleted successfully.", "success");
            allTrackFavouriteFn();
        }
    };

    useEffect(() => {
        allTrackFavouriteFn()
    }, [])

    return (
        <FavouriteContext.Provider value={{ trackFavouriteFn, allFavourites, deleteGame }}>
            {children}
        </FavouriteContext.Provider>
    )
}

TrackFavourites.propTypes = {
    children: PropTypes.node.isRequired
}