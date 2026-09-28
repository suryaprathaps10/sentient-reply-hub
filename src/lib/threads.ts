import type { ChatMessage } from "./chat-engine";

export type Thread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: ChatMessage[];
};

const KEY = "sps-cv-chat-threads";

export function isBrowser() {
  return typeof window !== "undefined";
}

export function newId() {
  if (isBrowser() && window.crypto?.randomUUID) return window.crypto.randomUUID().slice(0, 8);
  return Math.random().toString(36).slice(2, 10);
}

export function loadThreads(): Thread[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Thread[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveThreads(threads: Thread[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(threads));
  } catch {
    /* storage full or blocked — chat still works in memory */
  }
}

export function upsertThread(thread: Thread): Thread[] {
  const rest = loadThreads().filter((t) => t.id !== thread.id);
  const next = [thread, ...rest].sort((a, b) => b.updatedAt - a.updatedAt);
  saveThreads(next);
  return next;
}

export function deleteThread(id: string): Thread[] {
  const next = loadThreads().filter((t) => t.id !== id);
  saveThreads(next);
  return next;
}

export function createThread(id = newId()): Thread {
  return { id, title: "New chat", updatedAt: Date.now(), messages: [] };
}
