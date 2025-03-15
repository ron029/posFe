<template>
    <v-dialog
        v-model="showDialog"
        width="970px"
        persistent
    >
        <v-card>
            <v-card-title>Edit Product Expiration<v-spacer></v-spacer>
                <v-btn @click="showDialog = false">close</v-btn>
            </v-card-title>
            <v-form
                ref="form"
                @submit.prevent="submitForm"
            >
                <v-card-text>
                    <div
                        :style="`margin: 0 auto; width: 910px; background-color: ${index % 2 === 0 ? '#eee' : 'white'}; padding: 5px 10px 0 10px`"
                        v-for="(counter, index) in items"
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
                                <template slot="item" slot-scope="{ item }">
                                    <p style="text-align: right; width: 600px; position: relative; height: 20px; padding-top: 5px;">
                                        <span style="position: absolute; left: 0; font-weight: 700;">{{ item.barcode }}</span> {{ String(item.brand).toUpperCase() }} {{ String(item.name).toUpperCase() }} {{ String(item.unit).toUpperCase() }} @ {{ item.selling_price }}
                                    </p>
                                </template>
                                <template slot="selection">
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
        items: []
    }),
    props: ['show', 'expiryData'],
    computed: {
        ...mapGetters(['productData', 'productExpirationData', 'productExpirationsPostData', 'productExpirationPutData']),
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
        productExpirationPutData(newVal) {
            console.log('productExpirationPutData newVal: ', newVal)
        },
        expiryData: {
            handler(newVal) {
                this.items = structuredClone(newVal.map(item => ({ ...item, notif_date: this.formatDate(item.notif_date), expiration_date: this.formatDate(item.expiration_date)})))
            },
            immediate: true,
            deep: true
        },
        loading(newVal, oldVal) {
            if (oldVal === true && newVal === false) {
                this.productExpiration()
                this.showDialog = false
            }
        }
    },
    methods: {
        ...mapActions(['productExpiration', 'productExpirationPut']),
        formatDate(date) {
            return moment(date).format('YYYY-MM-DD')
        },
        notifRule(notif_date, expDate) {
            return [moment(notif_date).utcOffset('+0800').isSameOrBefore(moment(expDate).utcOffset('+0800')) || 'Notif Date should not after Expiry Date']
        },
        selectedProduct(index) {
            return this.productData?.DATA?.find(item => item.product_id === this.expiryData[index].product_id) || null;
        },
        async submitForm() {
            if (this.$refs && this.$refs.form.validate()) {
                this.loading = true
                for (let i=0; i<this.items.length; i++) {
                    delete this.items[i].brand
                    delete this.items[i].name
                    delete this.items[i].unit
                    delete this.items[i].days_remaining
                    await this.productExpirationPut(this.items[i])
                }
                this.loading = false
            }
        },
        handleFillBelow(index) {
            for (let i=index; i<this.items.length; i++) {
                this.items[i].product_id = this.items[index].product_id
            }
        },
        handleChangeExpiryDate(index) {
            this.items[index].notif_date = this.items[index].expiration_date
        },
        handleDeleteExpiryDate(index) {
            this.items.splice(index, 1)
            if (this.items.length <= 0) this.showDialog = false
        },
    },
}
</script>
