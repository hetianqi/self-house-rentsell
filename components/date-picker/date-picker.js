// components/date-picker/date-picker.js
import { formatDate } from '../../libs/util';


Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    year: null,
    month: null,
    days: [],
    today: null,
    selectedDay: null
  },

  // 组件实例进入节点树
  attached() {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();
    let today = [year, month, now.getDate()];

    this.setData({
      month,
      year,
      today: today,
      selectedDay: today[2]
    });
    this.buildDays();
  },

  /**
   * 组件的方法列表
   */
  methods: {   
    // 构建日期的天数
    buildDays() {
      // 当月第一天
      let firstDay = new Date(this.data.year, this.data.month, 1);
      // 当月最后一天
      let lastDay = new Date(this.data.year, this.data.month + 1, 0);
      // 第一天是星期几
      let firstDayOfWeek = firstDay.getDay();
      // 当月总天数
      let total = lastDay.getDate();
      // 当月日历占几行
      let totalRows = Math.ceil((total - (7 - firstDayOfWeek)) / 7) + 1;
      // 当前循环到第几天
      let currDay = 1;
      // 日期二维数组，每一维表示一行
      let days = [];
      // 每一行具体日期
      let rowDays;

      for (let i = 0; i < totalRows; i++) {	// 行循环
        rowDays = [];
        for (let j = 0; j <= 6; j++) {		// 列循环
          if (i === 0 && j >= firstDayOfWeek || i > 0 && currDay <= total) {
            rowDays.push(currDay);                              
            currDay++;
          } else {
            rowDays.push(0);
          }
        }
        days.push(rowDays);
      }

      console.log(days);

      this.setData( { days } );
    },

    // 选择日期并触发change事件
    selectDay(e) {
      let day = e.currentTarget.dataset.day;

      this.setData({
        selectedDay: day
      });
      this.triggerEvent('change', [this.data.year, this.data.month, day]);
    }
  }
})
