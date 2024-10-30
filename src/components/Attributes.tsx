import { Grid } from "@mui/material";
import attributes from "../data/attributes.json";
import Value from "./Value";
import React from "react";
import AttributeType from "../types/attributes";

interface AttributesProps {
  onChange: (name: string, value: number) => void;
  values: AttributeType;
  locked?: boolean;
}

export default React.memo(function Attributes({
  values,
  onChange,
  locked = false,
}: AttributesProps) {
  return (
    <Grid item container spacing={2} justifyContent={"center"}>
      {Object.keys(attributes).map((a: string) => {
        const { name } = attributes[a as keyof typeof attributes];
        const value = values[a as keyof typeof values] || 0;

        return (
          <Grid key={a} item>
            <Value
              disabled={locked}
              name={a}
              label={name}
              value={value}
              onChange={onChange}
            />
          </Grid>
        );
      })}
    </Grid>
  );
});
