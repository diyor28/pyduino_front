<template>
    <div>
        <flat-pickr
            @on-change="parseDate"
            v-model="date"
            placeholder="Select date"
            :config="calendarOptions"
            class="position-absolute invisible"
            ref="datePickerWrap"
        ></flat-pickr>

        <div class="dropdown" id="appendHere">
            <b-button-group>
                <button class="btn btn-white" @click="clearDateRange" v-if="date_range">
                    <span class="fe fe-x"></span>
                </button>
                <b-dropdown variant="white" no-flip :text="byDateLabel || 'По дате'">
                    <div v-if="future">
                        <b-dropdown-item
                            href="#"
                            v-for="(label, index) in labelsFuture"
                            :key="index"
                            @click="setDateFilter(index)"
                        >{{label}}
                        </b-dropdown-item>
                        <hr/>
                    </div>

                    <b-dropdown-item
                        href="#"
                        v-for="(label, index) in labels"
                        :key="index"
                        @click="setDateFilter(index)"
                    >{{label}}
                    </b-dropdown-item>
                    <hr/>
                    <b-dropdown-item href="#" @click="openDatePicker">Свой диапозон</b-dropdown-item>
                </b-dropdown>
            </b-button-group>
        </div>
    </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';

export default {
    props: ['future', 'initial'],
    components: {
        flatPickr
    },
    computed: {
        byDateLabel() {
            if (this.date_range == 'custom') {
                return this.date;
            } else
                return this.labels[this.date_range];
        },
    },
    data() {
        return {
            date: null,
            dates: {},
            date_range: null,
            labels: {
                'today': 'Сегодня',
                'yesterday': 'Вчера',
                'this_week': 'На этой неделе',
                'previous_week': 'Прошлая неделя',
                'this_month': 'Этот месяц',
                'previous_month': 'Прошлый месяц',
            },
            calendarOptions: {
                wrap: true,
                mode: "range",
                positionElement: window.document.getElementById('appendHere'),
                altFormat: 'F j, Y',
                dateFormat: "F j, Y",
                ariaDateFormat: 'd.m.Y',
                maxDate: this.future ? '' : new Date(),
            },
        }
    },

    mounted() {
        if (this.initial) this.setDateFilter(this.initial)
    },
    methods: {
        emit() {
            this.$emit('input', { 'start': this.dates.start, 'end': this.dates.end });
        },
        clearDateRange() {
            this.date_range = null;
            this.date = null;
            this.dates = {};
            this.emit();
        },
        setDateFilter(range) {
            this.date_range = range;
            this.dates.start = this.$moment();
            this.dates.end = this.$moment();


            switch (range) {

                case 'tomorrow':
                    this.dates.start.add('1', 'day').startOf('day');
                    this.dates.end.add('1', 'day').endOf('day');
                    break;
                case 'next_week':
                    this.dates.start.add('1', 'week').startOf('week');
                    this.dates.end.add('1', 'week').endOf('week');
                    break;
                case 'next_month':
                    this.dates.start.add('1', 'month').startOf('month');
                    this.dates.end.add('1', 'month').endOf('month');
                    break;

                case 'yesterday':
                    this.dates.start.subtract('1', 'day').startOf('day');
                    this.dates.end.subtract('1', 'day').endOf('day');
                    break;
                case 'this_week':
                    this.dates.start.startOf('week');
                    this.dates.end.endOf('week');
                    break;
                case 'previous_week':
                    this.dates.start.subtract('1', 'week').startOf('week');
                    this.dates.end.subtract('1', 'week').endOf('week');
                    break;
                case 'this_month':
                    this.dates.start.startOf('month');
                    this.dates.end.endOf('month');
                    break;
                case 'previous_month':
                    this.dates.start.subtract('1', 'month').startOf('month');
                    this.dates.end.subtract('1', 'month').endOf('month');
                    break;

                default:
                // code block
            }
            this.dates.start.startOf('day');
            this.dates.end.endOf('day');
            this.emit();
        },
        openDatePicker() {
            const flatPickrInstance = this.$refs.datePickerWrap.fp;
            flatPickrInstance._positionElement = window.document.getElementById('appendHere'); // eslint-disable-line
            flatPickrInstance.open();
        },
        parseDate(date) {

            if (date.length <= 0) {
                return false;
            }
            this.dates.start = this.$moment(date[0]).startOf('day');
            this.dates.end = this.$moment(date[1]).endOf('day');
            this.date_range = 'custom';
            this.emit();
        },
    }
}
</script>
