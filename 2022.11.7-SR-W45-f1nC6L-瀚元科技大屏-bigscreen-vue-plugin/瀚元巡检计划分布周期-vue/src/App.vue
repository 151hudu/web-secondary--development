<script>
import {
  DataConfiguration,
  StyleConfiguration,
  OtherConfiguration,
  Main
} from "./components";
import mockData from "./mockData.js";

export default {
  name: "App",
  components: { StyleConfiguration, DataConfiguration, OtherConfiguration, Main },
  props: {
    componentId: String,
    eventBus: Object,
    options: {
      type: Object,
      default: () => ({
        // 配置项从externalVariables里取
        externalVariables: {}
      })
    },
    block: Object,
    bigscreen: Object,
    notifyVariable: Function,
    type: String,
    mode: String,
    pubSub: Object,
    updateProcess: Function,
    variable: Object
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {
    this.eventBus?.on((newProps) => {
      for (const newPropsKey in newProps) {
        this[newPropsKey] = newProps[newPropsKey];
      }
    });
  },
  mounted() {
  },
  beforeDestroy() {
    this.eventBus?.remove();
  },
  methods: {
    Event_Center_getName: () => {
      return this.id;
    }
  },
  render(h) {
    if (this.mode === "development") {
      let props = mockData;
      return (
        <div>
          <div id={"main"}>
            <div class="left">主视图</div>
            <div class="right" style={{ height: "600px" }}>
              <Main {...{ props }}></Main>
            </div>
          </div>
          <div id={"style"}>
            <div class="left">style</div>
            <div class="right">
              <StyleConfiguration {...{ props }} />
            </div>
          </div>
          <div id={"data"}>
            <div class="left">data</div>
            <div class="right">
              <DataConfiguration {...{ props }} />
            </div>
          </div>
          <div id={"other"}>
            <div class="left">other</div>
            <div class="right">
              <OtherConfiguration {...{ props }} />
            </div>
          </div>
        </div>
      );
    } else {
      let props = this._props;
      let handleConfiguration = () => {
        const { block } = props;
        const { dataConfig } = block;
        const { pluginOptions = {}, columns } = dataConfig;
        pluginOptions.columns = columns;
        return pluginOptions;
      };
      let changeConfiguration = (pluginOptions) => {
        const {
          bigscreen: { updateBlockById, pluginDetailMap },
          block: {
            baseConfig: { id }
          }
        } = props;
        updateBlockById(id, { dataConfig: { pluginOptions: { ...pluginOptions } } });
        pluginDetailMap[`${id}-default`].detail.ref.current.run();
      };
      props = { configuration: handleConfiguration(), ...props };
      if (!this.type) {
        return <Main {...{ props }} />;
      } else {
        const renderHashMap = {
          dataConfiguration: DataConfiguration,
          styleConfiguration: StyleConfiguration,
          otherConfiguration: OtherConfiguration
        };
        const Comp = renderHashMap[this.type];
        props = { configuration: handleConfiguration(), changeConfiguration, ...props };
        return (
          <Comp {...{ props }} />
        );

      }
    }

  }
};
</script>
