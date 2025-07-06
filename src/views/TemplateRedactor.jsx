import {useEffect, useRef, useState} from "react";
import '../styles/CreateTemplate.css';
import '../App.css';
import '../scripts/ImageHandler';
import HeaderBlock from '../components/HeaderBlock';
import Toolbar from "../components/Toolbar";
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {AppHeader} from "../components/AppHeader";
import axios from "axios";
import {getImage} from "../scripts/ImageHandler";
import Card from "../components/Card";
import {data, useNavigate, useParams} from "react-router-dom";
import {getUserData} from "../scripts/User";
import Navbar from "../components/Navbar";
import {TemplateBuilder} from "../scripts/TemplateBuilder"
import {TemplateUpdater} from "../scripts/TemplateUpdater";

export function TemplateRedactor({toggleTheme}) {
    const api = process.env.REACT_APP_API_ADDRESS;
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const textareaRef = useRef(null);
    const [blocks, setBlocks] = useState([]);
    const [topic, setTopic] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const navType = performance.getEntriesByType("navigation")[0]?.type;
    const {id} = useParams();
    const [userStatus, setUserStatus] = useState('viewer');
    const [username, setUsername] = useState("Guest");
    const navigate = useNavigate();
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem("templateLayout", JSON.stringify({
                title: title,
                description: description,
                tags: tags,
                topic: topic,
                blocks: blocks
            }));
        }
    }, [blocks, isLoading, title, description, tags, topic]);
    useEffect(() => {
        if (navType === "reload") {
            const layout = localStorage.getItem("templateLayout");
            if (layout) {
                const data = JSON.parse(layout);
                setTitle(data.title);
                setDescription(data.description);
                setTags(data.tags);
                setTopic(data.topic);
                setBlocks(data.blocks)

            }
            setIsLoading(false);
        }
    }, [navType]);
    useEffect(() => {
        if (id && navType !== "reload") {
            loadTemplate();
        } else {
            setIsLoading(false);
            ConfigureUser();
        }
    }, [navType, id])
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; // Reset height
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"; // Set to scroll height
        }
    }, [description]);

    const ConfigureUser = () => {
        const user = getUserData();
        setUsername(user.username.split('@')[0]);
        const creatorId = localStorage.getItem("creatorId");
        const isAdmin = (user.roles.includes('ROLE_ADMIN'));
        console.log(user);
        if (!id || creatorId == user.id) {
            setUserStatus('creator');
        } else if (isAdmin) {
            setUserStatus('admin');
        }
    }
    const addImage = () => {
        setBlocks([
            ...blocks,
            {
                id: -1,
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
                id: -1,
                title: `Question ${blocks.length + 1}`,
                type: 'question',
                description: '',
                questionType: 'single-line',
                inputValue: '',
                options: [{index: 1, label: 'Option 1'}],
                isRequired: false,
            },
        ]);
    };
    const loadTemplate = () => {
        axios.get(`${api}/templates/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            }
        }).then((response) => {
            const data = response.data;
            localStorage.setItem("creatorId", data.creator['id']);
            setTitle(data.title);
            setDescription(data.description);
            setTags(data.tags.join(' '));
            setTopic(data.topic);
            localStorage.setItem('original', JSON.stringify(data));
            const processedBlocks = data.fields.map((field) => {
                if (field.type === "image") {
                    return {
                        type: "image",
                        id: field.id,
                        caption: field.caption || '',
                        key: field.key || '',
                        preview: getImage(field.key),
                    }
                } else return {
                    ...field,

                    options: field.options || [],
                }
            })
            ConfigureUser();
            setBlocks(processedBlocks);
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setIsLoading(false);
            return data;
        });
    }
    const createTemplate = async (e) => {
        const builder = new TemplateBuilder(blocks, title, description, createTags(), topic)
        builder.submitTemplate(e).then(response => {
                try {
                    console.log(response);
                    navigate(`/edit/${response.data.id}`);
                } catch (error) {
                    console.log(error);
                }
            }
        )
    }
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reordered = Array.from(blocks);
        const [removed] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, removed);

        setBlocks(reordered);
    };
    const createTags = () => {
        return tags
            .split(' ')
            .filter(Boolean)
    }
    const applyChanges = async (e) => {
        const updater = new TemplateUpdater(title, description, createTags(), topic, blocks, JSON.parse(localStorage.getItem("original")));
        await updater.submit(e).then((result) => {
            console.log(result);
        })
    }
    const publishForm = async (e) => {
        if (id) await applyChanges(e).then((result) => {
            navigate(`/submit/${id}`)
        })
        else {
            const builder = new TemplateBuilder(blocks, title, description, createTags(), topic)
            builder.submitTemplate(e).then(response => {
                try {
                    navigate(`/submit/${response.data.id}`)
                } catch (error) {
                    console.log(error);
                }
            })
        }
    }
    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <AppHeader className="App-header">
                <Navbar
                    save={createTemplate}
                    toggleTheme={toggleTheme}
                    userStatus={userStatus}
                    username={username}
                    editing={id != null}
                    publish={publishForm}
                    edit={applyChanges}
                    view={"redactor"}
                />
                <div className={"mt-5"}></div>
                <HeaderBlock title={title} description={description} textareaRef={textareaRef} tags={tags}
                             setTags={setTags} setDescription={setDescription}
                             setTitle={setTitle}
                             topic={topic}
                             setTopic={setTopic}
                             userStatus={userStatus}
                />
                <Toolbar toggleTheme={toggleTheme} addImage={addImage} addQuestion={addQuestion}
                         userStatus={userStatus}/>
                <Droppable droppableId="questions" direction="vertical">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {blocks.map((block, index) => (
                                <Draggable key={index} draggableId={`q-${index}`} index={index}
                                           isDragDisabled={userStatus === "viewer"}>
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
                                                setBlocks={setBlocks}
                                                userStatus={userStatus}
                                            >
                                            </Card>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}

                        </div>
                    )}
                </Droppable>
                <div className={"mt-5"}></div>
            </AppHeader>
        </DragDropContext>
    );
}