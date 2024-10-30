import React, { useEffect, useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";

interface ChapterProps {
  title: string;
  url: string;
  columns?: boolean;
}
export default function ({ url, title, columns = true }: ChapterProps) {
  const [text, setText] = useState("");

  useEffect(() => {
    axios.get(url).then((res) => setText(res.data));
  });

  const className: string = columns ? "chapter" : "";

  return (
    <div>
      <h2>{title}</h2>
      <Markdown className={className}>{text}</Markdown>
    </div>
  );
}
