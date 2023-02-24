let mixin = {
    data() {
        return {
            mixData: {}
        }
    },
    watch: {
        mixData: {
            deep: true,
            handler(newdata) {
                let { id, actions, eventActionDefine, child_id, index, componentCenter } = newdata;

                let initId = id;
                let ref = actions;
                if (child_id) {
                    initId = `${initId}_childtable`;
                }
                if (index > -1) {
                    initId = `${initId}_${index}`;
                }
                componentCenter.register(initId, "comp", ref, eventActionDefine);
                return () => {
                    componentCenter.removeInstance(initId);
                };
            }
        }
    }
}
export default mixin;




