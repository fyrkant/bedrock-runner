import * as vscode from 'vscode';
import { spawnCommand } from './spawn-command';

let terminal: vscode.Terminal;
let commandOutput: vscode.OutputChannel;

function run(cmd: string, cwd: string) {
  commandOutput = commandOutput ? commandOutput : vscode.window.createOutputChannel('bedrock phantom');
  return new Promise((accept, reject) => {
    const opts: any = {};

    commandOutput.clear();
    commandOutput.show();
    commandOutput.append('Running: ' + cmd + '\n');

    const process = spawnCommand(cmd, {cwd: vscode.workspace.rootPath});
    function printOutput(data: any) {
      commandOutput.append(data.toString());
    }
    process.stdout.on('data', printOutput);
    process.stderr.on('data', printOutput);
    process.on('close', (status: string) => {
      if (status) {
        reject(`Command \`${cmd}\` exited with status code ${status}.`);
      } else {
        accept();
      }
      process.kill();
    });
  });
}

const getClosestTestDir = (path: string) => {
  const arr = path.split('/');
  const testIndex = arr.findIndex((x) => x === 'test');

  return testIndex ? arr.slice(0, testIndex + 1).join('/') : path;
};

interface Options {
  runDir?: boolean;
  customRoutes?: boolean;
}

const getCustomRoute = (shouldGetRoute: boolean) => shouldGetRoute && vscode.window.showInputBox({value: 'src/core/test/json/routes.json'});

const bedrockRunner = (executable: string, args: string[], options: Options = {runDir: false, customRoutes: false}) => async () => {
  const editor = vscode.window.activeTextEditor;
  if (! editor) { return; }

  const path = options.runDir ? getClosestTestDir(editor.document.fileName) :  editor.document.fileName;

  const customRoute = await getCustomRoute(options.customRoutes === true);
  const customRoutesCommand = options.customRoutes && customRoute ? `--customRoutes ${customRoute}` : '';
  const terminalCommand = `node_modules/.bin/${executable} ${args.join(' ')} -${ options.runDir ? 'd' : 'f' } "${path}" ${customRoutesCommand}`;

  if (executable === 'bedrock-auto') {
    run(terminalCommand, '')
      // .then((x) => console.log(x))
      .catch((error) => console.error(error));
  } else {
    terminal = terminal !== undefined ? terminal : vscode.window.createTerminal('bedrock');
    terminal.sendText(terminalCommand);
    terminal.show();
  }
};

export default bedrockRunner;