<!-- eslint-disable vue/no-mutating-props -->
<template>
    <div style="vertical-align: top" class="btnContainer">
        <div
            @click="onClickFunc.f12 = true"
            style="height: 190px; width: 200px; background-color: yellow; color: black; margin: 10px; display: inline-block; vertical-align: top; text-shadow: 2px 2px 5px white;"
        >
            <img src="./../../assets/buy_8305477-removebg-preview.png" alt="test" height="100px" width="100px">
            <span>F12</span>Input Quantity
        </div>
        <div
            @click="onClickFunc.f9 = true"
            style="height: 190px; width: 200px; background-color: #00ff00 ; color: black; margin: 10px; display: inline-block; vertical-align: top;"
        >
            <img src="./../../assets/wallet_10630192-removebg-preview.png" alt="test" height="100px" width="100px">
            <span>F9</span>Finish Payment
        </div>
        <div
            @click="onClickFunc.f4 = true"
            style="height: 190px; width: 200px; background-color: gray; color: black; margin: 10px; display: inline-block; vertical-align: top;"
        >
            <img src="./../../assets/printer_12142397-removebg-preview.png" alt="test" height="100px" width="100px">
            <span>F4</span>Print Order Slip
        </div>
        <br>
        <div
            @click="onClickFunc.f6 = true"
            style="height: 190px; width: 200px; background-color: red; color: black; margin: 10px; display: inline-block; vertical-align: top;"
        >
            <img src="./../../assets/dustbin_8305532-removebg-preview.png" alt="test" height="100px" width="100px">
            <span>F6</span>Remove Item
        </div>
        <div
            @click="onClickFunc.f11 = true"
            style="height: 190px; width: 200px; background-color: orange; color: black; margin: 10px; display: inline-block; vertical-align: top;"
        >
            <img src="./../../assets/brain_7650331-removebg-preview.png" alt="test" height="100px" width="100px">
            <span>F11</span>Revise Order
        </div>
        <div
            @click="onClickFunc.f2 = true"
            style="height: 190px; width: 200px; background-color: #1e90ff ; color: black; margin: 10px; display: inline-block; vertical-align: top;"
        >
            <img src="./../../assets/printer_10134828-removebg-preview.png" alt="test" height="100px" width="100px">
            <span>F2</span>Start/End Shift
        </div>
        <!-- <div style="height: 200px; width: 200px; background-color: red; color: white; margin: 10px; display: inline-block; vertical-align: top;"><span>F6</span>Remove Item</div>
        <div style="height: 200px; width: 200px; background-color: orange; color: black; margin: 10px; display: inline-block; vertical-align: top;"><span>F11</span>Revise Order</div>
        <div style="height: 200px; width: 200px; background-color: blue; color: white; margin: 10px; display: inline-block; vertical-align: top;"><span>F2</span>Start/End Shift</div> -->
        <!-- <div style="height: 100px; width: 100px; background-color: blue; color: white; margin: 10px; display: inline-block; vertical-align: top;"><span>ALT + P</span>Print</div> -->
        <!-- <div style="height: 100px; width: 100px; background-color: blue; color: white; margin: 10px; display: inline-block; vertical-align: top;"><span>F1</span>Sales</div>
        <div style="height: 100px; width: 100px; background-color: blue; color: white; margin: 10px; display: inline-block; vertical-align: top;"><span>F2</span>Inventory</div>

        <div style="height: 100px; width: 100px; background-color: blue; color: white; margin: 10px; display: inline-block; vertical-align: top;"><span>F6</span>Dashboard</div>
        <div style="height: 100px; width: 100px; background-color: orange; color: white; margin: 10px; display: inline-block; vertical-align: top;"><span>F7</span>Cancel</div>
        <div style="height: 100px; width: 100px; background-color: green; color: white; margin: 10px; display: inline-block; vertical-align: top;;"><span>F8</span>Payment</div>
        <br>
        <div style="height: 100px; width: 100px; background-color: blue; color: white; margin: 10px; display: inline-block; vertical-align: top;"><span>ALT + E</span>Edit Item</div>
        <div style="height: 100px; width: 100px; background-color: blue; color: white; margin: 10px; display: inline-block; vertical-align: top;"><span>ALT + D</span> DLT Item</div>
        <div style="height: 100px; width: 100px; background-color: blue; color: white; margin: 10px; display: inline-block; vertical-align: top;"><span>ALT + Q</span>Edit QTY</div>
    -->


    </div>
</template>

<script>
export default {
    props: ['onClickFunc'],
    methods: {
        test() {
            alert('ok')
        }
    }
}
</script>

<style scoped>
.btnContainer {
    text-align: left;
}
.btnContainer div {
    text-align: center;
    border-radius: 25px;
}
.btnContainer div span {
    display: block;
}
</style>
