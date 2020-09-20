<script>
import {Line, mixins} from 'vue-chartjs'
import {mapGetters} from 'vuex'

const {reactiveData} = mixins

export default {
  extends: Line,
  props: {
      data: Object
  },
  data() {
    return {
      colors: [
          '#f87979',
          '#4c65b0',
          '#79f886',
          '#27ffed',
          '#392b2b',
          '#ff0000',
          '#4a6e2a',
          '#f87979',
          '#102d67',
          '#13584a',
          '#f87979',
          '#00ff88',
          '#f87979',
          '#82ffa3',
          '#1e556e',
          '#662222',
          '#88872b',
          '#e5f879',
          '#a800ff',
          '#f55eff',
          '#e08341',
          '#ff6500',
          '#ffb9b9'
      ],

      options: {
        responsive: true,
        aspectRatio: 8,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              steps: 15,
              stepSize: 0.5,
              // suggestedMin: ,
              // suggestedMax: 35
            }
          }]
        }
      }
    }
  },
  mixins: [reactiveData],
  mounted() {
    this.updateData(this.data);
    this.render();
  },
  watch: {
    data: {
      deep: true,
      handler(newVal) {
        this.updateData(newVal)
      }
    }
  },
  methods: {
    render() {
      this.renderChart(this.chartData, this.options)
    },

    updateData(data) {
      const labels = (Object.values(data)[0] || []).map(el => this.processDate(el.date))
      this.chartData = {
        labels,
        datasets: Object.entries(data).map(([key, values], index) => {
          return {
            label: values[0].label,
            fill: false,
            borderColor: this.colors[index],
            data: values.map(el => ({y: el['temperature'], x: new Date(el['date'])}))
          }
        })
      };
    },

    processDate(dateString) {
      return this.$moment(dateString).format('h:mm:ss a')
    }
  }
}
</script>

<style>
</style>