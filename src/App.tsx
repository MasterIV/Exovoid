import React, {useCallback} from 'react';
import Chapter from "./components/Chapter";
import {Container, Grid } from "@mui/material";

function App() {
    const [stats, setStats] = React.useState({});

    const onChange = useCallback((name:string, value:number) => {
        setStats({...stats, [name]: value});
    }, [stats]);

    return (
        <Container maxWidth='md'>
            <Chapter title="A Galaxy in Flux" url={'lore/introduction.md'} columns={false}/>
            <Chapter title="Human History" url={'lore/history.md'} />
            <Chapter title="The Galactic Empire" url={'lore/empire.md'} />
        </Container>
    );
}

export default App;
