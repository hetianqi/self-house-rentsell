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
        this.updateIndex(target);
      },
      // 每次被移动后执行
      linkChanged: function (target) {
        this.updateIndex(target);
      }
    }
  },

  /**
   * 组件的属性列表
   */
  properties: {
    index: {
      type: Number,
      value: 0
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
    // 更新索引信息
    updateIndex(parent) {
      this.data.parent = parent;
      parent.updateIndex();
    },
    // 切换tab
    onTap() {
      this.data.parent.setActiveItem(this.data.index);
    }
  }
});