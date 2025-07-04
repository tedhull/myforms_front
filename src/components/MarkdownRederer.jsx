import {marked} from "marked";
import DOMPurify from "dompurify"; // recommended for XSS protection

export default function MarkdownRenderer({markdownText}) {
    const getHtml = () => {
        const rawHtml = marked(markdownText || "");
        return DOMPurify.sanitize(rawHtml); // prevents script injection
    };

    return (
        <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{__html: getHtml()}}
        />
    );
}
