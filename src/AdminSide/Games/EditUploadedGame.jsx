import { useContext, useState, useEffect } from "react";
import { Button, Form, Image, Modal, Nav } from "react-bootstrap";
import GameContext from "../../ContextApi/GameContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import PropTypes from 'prop-types'
import apiUrl from "../../ApiEndpoint";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import Select from "react-select";
import GameCatContext from "../../ContextApi/GameCatContext";
// import UserContext from "../../ContextApi/UserContext";

export default function EditUploadedGame({ gameId }) {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [gameEditModal, setGameEditModal] = useState(false)
    const [activeTab, setActiveTab] = useState("form");
    const [allTags, setAllTags] = useState([])
    const categoryOptions = [];
    const { gameById, getGameById, uploadedCacheGames, setGameById, purgeGameCache } = useContext(GameContext)
    const { categories } = useContext(GameCatContext)
    // const { signUser } = useContext(UserContext)

    /* ================= MULTI LANGUAGE SETUP ================= */

    const languages = [
        { code: "en", label: "English" },
        { code: "ur", label: "Urdu" },
        { code: "ar", label: "Arabic" },
        { code: "fr", label: "French" },
        { code: "es", label: "Spanish" },
    ];

    const [selectedLanguages, setSelectedLanguages] = useState({
        title: ["en"],
        shortDes: ["en"],
        description: ["en"],
        keywords: ["en"],
    });

    /* ================= OPEN MODAL ================= */

    const openEditGame = async () => {
        setGameById({});
        setGameEditModal(true);
        await getGameById(gameId);
    };

    /* ================= DETECT EXISTING LANGUAGES ================= */

    useEffect(() => {
        if (!gameById?._id) return;

        if (gameById?.categories && gameById?.categories.length > 0) {
            const ids = gameById.categories.map(cat =>
                typeof cat === "object" ? cat._id : cat
            );

            setSelectedCategories(ids);

            setGameById(prev => ({
                ...prev,
                categoryIds: ids
            }));
        }
        if (gameById?.gameTags && gameById?.gameTags.length > 0) {
            const ids = gameById.gameTags.map(tag =>
                typeof tag === "object" ? tag._id : tag
            );

            setSelectedTags(ids);

            setGameById(prev => ({
                ...prev,
                gameTags: ids
            }));
        }

        setSelectedLanguages({
            title: Object.keys(gameById.title || { en: "" }),
            shortDes: Object.keys(gameById.shortDes || { en: "" }),
            description: Object.keys(gameById.description || { en: "" })
        });

    }, [gameById?._id]);

    /* ================= LANGUAGE HANDLER ================= */

    const handleLanguageChange = (langCode) => {
        setSelectedLanguages(prev => {
            const updated = { ...prev };
            Object.keys(updated).forEach(field => {
                if (!updated[field].includes(langCode)) {
                    updated[field].push(langCode);
                }
            });
            return updated;
        });
    };

    const handleMultiLangChange = (field, langCode, value) => {
        setGameById(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [langCode]: value
            }
        }));
    };

    const renderMultiLangInputs = (field, label) => (
        <>
            <Form.Label className="fw-bold mt-3">{label}</Form.Label>
            {selectedLanguages[field]?.map((lang) => (
                <Form.Control
                    key={`${field}-${lang}`}
                    className="mb-2"
                    type="text"
                    placeholder={`${label} (${lang.toUpperCase()})`}
                    value={gameById?.[field]?.[lang] || ""}
                    onChange={(e) =>
                        handleMultiLangChange(field, lang, e.target.value)
                    }
                />
            ))}
        </>
    );

    /* ================= FAQ ================= */

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

    /* ================= NORMAL ONCHANGE ================= */

    const onchange = (e) => {
        const { name, value, type, files } = e.target;
        const newValue = type === "file" ? files[0] : value;

        setGameById(prev => ({
            ...prev,
            [name]: newValue,
        }));
    };

    /* ================= UPDATE GAME ================= */

    const updateGameFn = async (e) => {
        e.preventDefault()

        const { isConfirmed } = await Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`,
        });

        if (!isConfirmed) return;

        const formData = new FormData()

        formData.append("title", JSON.stringify(gameById.title));
        formData.append("shortDes", JSON.stringify(gameById.shortDes));
        formData.append("description", JSON.stringify(gameById.description));
        formData.append("gameKeywords", gameById.gameKeywords);

        if (gameById.categoryIds?.length > 0) {
            formData.append("categoryIds", JSON.stringify(gameById.categoryIds));
        }
        if (gameById.gameTags?.length > 0) {
            formData.append("gameTags", JSON.stringify(gameById.gameTags));
        }

        formData.append("thumbnail", gameById.thumbnail)
        formData.append("video", gameById.video)
        formData.append("gameUrl", gameById.gameUrl)
        formData.append("howToPlay", gameById.howToPlay)
        formData.append("whoCreated", gameById.whoCreated)
        formData.append("orientation", gameById.orientation)
        formData.append("featureGame", gameById.featureGame)
        formData.append("metaTitle", gameById.metaTitle)
        formData.append("metaDescription", gameById.metaDescription)

        formData.append("recommended", gameById.recommended)
        formData.append("featureList", gameById.featureList);
        formData.append("controls", gameById.controls);
        formData.append("faqs", JSON.stringify(gameById.faqs));

        const res = await fetch(`${apiUrl}/api/games/editGame/${gameById?._id}`, {
            method: "PUT",
            body: formData
        })

        if (res.ok) {
            Swal.fire("Saved!", "", "success");
            purgeGameCache()
            uploadedCacheGames(true);
            setGameEditModal(false)
        } else {
            Swal.fire("Error saving changes", "", "error");
        }
    }

    /* ================= UI ================= */

    const handleHowPlayChange = (html) => {
        setGameById({ ...gameById, howToPlay: html });
    };
    const handleFeatureListChange = (html) => {
        setGameById({ ...gameById, featureList: html });
    };
    const handleControlsChange = (html) => {
        setGameById({ ...gameById, controls: html });
    };

    const buildOptions = (cats, level = 0) => {
        cats?.forEach(cat => {
            categoryOptions.push({
                value: cat._id,
                label: `${"— ".repeat(level)} ${cat.category}`
            });

            if (cat.children?.length > 0) {
                buildOptions(cat.children, level + 1);
            }
        });
    };

    buildOptions(categories);

    // Tags
    const fetchTags = async () => {
        const res = await fetch("https://edge.khelogy.com/api/tags/allTags");
        const data = await res.json();
        setAllTags(data);
    };

    useEffect(() => {
        fetchTags()
    }, [])

    const tagOptions = allTags?.map(tag => ({
        value: tag._id,
        label: tag.tags
    }));

    return (
        <>
            <FontAwesomeIcon icon={faEdit} className="me-3" onClick={openEditGame} />

            <Modal size="lg" show={gameEditModal} onHide={() => setGameEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Game Modal</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={updateGameFn}>

                        {/* LANGUAGE SELECTOR */}
                        <Form.Group>
                            <Form.Label>Add Translations</Form.Label>
                            <div className="d-flex flex-wrap">
                                {languages.map(lang => (
                                    <Form.Check
                                        key={lang.code}
                                        inline
                                        type="checkbox"
                                        label={lang.label}
                                        checked={selectedLanguages.title.includes(lang.code)}
                                        onChange={() => handleLanguageChange(lang.code)}
                                    />
                                ))}
                            </div>
                        </Form.Group>

                        <Nav variant="tabs"
                            activeKey={activeTab}
                            onSelect={(selectedKey) => setActiveTab(selectedKey)}>
                            <Nav.Item>
                                <Nav.Link eventKey="form">Category Form</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="seo">SEO Specific</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        {activeTab === "form" && (
                            <>
                                {renderMultiLangInputs("title", "Game Title")}
                                {renderMultiLangInputs("shortDes", "Short Description")}
                                {renderMultiLangInputs("description", "Description")}
                                <Form.Label>Categories *</Form.Label>
                                <Select
                                    isMulti
                                    options={categoryOptions}
                                    value={selectedCategories
                                        .map((id) => categoryOptions.find(option => option.value === id))
                                        .filter(Boolean) // remove any undefined in case id is missing
                                    }
                                    onChange={(selected) => {
                                        // preserve the order in which the user selects
                                        const ids = selected.map(item => item.value);
                                        setSelectedCategories(ids);

                                        setGameById(prev => ({
                                            ...prev,
                                            categoryIds: ids
                                        }));
                                    }}
                                />
                                <Form.Label>Tags</Form.Label>
                                <Select
                                    isMulti
                                    options={tagOptions}
                                    value={selectedTags
                                        .map((id) => tagOptions.find(option => option.value === id))
                                        .filter(Boolean) // remove any undefined in case id is missing
                                    }
                                    onChange={(selected) => {
                                        // preserve the order in which the user selects
                                        const ids = selected.map(item => item.value);
                                        setSelectedTags(ids);

                                        setGameById(prev => ({
                                            ...prev,
                                            gameTags: ids
                                        }));
                                    }}
                                />

                                {/* KEEPING YOUR EXISTING FIELDS SIMPLE */}
                                <Form.Control className="my-3" type="text" name="gameUrl" value={gameById?.gameUrl || ""} onChange={onchange} placeholder="Game URL" />

                                <Form.Label>
                                    Controls
                                    <span style={{ color: "red" }}>*</span>
                                </Form.Label>
                                <ReactQuill
                                    className="mb-3"
                                    theme="snow"
                                    name={gameById?.controls}
                                    value={gameById?.controls}
                                    onChange={handleControlsChange}
                                />
                                <Form.Label>
                                    How To Play
                                    <span style={{ color: "red" }}>*</span>
                                </Form.Label>
                                <ReactQuill
                                    className="mb-3"
                                    theme="snow"
                                    name={gameById?.howToPlay}
                                    value={gameById?.howToPlay}
                                    onChange={handleHowPlayChange}
                                />
                                <Form.Label>
                                    Feature List
                                    <span style={{ color: "red" }}>*</span>
                                </Form.Label>
                                <ReactQuill
                                    className="mb-3"
                                    theme="snow"
                                    name={gameById?.featureList}
                                    value={gameById?.featureList}
                                    onChange={handleFeatureListChange}
                                />
                                <Form.Control className="mb-3" type="file" name="thumbnail" onChange={onchange} />
                                <Image src={gameById?.thumbnail} style={{ width: "100px" }} />

                                {/* FAQ */}
                                <div className="mt-3">
                                    {gameById.faqs?.map((faq, i) => (
                                        <div key={i}>
                                            <Form.Control
                                                className="mb-1"
                                                placeholder="Question"
                                                value={faq.question}
                                                onChange={(e) => updateFaq(i, "question", e.target.value)}
                                            />
                                            <Form.Control
                                                className="mb-2"
                                                placeholder="Answer"
                                                value={faq.answer}
                                                onChange={(e) => updateFaq(i, "answer", e.target.value)}
                                            />
                                            <Button size="sm" variant="danger" onClick={() => removeFaq(i)}>Remove</Button>
                                        </div>
                                    ))}
                                    <Button className="mt-2" onClick={addFaq}>+ Add FAQ</Button>
                                </div>

                                <Form.Group className="mb-3">
                                    <Form.Label>Feature Game?</Form.Label>
                                    <Form.Control as="select" name="featureGame" value={gameById.featureGame} onChange={onchange}>
                                        <option value="">Select</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </Form.Control>
                                </Form.Group>
                            </>
                        )}

                        {activeTab === "seo" && (
                            <>
                                {/* MULTILINGUAL FIELDS */}
                                <Form.Control
                                    type='text'
                                    className="my-3"
                                    placeholder="keyword1, keyword2, keyword3"
                                    name='gameKeywords'
                                    value={gameById?.gameKeywords}
                                    onChange={onchange}
                                />
                                <hr />

                                <Form.Control className="mb-3" type="text" name="metaTitle" value={gameById?.metaTitle || ""} onChange={onchange} placeholder="Meta Title" />
                                <Form.Control className="mb-3" as="textarea" rows={3} name="metaDescription" value={gameById?.metaDescription || ""} onChange={onchange} placeholder="Meta Description" />
                            </>
                        )}

                        <div className="text-center mt-4">
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