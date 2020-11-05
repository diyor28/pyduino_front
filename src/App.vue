<template>
    <div id="app">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <router-link class="navbar-brand ml-2" active-class="active" :to="{name: 'dashboard'}">Панель</router-link>
            <ul class="navbar-nav ml-2">
                <li class="nav-item" v-for="(link, index) in links" :key="index">
                    <router-link class="nav-link pointer" active-class="active" :to="{name: link.name}">{{ link.label }}</router-link>
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
            links: [
                { name: 'sensors', label: 'Датчики' },
                { name: 'relays', label: 'Реле' },
                { name: 'greenhouses', label: 'Теплица' },
                { name: 'temps', label: 'История температур' },
                { name: 'calibration', label: 'Калибровка' }
            ]
        }
    },
    mounted() {
        this.fetchSensors({});
        this.fetchRelays({});
        this.fetchHouses({});
    },
    computed: {
        ...mapGetters('sensors', { getSensor: 'get' }),
        ...mapGetters({ temps: 'temperatures' })
    },
    methods: {
        ...mapActions('sensors', { fetchSensors: 'find' }),
        ...mapActions('relays', { fetchRelays: 'find' }),
        ...mapActions('houses', { fetchHouses: 'find' }),
    },
    watch: {}
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
