<template>
    <div style="font-weight: 600;">
        <v-row no-gutters>
            <v-col lg="5" md="5" style="padding: 10px 5px 0 10px;">
                <div>
                    <span class="title1 colorBlue" style="margin-right: 40px;">Terminal: 2</span>
                    <span class="title1 colorBlue" >Transaction: 1/1</span>
                    <!-- <v-text-field
                        value="1002000000000205"
                        outlined
                        style="font-size: 20px;"
                        readonly
                        hide-details
                    >
                        <template slot="prepend-inner">
                            <span style="font-size: 22px; color: blue">REF#</span>
                        </template>
                    </v-text-field> -->
                    <div>
                        <p class="title1 colorBlue" style="margin: 15px 0 0 0;">Product Information</p>
                        <ul style="list-style-type: none; padding-left: 0;">
                            <li>Barcode: <span class="colorBlue">{{ currentTransaction.barcode }}</span></li>
                            <li>Description: <span class="colorBlue">{{ currentTransaction.name }}</span></li>
                            <li>Price: <span class="colorBlue">{{ currentTransaction.price ? `${parseInt(currentTransaction.price).toFixed(2)} each` : null }}</span></li>
                            <li>Memo: </li>
                            <li>Status: NonVAT | NonSenior</li>
                            <li>Discount: </li>
                        </ul>
                        <p style="margin-top: 20px;">Press [Alt + i] to Show Inventory</p>
                    </div>
                    <div>
                        Transaction Discount
                        <v-row>
                            <v-col>
                                <p>Member Discount: 0.00</p>
                                <p>Pos Promo: 0.00</p>
                            </v-col>
                            <v-col>
                                <p>Adjustments: 0.00</p>
                                <p>Other Discount: 0.00</p>
                            </v-col>
                        </v-row>
                    </div>
                    <div>
                        <v-row>
                            <v-col>
                                <p>Customer:</p>
                                <p>Mode:</p>
                                <p>Clerk: Jamaica</p>
                            </v-col>
                            <v-col>
                                <p>Member: </p>
                                <p>Memo: </p>
                                <p>Salesman:</p>
                            </v-col>
                        </v-row>
                    </div>
                </div>
            </v-col>
            <v-col lg="7" md="7" style="padding: 10px 10px 0 5px;">
                <div>
                    <BarcodeQuantity
                        @saveBarcodeQuantity="saveBarcodeQuantity"
                    />
                    <div style="border: 1px solid black; padding: 10px; margin-top: 10px; position: relative;">
                        <p class="title1" style="margin: 0; padding: 0; position: absolute; left: 10px; top: 10px;">TOTAL</p>
                        <p class="text-right" style="font-size: 80px; font-weight: 700; color: red; padding: 0; margin: 0">{{ totalAmount.toFixed(2) }}</p>
                    </div>
                    <div>
                        <v-data-table
                            :items="transactions"
                            :headers="headers.transactions"
                            style="height: 400px; font: 20px; overflow-y: scroll;"
                            hide-default-footer
                            :item-class="getRowClass"
                            :items-per-page="-1"
                            dense
                        >
                            <template slot="item.name" slot-scope="{ item }">
                                <span style="text-wrap: nowrap;">{{ item.name }}</span>
                            </template>
                            <template slot="item.amount" slot-scope="{ item }">
                                <span style="text-wrap: nowrap;">{{ amountEachItem(item) }}</span>
                            </template>
                        </v-data-table>
                    </div>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import BarcodeQuantity from './BarcodeQuantity.vue';
export default {
    components: {
        BarcodeQuantity,
    },
    data: () => ({
        headers: {
            transactions: [
                { text: 'Description', value: 'name'},
                { text: 'Qty', value: 'itemQuantity'},
                { text: 'Unit', value: 'unit'},
                { text: 'Price', value: 'price'},
                { text: 'Amount', value: 'amount'},
            ],
        },
        transactions: [
            // { id: 1, description: 'GIFT WRAP (CHRISTMAS) asdf adsf adf adsf', price: 5.00, amount: 10.00, qty: 2, unit: 'pcs.', barcode: '200000003221'  }
        ]
    }),
    computed: {
        ...mapGetters(['findBarcodeData']),
        currentTransaction() {
            if (this.transactions.length > 0) {
                return this.transactions[0]
            } else {
                return { id: null, description: null, price: null, amount: null, qty: null, unit: null, barcode: null  }
            }
        },
        totalAmount() {
            return this.transactions.reduce((total, transaction) => {
                return total + parseFloat(transaction.price) * transaction.itemQuantity;
            }, 0);
        }
    },
    methods: {
        getRowClass(item) {
            return item.isCurrent ? 'current-row' : '';
        },
        amountEachItem(item) {
            const amount = parseFloat(item.price) * parseFloat(item.itemQuantity)
            return amount ? amount.toFixed(2) : null
        },
        saveBarcodeQuantity(data) {
            console.log('saveBarcodeQuantity data: ', data);

            // Add "currentTransaction" class to the new item and remove it from others
            this.transactions.forEach((item) => {
                item.isCurrent = false; // Remove class from others
            });

            // Find the index of the existing product in transactions
            const existingProductIndex = this.transactions.findIndex(item => item.product_id === data.product_id);

            if (existingProductIndex !== -1) {
                // If the product exists, update its quantity and price
                const existingProduct = this.transactions[existingProductIndex];
                existingProduct.itemQuantity += parseInt(data.itemQuantity);
                existingProduct.price = (
                    parseFloat(existingProduct.price) + parseFloat(data.price)
                ).toFixed(2); // Ensure the price stays a string with 2 decimal places
                existingProduct.isCurrent = true
                // Remove the existing product from its current position
                // this.transactions.splice(existingProductIndex, 1);

                // Add the updated product to the beginning of the list
                // this.transactions.unshift(existingProduct);
            } else {
                // Add the new product to the beginning of the list
                data.isCurrent = true
                this.transactions.unshift(data);
            }
        }
    }
}
</script>

<style scoped lang="css">
.title1 {
    font-size: 25px;
}
.colorBlue {
    color:blue
}
.v-data-table > .v-data-table__wrapper > table > thead > tr > th, span
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td, span {
  font-size: 20px; /* Adjust the size as needed */
}
.v-data-table >>> tr.current-row {
    background-color: blue !important;
    font-weight: bold;
    border: 2px solid #007bff;
    color: white;
}

</style>
