<template>
    <div>
        <h1>Login Page</h1>
        <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="submitForm"
        >
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
                type="submit"
            >submit</v-btn>
        </v-form>

    </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    data: ()=>({
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
                    if (this.$route.path !== '/pos') this.$router.push({name: 'pos'})
                }
            }
        }
    },
    methods: {
        ...mapActions(['login', 'getCsrfToken']),
        submitForm() {
            if (this.$refs.form.validate()) {
                console.log('submit')
                this.login({username: this.cred.user, password: this.cred.pass})
            }
        }
    },
    mounted() {
        this.getCsrfToken()
    }
}
</script>
