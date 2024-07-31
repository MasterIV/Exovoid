import React from "react";
import {Tree, TreeNode} from "react-organizational-chart";
import {Paper, Typography} from "@mui/material";

interface TalentProps {
    name?: string;
    description?: string;
}

function Talent({name, description}: TalentProps) {
    return (<Paper className='talent'>
        <Typography variant={"subtitle1"}>{name}</Typography>
        <Typography variant={"caption"}>{description}</Typography>
    </Paper>);
}

function generateChildren() {
    return [
        <TreeNode label={<Talent name='Fooo' description='This is a description telling what the talent is doing. It can be quite a bit loinger as marcel is not good in keeping things short.' />}>
            <TreeNode label={<Talent name='Dual Wield' description='Lorem ipsum dolor sit amet!' />} />
        </TreeNode>,
        <TreeNode label={<Talent name='Dual Wield' description='Lorem ipsum dolor sit amet!' />} >
            <TreeNode label={<Talent name='Fooo' description='This is a description telling what the talent is doing. It can be quite a bit loinger as marcel is not good in keeping things short.' />} />
            <TreeNode label={<Talent name='Fooo' description='This is a description telling what the talent is doing. It can be quite a bit loinger as marcel is not good in keeping things short.' />} />
        </TreeNode>,
    ];
}

interface ProfessionProps {
    name: string;
}

export default function Profession({name} : ProfessionProps) {
    return (<Tree label={<Talent name={name} />}>
        {generateChildren()}
    </Tree>);
}