import {
  ClientCapabilities,
  Connection,
  DidChangeConfigurationParams,
  TextDocuments,
} from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";

import { validateTextDocument } from "./validation";

type Settings = {
  maxNumberOfProblems: number;
};
// The global settings, used when the `workspace/configuration` request is not supported by the client.
const defaultSettings: Settings = { maxNumberOfProblems: 1000 };
let globalSettings: Settings = defaultSettings;

// Cache the settings of all open documents
const documentSettings: Map<string, Thenable<Settings>> = new Map();

export const handleConnectionConfigurationChange = (
  connection: Connection,
  documents: TextDocuments<TextDocument>
) => (change: DidChangeConfigurationParams) => {
  if (getCapabilities().hasConfigurationCapability)
    // Reset all cached document settings
    documentSettings.clear();
  else
    globalSettings = <Settings>(
      (change.settings.languageServerExample || defaultSettings)
    );

  // Revalidate all open text documents
  documents.all().forEach(validateTextDocument(connection));
};

export const getDocumentSettings = (connection: Connection) => (
  resource: string
): Thenable<Settings> => {
  if (!getCapabilities().hasConfigurationCapability)
    return Promise.resolve(globalSettings);

  let result = documentSettings.get(resource);
  if (!result) {
    result = connection.workspace
      .getConfiguration({
        scopeUri: resource,
        section: "languageServerExample",
      })
      .then((config) => ({ ...defaultSettings, ...config }));
    documentSettings.set(resource, result);
  }
  return result;
};

export const deleteDocumentSettings = (uri: string) => {
  documentSettings.delete(uri);
};

type Capabilities = {
  hasConfigurationCapability: boolean;
  hasWorkspaceFolderCapability: boolean;
  hasDiagnosticRelatedInformationCapability: boolean;
};
let _capabilities: Capabilities = {
  hasConfigurationCapability: false,
  hasWorkspaceFolderCapability: false,
  hasDiagnosticRelatedInformationCapability: false,
};
export const setCapabilities = (
  capabilities: ClientCapabilities
): Capabilities => {
  _capabilities = {
    // Does the client support the `workspace/configuration` request?
    // If not, we fall back using global settings.
    hasConfigurationCapability: !!(
      capabilities.workspace && !!capabilities.workspace.configuration
    ),
    hasWorkspaceFolderCapability: !!(
      capabilities.workspace && !!capabilities.workspace.workspaceFolders
    ),
    hasDiagnosticRelatedInformationCapability: !!(
      capabilities.textDocument &&
      capabilities.textDocument.publishDiagnostics &&
      capabilities.textDocument.publishDiagnostics.relatedInformation
    ),
  };
  return _capabilities;
};
export function getCapabilities(): Capabilities {
  return _capabilities;
}
