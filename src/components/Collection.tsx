import React from "react";

const CollectionItem = React.memo(({component, index, onChange, onRemove, ...props}: any) => {
    const changeElement = (k: string, v:string) =>  onChange(index, k, v);
    const removeElement = () => onRemove(index);

    const Component = component;
    return <Component
        {...props}
        onChange={changeElement}
        onRemove={removeElement} />
});

interface CollectionProps {
    id: string;
    values: Record<string, any>[];
    onChange: (values: object[]) => void;
    component: React.ElementType;
    [key: string]: any;
}

export interface CollectionItemPros {
    onChange: (name: string, value: any) => void;
    onRemove: () => void;
    index: number;
}

const cache: Record<string,{
    values: Record<string, any>[];
    onChange: (index: number, name: string, value: any) => void;
    onRemove: (index: number) => void;
}> = {};

export default React.memo(function Collection({id, values, onChange, ...props}: CollectionProps) {
    if(!cache[id]) {
        cache[id] = {
            values,
            onChange: (index: number, name: string, value: any) => {
                const updated = [...cache[id].values];
                updated[index] = {...updated[index], [name]: value };
                onChange(updated)
            },
            onRemove: (index: number) =>  {
                const updated = [...cache[id].values];
                updated.splice(index, 1);
                onChange(updated);
            }
        }
    } else if(id) {
        cache[id].values = values;
    }

    const {
        onChange: changeElement,
        onRemove: removeElement
    } = cache[id];

    return <>
        {values.map((value, i) => <CollectionItem
        {...props}
        {...value}
        key={value.id}
        index={i}
        onChange={changeElement}
        onRemove={removeElement} />)}
    </>;
});
