import React from "react";
import Chapter from "../components/Content/Chapter";

interface LorePageProps {

}
export default function LorePage({} : LorePageProps) {
    return (<React.Fragment>
        <Chapter title="A Galaxy in Flux" url={'lore/introduction.md'} columns={false}/>
        <Chapter title="Human History" url={'lore/history.md'} />
        <Chapter title="The Galactic Empire" url={'lore/empire.md'} />
        <Chapter title="The Hegemony" url={'lore/hegemony.md'} />
        <Chapter title="The Elders" url={'lore/elders.md'} />
        <Chapter title="Technology in the Galaxy" url={'lore/technology.md'} />
    </React.Fragment>);
}