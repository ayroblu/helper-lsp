import {
  Connection,
  DidChangeConfigurationNotification,
  InitializeParams,
  InitializeResult,
  TextDocumentSyncKind,
} from "vscode-languageserver";

import { getCapabilities, setCapabilities } from "./settings";

export function handleInit({
  capabilities,
}: InitializeParams): InitializeResult {
  const { hasWorkspaceFolderCapability } = setCapabilities(capabilities);

  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      // Tell the client that this server supports code completion.
      completionProvider: {
        resolveProvider: true,
      },
      ...(hasWorkspaceFolderCapability
        ? {
            workspaceFolders: {
              supported: true,
            },
          }
        : {}),
    },
  };
}
export const handleFinishInit = (connection: Connection) => () => {
  const {
    hasConfigurationCapability,
    hasWorkspaceFolderCapability,
  } = getCapabilities();
  if (hasConfigurationCapability)
    // Register for all configuration changes.
    connection.client.register(
      DidChangeConfigurationNotification.type,
      undefined
    );

  if (hasWorkspaceFolderCapability)
    connection.workspace.onDidChangeWorkspaceFolders((_event) => {
      connection.console.log("Workspace folder change event received.");
    });
};
