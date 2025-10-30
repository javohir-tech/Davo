//Vue
import { ref } from "vue";
import { useRouter } from "vue-router";
//Firebase
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth'
import { auth, db } from "@/FireBase/config"
import { doc, getDoc, setDoc } from "firebase/firestore";
//Antd
import { message } from "ant-design-vue";
//Users Store
import { useUsersStore } from "@/Store/useUserStore";

export function useAuthFireBase() {
    const loading = ref(false);

    const store = useUsersStore();
    const router = useRouter()

    async function registerUser(email, password, username) {
        loading.value = true
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user
            localStorage.setItem('token', user.accessToken)
            store.addUser(username, user.email, password, user.accessToken, user.photoURL, user.uid)

            const userData = await getDoc(doc(db, 'users', user.uid))
            let consultations = null
            if (userData.data() && userData.data().consultations) {
                consultations = user.data().consultations
            }

            await updateProfile(user, {
                displayName: username
            })

            await setDoc(doc(db, 'users', user.uid), {
                username: username,
                email: email,
                photoURL: null,
                createdAt: new Date().toISOString(),
                uid: user.uid,
                provider: null,
                userConsultations: consultations
            })

            message.success('Ro\'yxatdan o\'tish muvaffaqiyatli!');
            router.push('/');
            return { success: true, user };
        } catch (error) {
            message.error(error)
        } finally {
            loading.value = false
        }
    }

    async function loginUser(email, password) {
        loading.value = true
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user;
            localStorage.setItem('token', user.accessToken)
            store.addUser(user.displayName, user.email, password, user.accessToken, user.photoURL, user.uid)
            message.success('Kirish muvaffaqiyatli!')
            router.push('/');
        } catch (error) {
            message.error(error)
        } finally {
            loading.value = false
        }
    }

    async function signInWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider)

            const user = result.user
            store.addUser(user.displayName, user.email, null, user.accessToken, user.photoURL, user.uid)
            localStorage.setItem('token', user.accessToken)

            const userData = await getDoc(doc(db, 'users', user.uid))
            let consultations = null
            console.log(userData.data())
            if (userData.data() && userData.data().userConsultations) {
                console.log(true)
                consultations = userData.data().userConsultations
            }
            await setDoc(doc(db, 'users', user.uid), {
                username: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                createdAt: new Date().toISOString(),
                uid: user.uid,
                provider: 'gooogle',
                userConsultations: consultations
            })


            router.push('/')
            message.success('Google orqali kirish muvaffaqiyatli!');
        } catch (error) {
            console.log(error)
            message.error(error)
        }
    }

    function logOut() {
        store.clearStore()
        localStorage.clear()
        sessionStorage.clear()
        window.location.reload()
    }

    return {
        loading,
        registerUser,
        loginUser,
        signInWithGoogle,
        logOut
    }
}