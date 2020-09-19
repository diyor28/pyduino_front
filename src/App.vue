<template>
    <div id="app">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand ml-2" @click="$router.push({name: 'home'})" href="#">Главная</a>
            <ul class="navbar-nav ml-2">
                <li class="nav-item" :class="{'active': $route.name==='sensors'}">
                    <a class="nav-link" href="#" @click="$router.push({name: 'sensors'})">Датчики</a>
                </li>
                <li class="nav-item" :class="{'active': $route.name==='relays'}">
                    <a class="nav-link" href="#" @click="$router.push({name: 'relays'})">Реле</a>
                </li>
            </ul>
        </nav>
        <router-view/>
    </div>
</template>

<script>
import debounce from 'lodash/debounce';
import { mapActions, mapGetters } from "vuex";

export default {
    data() {
        return {
            notifications: {}
        }
    },
    mounted() {
        this.findSensors({});
    },
    computed: {
        ...mapGetters('sensors', { getSensor: 'get' }),
        ...mapGetters({ temps: 'temperatures' })
    },
    methods: {
        ...mapActions('sensors', { findSensors: 'find' }),
        notify(message) {
            // this.$toasted.global.success({ message })
        },
    },
    watch: {
        temps: {
            deep: true,
            handler(newVal) {
                Object.entries(newVal).forEach(([sensorId, values]) => {
                    const sensor = this.getSensor(parseInt(sensorId))
                    if (!sensor || !sensor['high_threshold']) return;
                    const lastRecord = values[values.length - 1]
                    if (lastRecord['temperature'] > sensor['high_threshold']) {
                        const message = `Температу на датчике ${ sensor.label } превысила верхний порог ${ sensor['high_threshold'] }`;
                        this.notify(message)
                    } else if (lastRecord['temperature'] < sensor['low_threshold']) {
                        const message = `Температу на датчике ${ sensor.label } опсутилась ниже порога ${ sensor['low_threshold'] }`;
                        this.notify(message)
                    }
                })
            }
        }
    }
}
</script>

<style lang="scss">
/* cyrillic */
@font-face {
    font-family: "Rubik";
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local("Rubik"), local("Rubik-Regular"),
    url(https://fonts.gstatic.com/s/rubik/v8/iJWKBXyIfDnIV7nFrXyw023e1Ik.woff2) format("woff2");
    unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* hebrew */
@font-face {
    font-family: "Rubik";
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local("Rubik"), local("Rubik-Regular"),
    url(https://fonts.gstatic.com/s/rubik/v8/iJWKBXyIfDnIV7nDrXyw023e1Ik.woff2) format("woff2");
    unicode-range: U+0590-05FF, U+20AA, U+25CC, U+FB1D-FB4F;
}

/* latin-ext */
@font-face {
    font-family: "Rubik";
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local("Rubik"), local("Rubik-Regular"),
    url(https://fonts.gstatic.com/s/rubik/v8/iJWKBXyIfDnIV7nPrXyw023e1Ik.woff2) format("woff2");
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
    U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

/* latin */
@font-face {
    font-family: "Rubik";
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local("Rubik"), local("Rubik-Regular"),
    url(https://fonts.gstatic.com/s/rubik/v8/iJWKBXyIfDnIV7nBrXyw023e.woff2) format("woff2");
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212,
    U+2215, U+FEFF, U+FFFD;
}

#app {
    height: 100%;
    min-height: 100vh;
    font-family: "Rubik", sans-serif;
}

.no-glow:focus {
    outline-color: transparent;
    box-shadow: none !important;
    outline-style: none;
}

.pointer {
    cursor: pointer;
}

.hover:hover {
    background-color: #f9fbfd;
}

.draggable:active {
    cursor: move;
}

.fullHeight {
    height: 80vh;
    overflow-y: auto;
    overflow-x: hidden;
}

.fullHeightWithTitle {
    height: 70vh;
    overflow-x: hidden;
    overflow-y: auto;
}

.fullHeightWithTitleAndNav {
    height: 58vh;
    overflow-y: auto;
    overflow-x: hidden;
}

.card-header-title::first-letter {
    text-transform: uppercase;
}

h2 {
    text-transform: capitalize;
}

.bg-1 {
    background-color: #f44336;
}

.bg-2 {
    background-color: #c2185b;
}

.bg-3 {
    background-color: #c2185b;
}

.service-draggable {
    cursor: pointer;
}

.service-draggable-icon {
    display: none;
}

.service-draggable:hover .service-draggable-icon {
    display: block;
}

.text-ucfirst:first-letter {
    text-transform: uppercase;
}

*.unselectable {
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;

    /*
     Introduced in Internet Explorer 10.
     See http://ie.microsoft.com/testdrive/HTML5/msUserSelect/
   */
    -ms-user-select: none;
    user-select: none;
}

// .dropdown {
//     z-index: 1030;
// }
// .dropdown-menu {
//     z-index: 100000 !important;
// }
</style>
