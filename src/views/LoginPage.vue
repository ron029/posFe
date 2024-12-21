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
            console.log('watch loginData newVal: ', newVal)
            if (newVal) {
                if (newVal.STATUS === 200) {
                    this.$router.push({name: 'dashboard'})
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
