'use strict';
import * as vscode from 'vscode';
import bedrockRunner from './bedrock';

export function activate(context: vscode.ExtensionContext) {
    const runBedrockManual = vscode.commands.registerCommand(
      'extension.runBedrockManual', bedrockRunner('bedrock', [], )
    );
    const runBedrockManualCustomRoutes = vscode.commands.registerCommand(
      'extension.runBedrockManualCustomRoutes', bedrockRunner('bedrock', [], {customRoutes: true})
    );
    const runBedrockManualTestDir = vscode.commands.registerCommand(
      'extension.runBedrockManualTestDir', bedrockRunner('bedrock', [], {runDir: true})
    );
    const runBedrockManualTestDirCustomRoutes = vscode.commands.registerCommand(
      'extension.runBedrockManualTestDirCustomRoutes', bedrockRunner('bedrock', [], {runDir: true, customRoutes: true})
    );
    const runBedrockPhantom = vscode.commands.registerCommand(
      'extension.runBedrockPhantom', bedrockRunner('bedrock-auto', ['-b phantomjs'])
    );

    context.subscriptions.push(
      runBedrockManual,
      runBedrockManualCustomRoutes,
      runBedrockManualTestDir,
      runBedrockManualTestDirCustomRoutes,
      runBedrockPhantom
    );
}

// this method is called when your extension is deactivated
export function deactivate() {
}