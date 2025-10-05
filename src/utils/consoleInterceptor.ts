interface ConsoleMessage {
  id: number;
  type: 'log' | 'warn' | 'error';
  message: any[];
  timestamp: Date;
}

const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
};

let messages: ConsoleMessage[] = [];
let listeners: ((msgs: ConsoleMessage[]) => void)[] = [];
let nextId = 0;

const addMessage = (type: ConsoleMessage['type'], ...args: any[]) => {
  const newMessage: ConsoleMessage = {
    id: nextId++,
    type,
    message: args,
    timestamp: new Date(),
  };
  messages = [...messages, newMessage].slice(-100); // Keep last 100 messages
  listeners.forEach(listener => listener(messages));
};

export const consoleInterceptor = {
  start: () => {
    console.log = (...args: any[]) => {
      originalConsole.log.apply(console, args);
      addMessage('log', ...args);
    };
    console.warn = (...args: any[]) => {
      originalConsole.warn.apply(console, args);
      addMessage('warn', ...args);
    };
    console.error = (...args: any[]) => {
      originalConsole.error.apply(console, args);
      addMessage('error', ...args);
    };
  },
  stop: () => {
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  },
  getMessages: () => messages,
  subscribe: (listener: (msgs: ConsoleMessage[]) => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
};