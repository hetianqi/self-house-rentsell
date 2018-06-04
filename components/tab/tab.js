// components/tab/tab.js
Component({
  /**
   * 组件关系
   */
  relations: {
    './tab-item': {
      type: 'child'
    }
  },

  /**
   * 组件的属性列表
   */
  properties: {
    // 当前激活的tab-item的索引
    activeIndex: {
      type: String,
      value: '',
      observer(v) {
        this.setActiveItem();
      }
    }
  },

  data: {
    initFlag: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取所有子节点
    _getAllItem: function () {
      return this.getRelationNodes('./tab-item');
    },

    // 设置子节点激活
    setActiveItem(index) {
      // 如果点击的是当前已激活的tab则不做处理
      if (index === this.data.activeIndex) return;
      if (index !== undefined) {
        this.data.activeIndex = index;
      }
      let nodes = this._getAllItem();
      nodes.forEach((node, index) => {
        node.setData({ active: node.data.index === this.data.activeIndex });
      });
      if (this.data.initFlag) {
        // 出发自定义事件供调用者知晓tab切换
        this.triggerEvent('tabchange', { index: this.data.activeIndex });
      } else {
        this.data.initFlag = true;
      }      
    }
  }
});