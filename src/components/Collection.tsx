import React from "react";

interface CollectionProps {
    values: object[];
    onChange: (value: any) => void;
    component: React.ElementType;
    [key: string]: any;
}

export default function Collection({values, component, onChange, ...props}: CollectionProps) {
    // add element
    // change element
    // remove element


    const Component = component;
    return values.map((value) => <Component {...props} {...value} />);
}