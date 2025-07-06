import axios from "axios";
import {getImage, upload} from "./ImageHandler";

export class TemplateUpdater {
    constructor(title, description, tags, topic, blocks, original) {
        this.title = title;
        this.description = description;
        this.tags = tags;
        this.topic = topic;
        this.blocks = blocks;
        this.original = original;
        this.id = original.id;
    }

    uploadImages = async (blocks) => {
        const updatedBlocks = [...blocks];

        await Promise.all(updatedBlocks.map(async (block, i) => {
            if (block.type === 'image' && block.file instanceof File) {
                try {
                    const key = await upload(block.file);
                    updatedBlocks[i].key = key;
                    updatedBlocks[i].preview = getImage(key);
                    console.log(key);
                    delete updatedBlocks[i].file;
                } catch (err) {
                    console.error('Upload failed for', block, err);
                }
            }
        }));
        return updatedBlocks;
    };

    submit = async (e) => {
        e.preventDefault();
        const api = process.env.REACT_APP_API_ADDRESS;
        const originalBlocks = this.original.fields;
        this.blocks.map((block, index) => {
            block.position = index;
        })

        const getDeletedBlockIds = () => {
            const currentKeys = this.blocks.map(b => b.id);
            return originalBlocks
                .filter(orig => !currentKeys.includes(orig.id))
                .map(orig => orig.id);
        };
        if (!this.hasChanges(this.getChangedBlocks(this.original.fields,this.blocks), getDeletedBlockIds())) {
            return {
                message: "no changes detected"
            };
        }
        const updatedBlocks = await this.uploadImages(this.getChangedBlocks(this.original.fields,this.blocks), getDeletedBlockIds());
        try {
            return await axios.put(`${api}/templates/update/${this.id}`, {
                updatedBlocks: updatedBlocks,
                deletedBlockIds: getDeletedBlockIds(),
                title: this.title,
                description: this.description,
                tags: this.tags,
                topic: this.topic,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
                }
            });

        } catch (error) {
            return error;
        }
    }

    getChangedBlocks = (originalBlocks, blocks) => {
        return blocks.filter((block, i) => {
            const original = originalBlocks[i];
            if (!original) return true; // New block
            return JSON.stringify(block) !== JSON.stringify(original);
        });
    };

    hasChanges = (updatedBlocks, deletedIds) => {
        return updatedBlocks.length > 0
            || deletedIds.length > 0
            || this.original.title !== this.title
            || this.original.description !== this.description
            || this.original.topic !== this.topic
            || !this.arraysEqual(this.original.tags, this.tags)
    }

    arraysEqual = (arr1, arr2) => {
        return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
    }

}

export class FormUpdater extends TemplateUpdater {
    constructor(original, updated) {
        super();
        this.original = original;
        this.updated = updated
    }

    submit = async (e) => {
        if (super.arraysEqual(this.original, this.updated)) return {
            message: "no changes detected"
        }
        const api = process.env.REACT_APP_API_ADDRESS;
        const updatedBlocks = super.getChangedBlocks(this.original,this.updated);
        return axios.post()
    }
}