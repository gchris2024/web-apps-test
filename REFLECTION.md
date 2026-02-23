### Q1 — Reactivity

When you type inside the `<textarea>`, the character counter updates automatically because the `stickies` array changes, and that array is tracked via a `v-model`, automatically tracking its state and reacting to changes.

### Q2 - Deep Watch

`deep: true` allows Vue to track properties that are nested within a specified object or array. If we were to remove it, text in the sticky notes would not persist after refresh.

### Q3 — localStorage

1. localStorage stores key-value pairs.
2. We use `JSON.stringify()` when saving to save String text in localStorage.
3. If we forgot `JSON.parse()` when loading, we'd be storing strings in the `stickies` array instead of objects.

### Q4 — Delete logic

Given

```js
deleteStickie(id) {
this.stickies = this.stickies.filter(s => s.id !== id);
}
```

`.filter()` returns a new array that only contains the items that pass a condition. We use `s.id !== id` and not `s.id === id` so we keep all notes except the one we want to delete.

### Q5 — Architecture decision

Saving implemented in a separate method ( `saveToStorage` ) instead of writing localStorage
code directly in the watcher to have a clear separation of concerns (modularizing small snippets).

### AI Use

See `ai-log.txt`
