import { useEffect, useState } from "react";
import apiUrl from "../ApiEndpoint";
import TrackContext from "./TrackContext";
import PropTypes from 'prop-types'

export default function TrackProvider({ children }) {
    const [allRecords, setAllRecords] = useState([])
    const [favourites, setFavourites] = useState([]);
    const trackRecordFn = async (userId, productId) => {
        if (!userId) {
            return;
        }
        await fetch(`${apiUrl}/api/track/trackRecord`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId, productId })
        })
        allTrackRecordFn()
    }
    const allTrackRecordFn = async () => {
        const res = await fetch(`${apiUrl}/api/track/allTrackRecords`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        setAllRecords(data)
    }

    useEffect(() => {
        allTrackRecordFn()
    }, [])
    return (
        <TrackContext.Provider value={{ trackRecordFn, allRecords, favourites, setFavourites }}>
            {children}
        </TrackContext.Provider>
    )
}

TrackProvider.propTypes = {
    children: PropTypes.node.isRequired
}
