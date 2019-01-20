import { Component, Prop } from '@stencil/core';
// import { format } from '../../utils/utils';

@Component({
  tag: 'month-calendar',
  styleUrl: 'month-calendar.css',
  shadow: true
})
export class MonthCalendar {
  @Prop() startDate: string;
  @Prop() endDate: string;
  @Prop() startOnSundays: boolean;
  @Prop() hideOutsiders: boolean;
  @Prop() activeMonth: string;

  private weekdays: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ]

  private months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  render() {

    return this.renderMarkupForCalendar()
  }

  renderMarkupForCalendar () {
    const cal = this.renderCalendarBlock();

    return (
      <div class='datepicker-container'>
        <div class="month-header">
          {this.getMonthHeader()}
        </div>

          {this.getWeekdayHeaders()}
          {
            cal.map((week: Date[]) => {
              return (
                <div class="row">
                {
                    week.map((day: Date) => {
                      return this.renderCalendarDayBlock(day)
                    })
                  }
                </div>
              )
            })
          }
      </div>
    );
  }

  getWeekdayHeaders () {
    return (
      <div class="row weekday-header">
      {
        this.weekdays.map((day) => {
          return (
            <div class="column">{day.substr(0, 3)}</div>
          )
        })
      }
      </div>
    )
  }

  isOutsideActiveMonth (day: Date): boolean {
    return this.getActiveMonth().getMonth() !== day.getMonth();
  }

  isSelectedEndOfRange (day: Date): boolean {
    if (! this.startDate) {
      return false;
    }

    return day.getTime() === new Date(this.startDate).getTime() || day.getTime() === new Date(this.endDate).getTime();
  }

  isSelectedBetweenRange (day: Date): boolean {
    if (! this.startDate || this.isSelectedEndOfRange(day)) {
      return false;
    }

    const start = new Date(this.startDate)
    const end = new Date(this.endDate)

    return day > start && day < end
  }

  renderCalendarDayBlock (day: Date) {
    const classlist = {
      'outside-active-month': this.isOutsideActiveMonth(day),
      'hide-block': this.hideOutsiders && this.isOutsideActiveMonth(day),
      'selected-end-range': this.isSelectedEndOfRange(day),
      'selected-between-range': this.isSelectedBetweenRange(day),
      'column': true
    }

    return (
      <div class={classlist}>
        {day.getDate()}
      </div>
    )
  }

  addOneDay (date: Date): Date {
    const unix = date.getTime();

    const newSeconds = unix + (60 * 60 * 24 * 1000);

    return new Date(newSeconds);
  }

  getActiveMonth () {
    return new Date(this.activeMonth + '-01');
  }

  getMonthHeader () {
    const active = this.getActiveMonth();

    return this.months[active.getMonth()] + " " + active.getFullYear();
  }

  getStartOfMonth (): Date {
    const now = this.getActiveMonth()

    // Go back to the previous Monday.
    const currentDay = now.getDay();
    const distance = 1 - currentDay;

    now.setDate(now.getDate() + distance);

    return now;
  }

  renderCalendarBlock () {
    const daysInBlock = 42;
    let currentDate = this.getStartOfMonth()
    let calendar = [];

    for (let i = 0, col = 0, row = 0; i < daysInBlock; i++, col++, currentDate = this.addOneDay(currentDate)) {
      if (i > 0 && col % 7 === 0) {
          col = 0;
          row++;
      }

      if (calendar[row] === undefined) {
        calendar[row] = [];
      }

      calendar[row][col] = Object.assign(currentDate);
    }

    return calendar;
  }
}
