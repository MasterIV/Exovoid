import React, {useCallback} from "react";

function CollectionItem({component, index, onChange, onRemove, ...props}: any) {
    const changeElement = useCallback((k: string, v:string) =>  onChange(index, k, v), [onChange, index]);
    const removeElement = useCallback(() => onRemove(index), [onRemove, index]);

    const Component = component;
    return <Component
        {...props}
        onChange={changeElement}
        onRemove={removeElement} />
}

interface CollectionProps {
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

export default React.memo(function Collection({values, onChange, ...props}: CollectionProps) {
    // add element

    const changeElement = useCallback((index: number, name: string, value: any) => {
        values[index][name] = value;
        onChange([...values])
    }, [onChange, values]);

    const removeElement = useCallback((index: number) =>  {
        values.splice(index, 1);
        onChange([...values]);
    }, [onChange, values]);

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
