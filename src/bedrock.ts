import * as vscode from 'vscode';
import * as spawnCmd from 'spawn-command/lib/spawn-command';

let terminal: vscode.Terminal;
let commandOutput;

function run(cmd:string, cwd:string) {
  commandOutput = commandOutput ? commandOutput : vscode.window.createOutputChannel('bedrock phantom');
  return new Promise((accept, reject) => {
    var opts : any = {};

    commandOutput.clear();
    commandOutput.show();
    commandOutput.append('Running: ' + cmd + '\n')

    let process = spawnCmd(cmd, {cwd: vscode.workspace.rootPath});
    function printOutput(data) { 
      commandOutput.append(data.toString());
    }
    process.stdout.on('data', printOutput);
    process.stderr.on('data', printOutput);
    process.on('close', (status) => {
      if (status) {
        reject(`Command \`${cmd}\` exited with status code ${status}.`);
      } else {
        accept();
      }
      process = null;
    });
  });
}

const getClosestTestDir = path => {
  const arr = path.split('/');
  const testIndex = arr.findIndex(x => x === 'test');

  return testIndex ? arr.slice(0, testIndex + 1).join('/') : path;
}

const bedrockRunner = (executable: string, args: string[], runDir: boolean) => () => {
  const editor = vscode.window.activeTextEditor;
  if (! editor) return;

  const fileName = runDir ? getClosestTestDir(editor.document.fileName) :  editor.document.fileName;
  const terminalCommand = `node_modules/.bin/${executable} ${args.join(' ')} -${ runDir ? 'd' : 'f' } ${fileName}`;
  
  if (executable === 'bedrock-auto') {
    run(terminalCommand, '').then(x => console.log('hej', x)).catch(_ => () => {});
  } else {
    terminal = terminal !== undefined ? terminal : vscode.window.createTerminal('bedrock');
    terminal.sendText(terminalCommand);
    terminal.show();
  }
}

export default bedrockRunner;