import React, {useEffect, useState} from "react";
import axios from "axios";
import Markdown from "react-markdown";

interface ChapterProps {
    url: string
}
export default function({url}: ChapterProps) {
    const [text, setText] = useState("");

    useEffect(() => {
        axios
            .get(url)
            .then(res => setText(res.data));
    });

    return (
        <div>
            <Markdown>{text}</Markdown>
        </div>
    );
}