import { defineStore } from "pinia";

export const useUsersStore = defineStore('users', {
    state: () => ({
        username: null,
        token: null,
        photoURL : null, 
        email:null
    }),
    getters: {
        usersData: (state) => state
    },
    actions: {
        addUser(username, email,  token, photoURL) {
            this.username = username;
            this.email = email;
            this.token = token;
            this.photoURL = photoURL
        },
        clearStore(){
            this.username = null;
            this.token = null;
            this.photoURL = null;
            this.email = null;
        }
    },
    persist: true
})