import { defineStore } from "pinia";

export const useUsersStore = defineStore('users', {
    state: () => ({
        username: null,
        token: null,
        password: null,
        photoURL: null,
        email: null
    }),
    getters: {
        usersData: (state) => state
    },
    actions: {
        addUser(username, email, password, token, photoURL) {
            this.username = username;
            this.email = email;
            this.token = token;
            this.photoURL = photoURL;
            this.password = password;
        },
        editUsername(newUsername) {
            this.username = newUsername;
        },
        editPassword(newPassword) {
            this.password = newPassword
        },
        clearStore() {
            this.username = null;
            this.token = null;
            this.photoURL = null;
            this.email = null;
            this.password = null;
        }
    },
    persist: true
})