import axios from "axios";

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

    submit = async (e) => {
        const api = process.env.REACT_APP_API_ADDRESS;
        e.preventDefault();
        const originalBlocks = this.original.fields;
        this.blocks.map((block, index) => {
            block.position = index;
        })
        const getChangedBlocks = () => {
            return this.blocks.filter((block, i) => {
                const original = originalBlocks[i];
                if (!original) return true; // New block
                return JSON.stringify(block) !== JSON.stringify(original);
            });
        };
        const getDeletedBlockIds = () => {
            const currentKeys = this.blocks.map(b => b.id);
            return originalBlocks
                .filter(orig => !currentKeys.includes(orig.id))
                .map(orig => orig.id);
        };
        if (!this.hasChanges(getChangedBlocks(), getDeletedBlockIds())) {
            return {
                message: "update denied"
            };
        }
        try {
            const response = await axios.put(`${api}/templates/update/${this.id}`, {
                updatedBlocks: getChangedBlocks(),
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
            })
            return response;

        } catch (error) {
            console.error(error);
        }
    }

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