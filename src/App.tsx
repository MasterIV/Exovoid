import React, {useCallback} from 'react';
import CharacterType from "./types/character";
import Game from "./Game";

function App() {
    const [stats, setStats] = React.useState<CharacterType>({
        id: "",
        name: "",
        table: "",
        exp: 0,
        currentHealth: 0,
        currentEdge: 0,
        attributes: {INT:3, STR:3, COO:3, CON:3, AGI:3, EDU:3, PER:3},
        skills: {}
    });

    const onChange = useCallback((name: string, value: any) => {
        setStats({...stats, [name]: value});
    }, [stats]);

    return <Game character={stats} onChange={onChange} />;
}

export default App;
