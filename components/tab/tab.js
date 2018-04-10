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
      type: Number,
      value: 0,
      observer() {
        this.setActiveItem();
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取所有子节点
    _getAllItem: function () {
      return this.getRelationNodes('./tab-item');
    },

    // 更新子节点索引
    updateIndex() {
      let nodes = this._getAllItem();
      nodes.forEach((node, index) => {
        node.setData({ index: index });
      });
    },

    // 设置子节点激活
    setActiveItem(index) {
      if (index !== undefined) {
        this.data.activeIndex = index;
      }
      let nodes = this._getAllItem();
      nodes.forEach((node, index) => {
        node.setData({ active: index === this.data.activeIndex });
      });
    }
  },

  /**
   * 组件布局完毕
   */
  ready() {
    this.setActiveItem();
  }
});