import {useEffect, useRef, useState} from "react";
import '../styles/CreateTemplate.css';
import '../App.css';
import '../scripts/ImageHandler';
import HeaderBlock from '../components/HeaderBlock';
import Toolbar from "../components/Toolbar";
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {AppHeader} from "../components/AppHeader";
import axios from "axios";
import {getImage, upload} from "../scripts/ImageHandler";
import Card from "../components/Card";
import {useParams} from "react-router-dom";

export function TestCreateTemplate({toggleTheme}) {
    const api = process.env.REACT_APP_API_ADDRESS;
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const textareaRef = useRef(null);
    const [blocks, setBlocks] = useState([]);
    const [topic, setTopic] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const {id} = useParams();

    useEffect(() => {
        if (id) {
            axios.get(`${api}/templates/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            }).then((response) => {
                const data = response.data;
                setTitle(data.title);
                setDescription(data.description);
                setTags(data.tags.join(' '));
                setTopic(data.topic);
                const processedBlocks = data.fields.map((field) => {
                    if (field.type === "image") {
                        return {
                            type: "image",
                            caption: field.caption || '',
                            key: field.key || '',
                            preview: getImage(field.key),
                        }
                    } else return {
                        ...field,

                        options: field.options || [],
                    }
                })
                setBlocks(processedBlocks);
            }).catch((error) => {
                console.log(error)
            }).finally(() => setIsLoading(false));
        } else setIsLoading(false);
    }, [id, api])

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reordered = Array.from(blocks);
        const [removed] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, removed);

        setBlocks(reordered);
    };
    const uploadImages = async () => {
        const updatedBlocks = [...blocks];

        await Promise.all(updatedBlocks.map(async (block, i) => {
            if (block.type === 'image' && block.file instanceof File && !block.key) {
                try {
                    const key = await upload(block.file);
                    updatedBlocks[i].key = key;
                    updatedBlocks[i].preview = getImage(key);
                    delete updatedBlocks[i].file;
                } catch (err) {
                    console.error('Upload failed for', block, err);
                }
            }
        }));

        setBlocks(updatedBlocks);
        return updatedBlocks; // 👈 Return the fresh state directly
    };


    const addImage = () => {
        setBlocks([
            ...blocks,
            {
                type: 'image',
                preview: '',
                file: null,
                caption: '',
                key: '',
            }
        ]);
    }
    const addQuestion = () => {
        setBlocks([
            ...blocks,
            {
                title: `Question ${blocks.length + 1}`,
                type: 'question',
                description: '',
                questionType: 'single-line',
                inputValue: '',
                options: [{index: 1, label: ''}],
                isRequired: false,
            },
        ]);
    };

    const submit = async (e) => {
        e.preventDefault();
        const updatedBlocks = await uploadImages(); // 👈 Now has the latest keys

        const formJson = updatedBlocks.map((block) => ({
            type: block.type,
            key: block.key,
            title: block.title,
            questionType: block.questionType,
            description: block.description,
            inputValue: block.inputValue,
            options: block.options,
            caption: block.caption,
            preview: block.preview,
            isRequired: block.isRequired,
        }));
        console.log(formJson);
        try {
            const response = await axios.post(`${api}/templates/new`, {
                    title: title,
                    description: description,
                    tags: createTags(),
                    topic: topic,
                    fields: formJson,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                    }
                })
            console.log(response);

        } catch (error) {
            console.log(error);
        }
    }

    const createTags = () => {
        return tags
            .split(' ')
            .filter(Boolean)
    }
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; // Reset height
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"; // Set to scroll height
        }
    }, [description]);

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <AppHeader className="App-header">
                <HeaderBlock title={title} description={description} textareaRef={textareaRef} tags={tags}
                             setTags={setTags} setDescription={setDescription}
                             setTitle={setTitle}
                             topic={topic}
                             setTopic={setTopic}
                />
                <Toolbar toggleTheme={toggleTheme} addImage={addImage} addQuestion={addQuestion}/>
                <button onClick={submit}>SAVE TEMPLATE</button>
                <Droppable droppableId="questions" direction="vertical">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {blocks.map((block, index) => (
                                <Draggable key={index} draggableId={`q-${index}`} index={index}>
                                    {(provided) => (
                                        <div
                                            className="container mt-5 d-flex justify-content-center"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <Card
                                                block={block}
                                                index={index}
                                                blocks={blocks}
                                                setBlocks={setBlocks}>
                                            </Card>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}

                        </div>
                    )}
                </Droppable>
            </AppHeader>
        </DragDropContext>
    );
}