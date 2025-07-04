export const validateBlock = (block) => {
    if (block.isRequired) {
        if (
            block.inputValue === null ||
            block.inputValue === undefined ||
            block.inputValue === "" ||
            (Array.isArray(block.inputValue) && block.inputValue.length === 0)
        ) {
            return false;
        }
    }
    return true;
};
