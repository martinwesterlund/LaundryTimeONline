import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        booking: { "date": null, "booked": {}, "message": '' },
        bookings: [],
        current: { year: null, month: null, day: null },
        daysInMonth: null,
        error: null,
        fadeOut: false,
        months: ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'],
        nextDaysInMonth: null,
        password: null,
        prevDaysInMonth: null,
        selected: {
            year: null,
            month: null,
            day: null,
            timePeriods:
                [
                    { label: 'timeA', time: '8-12', booking: null },
                    { label: 'timeB', time: '12-16', booking: null },
                    { label: 'timeC', time: '16-20', booking: null },
                ]
        },

        selectedMonthData: [],
        showCheckmark: false,
        showModal: false,
        showLoginForm: false,
        showSubmitForm: false,
        user: null,
        userName: null,
        weekdays: ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'],

    },

    actions: {

        fadeOut(context) {
            setTimeout(function () {
                context.commit('fadeOut')
            }, 1500)
        },
        makeCheckmarkDisappear(context) {
            setTimeout(function () {
                context.commit('makeCmDisappear')
            }, 3000)
        }
    },

    mutations: {

        addPassword(state, password) {
            state.password = password
        },
        addUserName(state, userName) {
            state.userName = userName
        },
        bookTime(state) {
            state.showModal = !state.showModal
            state.showCheckmark = true
            this.dispatch('makeCheckmarkDisappear')
            this.dispatch('fadeOut')
            
            state.fadeOut = false
        },
        calcDaysInMonth(state) {
            state.daysInMonth = moment(state.selected.year + '-' + state.selected.month, "YYYY-MM").daysInMonth()
            this.commit('calcSelectedMonthData')
        },
        calcDaysInNextMonth(state) {
            state.nextDaysInMonth =
                7 -
                moment(
                    state.selected.year +
                    "-" +
                    state.selected.month,
                    "YYYY-MM"
                )
                    .endOf("month")
                    .format("E")
        },
        calcDaysInPrevMonth(state) {
            state.prevDaysInMonth = moment(
                state.selected.year +
                "-" +
                state.selected.month,
                "YYYY-MM"
            )
                .startOf("month")
                .format("E") - 1
        },

        calcSelectedMonthData(state) {
            state.selectedMonthData = []
            state.daysInMonth = moment(state.selected.year + "-" + state.selected.month, "YYYY-MM").daysInMonth();
            for (let i = 0; i < state.daysInMonth; i++) {
                state.selectedMonthData.push(
                    {
                        "dateId": '' + state.selected.year + '-' + state.selected.month + '-' + (i + 1),
                        "date": i + 1,
                        "timePeriods": [
                            { 'label': 'timeA', 'time': '8-12', 'booking': {} },
                            { 'label': 'timeB', 'time': '12-16', 'booking': {} },
                            { 'label': 'timeC', 'time': '16-20', 'booking': {} }
                        ]
                    }
                )


                for (let j = 0; j < state.bookings.length; j++) {
                    if (state.bookings[j].date === state.selectedMonthData[i].dateId) {
                        switch (state.bookings[j].booked) {
                            case 'timeA': state.selectedMonthData[i].timePeriods[0].booking = state.bookings[j]
                                break;
                            case 'timeB': state.selectedMonthData[i].timePeriods[1].booking = state.bookings[j]
                                break;
                            case 'timeC': state.selectedMonthData[i].timePeriods[2].booking = state.bookings[j]
                                break;
                        }
                    }
                }
            }
        },

        clearSelectedDate(state) {
            state.booking = { "date": null, "booked": {}, "message": '' }
        },

        closeModal(state) {
            state.showSubmitForm = false
            state.showModal = !state.showModal
        },

        fadeOut(state){
            state.fadeOut = true
        },

        loadFromDb(state, result) {
            state.bookings = []
            state.bookings = result
            this.commit('calcSelectedMonthData')

        },
        logIn(state, validation) {
            if (validation === 200) {
                state.user = state.userName
                this.commit('setCurrentDate')
                state.userName = null
                state.password = null
            } else if (validation === 401) {
                state.error = 'Användarnamnet eller lösenordet är felaktigt!'
            } else {
                state.error = 'Något gick snett! Testa igen senare'
            }
        },

        logOut(state) {
            state.user = null
            state.userName = null
            state.password = null
            state.error = null
        },

        makeCmDisappear(state) {
            state.showCheckmark = false
        },

        monthDown(state) {
            if (state.selected.month === 1) {
                state.selected.month = 12
                state.selected.year--
            }
            else {
                state.selected.month--
            }
            this.commit('calcDaysInPrevMonth')
            this.commit('calcDaysInNextMonth')
            this.commit('calcSelectedMonthData')
        },
        monthUp(state) {
            if (state.selected.month === 12) {
                state.selected.month = 1
                state.selected.year++
            }
            else {
                state.selected.month++
            }
            this.commit('calcDaysInPrevMonth')
            this.commit('calcDaysInNextMonth')
            this.commit('calcSelectedMonthData')
        },

        setCurrentDate(state) {
            state.current.year = moment().year()
            state.current.month = moment().month() + 1
            state.current.day = moment().date()
            state.selected.year = moment().year()
            state.selected.month = moment().month() + 1
            state.selected.day = moment().date()
            this.commit('calcDaysInMonth')
        },

        toggleLoginForm(state){
            state.showLoginForm = !state.showLoginForm
        },

        toggleModal(state, date) {
            state.showSubmitForm = false
            state.showModal = !state.showModal
            state.selected.day = date.date
        },
        toggleSubmitForm(state, label) {
            state.showSubmitForm = !state.showSubmitForm
            state.booking.message = ''
            state.booking.booked.label = label
            state.booking.date = state.selected.year + '-' + state.selected.month + '-' + state.selected.day
        }



    }

})