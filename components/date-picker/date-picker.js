// components/date-picker/date-picker.js
import { formatDate } from '../../libs/util';

Component({
  /**
   * 组件的属性
   */
  properties: {
    beginDate: {
      type: Object,
      value: null,
      observer() {
        this.init();
      }
    },
    endDate: {
      type: Object,
      value: null,
      observer() {
        this.init();
      }
    },
    selectedDate: {
      type: Object,
      value: null,
      observer() {
        this.init();
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    year: null,
    month: null,
    days: [], // 结构形如[{ day: 1, selected: false, disabled: false, today: false }]
    today: null,
    convertedBeginDate: null,
    convertedEndDate: null,
    convertedSelectedDate: null
  },

  // 组件实例进入节点树
  attached() {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    init() {
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let day = now.getDate();
      let today = {
        year,
        month,
        day
      };
      let selectedDate = now;

      if (this.data.selectedDate) {
        let { year, month, day } = this.data.selectedDate;
        selectedDate = new Date(year, month - 1, day);
      }
      if (this.data.beginDate) {
        let { year, month, day } = this.data.beginDate;
        this.data.convertedBeginDate = new Date(year, month - 1, day);
        if (selectedDate < this.data.convertedBeginDate) {
          selectedDate = this.data.convertedBeginDate;
        }
      }
      if (this.data.endDate) {
        let { year, month, day } = this.data.endDate;
        this.data.convertedEndDate = new Date(year, month - 1, day);
        if (selectedDate > this.data.convertedEndDate) {
          selectedDate = this.data.convertedEndDate;
        }
      }

      this.setData({
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        convertedSelectedDate: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate()
        },
        today: today
      });
      this.buildDays();
      this.triggerEvent('change', this.data.convertedSelectedDate);
    },

    // 构建日期的天数
    buildDays() {
      let { year, month, today, convertedSelectedDate: selectedDate } = this.data;
      // 当月第一天
      let firstDay = new Date(year, month - 1, 1);
      // 当月最后一天
      let lastDay = new Date(year, month, 0);
      // 第一天是星期几
      let firstDayOfWeek = firstDay.getDay();
      // 当月总天数
      let total = lastDay.getDate();
      // 当月日历占几行
      let totalRows = Math.ceil((total - (7 - firstDayOfWeek)) / 7) + 1;
      // 当月所有日期
      let days = [];
      // 当前循环到第几天
      let currDay = 1;      
      let rowDays, currDate;

      for (let i = 0; i < totalRows; i++) {	// 行循环
        rowDays = [];
        for (let j = 0; j <= 6; j++) {		// 列循环
          if (i === 0 && j >= firstDayOfWeek || i > 0 && currDay <= total) {
            currDate = new Date(year, month - 1, currDay);
            rowDays.push({
              day: currDay,
              today: year === today.year && month === today.month && currDay === today.day,
              selected: year === selectedDate.year && month === selectedDate.month && currDay === selectedDate.day,
              disabled: !!this.data.convertedBeginDate && currDate < this.data.convertedBeginDate || !!this.data.convertedEndDate && currDate > this.data.convertedEndDate
            });                              
            currDay++;
          } else {
            rowDays.push({ day: 0 });
          }
        }
        days.push(rowDays);
      }

      this.setData( { days } );
    },

    // 选择日期并触发change事件
    selectDay(e) {
      let day = e.currentTarget.dataset.day;
      
      if (day.disabled || day.selected) return;

      this.data.days.forEach(rowDays => {
        rowDays.forEach(d => {
          d.selected = d.day === day.day;
        });
      });
      this.setData({
        days: this.data.days,
        convertedSelectedDate: {
          year: this.data.year,
          month: this.data.month,
          day: day.day
        }
      });
      this.triggerEvent('change', this.data.convertedSelectedDate);
    },

    // 切换月份
    changeMonth(e) {
      let month = this.data.month + e.currentTarget.dataset.num;
      let year = this.data.year;
      
      if (month > 12) {
        year++;
        month = 1;
      }
      if (month <= 0) {
        year--;
        month = 12;
      }
      this.setData({ year, month });
      this.buildDays();
    }
  }
})
