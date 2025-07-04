import React from "react";

export default function Card({index, block, blocks, setBlocks, userStatus}) {

    const updateBlock = (updater) => {
        const updated = [...blocks];
        updater(updated[index]);
        setBlocks(updated);
    };

    const updateOption = (optIndex, value) => {
        const updated = [...blocks];
        updated[index].options[optIndex].label = value;
        setBlocks(updated);
    };

    const deleteOption = (optIndex) => {
        const updated = [...blocks];
        updated[index].options = updated[index].options.filter((_, i) => i !== optIndex);
        setBlocks(updated);
    };

    const addOption = () => {
        const updated = [...blocks];
        updated[index].options.push({index: Date.now(), label: ""});
        setBlocks(updated);
    };

    const deleteBlock = (indexToDelete) => {
        setBlocks(prev => prev.filter((_, index) => index !== indexToDelete));
    };

    return (

        <div className="card shadow" style={{width: "100%", maxWidth: "800px"}}>
            <div className="card-body">
                <fieldset disabled={userStatus === "viewer"}>
                    <button
                        className="btn btn-sm btn-outline-danger position-absolute"
                        style={{top: '10px', right: '10px'}}
                        onClick={() => deleteBlock(index)}
                        title="Delete this block"
                    >
                        ❌
                    </button>
                    {block.type === 'question' && (
                        <div>
                            <div className="row mt-5">
                                <div className="col-md-8">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Question"
                                        value={block.title}
                                        onChange={(e) => {
                                            const updated = [...blocks];
                                            updated[index].title = e.target.value;
                                            setBlocks(updated);
                                        }}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <select
                                        className="form-control"
                                        value={block.questionType}
                                        onChange={(e) => {
                                            const updated = [...blocks];
                                            updated[index].questionType = e.target.value;
                                            updated[index].inputValue = e.target.value === "few-from-list" ? [] : "";
                                            setBlocks(updated);
                                        }}
                                    >
                                        <option value="single-line">Single-line text
                                        </option>
                                        <option value="paragraph">Paragraph</option>
                                        <option value="number">Number</option>
                                        <option value="one-from-list">One from list
                                        </option>
                                        <option value="few-from-list">A few from
                                            list
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Description"
                                    value={block.description}
                                    onChange={(e) => {
                                        const updated = [...blocks];
                                        updated[index].description = e.target.value;
                                        setBlocks(updated);
                                    }}
                                />
                            </div>

                            {["one-from-list", "few-from-list"].includes(block.questionType) && (
                                <div className="mb-3">
                                    <label className="form-label mt-1">Customize
                                        Options</label>
                                    {block.options.map((option, optIndex) => (
                                        <div className="input-group mb-2"
                                             key={option.index}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={option.label}
                                                onChange={(e) => {
                                                    const updated = [...blocks];
                                                    updated[index].options[optIndex].label = e.target.value;
                                                    setBlocks(updated);
                                                }}
                                                placeholder={`Option ${optIndex + 1}`}
                                            />
                                            <button
                                                className="btn btn-danger"
                                                type="button"
                                                onClick={() => {
                                                    const updated = [...blocks];
                                                    updated[index].options = updated[index].options.filter((_, i) => i !== optIndex);
                                                    setBlocks(updated);
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
                                            const updated = [...blocks];
                                            const nextIndex = updated[index].options.length + 1;

                                            updated[index].options.push({
                                                index: nextIndex,
                                                label: `Option ${nextIndex}`,
                                            });

                                            setBlocks(updated);
                                        }}
                                    >
                                        ➕ Add Option
                                    </button>

                                </div>
                            )}
                            {(() => {
                                switch (block.questionType) {
                                    case "single-line":
                                        return (
                                            <input
                                                type="text"
                                                className="form-control mt-3"
                                                placeholder="Your answer"
                                                value={block.inputValue}
                                                onChange={(e) => {
                                                    const updated = [...blocks];
                                                    updated[index].inputValue = e.target.value;
                                                    setBlocks(updated);
                                                }}
                                            />
                                        );
                                    case "paragraph":
                                        return (
                                            <textarea
                                                className="form-control mt-3"
                                                rows="3"
                                                placeholder="Your detailed answer"
                                                value={block.inputValue}
                                                onChange={(e) => {
                                                    const updated = [...blocks];
                                                    updated[index].inputValue = e.target.value;
                                                    setBlocks(updated);
                                                }}
                                            />
                                        );
                                    case "number":
                                        return (
                                            <input
                                                type="number"
                                                className="form-control mt-3"
                                                placeholder="Enter a number"
                                                value={block.inputValue}
                                                onChange={(e) => {
                                                    const updated = [...blocks];
                                                    updated[index].inputValue = e.target.value;
                                                    setBlocks(updated);
                                                }}
                                            />
                                        );
                                    case "one-from-list":
                                        return (
                                            <div className="form-check mt-3">
                                                {block.options.map((option) => (
                                                    <div key={option.index}
                                                         className="form-check">
                                                        <input
                                                            type="radio"
                                                            className="form-check-input"
                                                            name={`oneFromList-${index}`}
                                                            id={`radio-${option.index}`}
                                                            value={option.label}
                                                            checked={block.inputValue === option.label}
                                                            onChange={(e) => {
                                                                const updated = [...blocks];
                                                                updated[index].inputValue = e.target.value;
                                                                setBlocks(updated);
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
                                                {block.options.map((option) => (
                                                    <div key={option.index}
                                                         className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            id={`checkbox-${option.index}`}
                                                            value={option.label}
                                                            checked={Array.isArray(block.inputValue) && block.inputValue.includes(option.label)}
                                                            onChange={(e) => {
                                                                const updated = [...blocks];
                                                                const checked = e.target.checked;
                                                                const current = updated[index].inputValue || [];
                                                                updated[index].inputValue = checked
                                                                    ? [...current, option.label]
                                                                    : current.filter((v) => v !== option.label);
                                                                setBlocks(updated);
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

                            <div className="form-check form-check-inline mt-3">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`required-${index}`}
                                    checked={block.isRequired}
                                    onChange={(e) => {
                                        const updated = [...blocks];
                                        updated[index].isRequired = e.target.checked;
                                        setBlocks(updated);
                                    }}
                                />
                                <label className="form-check-label"
                                       htmlFor={`required-${index}`}>
                                    Required
                                </label>
                            </div>
                        </div>

                    )}

                    {block.type === 'image' && (
                        <>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            const updated = [...blocks];
                                            updated[index].file = file;
                                            updated[index].preview = reader.result;
                                            setBlocks(updated);
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                            {block.preview && (
                                <img
                                    src={block.preview}
                                    alt=""
                                    style={{maxWidth: '100%', marginTop: '1rem'}}
                                />
                            )}
                        </>
                    )}
                </fieldset>
            </div>
        </div>
    );
}