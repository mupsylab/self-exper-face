import { defineStore } from "pinia";

export const useColorScheme = defineStore("color-scheme", {
    state() {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return {
                colorScheme: "dark"
            }
        }
        return {
            colorScheme: "light"
        }
    },
    getters: {
        currScheme(): string {
            return this.colorScheme;
        }
    },
    actions: {
        switch(colorScheme: string) {
            this.colorScheme = colorScheme;
            document.documentElement.classList.add(colorScheme);
        }
    }
})