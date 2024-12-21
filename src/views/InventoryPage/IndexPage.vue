<template>
    <div style="width: 100%;">
        <h1 style="background-color: red;">Inventory Page</h1>
        <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="submitForm"
        >
            <v-btn>Units</v-btn>
            <v-btn>Categories</v-btn>
            <v-btn>Brands</v-btn>

            <!-- <v-text-field
                label="Brand Name"
            ></v-text-field> -->
            <v-text-field
                label="Product Name"
            ></v-text-field>
            <v-text-field
                label="Measurement"
            ></v-text-field>
            <v-text-field
                label="Quantity"
            ></v-text-field>
            <v-text-field
                label="Category"
            ></v-text-field>
            <v-text-field
                label="Reorder Level"
            ></v-text-field>
        </v-form>
    </div>
</template>

<script>
export default {
    data: ()=>({
        valid: false,
        item: {
            brand: null,
            name: null,
            unit: null,
            quantity: null,
            category: null,
            reorder_level: null,
        }
    }),
}
</script>
