<script>
import {
  Configuration,
  Main
} from "./components";
import mockData from "./mockData.js";
export default {
  name: "App",
  components: { Configuration, Main },
  props: {
    customConfig: Object,
    info: Object,
    appVariables: Array,
    sysVariables: Array,
    themeInfo: Object,
    intlGetKey: Function,
    history: Object,
    funcRef: Object,
    isConfig: Boolean,
    mode: String,
    onConfigChange: Function
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {},
  render(h) {
    let props = this._props;

    if (this.isConfig) {
      return <Configuration {...{ props }} />;
    } else {
      return <Main {...{ props }} />;
    }
  }
};
</script>
