<template>
    <v-dialog
        v-model="showDialog"
        width="970px"
        persistent
    >
        <v-card>
            <v-card-title>New Product Expiration<v-spacer></v-spacer>
                <v-select
                    style="width: 20px;"
                    dense
                    hide-details
                    outlined
                    :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]"
                    v-model="itemCounter"
                ></v-select>
                <v-btn @click="handleAddExpiryData">Add</v-btn>
            </v-card-title>
            <v-form
                ref="form"
                @submit.prevent="submitForm"
            >
                <v-card-text>
                    <div
                        :style="`margin: 0 auto; width: 910px; background-color: ${index % 2 === 0 ? '#eee' : 'white'}; padding: 5px 10px 0 10px`"
                        v-for="(counter, index) in expiryData"
                        :key="index"
                    >
                        <div style="width: 250px; display: inline-block; margin-right: 10px;">
                            <span @click="handleFillBelow(index)" style="background-color: green; color: white; border-radius: 5px; padding: 2px; margin: 5px 0;">Fill Below</span>
                            <v-combobox
                                dense
                                :items="productItemsToSearch"
                                item-text="selectDisplayName"
                                :return-object="false"
                                item-value="product_id"
                                outlined
                                label="Product Name"
                                v-model="counter.product_id"
                                :rules="[v=>!!v||'Product name is required']"
                            >
                                <template v-slot:item="{ item }">
                                    <p style="text-align: right; width: 600px; position: relative; height: 20px; padding-top: 5px;">
                                        <span style="position: absolute; left: 0; font-weight: 700;">{{ item.barcode }}</span> {{ String(item.brand).toUpperCase() }} {{ String(item.name).toUpperCase() }} {{ String(item.unit).toUpperCase() }} @ {{ item.selling_price }}
                                    </p>
                                </template>
                                <template v-slot:selection>
                                    {{ selectedProduct(index).brand }} {{ selectedProduct(index).name }} {{ selectedProduct(index).unit }}
                                </template>
                            </v-combobox>
                        </div>
                        <div style="display: inline-block; margin-right: 10px;">
                            <v-text-field
                                dense
                                outlined
                                type="date"
                                label="Exp Date"
                                :rules="[v=>!!v||'Exp date is required']"
                                v-model="counter.expiration_date"
                                @change="handleChangeExpiryDate(index)"
                                style="max-width: 170px;"
                            ></v-text-field>
                        </div>
                        <div style="display: inline-block; margin-right: 10px;">
                            <v-text-field
                                outlined
                                dense
                                type="date"
                                label="Notif Date"
                                :rules="[v=>!!v||'Notif date is required'].concat(notifRule(counter.notif_date, counter.expiration_date))"
                                v-model="counter.notif_date"
                                style="max-width: 170px;"
                            ></v-text-field>
                        </div>
                        <div style="display: inline-block; margin-right: 10px;">
                            <v-text-field
                                outlined
                                dense
                                label="Comment"
                                v-model="counter.comment"
                                height="2"
                                clearable
                            ></v-text-field>
                        </div>
                        <v-btn
                            icon
                            @click="handleDeleteExpiryDate(index)"
                            color="red"
                            :loading="loading"
                        ><v-icon>mdi-trash-can</v-icon></v-btn>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn style="color: white; background-color: red;" @click="showDialog = false">Close</v-btn>
                    <v-btn type="submit" style="color: white; background-color: green;">Submit</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';

export default {
    data: ()=>({
        loading: false,
        valid: false,
        itemCounter: 1,
        expiryData: [{
            product_id: null,
            expiration_date: null,
            notif_date: null,
            comment: null
        }],
        expiryDataTemplate: {
            product_id: null,
            expiration_date: null,
            notif_date: null,
            comment: null
        },
    }),
    props: ['show'],
    computed: {
        ...mapGetters(['productData', 'productExpirationData', 'productExpirationsPostData']),
        showDialog: {
            get() {
                return this.show
            },
            set() {
                this.$emit('closeDialog')
            }
        },
        productItemsToSearch() {
            return this.productData && this.productData.DATA && this.productData.DATA.length > 0
                ? this.productData.DATA.map(item => ({...item, selectDisplayName: `${item.brand.toUpperCase()} ${item.name.toUpperCase()} ${item.unit.toUpperCase()}`, displayName: `${item.barcode} ${item.category} ${item.brand} ${item.name} ${item.unit} ${item.selling_price}`}))
                : []
        },
    },
    watch: {
        productExpirationData(newVal) {
            if (this.loading = false) {
                this.productExpiration()
                this.showDialog = false
            }
            console.log('watch productExirationData newVal: ', newVal)
        }
    },
    methods: {
        ...mapActions(['productExpiration', 'productExpirationsPost']),
        notifRule(notif_date, expDate) {
            return [moment(notif_date).utcOffset('+0800').isSameOrBefore(moment(expDate).utcOffset('+0800')) || 'Notif Date should not after Expiry Date']
        },
        selectedProduct(index) {
            return this.productData?.DATA?.find(item => item.product_id === this.expiryData[index].product_id) || null;
        },
        async submitForm() {
            if (this.$refs && this.$refs.form.validate()) {
                this.loading = true
                for (let i=0; i<this.expiryData.length; i++) {
                    await this.productExpirationsPost(this.expiryData[i])
                }
                this.loading = false
            }
        },
        handleFillBelow(index) {
            for (let i=index; i<this.expiryData.length; i++) {
                this.expiryData[i].product_id = this.expiryData[index].product_id
            }
        },
        handleChangeExpiryDate(index) {
            this.expiryData[index].notif_date = this.expiryData[index].expiration_date
        },
        handleDeleteExpiryDate(index) {
            this.expiryData.splice(index, 1)
            if (this.expiryData.length <= 0) this.showDialog = false
        },
        handleAddExpiryData() {
            let test = []
            for(let i = 0; i<this.itemCounter; i++) {
                test.push(structuredClone(this.expiryDataTemplate))
            }
            this.expiryData = [...this.expiryData, ...test]
        }
    },
}
</script>
