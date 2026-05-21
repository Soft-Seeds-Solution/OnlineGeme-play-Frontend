import { useContext, useState } from "react";
import { Button, Form, Image, Modal } from "react-bootstrap";
import GameContext from "../../ContextApi/GameContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import PropTypes from 'prop-types'
import GameCatContext from "../../ContextApi/GameCatContext";
import apiUrl from "../../ApiEndpoint";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import UserContext from "../../ContextApi/UserContext";

export default function EditUploadedGame({ gameId }) {
    const [gameEditModal, setGameEditModal] = useState(false)
    const { gameById, getGameById, uploadedGames, setGameById } = useContext(GameContext)
    const { AllCategory } = useContext(GameCatContext)
    const { signUser } = useContext(UserContext)

    const openEditGame = async () => {
        // Reset old game data before loading a new one
        setGameById({});

        setGameById(prev => ({
            ...prev,
            featureList: prev.featureList || "",
            controls: prev.controls || "",
            faqs: prev.faqs || [{ question: "", answer: "" }]
        }));

        setGameEditModal(true);
        await getGameById(gameId);
    };

    const allGamesCategories = AllCategory?.map(cat => (
        { lab: cat.category, val: cat._id }
    ))

    const gameForm = [
        {
            name: "categoryId", val: gameById?.categoryId?._id, type: "select", placeH: "Game Category", conId: "floatingInput", lab: "Game Category", options: [
                ...allGamesCategories
            ]
        },
        {
            name: "gameUrl", val: gameById?.gameUrl, type: "text", placeH: "Game Url", conId: "floatingInput", lab: "Game Url",
        },
        {
            name: "metaTitle", val: gameById?.metaTitle, type: "text", placeH: "Meta Title", conId: "floatingInput", lab: "Meta Title",
        },
        {
            name: "metaDescription", val: gameById?.metaDescription, type: "metaDescription", placeH: "Meta Description", conId: "floatingInput", lab: "Meta Description",
        },
        {
            name: "thumbnail", type: "file", placeH: "Game Thumbnail", conId: "floatingInput", lab: "Game Thumbnail",
        },
        {
            name: "video", type: "file", placeH: "Game Short Video", conId: "floatingInput", lab: "Game Short Video",
        },
        {
            name: "orientation", val: gameById?.orientation, type: "select", placeH: "Game Orientation", conId: "floatingInput", lab: "Game Orientation", options: [
                { lab: "Select Game Orientation", val: "" },
                { lab: "Portrait", val: "portrait" },
                { lab: "Landscape", val: "landscape" },
            ]
        },
        {
            name: "featureList", val: gameById?.featureList, placeH: "Feature List", conId: "floatingInput", rows: 7,
        },
        {
            name: "controls", val: gameById?.controls, placeH: "Controls", conId: "floatingInput", rows: 7,
        },
        {
            name: "faqs",
            val: gameById?.faqs || [{ question: "", answer: "" }],
            type: "faq",
            lab: "FAQs"
        },
        {
            name: "featureGame", val: gameById?.featureGame, type: "select", conId: "floatingInput", lab: "Is This Feature Game?", options: [
                { lab: "Select Is Feature Game", val: "" },
                { lab: "Yes", val: "Yes" },
                { lab: "No", val: "No" },
            ]
        },
        {
            name: "featureGamePosition", val: gameById?.featureGamePosition, type: "select", conId: "floatingInput", lab: "Select Feature Game Position", options: [
                { lab: "Select Feature Game Position", val: "" },
                { lab: "1", val: 1 },
                { lab: "2", val: 2 },
                { lab: "3", val: 3 },
                { lab: "4", val: 4 },
                { lab: "5", val: 5 },
                { lab: "6", val: 6 },
                { lab: "7", val: 7 },
                { lab: "8", val: 8 },
                { lab: "9", val: 9 },
                { lab: "10", val: 10 },
                { lab: "11", val: 11 },
            ]
        },
        {
            name: "recommended", val: gameById.recommended, type: "select", conId: "floatingInput", lab: "Is This Recommending Game?", options: [
                { lab: "Select Is Recommended Game", val: "" },
                { lab: "Yes", val: "Yes" },
                { lab: "No", val: "No" },
            ]
        },
        {
            name: "whoCreated", val: gameById?.whoCreated, type: "description", placeH: "Who Created", conId: "floatingInput", lab: "Who Created", rows: 3,
        },
        {
            name: "howToPlay", val: gameById?.howToPlay, placeH: "How To Play", conId: "floatingInput", rows: 7,
        },
    ]

    const handleHowPlayChange = (html) => {
        setGameById({ ...gameById, howToPlay: html });
    };
    const handleFeatureListChange = (html) => {
        setGameById({ ...gameById, featureList: html });
    };
    const handleControlsChange = (html) => {
        setGameById({ ...gameById, controls: html });
    };

    const addFaq = () => {
        setGameById(prev => ({
            ...prev,
            faqs: [...(prev.faqs || []), { question: "", answer: "" }]
        }));
    };

    const updateFaq = (index, field, value) => {
        const updatedFaqs = [...(gameById.faqs || [])];
        updatedFaqs[index][field] = value;
        setGameById(prev => ({ ...prev, faqs: updatedFaqs }));
    };

    const removeFaq = (index) => {
        const updatedFaqs = gameById.faqs.filter((_, i) => i !== index);
        setGameById(prev => ({ ...prev, faqs: updatedFaqs }));
    };

    const updateGameFn = async (e) => {
        e.preventDefault()
        const { isConfirmed } = await Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`,
        });

        if (isConfirmed) {
            const { categoryId, thumbnail, gameUrl, howToPlay, whoCreated, orientation, video, featureGame, featureGamePosition, recommended, metaTitle, metaDescription, controls } = gameById
            const formData = new FormData()
            formData.append("categoryId", typeof categoryId === "object" ? categoryId._id : categoryId)
            formData.append("thumbnail", thumbnail)
            formData.append("video", video)
            formData.append("gameUrl", gameUrl)
            formData.append("howToPlay", howToPlay)
            formData.append("whoCreated", whoCreated)
            formData.append("orientation", orientation)
            formData.append("featureGame", featureGame)
            formData.append("metaTitle", metaTitle)
            formData.append("metaDescription", metaDescription)
            formData.append("featureGamePosition", featureGamePosition === "" || featureGamePosition === "null" ? null : Number(featureGamePosition));
            formData.append("recommended", recommended)
            // formData.append("gameStatus", gameStatus)
            formData.append("featureList", gameById.featureList);
            formData.append("controls", controls);
            formData.append("faqs", JSON.stringify(gameById.faqs));

            const res = await fetch(`${apiUrl}/api/games/editGame/${gameById?._id}`, {
                method: "PUT",
                body: formData
            })
            const data = await res.json()
            const gameDataError = document.getElementById("gameDataError")
            data.message !== undefined ? gameDataError.innerText = data.message : gameDataError.innerText = ""

            if (res.ok) {
                Swal.fire("Saved!", "", "success");
                uploadedGames();
            }
        } else {
            Swal.fire("Error saving changes", "", "error");
        }
    }

    const onchange = (e) => {
        const { name, value, type, files } = e.target;
        const newValue = type === "file" ? files[0] : value;

        setGameById((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    return (
        <>
            <FontAwesomeIcon icon={faEdit} className="me-3" onClick={() => openEditGame()} />

            <Modal
                size="lg"
                show={gameEditModal}
                onHide={() => setGameEditModal(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-sm">
                        Game Modal
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={updateGameFn}>
                        <div id="gameDataError" className="text-danger text-center"></div>
                        {gameForm?.map((formData, ind) => (
                            <Form.Group key={ind} className="mb-3">
                                <Form.Label className={`${(formData.lab === "Is This Feature Game?" || formData.lab === "Select Feature Game Position") && signUser?.role !== "Admin" ? "d-none" : ""}`}>{formData.lab} <span className="text-danger">{formData.star}</span> </Form.Label>

                                {formData.type === "description" || formData.type === "metaDescription" ? (
                                    <Form.Control as="textarea" rows={formData.rows} name={formData.name} value={formData.val} onChange={onchange} placeholder={formData.placeH} />
                                ) : formData.name === "howToPlay" ? (
                                    <div>
                                        <Form.Label>
                                            How To Play
                                            <span style={{ color: "red" }}>*</span>
                                        </Form.Label>
                                        <ReactQuill
                                            className="mb-3"
                                            theme="snow"
                                            name={formData.name}
                                            value={formData.val}
                                            onChange={handleHowPlayChange}
                                        />
                                    </div>
                                ) : formData.name === "controls" ? (<div>
                                    <Form.Label>
                                        Controls
                                        <span style={{ color: "red" }}>*</span>
                                    </Form.Label>
                                    <ReactQuill
                                        className="mb-3"
                                        theme="snow"
                                        name={formData.name}
                                        value={formData.val}
                                        onChange={handleControlsChange}
                                    />
                                </div>) : formData.name === "featureList" ? (<div>
                                    <Form.Label>
                                        Feature List
                                        <span style={{ color: "red" }}>*</span>
                                    </Form.Label>
                                    <ReactQuill
                                        className="mb-3"
                                        theme="snow"
                                        name={formData.name}
                                        value={formData.val}
                                        onChange={handleFeatureListChange}
                                    />
                                </div>) : formData.type === "select" ? (
                                    <Form.Control as="select" className={`${(formData.name === "featureGame" || formData.name === "featureGamePosition" || formData.name === "recommended") && signUser?.role !== "Admin" ? "d-none" : ""}`} name={formData.name} value={formData.val} onChange={onchange}>
                                        {formData.options?.map((option, idx) => (
                                            <option key={idx} value={option.val}>
                                                {option.lab}
                                            </option>
                                        ))}
                                    </Form.Control>
                                ) : formData.type === "file" ? (
                                    <div className="d-flex justify-content-between">
                                        <Form.Control type={formData.type} name={formData.name} onChange={onchange} placeholder={formData.placeH} style={{ width: "70%" }} />
                                        <Image src={gameById?.thumbnail} style={{ width: "10%", height: "40px" }}></Image>
                                    </div>
                                ) : formData.type === "faq" ? (
                                    <div className="mb-3">
                                        {gameById.faqs?.map((faq, i) => (
                                            <div key={i} className="mb-2">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Question"
                                                    value={faq.question}
                                                    onChange={(e) => updateFaq(i, "question", e.target.value)}
                                                    className="mb-1"
                                                />
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Answer"
                                                    value={faq.answer}
                                                    onChange={(e) => updateFaq(i, "answer", e.target.value)}
                                                    className="mb-1"
                                                />
                                                <div className="mt-3" style={{ fontSize: "12px", border: "1px solid red", display: "inline-block" }} size="sm" type="button" onClick={() => removeFaq(i)}>Remove -</div>
                                            </div>
                                        ))}
                                        <Button type="button" onClick={addFaq}>+ Add FAQ</Button>
                                    </div>
                                ) : (
                                    <Form.Control type={formData.type} name={formData.name} value={formData.val} onChange={onchange} placeholder={formData.placeH} />
                                )}
                            </Form.Group>
                        ))}
                        <div className="d-flex justify-content-center">
                            <Button type="submit">Update Game</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

EditUploadedGame.propTypes = {
    gameId: PropTypes.node.isRequired
}