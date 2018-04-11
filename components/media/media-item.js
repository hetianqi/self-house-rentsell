// components/media/media-item.js
Component({
  /**
   * 组件选项
   */
  options: {
    multipleSlots: true
  },

  /**
   * 组件关系
   */
  relations: {
    './media': {
      type: 'parent'
    }
  },

  /**
   * 组件的属性列表
   */
  properties: {
    iconPath: {
      type: String,
      value: ''
    }
  },
});