Vue.createApp({
  data() {
    return {
      stickies: [],
      storageKey: "sticky-notes-simple",
      colors: ["#fcfa5d", "#ffd6ec", "#b6fcd5", "#d6eaff"],
    };
  },

  mounted() {
    this.loadFromStorage();
  },

  methods: {
    addStickie() {
      // Add a new object to this.stickies
      this.stickies.push({
        id: crypto.randomUUID(),
        text: "",
        color: this.colors[0],
      });
    },

    deleteStickie(id) {
      // Remove the note that matches the provided id.
      // Reassign the result back to this.stickies
      this.stickies = this.stickies.filter((stickie) => stickie.id !== id);
    },

    cycleColor(stickie) {
      const idx = this.colors.indexOf(stickie.color);
      stickie.color = this.colors[(idx + 1) % this.colors.length];
    },

    clearAll() {
      if (confirm("Delete all notes?")) {
        this.stickies = [];
        localStorage.removeItem(this.storageKey);
      }
    },

    // ================================
    // Helper — Character Count
    // ================================

    charCount(text) {
      // Returns the length of the text or 0 if empty.
      return (text ?? "").length;
    },

    saveToStorage() {
      // Save this.stickies to localStorage.
      localStorage.setItem(this.storageKey, JSON.stringify(this.stickies));
    },

    loadFromStorage() {
      // Load notes from localStorage.
      const storedStickies = localStorage.getItem(this.storageKey);
      this.stickies = storedStickies ? JSON.parse(storedStickies) : [];
    },
  },

  watch: {
    stickies: {
      handler() {
        this.saveToStorage();
      },
      deep: true,
    },
  },
}).mount("#app");
