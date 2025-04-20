<template>
    <v-dialog
        v-model="showDialog"
        persistent
    >
        <v-card>
            <v-form
                v-model="form"
                ref="form"
                @submit.prevent="handleSubmit"
            >
                <v-card-text>
                    <v-row>
                        <v-col cols="3">
                            <v-checkbox
                                v-model="referenceNum.autoGenerate"
                                label="Existing Reference Number"
                                @change="handleChangeExistingReferenceNum"
                            ></v-checkbox>
                        </v-col>
                        <v-col cols="3">
                            <v-text-field
                                v-if="referenceNum.autoGenerate"
                                v-model="referenceNum.value"
                                label="Reference Number"
                                :rules="referenceNum.autoGenerate ? [v=>!!v||'Reference Number is required'] : []"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row
                        v-for="(item, index) in adjustmentItems"
                        :key="index"
                    >
                        <v-col cols="5">
                            <v-combobox
                                :items="items"
                                item-value="product_id"
                                item-text="displayName"
                                v-model="item.productId"
                                label="Product name"
                                autocomplete="nope"
                                :rules="index !== 0 && adjustmentItems.length-1 === index ? [] : [v=>!!v||'Product name is required']"
                            >
                                <template v-slot:item="{ item }">
                                    <p style="text-align: right; width: 100%; min-width: 300px; position: relative; height: 20px; padding-top: 5px;">
                                        <span style="position: absolute; left: 0; font-weight: 700;">{{ item.barcode }}</span> {{ String(item.brand).toUpperCase() }} {{ String(item.name).toUpperCase() }} {{ String(item.unit).toUpperCase() }} @ {{ item.selling_price }}
                                    </p>
                                </template>
                            </v-combobox>
                        </v-col>
                        <v-col cols="2">
                            <v-text-field
                                type="number"
                                v-model="item.incomingQuantity"
                                label="Incoming quantity"
                                :rules="index !== 0 && adjustmentItems.length-1 === index ? [] : [v=>!!v||'Incoming quantity is required' ].concat(numberRule)"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="2">
                            <v-text-field
                                type="number"
                                v-model="item.adjustmentQuantity"
                                label="Adjustment quantity"
                                :rules="index !== 0 && adjustmentItems.length-1 === index ? [] : [v=>!!v||'Adjustment quantity is required'].concat(numberRule)"
                            ></v-text-field>
                        </v-col>
                        <v-col>
                            <v-textarea
                                auto-grow
                                rows="1"
                                v-model="item.itemRemarks"
                                label="Remarks"
                            ></v-textarea>
                        </v-col>
                        <v-col cols="1" style="padding-top: 30px;">
                            <v-btn icon color="error" @click="handleDeleteItem(index)"><v-icon>mdi-trash-can</v-icon></v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click="showDialog = false">close</v-btn>
                    <v-btn color="success" type="submit">submit</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    data: ()=>({
        form: false,
        referenceNum: {
            autoGenerate: false,
            value: null,
        },
        remarks: null,
        adjustmentItems: [
            {
                productId: null,
                incomingQuantity: null,
                adjustmentQuantity: null,
                itemRemarks: null
            }
        ],
        template: {
            productId: null,
            incomingQuantity: null,
            adjustmentQuantity: null,
            itemRemarks: null
        },
        items: [],
        numberRule: [
            v => Number.isInteger(Number(v)) || 'Must be a whole number',
            v => v >= 0 || 'Cannot be negative',
            v => String(v).indexOf('.') === -1 || 'Decimals are not allowed'
        ],
        isFormSubmitted: false
    }),
    props: ['show'],
    computed: {
        ...mapGetters(['productData', 'inventoryAdjustmentsPostData']),
        showDialog: {
            get() {
                return this.show
            },
            set() {
                this.$emit('closeDialog')
            }
        }
    },
    watch: {
        inventoryAdjustmentsPostData(newVal) {
            if (newVal.STATUS === 201) {
                this.showDialog = false
                this.inventoryAdjustmentsGet()
                this.adjustmentItems = [structuredClone(this.template)]
                this.referenceNum = {
                    autoGenerate: false,
                    value: null,
                }
                this.isFormSubmitted = false
                this.remarks = null
            }
        },
        productData(newVal) {
            if (newVal.STATUS === 200) {
                this.items = newVal.DATA.map(item => ({...item,
                    searchQuery: `${item.barcode} ${item.brand} ${item.name} ${item.unit}`,
                    displayName: `${item.brand} ${item.name} ${item.unit}`
                }))
            }
        },
        adjustmentItems: {
            handler() {
                this.$nextTick(()=>{
                    if (!this.isFormSubmitted && this.adjustmentItems.length > 0) {
                        const lastItem = this.adjustmentItems[this.adjustmentItems.length-1]
                        if (lastItem.productId !== null && lastItem.incomingQuantity !== null && lastItem.adjustmentQuantity !== null) {
                            setTimeout(() => {
                                this.adjustmentItems.push(structuredClone(this.template))
                            }, 500)
                        }
                    }
                })
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        ...mapActions(['products', 'inventoryAdjustmentsPost', 'inventoryAdjustmentsGet']),
        handleDeleteItem(index) {
            this.adjustmentItems.splice(index, 1)
        },
        handleSubmit() {
            if (this.$refs && this.$refs.form && this.$refs.form.validate()) {
                this.isFormSubmitted = true
                this.adjustmentItems.splice(-1, 1)
                for (let i=0; i<this.adjustmentItems.length; i++) {
                    const product = this.adjustmentItems[i]
                    this.adjustmentItems[i].productId = product.productId.product_id
                    this.adjustmentItems[i].incomingQuantity = Number(product.incomingQuantity)
                    this.adjustmentItems[i].adjustmentQuantity = Number(product.adjustmentQuantity)
                }
                const params = {}
                params.items = this.adjustmentItems
                params.referenceNum = this.referenceNum.value
                params.employeeId = Number(window.$cookies.get('userId'))
                params.remarks = this.remarks
                this.inventoryAdjustmentsPost(params)
            }
        },
        handleChangeExistingReferenceNum(value) {
            if (!value) {
                this.referenceNum.value = null
            }
        }
    },
    mounted() {
        this.products()
    }
}
</script>
