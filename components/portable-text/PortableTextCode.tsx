import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism"; TODO how to set font size w/o changing theme?
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

export function PortableTextCode({ value }: any) {
  if (!value || !value.code) {
    return null;
  }
  const { language, code } = value;
  return (
    <SyntaxHighlighter
      language={language || "text"}
      style={atomDark}
      wrapLongLines={true}
      showLineNumbers={false}
      className="rounded-lg text-lg"
    >
      {code}
    </SyntaxHighlighter>
  );
}
