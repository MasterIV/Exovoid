import React from "react";
import Chapter from "../components/Chapter";

interface LorePageProps {

}
export default function LorePage({} : LorePageProps) {
    return (<React.Fragment>
        <Chapter title="A Galaxy in Flux" url={'lore/introduction.md'} columns={false}/>
        <Chapter title="Human History" url={'lore/history.md'} />
        <Chapter title="The Galactic Empire" url={'lore/empire.md'} />
    </React.Fragment>);
}