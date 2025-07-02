import {getImage, upload} from "./ImageHandler";
import axios from "axios";

export class TemplateBuilder {
    constructor(blocks, title, description, tags, topic) {
        this.blocks = blocks;
        this.title = title;
        this.description = description;
        this.tags = tags;
        this.topic = topic;
    }

    uploadImages = async () => {
        const updatedBlocks = [...this.blocks];

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
        console.log(updatedBlocks);
        return updatedBlocks;
    };

    submitTemplate = async (e) => {
        e.preventDefault();
        const api = process.env.REACT_APP_API_ADDRESS;
        const updatedBlocks = await this.uploadImages();
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
        try {
            const response = await axios.post(`${api}/templates/new`, {
                    title: this.title,
                    description: this.description,
                    tags: this.tags,
                    topic: this.topic,
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

}