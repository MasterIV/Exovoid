import React, {useCallback} from 'react';
import Chapter from "./components/Chapter";
import {Container, Grid } from "@mui/material";

import attributes from './data/attributes.json';
import Value from "./components/Value";

interface attribute {
    name: string,
    description: string,
}

function App() {
    const [stats, setStats] = React.useState({});

    const onChange = useCallback((name:string, value:number) => {
        setStats({...stats, [name]: value});
    }, [stats]);

    return (
        <Container maxWidth='xl'>
            <Grid container spacing={2} margin={1}>
                {Object.keys(attributes).map((a: string) => {
                    const {name} = attributes[a as keyof typeof attributes];
                    const value = stats[a as keyof typeof stats] || 0;

                    return (<Grid item>
                        <Value key={a} name={a} label={name} value={value} onChange={onChange} />
                    </Grid>);
                })}
            </Grid>

            <Chapter url={'lore/history.md'} />
        </Container>
    );
}

export default App;
