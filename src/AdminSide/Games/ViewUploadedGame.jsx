import { useContext, useState } from "react";
import { Form, Image, Modal } from "react-bootstrap";
import GameContext from "../../ContextApi/GameContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import PropTypes from 'prop-types'
import ReactQuill from "react-quill";

export default function ViewUploadedGame({ gameId }) {
    const [gameViewModal, setGameViewModal] = useState(false)
    const { gameById, getGameById } = useContext(GameContext)

    const openViewGame = () => {
        setGameViewModal(true)
        getGameById(gameId)
    }

    const gameForm = [
        {
            name: "title", val: gameById?.title, type: "text", placeH: "Game Title", conId: "floatingInput", lab: "Game Title",
        },
        {
            name: "categoryId", val: gameById?.categoryId?.category, placeH: "Game Category", conId: "floatingInput", lab: "Game Category"
        },
        {
            name: "gameUrl", val: gameById?.gameUrl, type: "text", placeH: "Game Url", conId: "floatingInput", lab: "Game Url",
        },
        {
            name: "thumbnail", type: "file", placeH: "Game Thumbnail", conId: "floatingInput", lab: "Game Thumbnail",
        },
        {
            name: "video", type: "file", placeH: "Game Short Video", conId: "floatingInput", lab: "Game Short Video",
        },
        {
            name: "keywords", type: "text", val: gameById?.keywords, placeH: "Game Keywords", conId: "floatingInput", lab: "Game Keywords (comma-separated)"
        },
        {
            name: "orientation", val: gameById?.orientation, placeH: "Game Orientation", conId: "floatingInput", lab: "Game Orientation",
        },
        {
            name: "featureGame", val: gameById?.featureGame, conId: "floatingInput", lab: "Is This Feature Game?"
        },
        {
            name: "featureGamePosition", val: gameById?.featureGamePosition, conId: "floatingInput", lab: "Select Feature Game Position"
        },
        {
            name: "whoCreated", val: gameById?.whoCreated, type: "description", placeH: "Who Created", conId: "floatingInput", lab: "Who Created", rows: 3,
        },
        {
            name: "shortDes", val: gameById?.shortDes, type: "description", placeH: "Game Short Description", conId: "floatingInput", lab: "Game Short Description", rows: 3,
        },
        {
            name: "description", val: gameById?.description, type: "description", placeH: "Game Description", conId: "floatingInput", lab: "Game Description", rows: 7,
        },
        {
            name: "howToPlay", val: gameById?.howToPlay, placeH: "How To Play", conId: "floatingInput", rows: 7,
        },
    ]

    return (
        <>
            <FontAwesomeIcon icon={faEye} className="me-3" onClick={() => openViewGame()} />

            <Modal
                size="lg"
                show={gameViewModal}
                onHide={() => setGameViewModal(false)}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-sm">
                        Game Modal
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Modal.Body>
                        <Form>
                            <div id="gameDataError" className="text-danger text-center"></div>
                            {gameForm?.map((formData, ind) => (
                                <Form.Group key={ind} className="mb-3">
                                    <Form.Label>{formData.lab} <span className="text-danger">{formData.star}</span> </Form.Label>
                                    {formData.type === "description" ? (
                                        <Form.Control as="textarea" rows={formData.rows} name={formData.name} value={formData.val} placeholder={formData.placeH} />
                                    ) : formData.name === "howToPlay" ? <div>
                                        <Form.Label>
                                            How To Play
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
                                            <Image src={gameById?.thumbnail} style={{ width: "10%", height: "40px" }}></Image>
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

ViewUploadedGame.propTypes = {
    gameId: PropTypes.node.isRequired
}