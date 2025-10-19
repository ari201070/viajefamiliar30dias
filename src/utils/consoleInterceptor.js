const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
};

let messages = [];
let listeners = [];
let nextId = 0;

const addMessage = (type, ...args) => {
  const newMessage = {
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
    console.log = (...args) => {
      originalConsole.log.apply(console, args);
      addMessage('log', ...args);
    };
    console.warn = (...args) => {
      originalConsole.warn.apply(console, args);
      addMessage('warn', ...args);
    };
    console.error = (...args) => {
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
  subscribe: (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
};