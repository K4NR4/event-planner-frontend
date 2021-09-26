const userInfoFromlocalStorage = window.localStorage.accountInfo
const parsedUserInfo = JSON.parse(userInfoFromlocalStorage)
const currentUserId = parsedUserInfo.userid;
const currentEvent = localStorage.getItem('id');
const callendar = document.querySelector('#callendar')
const calendarTitle = document.querySelector('#calendartitle')
const scheduledDays = [];
let newDate;
// console.log(currentEvent)
const APIAddress = 'http://127.0.0.1:8176'

window.addEventListener('load', ()=>{
    fetch(`${APIAddress}/api/schedules/${currentEvent}`)
    .then(response=>response.json())
    // .then(response => console.log(response.eventweek))
    .then(response => displayCurrentEvent(response))


    loadOtherEvents()

})
const calendarTemplate = [];


    const displayCurrentEvent = function(event){
        let parsedAccountinfo = JSON.parse(window.localStorage.accountInfo)
        let username = parsedAccountinfo.username;
        calendarTitle.innerHTML = `
        <div class='eventTitle'> ${event.eventname}</div>
        <div class='eventDescription'>What: ${event.eventdescription}</div>
        <div class='eventWeek'>When:${event.eventweek}</div>
        <div class='eventOwner'>Who: ${username}</div>
        `
        
        fetch('./calendar.json')
        .then(response => response.json())
        .then(response => buildCallendar(Object.values(response[event.eventweek])))

        const buildCallendar = function(date){
            newDate = new Date (date)

        
        for(let i = 0; i < 7; i++){
    
            for(let j = 1; j<13; j++){
                callendar.innerHTML += `
                <div class="table-day" style="grid-row: ${j}/${j+1};" id= "${newDate}"></div>
                `
                newDate.setHours(newDate.getHours() + 2 )
            }
            
        }
        }
    }


    // const eventData = [];

const loadOtherEvents = function(){
    fetch(`${APIAddress}/api/schedules/${currentEvent}`)
    .then(response => response.json())
    .then(response => getAllSchedules(response))



    const getAllSchedules = function(data){
        const arrayOfSchedules = [];
        let temporary;
        data.schedules.forEach(el =>{
            temporary = el.schedulearray.replace(/[\[\]\"']+/g,'')
            arrayOfSchedules.push(temporary)
            
            return arrayOfSchedules;
            
        })
        // console.log(arrayOfSchedules)

        const temp = document.querySelectorAll('.table-day');
        const eventdata = [];
        temp.forEach(el=>{
            eventdata.push(el.id)
        })

        setTimeout(compareSchedules(arrayOfSchedules,eventdata),1000)

        console.log(eventdata)
    }

    const compareSchedules = function(hours, timeslots){
            hours.forEach(el=>{
                // console.log(el)
                timeslots.forEach(el2 =>{
                    if(el2.includes(el)){
                        
                    }else{
                        console.log(`EL = ${el}` )
                        console.log(` EL2 = ${el2}`)
                    }
                })
            })
    }

    // setTimeout(function(){
    //     getAllSchedules(data)
    // },1000)

}

























    
    setTimeout(function(){
        const dayTimeArray = Array.from(document.querySelectorAll('.table-day'))
        const dayTimePicker = function(){
        
        dayTimeArray.forEach(el =>{
                coolFunc(el)
            })
        }
    
    const coolFunc = function (el){
        let temp;
        let temptemp;
        // console.log(el.id)
        el.addEventListener('click', ()=>{
            el.classList.toggle('active')
            if(scheduledDays.includes(el.id)){
                temptemp = scheduledDays.indexOf(el.id);
                // console.log(temptemp)
                if (temptemp > -1) {
                    scheduledDays.splice(temptemp, 1);
                  }
            }else{
                temp = el.id;
                scheduledDays.push(temp)
            }
            console.log(scheduledDays)
            
        })
    }
    dayTimePicker()
    
    
    }, 1000)