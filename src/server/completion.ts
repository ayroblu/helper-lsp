import md5 from "md5";
import {
  CompletionItem,
  CompletionItemKind,
  CompletionParams,
  TextDocuments,
} from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";

/**
 * Theory: List all possible completions in that scope
 * Because I'm working on a per file basis really, show next line completions
 * hashes, this can just be one item?
 */
export const completions: CompletionItem[] = [
  {
    label: "TypeScript",
    kind: CompletionItemKind.Text,
    data: 1,
  },
  {
    label: "JavaScript",
    kind: CompletionItemKind.Text,
    data: 2,
  },
];

export const handleCompletion = (documents: TextDocuments<TextDocument>) => ({
  position,
  textDocument,
}: CompletionParams): CompletionItem[] => {
  const doc = documents.get(textDocument.uri)?.getText();
  if (!doc) return [];
  const lines = doc.split("\n");

  if (position.line === lines.length - 1)
    // Can't complete last line as we need to check the next line
    return [];

  return [
    {
      label: `hash-${md5(lines[position.line]).slice(0, 8)}`,
      kind: CompletionItemKind.Text,
      data: 1,
    },
  ];
};

export const handleCompletionResolve = (
  item: CompletionItem
): CompletionItem => {
  if (item.data === 1) {
    item.detail = "TypeScript details";
    item.documentation = "TypeScript documentation";
  } else if (item.data === 2) {
    item.detail = "JavaScript details";
    item.documentation = "JavaScript documentation";
  }
  return item;
};
