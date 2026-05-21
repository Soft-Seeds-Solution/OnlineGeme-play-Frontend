import { useContext, useState, useEffect } from "react";
import { Button, Form, Image, Nav } from "react-bootstrap";
import GameContext from "../../ContextApi/GameContext";
import GameCatContext from "../../ContextApi/GameCatContext";
import PropTypes from "prop-types";
import apiUrl from "../../ApiEndpoint";
import Swal from "sweetalert2";
import ReactQuill from "react-quill";
import Select from "react-select";
import AddGameCategory from "../Category/AddGameCategory";
import CreatableSelect from "react-select/creatable";
import { useParams } from "react-router-dom";
import UserContext from "../../ContextApi/UserContext";

export default function EditUploadedGame() {
    const { AllGames, gameById, uploadedCacheGames, setGameById, purgeGameCache } =
        useContext(GameContext);
    const { signUser } = useContext(UserContext)
    const { categories } = useContext(GameCatContext);
    const { title } = useParams();
    const gameTitle = title.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    const [activeTab, setActiveTab] = useState("form");
    const selectedGame = AllGames?.find(gameData => gameData.title?.en.toLowerCase() === gameTitle.toLowerCase())
    useEffect(() => {
        setGameById(selectedGame)
    }, [selectedGame])
    const [allTags, setAllTags] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    const [selectedLanguages, setSelectedLanguages] = useState({
        title: ["en"],
        shortDes: ["en"],
        description: ["en"],
        keywords: ["en"],
    });

    const languages = [
        { code: "en", label: "English" },
        { code: "ur", label: "Urdu" },
        { code: "ar", label: "Arabic" },
        { code: "fr", label: "French" },
        { code: "es", label: "Spanish" },
    ];

    // Build category options
    const categoryOptions = [];
    const buildOptions = (cats, level = 0) => {
        cats?.forEach((cat) => {
            categoryOptions.push({
                value: cat._id,
                label: `${"— ".repeat(level)} ${cat.category}`,
            });
            if (cat.children?.length) buildOptions(cat.children, level + 1);
        });
    };
    buildOptions(categories);

    // Fetch all tags once
    useEffect(() => {
        const fetchTags = async () => {
            const res = await fetch("https://edge.khelogy.com/api/tags/allTags");
            const data = await res.json();
            setAllTags(data);
        };
        fetchTags();
    }, []);

    const tagOptions = allTags?.map((tag) => ({ value: tag._id, label: tag.tags }));

    // Update selected categories/tags after game and tags ready
    useEffect(() => {
        if (!gameById?._id || !allTags.length) return;

        // Categories
        if (gameById.categories?.length) {
            const ids = gameById.categories.map((c) => (typeof c === "object" ? c._id : c));
            setSelectedCategories(ids);
            setGameById((prev) => ({ ...prev, categoryIds: ids }));
        }

        // Tags
        if (gameById.gameTags?.length) {
            const ids = gameById.gameTags.map((t) => (typeof t === "object" ? t._id : t));
            setSelectedTags(ids);
            setGameById((prev) => ({ ...prev, gameTags: ids }));
        }

        // Languages
        setSelectedLanguages({
            title: Object.keys(gameById.title || { en: "" }),
            shortDes: Object.keys(gameById.shortDes || { en: "" }),
            description: Object.keys(gameById.description || { en: "" }),
        });
    }, [gameById?._id]);

    const handleLanguageChange = (langCode) => {
        setSelectedLanguages((prev) => {
            const updated = { ...prev };
            Object.keys(updated).forEach((field) => {
                if (!updated[field].includes(langCode)) updated[field].push(langCode);
            });
            return updated;
        });
    };

    const handleMultiLangChange = (field, langCode, value) => {
        setGameById((prev) => ({
            ...prev,
            [field]: { ...prev[field], [langCode]: value },
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
                    onChange={(e) => handleMultiLangChange(field, lang, e.target.value)}
                />
            ))}
        </>
    );

    const onchange = (e) => {
        const { name, value, type, files } = e.target;
        const newValue = type === "file" ? files[0] : value;
        setGameById((prev) => ({ ...prev, [name]: newValue }));
    };

    const addFaq = () => {
        setGameById((prev) => ({
            ...prev,
            faqs: [...(prev.faqs || []), { question: "", answer: "" }],
        }));
    };

    const updateFaq = (index, field, value) => {
        const updatedFaqs = [...(gameById.faqs || [])];
        updatedFaqs[index][field] = value;
        setGameById((prev) => ({ ...prev, faqs: updatedFaqs }));
    };

    const removeFaq = (index) => {
        const updatedFaqs = gameById.faqs.filter((_, i) => i !== index);
        setGameById((prev) => ({ ...prev, faqs: updatedFaqs }));
    };

    const handleHowPlayChange = (html) => setGameById({ ...gameById, howToPlay: html });
    const handleFeatureListChange = (html) =>
        setGameById({ ...gameById, featureList: html });
    const handleControlsChange = (html) => setGameById({ ...gameById, controls: html });

    const updateGameFn = async (e) => {
        e.preventDefault();
        const { isConfirmed } = await Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`,
        });
        if (!isConfirmed) return;

        const formData = new FormData();
        formData.append("title", JSON.stringify(gameById.title));
        formData.append("shortDes", JSON.stringify(gameById.shortDes));
        formData.append("description", JSON.stringify(gameById.description));
        formData.append("gameKeywords", gameById.gameKeywords);
        formData.append("categoryIds", JSON.stringify(gameById.categoryIds || []));
        formData.append("gameTags", JSON.stringify(gameById.gameTags || []));
        formData.append("thumbnail", gameById.thumbnail);
        formData.append("video", gameById.video);
        formData.append("gameUrl", gameById.gameUrl);
        formData.append("role", signUser?._id);
        formData.append("howToPlay", gameById.howToPlay);
        formData.append("whoCreated", gameById.whoCreated);
        formData.append("orientation", gameById.orientation);
        formData.append("featureGame", gameById.featureGame);
        formData.append("metaTitle", gameById.metaTitle);
        formData.append("metaDescription", gameById.metaDescription);
        formData.append("recommended", gameById.recommended);
        formData.append("featureList", gameById.featureList);
        formData.append("controls", gameById.controls);
        formData.append("faqs", JSON.stringify(gameById.faqs));

        const res = await fetch(`${apiUrl}/api/games/editGame/${gameById?._id}`, {
            method: "PUT",
            body: formData,
        });

        if (res.ok) {
            Swal.fire("Games Send For Review To Admin!", "", "success");
            purgeGameCache();
            uploadedCacheGames();
        } else {
            Swal.fire("Error saving changes", "", "error");
        }
    };

    return (
        <>
            <Form onSubmit={updateGameFn}>
                {/* Language Selector */}
                <Form.Group>
                    <Form.Label>Add Translations</Form.Label>
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

                <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
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
                                setGameById((prev) => ({ ...prev, categoryIds: ids }));
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
                                setGameById((prev) => ({ ...prev, gameTags: ids }));
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

                                    setGameById((prev) => ({
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

                        <Form.Control
                            className="my-3"
                            type="text"
                            name="gameUrl"
                            value={gameById?.gameUrl || ""}
                            onChange={onchange}
                            placeholder="Game URL"
                        />

                        {/* React Quill Fields */}
                        <Form.Label>Controls *</Form.Label>
                        <ReactQuill value={gameById?.controls} onChange={handleControlsChange} />
                        <Form.Label>How To Play *</Form.Label>
                        <ReactQuill value={gameById?.howToPlay} onChange={handleHowPlayChange} />
                        <Form.Label>Feature List *</Form.Label>
                        <ReactQuill value={gameById?.featureList} onChange={handleFeatureListChange} />

                        {/* Thumbnail */}
                        <Form.Control className="mb-3" type="file" name="thumbnail" onChange={onchange} />
                        <Image src={gameById?.thumbnail} style={{ width: "100px" }} />

                        {/* FAQ */}
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
                                <Button size="sm" variant="danger" onClick={() => removeFaq(i)}>
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Button className="mt-2" onClick={addFaq}>
                            + Add FAQ
                        </Button>

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
                        <Form.Control
                            type="text"
                            className="my-3"
                            placeholder="keyword1, keyword2, keyword3"
                            name="gameKeywords"
                            value={gameById?.gameKeywords}
                            onChange={onchange}
                        />
                        <Form.Control
                            className="mb-3"
                            type="text"
                            name="metaTitle"
                            value={gameById?.metaTitle || ""}
                            onChange={onchange}
                            placeholder="Meta Title"
                        />
                        <Form.Control
                            className="mb-3"
                            as="textarea"
                            rows={3}
                            name="metaDescription"
                            value={gameById?.metaDescription || ""}
                            onChange={onchange}
                            placeholder="Meta Description"
                        />
                    </>
                )}

                <div className="text-center mt-4">
                    <Button type="submit">Update Game</Button>
                </div>
            </Form>
        </>
    );
}

EditUploadedGame.propTypes = {
    gameId: PropTypes.node.isRequired,
};