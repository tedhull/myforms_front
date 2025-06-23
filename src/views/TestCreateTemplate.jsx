import {useEffect, useState, useRef} from "react";
import '../styles/CreateTemplate.css';
import '../App.css';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

export function TestCreateTemplate() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const textareaRef = useRef(null);
    const [questions, setQuestions] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState([{index: 1, label: ''}]);


    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reordered = Array.from(questions);
        const [removed] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, removed);

        setQuestions(reordered);
    };
    const deleteBlock = (indexToDelete) => {
        setQuestions(prev => prev.filter((_, index) => index !== indexToDelete));
    };
    const addImage = () => {
        const arrayLength = questions.length;
        setQuestions([
            ...questions,
            {
                index: questions.length - 1,
                type: 'image',
                preview: '',
                file: null,
                caption: '',
            }
        ]);
    }
    const addQuestion = () => {
        const cardsCount = questions.length;

        setQuestions([
            ...questions,
            {
                index: cardsCount - 1,
                title: `Question ${cardsCount + 1}`,
                type: 'question',
                description: '',
                selectedType: '',
                inputValue: '',
                options: [{index: 1, label: ''}],
            },
        ]);
    };


    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; // Reset height
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"; // Set to scroll height
        }
    }, [description]);

    const empty = () => {

    }

    const renderField = () => {
        switch (selectedType) {
            case 'single-line':
                return (
                    <input
                        type="text"
                        className="form-control mt-3"
                        placeholder="Your answer"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                );
            case 'paragraph':
                return (
                    <textarea
                        className="form-control mt-3"
                        rows="3"
                        placeholder="Your detailed answer"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                );
            case 'number':
                return (
                    <input
                        type="number"
                        className="form-control mt-3"
                        placeholder="Enter a number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                );
            case 'one-from-list':
                return (
                    <div className="form-check mt-3">
                        {options.map((option, index) => (
                            <div key={option.index} className="form-check">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    name="oneFromList"
                                    id={`radio-${option.index}`}
                                    value={option.label}
                                    checked={inputValue === option.label}
                                    onChange={(e) => setInputValue(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor={`radio-${option.index}`}>
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </div>
                );

            case 'few-from-list':
                return (
                    <div className="form-check mt-3">
                        {options.map((option, index) => (
                            <div key={option.index} className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`checkbox-${option.index}`}
                                    value={option.label}
                                    checked={Array.isArray(inputValue) && inputValue.includes(option.label)}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setInputValue((prev) => {
                                            const prevArr = Array.isArray(prev) ? prev : [];
                                            if (checked) return [...prevArr, option.label];
                                            return prevArr.filter((v) => v !== option.label);
                                        });
                                    }}
                                />
                                <label className="form-check-label" htmlFor={`checkbox-${option.index}`}>
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (

        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="App-header">
                <div className="toolbar">
                    <button className="btn btn-primary mb-1" onClick={addQuestion}>➕</button>
                    <button className="btn btn-secondary mt-1" onClick={addImage}>🖼️</button>
                </div>

                <div className="container mt-5 d-flex justify-content-center">
                    <div className="card shadow card-with-top-left-border" style={{width: "100%", maxWidth: "800px"}}>
                        <div className="card-body">
                            <div className="mb-3 mt-3" style={{height: "40px"}}>
                                <input
                                    type="text"
                                    className="border-bottom-only"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter template title"
                                />
                            </div>
                            <div className="mb-3">
            <textarea
                ref={textareaRef}
                className="border-bottom-only"
                rows="1"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter template description"
                style={{overflow: 'hidden', resize: 'none'}}
            />
                            </div>
                        </div>
                    </div>
                </div>

                <Droppable droppableId="questions" direction="vertical">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {questions.map((question, index) => (
                                <Draggable key={index} draggableId={`q-${index}`} index={index}>
                                    {(provided) => (
                                        <div
                                            className="container mt-5 d-flex justify-content-center"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <div className="card shadow" style={{width: "100%", maxWidth: "800px"}}>
                                                <div className="card-body">
                                                    <button
                                                        className="btn btn-sm btn-outline-danger position-absolute"
                                                        style={{top: '10px', right: '10px'}}
                                                        onClick={() => deleteBlock(index)}
                                                        title="Delete this block"
                                                    >
                                                        ❌
                                                    </button>
                                                    {question.type === 'question' && (
                                                        <div>
                                                            <div className="row mt-5">
                                                                <div className="col-md-8">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Question"
                                                                        value={question.title}
                                                                        onChange={(e) => {
                                                                            const updated = [...questions];
                                                                            updated[index].title = e.target.value;
                                                                            setQuestions(updated);
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="col-md-4">
                                                                    <select
                                                                        className="form-control"
                                                                        value={question.selectedType}
                                                                        onChange={(e) => {
                                                                            const updated = [...questions];
                                                                            updated[index].selectedType = e.target.value;
                                                                            updated[index].inputValue = e.target.value === "few-from-list" ? [] : "";
                                                                            setQuestions(updated);
                                                                        }}
                                                                    >
                                                                        <option value="single-line">Single-line text
                                                                        </option>
                                                                        <option value="paragraph">Paragraph</option>
                                                                        <option value="number">Number</option>
                                                                        <option value="one-from-list">One from list
                                                                        </option>
                                                                        <option value="few-from-list">A few from list
                                                                        </option>
                                                                    </select>
                                                                </div>
                                                            </div>

                                                            <div className="mt-3">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Description"
                                                                    value={question.description}
                                                                    onChange={(e) => {
                                                                        const updated = [...questions];
                                                                        updated[index].description = e.target.value;
                                                                        setQuestions(updated);
                                                                    }}
                                                                />
                                                            </div>

                                                            {/* Options Customizer */}
                                                            {["one-from-list", "few-from-list"].includes(question.selectedType) && (
                                                                <div className="mb-3">
                                                                    <label className="form-label mt-1">Customize
                                                                        Options</label>
                                                                    {question.options.map((option, optIndex) => (
                                                                        <div className="input-group mb-2"
                                                                             key={option.index}>
                                                                            <input
                                                                                type="text"
                                                                                className="form-control"
                                                                                value={option.label}
                                                                                onChange={(e) => {
                                                                                    const updated = [...questions];
                                                                                    updated[index].options[optIndex].label = e.target.value;
                                                                                    setQuestions(updated);
                                                                                }}
                                                                                placeholder={`Option ${optIndex + 1}`}
                                                                            />
                                                                            <button
                                                                                className="btn btn-danger"
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    const updated = [...questions];
                                                                                    updated[index].options = updated[index].options.filter((_, i) => i !== optIndex);
                                                                                    setQuestions(updated);
                                                                                }}
                                                                            >
                                                                                ❌
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                    <button
                                                                        className="btn btn-outline-primary mt-1 m-lg-1"
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const updated = [...questions];
                                                                            updated[index].options.push({
                                                                                index: Date.now(),
                                                                                label: "",
                                                                            });
                                                                            setQuestions(updated);
                                                                        }}
                                                                    >
                                                                        ➕ Add Option
                                                                    </button>
                                                                </div>
                                                            )}

                                                            {/* Answer Input Renderer */}
                                                            {(() => {
                                                                switch (question.selectedType) {
                                                                    case "single-line":
                                                                        return (
                                                                            <input
                                                                                type="text"
                                                                                className="form-control mt-3"
                                                                                placeholder="Your answer"
                                                                                value={question.inputValue}
                                                                                onChange={(e) => {
                                                                                    const updated = [...questions];
                                                                                    updated[index].inputValue = e.target.value;
                                                                                    setQuestions(updated);
                                                                                }}
                                                                            />
                                                                        );
                                                                    case "paragraph":
                                                                        return (
                                                                            <textarea
                                                                                className="form-control mt-3"
                                                                                rows="3"
                                                                                placeholder="Your detailed answer"
                                                                                value={question.inputValue}
                                                                                onChange={(e) => {
                                                                                    const updated = [...questions];
                                                                                    updated[index].inputValue = e.target.value;
                                                                                    setQuestions(updated);
                                                                                }}
                                                                            />
                                                                        );
                                                                    case "number":
                                                                        return (
                                                                            <input
                                                                                type="number"
                                                                                className="form-control mt-3"
                                                                                placeholder="Enter a number"
                                                                                value={question.inputValue}
                                                                                onChange={(e) => {
                                                                                    const updated = [...questions];
                                                                                    updated[index].inputValue = e.target.value;
                                                                                    setQuestions(updated);
                                                                                }}
                                                                            />
                                                                        );
                                                                    case "one-from-list":
                                                                        return (
                                                                            <div className="form-check mt-3">
                                                                                {question.options.map((option) => (
                                                                                    <div key={option.index}
                                                                                         className="form-check">
                                                                                        <input
                                                                                            type="radio"
                                                                                            className="form-check-input"
                                                                                            name={`oneFromList-${index}`}
                                                                                            id={`radio-${option.index}`}
                                                                                            value={option.label}
                                                                                            checked={question.inputValue === option.label}
                                                                                            onChange={(e) => {
                                                                                                const updated = [...questions];
                                                                                                updated[index].inputValue = e.target.value;
                                                                                                setQuestions(updated);
                                                                                            }}
                                                                                        />
                                                                                        <label
                                                                                            className="form-check-label"
                                                                                            htmlFor={`radio-${option.index}`}>
                                                                                            {option.label}
                                                                                        </label>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        );
                                                                    case "few-from-list":
                                                                        return (
                                                                            <div className="form-check mt-3">
                                                                                {question.options.map((option) => (
                                                                                    <div key={option.index}
                                                                                         className="form-check">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            className="form-check-input"
                                                                                            id={`checkbox-${option.index}`}
                                                                                            value={option.label}
                                                                                            checked={Array.isArray(question.inputValue) && question.inputValue.includes(option.label)}
                                                                                            onChange={(e) => {
                                                                                                const updated = [...questions];
                                                                                                const checked = e.target.checked;
                                                                                                const current = updated[index].inputValue || [];
                                                                                                updated[index].inputValue = checked
                                                                                                    ? [...current, option.label]
                                                                                                    : current.filter((v) => v !== option.label);
                                                                                                setQuestions(updated);
                                                                                            }}
                                                                                        />
                                                                                        <label
                                                                                            className="form-check-label"
                                                                                            htmlFor={`checkbox-${option.index}`}>
                                                                                            {option.label}
                                                                                        </label>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        );
                                                                    default:
                                                                        return null;
                                                                }
                                                            })()}
                                                        </div>

                                                    )}

                                                    {question.type === 'image' && (
                                                        <>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    if (file) {
                                                                        const reader = new FileReader();
                                                                        reader.onload = () => {
                                                                            const updated = [...questions];
                                                                            updated[index].file = file;
                                                                            updated[index].preview = reader.result;
                                                                            setQuestions(updated);
                                                                        };
                                                                        reader.readAsDataURL(file);
                                                                    }
                                                                }}
                                                            />
                                                            {question.preview && (
                                                                <img
                                                                    src={question.preview}
                                                                    alt="Uploaded"
                                                                    style={{maxWidth: '100%', marginTop: '1rem'}}
                                                                />
                                                            )}
                                                        </>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
}