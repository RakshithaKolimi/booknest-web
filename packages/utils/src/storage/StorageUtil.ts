// src/utils/storage.ts
export const safeLocalStorage = {
  get(key: string) {
    return window.localStorage.getItem(key)
  },
  set(key: string, value: string) {
    return window.localStorage.setItem(key, value)
  },
  remove(key: string) {
    return window.localStorage.removeItem(key)
  },
}
