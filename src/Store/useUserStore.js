import { defineStore } from "pinia";

export const useUsersStore = defineStore('users', {
    state: () => ({
        username: null,
        token: null
    }),
    getters: {
        usersData: (state) => state
    },
    actions: {
        addUser(username, token) {
            this.username = username;
            this.token = token
        }
    },
    persist: true
})