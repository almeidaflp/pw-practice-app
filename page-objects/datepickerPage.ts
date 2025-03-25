import { expect, Page } from '@playwright/test'
import { HelperBase } from './helperBase'

export class DatepickerPage extends HelperBase{


    constructor(page: Page){
        super(page)
    }

    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number){
        const calendarInputField = this.page.getByPlaceholder('Form Picker')
        await calendarInputField.click()
        const dateToAssert =  await this.selectDateInTheCalendar(numberOfDaysFromToday)
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    async selectDatepickerWithRangeFromToday(startDateFromToday: number, endDateFromToday: number){
        const calendarInputField = this.page.getByPlaceholder('Range Picker')
        await calendarInputField.click()
        const dateToAssertStart =  await this.selectDateInTheCalendar(startDateFromToday)
        const dateToAssertEnd =  await this.selectDateInTheCalendar(endDateFromToday)
        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    private async selectDateInTheCalendar(numberOfDaysFromToday: number){        
        let date = new Date()
        date.setDate(date.getDate() + numberOfDaysFromToday)
        const expectDate = date.getDate().toString()
        const expectedMonthShort = date.toLocaleString('En-Us', {month: 'short'})
        const expectedMonthLong = date.toLocaleString('En-Us', {month: 'long'})
        const expectedYear = date.getFullYear()
        const dateToAssert = `${expectedMonthShort} ${expectDate}, ${expectedYear}`
    
        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `
        while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }
        const dayCell = this.page.locator('[class="day-cell ng-star-inserted"]')
        const rangeCell = this.page.locator('[class="range-cell day-cell ng-star-inserted"]')
        if(await dayCell.first().isVisible()){
            await dayCell.getByText(expectDate, {exact: true}).click()
        } else {
            await rangeCell.getByText(expectDate, {exact: true}).click()
        }

        return dateToAssert
    }
}