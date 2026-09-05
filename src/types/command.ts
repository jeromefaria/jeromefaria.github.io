export type CommandGroup = 'Recent' | 'Now Playing' | 'Navigate' | 'Works' | 'Live' | 'Press' | 'Actions';

interface CommandBase {
  id: string;
  title: string;
  subtitle?: string;
  keywords?: string[];
  text?: string[];
  group: CommandGroup;
}

export interface NavigateCommand extends CommandBase {
  kind: 'navigate';
  to: string;
  englishOnly?: boolean;
}

export interface ResultCommand extends CommandBase {
  kind: 'result';
  to: string;
}

export interface ActionCommand extends CommandBase {
  kind: 'action';
  run: () => void | Promise<void>;
  external?: boolean;
  transient?: boolean;
}

export type Command = NavigateCommand | ResultCommand | ActionCommand;
