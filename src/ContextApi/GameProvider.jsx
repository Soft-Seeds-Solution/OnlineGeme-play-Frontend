import { useState, useEffect } from 'react';
import GameContext from './GameContext';
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
import apiUrl from '../ApiEndpoint';

function GameProvider({ children }) {
    const [AllGames, setAllGames] = useState([]);
    const [AllStatusGames, setAllStatusGames] = useState([]);
    const [gameById, setGameById] = useState([]);
    const [gameSearch, setGameSearch] = useState("");
    const [translatedSearch, setTranslatedSearch] = useState("");
    const [alreadyPlayed, setAlreadyPlayed] = useState(false)

    const uploadedCacheGames = async () => {
        const url = "https://edge.khelogy.com/api/games/uploadedd-games?fresh=1"

        const res = await fetch(url, {
            cache: "no-store"
        });

        const data = await res.json();

        setAllStatusGames(data);

        const approvedGame = data
            ?.filter(game => game.status !== "Pending" && game.status !== "Rejected")
            .filter(game => game.gameStatus !== "UnPublish");

        setAllGames(approvedGame);
    };
    
    const uploadedGames = async () => {
        try {
            const res = await fetch("https://edge.khelogy.com/api/games/uploadedd-games");

            if (!res.ok) throw new Error("Fetch failed");

            const data = await res.json();

            setAllStatusGames(data);

            setAllGames(
                data?.filter(
                    (game) =>
                        game.status !== "Pending" &&
                        game.status !== "Rejected" &&
                        game.gameStatus !== "UnPublish"
                )
            );

        } catch (err) {
            console.error(err);
        }
    };

    const purgeGameCache = async () => {
        await fetch(`${apiUrl}/api/purgeCache/purgeGame`, {
            method: "POST"
        })
    };

    const getGameById = async (id) => {
        const gameByIdFilter = AllGames.find(game => game._id === id);
        setGameById(gameByIdFilter);
    };

    const deleteGame = async (id) => {
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
            await fetch(`${apiUrl}/api/games/delGame/${id}`, {
                method: "DELETE"
            });
            Swal.fire("Deleted!", "This game deleted successfully.", "success");
            purgeGameCache()
            uploadedCacheGames(true);
        }
    };

    const updateViewsFn = async (id, url) => {
        const playedGames = JSON.parse(localStorage.getItem("playedGames")) || []

        if (playedGames.includes(url)) {
            setAlreadyPlayed(true)
        }
        await fetch(`${apiUrl}/api/games/updateGameViews/${id}`, {
            method: "PUT"
        });
        uploadedCacheGames(true);
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
        uploadedCacheGames(true);
    };

    const updateGameToIndexFn = async (id) => {
        await fetch(`${apiUrl}/api/games/updateGameToIndex/${id}`, {
            method: "PUT"
        });
        purgeGameCache()
        uploadedCacheGames(true);
        Swal.fire("Indexed!", "This game add to index successfully.", "success");
    };
    const updateGameToNoIndexFn = async (id) => {
        await fetch(`${apiUrl}/api/games/updateGameToNoIndex/${id}`, {
            method: "PUT"
        });
        purgeGameCache()
        uploadedCacheGames(true);
        Swal.fire("NoIndexed!", "This game add to noIndex successfully.", "success");
    };
    const updateLikesFn = async (id) => {
        await fetch(`${apiUrl}/api/games/updateGameLikes/${id}`, {
            method: "PUT"
        });
        uploadedCacheGames(true);
    };

    const updateBackLikesFn = async (id) => {
        await fetch(`${apiUrl}/api/games/updateBackLikes/${id}`, {
            method: "PUT"
        });
        uploadedCacheGames(true);
    };

    const updateGameDisLikes = async (id) => {
        await fetch(`${apiUrl}/api/games/updateGameDisLikes/${id}`, {
            method: "PUT"
        });
        uploadedCacheGames(true);
    };

    const updateBackDisLikes = async (id) => {
        await fetch(`${apiUrl}/api/games/updateBackDisLikes/${id}`, {
            method: "PUT"
        });
        uploadedCacheGames(true);
    };

    const ApproveGameFn = async (id) => {
        await fetch(`${apiUrl}/api/games/gameApprove/${id}`, {
            method: "PUT"
        });
        uploadedCacheGames(true);
    };

    const RejectGameFn = async (id) => {
        await fetch(`${apiUrl}/api/games/gameReject/${id}`, {
            method: "PUT"
        });
        uploadedCacheGames(true);
    };

    // 🌐 Translation using Google Translate public API
    const translateText = async (text) => {
        try {
            const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`);
            const data = await res.json();
            const translatedText = data[0]?.map(d => d[0]).join("");
            return translatedText || text;
        } catch (err) {
            console.error("Translation failed:", err.message);
            return text;
        }
    };

    useEffect(() => {
        if (!gameSearch.trim()) {
            setTranslatedSearch("");
            return;
        }

        const doTranslate = async () => {
            const translated = await translateText(gameSearch);
            setTranslatedSearch(translated);
        };

        doTranslate();
    }, [gameSearch]);

    const filterSearchGames = translatedSearch &&
        AllGames?.filter(gameData =>
            gameData.description.en.toLowerCase().includes(translatedSearch.toLowerCase()) || gameData.title.en.toLowerCase().includes(translatedSearch.toLowerCase()) || gameData.shortDes.en.toLowerCase().includes(translatedSearch.toLowerCase())
        );

    useEffect(() => {
        uploadedGames();
    }, []);

    return (
        <GameContext.Provider value={{
            AllGames,
            uploadedGames,
            deleteGame,
            setGameById,
            gameById,
            getGameById,
            updateViewsFn,
            updateLikesFn,
            updateGameDisLikes,
            updateBackLikesFn,
            updateBackDisLikes,
            setGameSearch,
            filterSearchGames,
            gameSearch,
            ApproveGameFn,
            RejectGameFn,
            AllStatusGames,
            updatePlayedFn,
            alreadyPlayed,
            setAlreadyPlayed,
            updateGameToNoIndexFn,
            updateGameToIndexFn,
            purgeGameCache,
            uploadedCacheGames
        }}>
            {children}
        </GameContext.Provider>
    );
}

GameProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default GameProvider;