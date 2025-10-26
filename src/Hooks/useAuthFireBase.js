//Vue
import { ref } from "vue";
import { useRouter } from "vue-router";
//Firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, db } from "@/FireBase/config"
import { doc, setDoc } from "firebase/firestore";
//Antd
import { message } from "ant-design-vue";


export function useAuthFireBase() {
    const loading = ref(false);

    const router = useRouter()

    async function registerUser(email, password , username) {
        loading.value = true
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            const user = userCredential.user

            await updateProfile(user, {
                displayName: username
            })

            await setDoc(doc(db, 'users', user.uid), {
                username: username,
                email: email,
                createdAt: new Date().toISOString(),
                uid: user.uid
            })

            console.log(user)
            message.success('Ro\'yxatdan o\'tish muvaffaqiyatli!');
            router.push('/');
            return { success: true, user };
        } catch (error) {
            message.error(error.code)
        } finally {
            loading.value = false
        }
    }

    async function loginUser(email, password) {
        loading.value = true
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email , password)

            const user = userCredential.user;
            message.success('Kirish muvaffaqiyatli!')
            router.push('/');
            console.log(user)
            return { success: true, user };
        } catch (error) {
            message.error(error.code)
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        registerUser,
        loginUser
    }
}