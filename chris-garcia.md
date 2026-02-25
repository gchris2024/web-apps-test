# Quiz Answers

**Name:** Chris Garcia

**Date:** 25 Feb 2026

## Q1

B

## Q2

The flaw is that `wordCounts` returns an array indexed by position, not by note identity. If at any point the sizes of the arrays `wordCounts[]` and `stickies[]` were to change, the displayed word count might be associated with the wrong note. The orgiinal app avoids this by computing the (character) count **per note**. Therefore, to fix this without significantly restructuring the template, I would follow the same pattern as we did with the method `charCount(text)`:

```js
  wordCount(text) {
    const trimmed = text.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0
  }
```

## Q3

B

## Q4

Part A: Yes, the watcher will correctly persist the cleared state to localStorage. First, the array is set to an empty array (`this.stickies = []`). Next, the watcher is triggered, causing the handler to call `this.saveToStorage()`. Finally, `saveToStorage()` calls one line,

```js
localStorage.setItem(this.storageKey, JSON.stringify(this.stickies));
```

persisting the empty array into `localStorage`. The main difference is that in this implementation, the key still exists in `localStorage`

Part B: Even though part A works, a real issue appears if `saveToStorage()` ever changes to skip saving when the array is empty. In that case, the method `clearAll()` would not overwrite `localStorage`, and the old notes would reappear on page reload.

Calling `localStorage.removeItem("this.storageKey")` explicitly guarantees storage is truly cleared, independent of watcher or save logic changes.

## Q5

A

## Q6

```js
loadFromStorage() {
  // Load notes from localStorage
  const storedStickies = localStorage.getItem(this.storageKey);
  this.stickies = storedStickies ? JSON.parse(storedStickies) : [];

  // Ensure old notes have `pinned`, without overwriting existing true values
  this.stickies.forEach(s => {
    if (s.pinned === undefined) s.pinned = false;
  });
}
```

This approach preserves any `pinned: true` values already stored in newer notes, only assigning false to notes that were missing the field (undefined). Unconditionally setting `s.pinned = false` would overwrite user-set pinned notes, undoing their intended state. This method safely migrates old data while keeping newer notes intact.

## Q7

B

## Q8

**Single-key approach**

- Advantage: It matches the app’s current architecture, where `loadFromStorage()` reads once and assigns `this.stickies = storedStickies`, and the watcher saves the entire array via `saveToStorage()`. This keeps persistence logic simple: one read, one write, fully synchronized with the dynamic `stickies` array.
- Disadvantage: Any change, however small, to any note rewrites the entire array in `localStorage`. As the number of notes grows, this becomes more compute-intensive than it needs to be.

**Per-key approach**

- Advantage: Each note can be updated independently. Editing a single note would only require updating `localStorage.setItem("sticky-note-<id>", ...)`, avoiding rewriting unrelated notes on every change.
- Disadvantage: It complicates `loadFromStorage()`, increasing startup time. The app would need to iterate over all keys, filter those matching the prefix, reconstruct the array, and maintain ordering. This breaks the simplicity of the current architecture.

**My choice and reasoning:** I would keep the single-key approach because it aligns directly with the existing `watch: { stickies: {...} }` and `saveToStorage()` logic. The app treats stickies as one reactive unit, so persisting it as one array keeps the data and storage models cleanly aligned. In short, I value the simplicity of the constant `stickies[]` array rewrites to `localStorage` (and don't expect it to be very expensive) over the complexity of the **per-key approach**.

## Q9

B

## Q10

`app.js` **changes**:

- Add a `color` property to each note, a list of pastel colors, and a method to cycle colors
- Update `addStickie()` to set the default color
- Add a `cycleColor(stickie)` method to cycle the color of the individual sticky note

```js
data() {
  ...
  colors: ["#fcfa5d", "#ffd6ec", "#b6fcd5", "#d6eaff"], // yellow, pink, mint, blue
  ...
}
addStickie() {
  this.stickies.push({
    ...,
    ...,
    color: this.colors[0] // default to yellow
  })
}
cycleColor(stickie) {
  const idx = this.colors.indexOf(stickie.color);
  stickie.color = this.colors[(idx + 1) % this.colors.length];
}
```

`index.html` **changes**:

- Add a color picker `<button>` to each note that calls `cycleColor(stickie)`.
- Bind the `<article>` background to `stickie.color`.

```html
<article ... :style="{ backgroundColor: stickie.color }">
  <div class="note-footer">
    <button
      class="color-btn"
      @click="cycleColor(stickie)"
      title="Change color"
      :style="{ backgroundCOlor: stickie.color}"
    >
      🎨
    </button>
  </div>
</article>
```

`style.css` **changes**:
Add styles for the color picker button so it appears as a small, round button.

```css
.color-btn {
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  margin-right: 0.5rem;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: outline 0.2s;
}
.color-btn:focus,
.color-btn:hover {
  outline: 2px solid #888;
}
```

**Why no extra storage logic is needed**:
The `stickies` array is saved and loaded as a JSON string in `localStorage`. Any new property (like `color`) added to each note object is automatically included in this process. Thus, color selections persist across reloads without additional code.
