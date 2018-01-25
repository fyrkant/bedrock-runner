import { spawn } from 'child_process';

export const spawnCommand = (command: string, options: any) => {
  let file, args;
  if (process.platform === 'win32') {
    file = 'cmd.exe';
    args = ['/s', '/c', '"' + command + '"'];
    options = {...options};
    options.windowsVerbatimArguments = true;
  } else {
    file = '/bin/sh';
    args = ['-c', command];
  }
  return spawn(file, args, options);
};