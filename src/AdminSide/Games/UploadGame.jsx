import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Nav, Row } from "react-bootstrap";
import apiUrl from "../../ApiEndpoint";
import GameContext from "../../ContextApi/GameContext";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import UserContext from "../../ContextApi/UserContext";
import Select from "react-select";
import AddGameCategory from "../Category/AddGameCategory";
import CreatableSelect from "react-select/creatable";
import GameCatContext from "../../ContextApi/GameCatContext";

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
    const { categories } = useContext(GameCatContext);

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
            <Container>
                <Row className="justify-content-center bg-white" style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.1)", borderRadius: "5px" }}>
                    <Col md={12}>

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
                                <Nav.Item>
                                    <Nav.Link eventKey="faq">Faq&apos;s</Nav.Link>
                                </Nav.Item>
                            </Nav>

                            {activeTab === "form" && (
                                <>
                                    {renderMultiLangInputs("title", "Game Title")}

                                    {/* 🔽 Other Game Fields */}
                                    <Form.Label>Categories *</Form.Label>
                                    <Select
                                        isMulti
                                        isSearchable   // ✅ enable search
                                        options={categoryOptions}
                                        placeholder="Search categories..."
                                        noOptionsMessage={() => "No category found"}
                                        filterOption={(option, inputValue) =>
                                            option.label.toLowerCase().includes(inputValue.toLowerCase())
                                        }
                                        value={selectedCategories
                                            .map((id) => categoryOptions.find((opt) => opt.value === id))
                                            .filter(Boolean)}
                                        onChange={(selected) => {
                                            const ids = selected.map((s) => s.value);
                                            setSelectedCategories(ids);
                                            setGameData((prev) => ({ ...prev, categoryIds: ids }));
                                        }}
                                    />
                                    <AddGameCategory />
                                    <Form.Label>Tags</Form.Label>
                                    <CreatableSelect
                                        isMulti
                                        isSearchable
                                        options={tagOptions}
                                        placeholder="Search or create tags..."
                                        noOptionsMessage={({ inputValue }) =>
                                            inputValue ? `Press Enter to add "${inputValue}"` : "No tag found"
                                        }

                                        value={selectedTags
                                            .map((id) => tagOptions.find((opt) => opt.value === id))
                                            .filter(Boolean)
                                        }

                                        onChange={(selected) => {
                                            const ids = selected.map((s) => s.value);
                                            setSelectedTags(ids);
                                            setGameData((prev) => ({ ...prev, gameTags: ids }));
                                        }}

                                        // ✅ THIS IS MAIN PART
                                        onCreateOption={async (inputValue) => {
                                            try {
                                                // 1. Create tag in backend
                                                const res = await fetch(`${apiUrl}/api/tags/addTags`, {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify({ tags: inputValue }),
                                                });

                                                const data = await res.json();

                                                if (!res.ok) {
                                                    Swal.fire("Error", data.message || "Tag not created", "error");
                                                    return;
                                                }

                                                // 2. Create new option
                                                const newTag = {
                                                    value: data._id || data.tag?._id, // depending on your API
                                                    label: inputValue,
                                                };

                                                // 3. Update dropdown list
                                                setAllTags((prev) => [...prev, { _id: newTag.value, tags: inputValue }]);

                                                // 4. Select it immediately
                                                const updatedIds = [...selectedTags, newTag.value];
                                                setSelectedTags(updatedIds);

                                                setGameData((prev) => ({
                                                    ...prev,
                                                    gameTags: updatedIds,
                                                }));

                                                Swal.fire("Added!", "Tag created successfully", "success");

                                            } catch (err) {
                                                console.log(err);
                                                Swal.fire("Error", "Something went wrong", "error");
                                            }
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
                            {activeTab === "faq" && (
                                <>
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
                                </>
                            )}
                            <div className="d-flex justify-content-center">
                                <Button type="submit" className="primary-btn">Upload Game</Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
