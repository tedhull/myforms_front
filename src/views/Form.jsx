import {useEffect, useRef, useState} from "react";
import '../styles/CreateTemplate.css';
import '../App.css';
import '../scripts/ImageHandler';
import {AppHeader} from "../components/AppHeader";
import axios from "axios";
import {getImage} from "../scripts/ImageHandler";
import {data, useParams} from "react-router-dom";
import {getUserData} from "../scripts/User";
import Navbar from "../components/Navbar";
import FormCard from "../components/FormCard";
import FormHeaderBlock from "../components/FormHeaderBlock";
import {validateBlock} from "../scripts/FormValidator";

export function Form({toggleTheme, redact}) {
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
    const {userId} = useParams();
    const [userStatus, setUserStatus] = useState('viewer');
    const [username, setUsername] = useState("Guest");
    const [submissionData, setSubmissionData] = useState('');
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem("formLayout", JSON.stringify({
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
            const layout = localStorage.getItem("formLayout");
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
        if (redact && navType !== "reload") {
            axios.get(`${api}/form/${id}/${userId}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                }
            }).then(response => {
                setSubmissionData(response.data);
                localStorage.setItem("submission_data", JSON.stringify(response.data));
            }).catch(error => {
                console.log(error)
            });
        }
    }, [redact, navType, api, id, userId],);
    useEffect(() => {
        if (id && navType !== "reload") {
            if (redact && submissionData !== '') loadForm();
            else if (!redact) {
                loadForm();
            }
        } else {
            setIsLoading(false);
            ConfigureUser();
        }
    }, [navType, id, submissionData])

    useEffect(() => {
        if (navType === "reload") {
            const data = JSON.parse(localStorage.getItem("submission_data"));
            if (data) setSubmissionData(data);
        }
    }, [navType])
    const ConfigureUser = () => {
        const user = getUserData();
        setUsername(user.username.split('@')[0]);
        const isAdmin = (user.roles.includes('ROLE_ADMIN'));
        if (redact && userId == user.id) {
            setUserStatus('creator');
        } else if (!redact || isAdmin) {
            setUserStatus('creator');
        }
    }

    const loadForm = async () => {
        axios.get(`${api}/templates/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            }
        }).then((template) => {
            const data = template.data;
            localStorage.setItem("creatorId", data.creator['id']);
            setTitle(data.title);
            setDescription(data.description);
            const tagged = data.tags.map(tag => `#${tag}`)
            setTags(tagged.join(' '));
            setTopic(data.topic);
            const fieldValues = submissionData.data ? JSON.parse(submissionData.data.fields) : [];
            localStorage.setItem('original', JSON.stringify(data));
            const processedBlocks = data.fields.map((field) => {
                const match = fieldValues ? fieldValues.find(value => value.question.id === field.id) : false;
                if (field.type === "image") {
                    return {
                        type: "image",
                        caption: field.caption || '',
                        key: field.key || '',
                        preview: getImage(field.key),
                    }
                } else return {
                    ...field,
                    inputValue: match ? match.value[0] : '',
                    options: field.options || [],
                }
            })
            ConfigureUser();
            setBlocks(processedBlocks);
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            setIsLoading(false);
            return data;
        });
    }
    const submitForm = () => {

        const updatedBlocks = blocks.map((block) => {
            if (!validateBlock(block)) {
                return {...block, error: "Invalid Value"};
            } else {
                return {...block, error: null};
            }
        });
        setBlocks(updatedBlocks);
        const hasErrors = updatedBlocks.some(block => block.error !== null);
        if (hasErrors) return;

        const questions = blocks.filter(block => block.type === "question");
        const formJson = questions.map(question => ({
            type: question.questionType,
            value: question.inputValue,
            id: question.id,
        }));
        axios.post(`${api}/form/submit`, {
            templateId: id,
            userId: redact ? userId : null,
            formData: formJson
        }, {
            headers: {
                contentType: "application/json",
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            }
        })
            .catch((error) => {
                console.log(error);
            })
    }
    return (
        <div>
            <AppHeader className="App-header">
                <Navbar
                    toggleTheme={toggleTheme}
                    userStatus={userStatus}
                    username={username}
                    submit={submitForm}
                    editing={id != null}
                    view={"form"}
                />
                <div className={"mt-5"}></div>
                <FormHeaderBlock title={title} description={description} textareaRef={textareaRef} tags={tags}
                                 setTags={setTags} setDescription={setDescription}
                                 setTitle={setTitle}
                                 topic={topic}
                                 setTopic={setTopic}
                                 userStatus={userStatus}
                />
                <div>
                    {blocks.map((block, index) => (
                        <div
                            className="container mt-5 d-flex justify-content-center"
                        >
                            <FormCard
                                block={block}
                                index={index}
                                blocks={blocks}
                                setBlocks={setBlocks}
                                userStatus={userStatus}
                                restricted={userStatus === 'viewer'}
                            >
                            </FormCard>
                        </div>
                    ))}
                </div>
                <div className={"mt-5"}></div>
            </AppHeader>
        </div>
    );
}