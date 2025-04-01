<template>
    <div style="display: flex; align-items: center; height: 100vh;">
        <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="submitForm"
            style="width: 380px; margin: auto auto; vertical-align: middle;"
            class="elevation-10"
        >
            <v-card style="padding: 20px 40px">
                <h1>Login Page</h1>
                <p>{{ errMsg }}</p>
                <v-text-field
                    v-model.trim="cred.user"
                    :rules="[v=>v && !!v.trim() || 'Username is required']"
                    label="Username"
                ></v-text-field>
                <v-text-field
                    type="password"
                    v-model.trim="cred.pass"
                    :rules="[v=>!!v || 'Password is required']"
                    label="Password"
                ></v-text-field>
                <v-btn
                    class="submitBtn"
                    rounded
                    style="width: 100%; height: 55px;"
                    type="submit"
                >submit</v-btn>
            </v-card>
        </v-form>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    data: ()=>({
        errMsg: '',
        cred: {
            user: null,
            pass: null,
        },
        valid: false
    }),
    computed: {
        ...mapGetters(['loginData'])
    },
    watch: {
        loginData(newVal) {
            if (newVal) {
                if (newVal.STATUS === 200) {
                    if (this.$route.path !== '/pos') window.location.href = '/pos'
                } else if (newVal.STATUS === 401) {
                    this.errMsg = newVal.STATE
                    setTimeout(()=>{
                        this.errMsg = ""
                    }, 5000)
                } else if (newVal.STATUS === 403) {
                    this.errMsg = newVal.STATE
                    setTimeout(()=>{
                        this.errMsg = ""
                    }, 5000)
                } else {
                    console.error(newVal.STATE)
                }
            }
        }
    },
    methods: {
        ...mapActions(['login', 'getCsrfToken']),
        submitForm() {
            if (this.$refs.form.validate()) {
                this.login({username: this.cred.user, password: this.cred.pass})
            }
        }
    },
    mounted() {
        this.getCsrfToken()
    }
}
</script>

<style scoped>
h1 {
    text-align: center;
    margin-bottom: 20px;
}
.submitBtn {
    margin-bottom: 20px;
}
p {
    text-align: center;
    height: 40px;
    color: red;
}
</style>
