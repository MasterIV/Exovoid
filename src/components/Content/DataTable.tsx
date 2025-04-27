import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import React from "react";

interface DataTableProps {
    title: string;
    data: any[];
    hide?: string[];
    renderers?: Record<string, (v: any) => string | JSX.Element>;
    labels?: Record<string, string>;
}

function ucFirst(val: string) {
    return val.charAt(0).toUpperCase() + val.slice(1);
}

export default function DataTable({title, data, hide = [], renderers = {}, labels = {}}: DataTableProps) {
    const columns = Object.keys(data[0]).filter(c => !hide.includes(c));

    return <Accordion>
        <AccordionSummary>{title}</AccordionSummary>
        <AccordionDetails>
            <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map(c => <TableCell key={c}>{ucFirst(c)}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map(r => <TableRow>
                        {columns.map(c => <TableCell>{renderers[c] ? renderers[c](r[c]) :String(r[c])}</TableCell>)}
                    </TableRow>)}
                </TableBody>
            </Table>
            </TableContainer>
        </AccordionDetails>
    </Accordion>
}