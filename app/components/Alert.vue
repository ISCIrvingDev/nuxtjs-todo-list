<template>
    <transition name="slide-fade">
        <div id="alert" :class="alertType" role="alert" v-if="show">
            {{ msn }}
        </div>
    </transition>
</template>

<script>
    export default {
        name: 'Alert',
        props: {
            msn: {
                type: String,
                default: 'Invlid format'
            },
            show: {
                type: Boolean,
                default: false
            },
            type: {
                type: String,
                default: 'success'
            },
            time: {
                type: Number,
                default: 6000
            }
        },
        computed: {
            alertType: function () {
                return this.type == 'success' ? 'alert alert-success text-center' : 'alert alert-danger text-center';
            }
        },
        watch: {
            show: function (newVal, oldVal) {
                if (newVal)
                    setTimeout(() => {
                        this.$emit('fadeOut');
                    }, this.time);
            }
        }
    }
</script>

<style>
    #alert {
        position: fixed;
        top: 7rem;
        right: 1rem;
        width: 18rem;
    }

    /* .fade-enter-active, .fade-leave-active {
        transition: opacity 3s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    } */

    .slide-fade-enter-active {
        transition: all 1s linear;
    }
    .slide-fade-leave-active {
        transition: all 1s ease-in;
    }
    .slide-fade-enter, .slide-fade-leave-to {
        transform: translateX(4rem);
        opacity: 0;
    }
</style>
