import React from "react";

interface CollectionProps {
    values: Record<string, any>[];
    onChange: (values: object[]) => void;
    component: React.ElementType;
    [key: string]: any;
}

export default function Collection({values, component, onChange, ...props}: CollectionProps) {
    // add element

    const changeElement = (index: number, name: string, value: any) => {
        values[index][name] = value;
        onChange(values)
    };

    const removeElement = (index: number) => {
        values.splice(index, 1);
        onChange(values);
    }

    const Component = component;
    return values.map((value, i) => <Component
        {...props}
        {...value}
        key={value.id}
        onChange={(n:string,v:string) => changeElement(i,n,v)}
        onRemove={() => removeElement(i)} />);
}
