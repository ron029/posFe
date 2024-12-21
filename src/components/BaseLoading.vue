<!-- template 2 -->

<!-- <template>
    <div v-if="isLoading" class="overlay">
        <div class="loader"></div>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    computed: {
        ...mapState("loading", ["isLoading"]),
    },
};
</script>

<style scoped>/*
 .overlay {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99999;
    cursor: pointer;
} */
.loader {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 60px;
    height: 60px;
    margin: -76px 0 0 -76px;
    border: 8px solid #f3f3f3;
    border-radius: 50%;
    border-top: 8px solid #3498db;
    -webkit-animation: spin 2s linear infinite;
    animation: spin 2s linear infinite;
}
@-webkit-keyframes spin {
    0% {
    -webkit-transform: rotate(0deg);
    }
    100% {
    -webkit-transform: rotate(360deg);
    }
}
@keyframes spin {
    0% {
    transform: rotate(0deg);
    }
    100% {
    transform: rotate(360deg);
    }
}
</style> -->

<!-- template 2 -->
<template>
    <div v-if="isLoading" class="overlay">
        <div id="circle">
            <div class="loader">
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    computed: {
        ...mapState("loading", ["isLoading"]),
    },
};
</script>

<style scoped>
html, body{
    width: 100%;
    height: 100%;
}

 body {
     background: #0d161f;
}

#circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
	width: 150px;
    height: 150px;
}

.loader {
    width: calc(100% - 0px);
	height: calc(100% - 0px);
	/* border: 8px solid #162534;
	border-top: 8px solid #09f; */
	border: 8px solid #009688;
	border-top: 8px solid #00E676;
	border-radius: 50%;
	animation: rotate 5s linear infinite;
}

@keyframes rotate {
100% {transform: rotate(360deg);}
}
</style>

<!-- template 1 -->

<!-- <template>
    <div v-if="isLoading" class="overlay">
        <div class="top">
            <div class="square">
                <div class="square">
                    <div class="square">
                        <div class="square">
                            <div class="square">
                                <div class="square"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom">
            <div class="square">
                <div class="square">
                    <div class="square">
                        <div class="square">
                            <div class="square">
                                <div class="square"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="left">
            <div class="square">
                <div class="square">
                    <div class="square">
                        <div class="square">
                            <div class="square">
                                <div class="square"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="square">
                <div class="square">
                    <div class="square">
                        <div class="square">
                            <div class="square">
                                <div class="square"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    computed: {
        ...mapState("loading", ["isLoading"]),
    },
};
</script>

<style scoped>
body {
  background: #354b60;
}
.square {
  width: 8px;
  height: 30px;
  background: #2ecc71;
  border-radius: 10px;
  display: block;
  /*margin:10px;*/
  -webkit-animation: turn 2.5s ease infinite;
  animation: turn 2.5s ease infinite;
}
.top {
  position: absolute;
  left: 40%;
  top: 50%;
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}
.bottom {
  position: absolute;
  left: 40%;
  top: 50%;
  -webkit-transform: rotate(-90deg);
  transform: rotate(-90deg);
}
.left {
  position: absolute;
  left: 40%;
  top: 50%;
}
.right {
  position: absolute;
  left: 40%;
  top: 50%;
  -webkit-transform: rotate(-180deg);
  transform: rotate(-180deg);
}
@-webkit-keyframes turn {
  0% {
    transform: translateX(0) translateY(0) rotate(0);
  }
  50% {
    transform: translateX(400%) translateY(100%) rotate(90deg);
  }
  100% {
    transform: translateX(0) translateY(0) rotate(0);
  }
}
@keyframes turn {
  0% {
    transform: translateX(0) translateY(0) rotate(0);
  }
  70% {
    transform: translateX(400%) translateY(100%) rotate(90deg);
  }
  100% {
    transform: translateX(0) translateY(0) rotate(0);
  }
}
</style> -->
