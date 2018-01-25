'use strict';
import * as vscode from 'vscode';
import bedrockRunner from './bedrock';

export function activate(context: vscode.ExtensionContext) {
    const runBedrockManual = vscode.commands.registerCommand(
      'extension.runBedrockManual', bedrockRunner('bedrock', [], false)
    );
    const runBedrockManualTestDir = vscode.commands.registerCommand(
      'extension.runBedrockManualTestDir', bedrockRunner('bedrock', [], true)
    );
    const runBedrockPhantom = vscode.commands.registerCommand(
      'extension.runBedrockPhantom', bedrockRunner('bedrock-auto', ['-b phantomjs'], false)
    );

    context.subscriptions.push(
      runBedrockManual,
      runBedrockManualTestDir,
      runBedrockPhantom
    );
}

// this method is called when your extension is deactivated
export function deactivate() {
}