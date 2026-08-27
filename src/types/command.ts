export type CommandGroup = 'Recent' | 'Navigate' | 'Works' | 'Live' | 'Press' | 'Actions';

interface CommandBase {
  id: string;
  title: string;
  subtitle?: string;
  keywords?: string[];
  text?: string[];
  group: CommandGroup;
}

// A route or in-page section the palette jumps to (path, optionally with a hash).
export interface NavigateCommand extends CommandBase {
  kind: 'navigate';
  to: string;
}

// A catalog item (release, live event, press quote) deep-linked from search.
export interface ResultCommand extends CommandBase {
  kind: 'result';
  to: string;
}

// Anything the palette *does* rather than navigates to. `external` links open in
// a new tab; `run` may be async so the execute path can await it.
export interface ActionCommand extends CommandBase {
  kind: 'action';
  run: () => void | Promise<void>;
  external?: boolean;
}

export type Command = NavigateCommand | ResultCommand | ActionCommand;
