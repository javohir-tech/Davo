import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
  state: () => ({
    username: null,
    token: null,
    password: null,
    photoURL: null,
    email: null,
    uid: null,
  }),
  getters: {
    isActive: (state) => state.token !== null,
  },
  actions: {
    addUser(username, email, password, token, photoURL, uid) {
      this.username = username
      this.email = email
      this.token = token
      this.photoURL = photoURL
      this.password = password
      this.uid = uid
    },
    editUsername(newUsername) {
      this.username = newUsername
    },
    editPassword(newPassword) {
      this.password = newPassword
    },
    clearStore() {
      this.username = null
      this.token = null
      this.photoURL = null
      this.email = null
      this.password = null
      this.uid = null
    },
  },
  persist: true,
})
