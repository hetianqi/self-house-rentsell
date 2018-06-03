// components/tab/tab-item.js
Component({
  /**
   * 组件关系
   */
  relations: {
    './tab': {
      type: 'parent',
      // 每次被插入到父节点时执行
      linked: function (target) {
        this.setParent(target);
      }
    }
  },

  /**
   * 组件的属性列表
   */
  properties: {
    index: {
      type: String,
      value: ''
    },
    active: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的数据列表
   */
  data: {
    parent: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 设置父节点
    setParent(parent) {
      this.data.parent = parent;
    },
    // 切换tab
    onTap() {
      this.data.parent.setActiveItem(this.data.index);
    }
  }
});