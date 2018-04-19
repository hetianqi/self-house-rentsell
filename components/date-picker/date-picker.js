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
    days: [],
    today: null,
    selectedDay: null
  },

  // 组件实例进入节点树
  attached() {
    let now = new Date('2010-2-1');
    let year = now.getFullYear();
    let month = now.getMonth();
    let today = now.getDate();

    // 当月第一天
    let firstDay = new Date(year, month, 1);
    // 当月最后一天
    let lastDay = new Date(year, month + 1, 0);
    // 第一天是星期几
    let firstDayOfWeek = firstDay.getDay();
    console.log(firstDay);

		// 当月总天数
		let totalDay = lastDay.getDate();

    console.log(firstDayOfWeek, totalDay);

		// 当月日历占几行
    let totalRows = Math.ceil((totalDay - (7 - firstDayOfWeek)) / 7 + 1);
    // 当前循环到第几天
		let currDay = 1;
    // 日期二维数组，每一维表示一行
    let days = [];
    // 每一行具体日期
    let rowDays;

    console.log(totalRows);

    for (let i = 0; i < totalRows; i++) {	// 行循环
      rowDays = [];
      for (let j = 0; j <= 6; j++) {		// 列循环
        if (i === 0 && j >= firstDayOfWeek || i > 0 && currDay <= totalDay) {
          rowDays.push(currDay);                              
          currDay++;
        } else {
          rowDays.push(0);
        }
      }
      days.push(rowDays);
    }
    
    console.log(days);
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
