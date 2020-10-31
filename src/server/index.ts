import {
  createConnection,
  ProposedFeatures,
  TextDocuments,
} from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";

import { handleCompletion, handleCompletionResolve } from "./completion";
import { handleFinishInit, handleInit } from "./init";
import {
  deleteDocumentSettings,
  handleConnectionConfigurationChange,
} from "./settings";
import { validateTextDocument } from "./validation";

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize(handleInit);

connection.onInitialized(handleFinishInit(connection));

connection.onDidChangeConfiguration(
  handleConnectionConfigurationChange(connection, documents)
);

// Only keep settings for open documents
documents.onDidClose((e) => {
  deleteDocumentSettings(e.document.uri);
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(({ document }) => {
  validateTextDocument(connection)(document);
});

connection.onDidChangeWatchedFiles((_change) => {
  // Monitored files have change in VSCode
  connection.console.log("We received an file change event");
});

// This handler provides the initial list of the completion items.
connection.onCompletion(handleCompletion(documents));

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve(handleCompletionResolve);

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
