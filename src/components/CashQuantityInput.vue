<template>
    <p style="height: 40px; position: relative; padding-top: 8px; width: 150px;" class="text-right">
        <v-form
            v-model="valid"
            ref="form"
            @submit.prevent="submitForm"
        >

        </v-form>
        <v-text-field
            v-model.trim="amount"
            :label="String(label)"
            style="position: absolute; left: 0; top: 0; width: 90px;"
            outlined
            hide-details
            dense
            clearable
            :rules="[
                v => v === null || v === '' || !isNaN(v) || 'Quantity must be a number',
                v => v === null || v === '' || v > 0 || 'Quantity must be greater than 0',
                v => v === null || v === '' || Number.isInteger(+v) || 'Quantity must be a whole number'
            ]"
        ></v-text-field>
        <span>{{ total }}</span>
    </p>
</template>

<script>
export default {
    data: () => ({
        valid: true,
        amount: null
    }),
    props: ['label'],
    computed: {
        total() {
            const amount = this.amount * Number(this.label);
            if (!amount) return ''; // Return an empty string if amount is falsy

            // Check if the amount has cents (fractional part)
            const formatted = amount % 1 === 0
                ? amount.toLocaleString() // Whole number, format with commas
                : amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // With cents

            return formatted;
        }
    },
    watch: {
        amount(newVal) {
            this.$emit('deno', Number(newVal))
        }
    },
    methods: {
        submitForm() {
            if (this.$refs.form.validate()) {
                // console.log('form is valid')
            }
        }
    }
}
</script>

