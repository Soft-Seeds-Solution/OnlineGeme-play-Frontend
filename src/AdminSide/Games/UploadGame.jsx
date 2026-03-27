import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal, Nav } from "react-bootstrap";
import apiUrl from "../../ApiEndpoint";
import GameContext from "../../ContextApi/GameContext";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import UserContext from "../../ContextApi/UserContext";
import Select from "react-select";

const languages = [
    { code: "en", label: "English" },
    { code: "ur", label: "Urdu" },
    { code: "ar", label: "Arabic" },
    { code: "fr", label: "French" },
    { code: "es", label: "Spanish" },
    { code: "zh", label: "Chinese (Simplified)" },
    { code: "zh_tw", label: "Chinese (Traditional)" },
    { code: "hi", label: "Hindi" },
    { code: "id", label: "Indonesian" },
    { code: "it", label: "Italian" },
    { code: "ja", label: "Japanese" },
    { code: "ko", label: "Korean" },
    { code: "pt", label: "Portuguese" },
    { code: "ru", label: "Russian" },
    { code: "tr", label: "Turkish" },
    { code: "vi", label: "Vietnamese" },
];

export default function UploadGame() {
    const { signUser } = useContext(UserContext);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const { purgeGameCache, uploadedCacheGames } = useContext(GameContext);
    const [activeTab, setActiveTab] = useState("form");
    const [uploadGameModal, setUploadGameModal] = useState(false);
    const [howToPlayHtml, setHowToPlayHtml] = useState("");
    const [featureListHtml, setFeatureListHtml] = useState("");
    const [controlsHtml, setControlsHtml] = useState("");
    const [allTags, setAllTags] = useState([])
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        const res = await fetch("https://edge.khelogy.com/api/category/nestedCategories");
        const data = await res.json();
        setCategories(data);
    };
    useEffect(() => {
        fetchCategories();
    }, []);

    const [gameData, setGameData] = useState({
        title: { en: "" },
        shortDes: { en: "" },
        description: { en: "" },
        gameKeywords: "",
        categoryIds: "",
        gameTags: "",
        thumbnail: "",
        video: "",
        gameUrl: "",
        howToPlay: "",
        whoCreated: "",
        featureGame: "",
        orientation: "",
        featureList: "",
        controls: "",
        metaTitle: "",
        metaDescription: "",
        gameStatus: "",
        faqs: [{ question: "Q", answer: "A" }]
    });

    const [selectedLanguages, setSelectedLanguages] = useState({
        title: ["en"],
        shortDes: ["en"],
        description: ["en"],
        keywords: ["en"],
    });

    const handleLanguageChange = (langCode) => {
        setSelectedLanguages((prev) => {
            const updated = { ...prev };
            Object.keys(updated).forEach((field) => {
                if (!updated[field].includes(langCode)) {
                    updated[field].push(langCode);
                }
            });
            return updated;
        });
    };

    const handleInputChange = (field, langCode, value) => {
        setGameData((prev) => ({
            ...prev,
            [field]: {
                ...prev[field],
                [langCode]: value,
            },
        }));
    };

    const addFaq = () => {
        setGameData(prev => ({
            ...prev,
            faqs: [...prev.faqs, { question: "", answer: "" }]
        }));
    };

    const updateFaq = (index, field, value) => {
        const updatedFaqs = [...gameData.faqs];
        updatedFaqs[index][field] = value;
        setGameData(prev => ({ ...prev, faqs: updatedFaqs }));
    };

    const removeFaq = (index) => {
        const updatedFaqs = gameData.faqs.filter((_, i) => i !== index);
        setGameData(prev => ({ ...prev, faqs: updatedFaqs }));
    };

    const renderMultiLangInputs = (field, label, type = "text") => (
        <>
            <Form.Label className="fw-bold">{label}</Form.Label>
            {selectedLanguages[field].map((langCode) => (
                <Form.Group className="mb-3" key={`${field}-${langCode}`}>
                    <Form.Control
                        as={type === "textarea" ? "textarea" : "input"}
                        type={type}
                        placeholder={`${label} (${langCode.toUpperCase()})`}
                        value={gameData[field][langCode] || ""}
                        onChange={(e) =>
                            handleInputChange(field, langCode, e.target.value)
                        }
                    />
                </Form.Group>
            ))}
        </>
    );

    const uploadGameFn = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("title", JSON.stringify(gameData.title));
        formData.append("shortDes", JSON.stringify(gameData.shortDes));
        formData.append("description", JSON.stringify(gameData.description));

        formData.append("gameKeywords", gameData.gameKeywords);
        if (gameData.categoryIds?.length > 0) {
            formData.append("categoryIds", JSON.stringify(gameData.categoryIds));
        }
        if (gameData.gameTags?.length > 0) {
            formData.append("gameTags", JSON.stringify(gameData.gameTags));
        }
        formData.append("thumbnail", gameData.thumbnail);
        // formData.append("video", gameData.video);
        formData.append("gameUrl", gameData.gameUrl);
        formData.append("howToPlay", howToPlayHtml);
        formData.append("orientation", gameData.orientation);
        formData.append("featureGame", gameData.featureGame);
        formData.append("whoCreated", gameData.whoCreated);
        formData.append("featureList", featureListHtml);
        formData.append("controls", gameData.controls);
        formData.append("metaTitle", gameData.metaTitle);
        formData.append("metaDescription", gameData.metaDescription);
        formData.append("gameStatus", gameData.gameStatus);
        formData.append("faqs", JSON.stringify(gameData.faqs))

        formData.append("userId", signUser?._id);
        formData.append("status", signUser?.role === "Admin" ? "Approved" : "Pending");

        const res = await fetch(`${apiUrl}/api/games/uploadd-game`, {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        const errorBox = document.getElementById("gameDataError");
        errorBox.innerText = data.message || "";

        if (res.ok) {
            Swal.fire({
                icon: "success",
                title: "Game uploaded successfully!",
                showConfirmButton: true,
                timer: 1500,
            });

            setGameData({
                title: { en: "" },
                shortDes: { en: "" },
                description: { en: "" },
                keywords: { en: "" },
                categoryIds: "",
                gameTags: "",
                thumbnail: "",
                faqs: [{ question: "Q", answer: "A" }],
                video: "",
                gameUrl: "",
                howToPlay: "",
                whoCreated: "",
                featureGame: "",
                orientation: "",
                gameStatus: "",
                metaTitle: "",
                metaDescription: "",
            });
            setHowToPlayHtml("");
            setFeatureListHtml("");
            setControlsHtml("");
            setSelectedLanguages({
                title: ["en"],
                shortDes: ["en"],
                description: ["en"],
                keywords: ["en"],
            });
            purgeGameCache()
            uploadedCacheGames(true);
            setUploadGameModal(false);
        }
    };

    const onchange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setGameData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setGameData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleHowPlayChange = (html) => {
        setHowToPlayHtml(html);
    };
    const handleFeatureListChange = (html) => {
        setFeatureListHtml(html);
    };
    const handleControlsChange = (html) => {
        setControlsHtml(html);
    };

    const categoryOptions = [];
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
        const res = await fetch(`${apiUrl}/api/tags/allTags`);
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
            <div className="d-flex justify-content-end mb-4">
                <Button className="primary-btn" onClick={() => setUploadGameModal(true)}>Upload Game</Button>
            </div>

            <Modal size="lg" show={uploadGameModal} onHide={() => setUploadGameModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload Game</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={uploadGameFn}>
                        <div id="gameDataError" className="text-danger text-center mb-3"></div>

                        {/* 🔤 Add Languages */}
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Add Translations:</Form.Label>
                            <div className="d-flex flex-wrap">
                                {languages.map((lang) => (
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

                                {/* 🔽 Other Game Fields */}
                                <Form.Label>Category *</Form.Label>
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

                                        setGameData(prev => ({
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

                                        setGameData(prev => ({
                                            ...prev,
                                            gameTags: ids
                                        }));
                                    }}
                                />
                                <Form.Group className="mb-3">
                                    <Form.Label>Game URL *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="gameUrl"
                                        value={gameData.gameUrl}
                                        onChange={onchange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Thumbnail</Form.Label>
                                    <Form.Control type="file" name="thumbnail" onChange={onchange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Orientation *</Form.Label>
                                    <Form.Control as="select" name="orientation" value={gameData.orientation} onChange={onchange}>
                                        <option value="">Select Orientation</option>
                                        <option value="potrait">Potrait</option>
                                        <option value="landscape">Landscape</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control as="select" name="gameStatus" value={gameData.gameStatus} onChange={onchange}>
                                        <option value="">Select Game Status</option>
                                        <option value="Publish">Publish</option>
                                        <option value="UnPublish">UnPublish</option>
                                    </Form.Control>
                                </Form.Group>

                                {renderMultiLangInputs("shortDes", "Short Description", "textarea")}
                                {renderMultiLangInputs("description", "Full Description", "textarea")}
                                <Form.Group className="mb-3">
                                    <Form.Label>How To Play</Form.Label>
                                    <ReactQuill theme="snow" value={howToPlayHtml} onChange={handleHowPlayChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Feature List</Form.Label>
                                    <ReactQuill theme="snow" value={featureListHtml} onChange={handleFeatureListChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Controls</Form.Label>
                                    <ReactQuill theme="snow" value={controlsHtml} onChange={handleControlsChange} />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>FAQs</Form.Label>
                                    {gameData.faqs?.map((faq, i) => (
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
                                            />
                                            <div className="mt-3" style={{ fontSize: "12px", border: "1px solid red", display: "inline-block" }} size="sm" type="button" onClick={() => removeFaq(i)}>Remove -</div>
                                        </div>
                                    ))}
                                    <Button type="button" onClick={addFaq}>+ Add FAQ</Button>
                                </Form.Group>
                                {signUser?.role === "Admin" && (
                                    <>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Feature Game?</Form.Label>
                                            <Form.Control as="select" name="featureGame" value={gameData.featureGame} onChange={onchange}>
                                                <option value="">Select</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </>
                                )}
                            </>
                        )}

                        {activeTab === "seo" && (
                            <>
                                <Form.Group className="my-3">
                                    <Form.Label>Meta Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="metaTitle"
                                        value={gameData.metaTitle}
                                        onChange={onchange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Meta Descripton</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        name="metaDescription"
                                        value={gameData.metaDescription}
                                        onChange={onchange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Game Keywords</Form.Label>
                                    <Form.Control
                                        type='text'
                                        className="my-3"
                                        placeholder="keyword1, keyword2, keyword3"
                                        name='gameKeywords'
                                        value={gameData?.gameKeywords}
                                        onChange={onchange}
                                    />
                                </Form.Group>

                            </>
                        )}
                        <div className="d-flex justify-content-center">
                            <Button type="submit" className="primary-btn">Upload Game</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}
