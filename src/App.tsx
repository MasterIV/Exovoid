import React, {useEffect, useState} from 'react';
import Markdown from 'react-markdown';
import axios from 'axios';

function App() {
    const [text, setText] = useState("");

    useEffect(() => {
        axios
            .get('lore/history.md')
            .then(res => setText(res.data));
    });

    return (
        <div>
            <Markdown>{text}</Markdown>
        </div>
    );
}

export default App;
