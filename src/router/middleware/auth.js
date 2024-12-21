import router from "../index"

export default function auth ( { next } ) {
    const isLoggedIn = window.$cookies.get('login')
    if (isLoggedIn) {
        next();
    } else {
        router.push("/");
        next();
    }
}
