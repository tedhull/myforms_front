import React from "react";
import MarkdownRenderer from "./MarkdownRederer";

export default function FormCard({index, block, blocks, setBlocks, restricted}) {
    return (

        <div className="card shadow" style={{width: "100%", maxWidth: "800px"}}>
            <div className="card-body">
                {block.type === 'question' && (
                    <div>
                        {block.isRequired && !block.error && (
                            <span className="text-danger">required</span>
                        )}
                        {block.error && (
                            <span className="text-danger">{block.error}</span>
                        )}
                        <div className="row mt-2">

                            <div className="col-md-8">
                                <div>
                                    <MarkdownRenderer markdownText={block.title}/>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3">
                            <MarkdownRenderer markdownText={block.description}/>
                        </div>

                        {(() => {
                            switch (block.questionType) {
                                case "single-line":
                                    return (
                                        <input
                                            type="text"
                                            disabled={restricted}
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
                                            rows="1"
                                            disabled={restricted}
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
                                            type="text"
                                            inputMode="numeric"
                                            disabled={restricted}
                                            className={`form-control mt-3`}
                                            placeholder="Enter number"
                                            pattern="[0-9]*"
                                            value={block.inputValue}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (/^\d*$/.test(val)) {
                                                    const updated = [...blocks];
                                                    updated[index].inputValue = val;
                                                    setBlocks(updated);
                                                } else e.target.value = "";
                                            }}
                                        />

                                    );
                                case "one-from-list":
                                    return (
                                        <div className="form-check ps-0">
                                            {block.options.map((option) => (
                                                <div key={option.index}
                                                     className="form-check">

                                                    <label
                                                        className="form-check-label"
                                                        htmlFor={`radio-${option.index}`}>
                                                        <MarkdownRenderer markdownText={option.label}/>
                                                    </label>
                                                    <input
                                                        type="radio"
                                                        disabled={restricted}
                                                        className="form-check-input"
                                                        name={`oneFromList-${index}`}
                                                        id={`radio-${option.index}`}
                                                        value={option.index || " "}
                                                        checked={block.inputValue === option.index}
                                                        onChange={(e) => {
                                                            const updated = [...blocks];
                                                            updated[index].inputValue = Number(e.target.value);
                                                            setBlocks(updated);
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    );
                                case "few-from-list":
                                    return (
                                        <div className="form-check mt-3 ms-0 ps-0">
                                            {block.options.map((option) => (
                                                <div key={option.index}
                                                     className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        disabled={restricted}
                                                        className="form-check-input"
                                                        id={`checkbox-${option.index}`}
                                                        value={option.index || []}
                                                        checked={Array.isArray(block.inputValue) && block.inputValue.includes(option.index)}
                                                        onChange={(e) => {
                                                            const updated = [...blocks];
                                                            const checked = e.target.checked;
                                                            const current = updated[index].inputValue || [];
                                                            const indexValue = Number(e.target.value); // Ensure it's treated as a number
                                                            updated[index].inputValue = checked
                                                                ? [...current, indexValue]
                                                                : current.filter((v) => v !== indexValue);
                                                            setBlocks(updated);
                                                        }}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor={`checkbox-${option.index}`}>
                                                        <MarkdownRenderer markdownText={option.label}/>
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

                {block.type === 'image' && (
                    <>
                        {block.preview && (
                            <img
                                src={block.preview}
                                alt=""
                                style={{maxWidth: '100%', marginTop: '1rem'}}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}