// exposed header 
// /api/schedules/eventschedule
// /api/schedules/:eventid
// /api/schedules/eventschedule

const userInfoFromlocalStorage = window.localStorage.accountInfo
const parsedUserInfo = JSON.parse(userInfoFromlocalStorage)
const currentUserId = parsedUserInfo.userid;
const currentEvent = localStorage.getItem('id');
const callendar = document.querySelector('#callendar')
const calendarTitle = document.querySelector('#calendartitle')
const btnSubmitSchedule = document.querySelector('#btnSubmitSchedule')
const scheduledDays = [];
let newDate;
// console.log(currentEvent)
const APIAddress = 'http://127.0.0.1:8888'

window.addEventListener('load', (e) => {
    const token = window.localStorage.getItem('x-authenticate-token');
    const fetchOptions = {
        headers: {'Content-Type': 'application/json'}
    }

    if (token) fetchOptions.headers['x-authenticate-token'] = token;
    console.log(fetchOptions.headers);

    if(token){
        fetchOptions.method = 'GET';
        fetch(`${APIAddress}/api/schedules/${currentEvent}`, fetchOptions)
        
        .then(response=>response.json())
        // .then(response => console.log(response.eventweek))
        .then(response => displayCurrentEvent(response))
        .catch(console.error)
        loadOtherEvents()

    }
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
            };
        };
    };

    // const eventData = [];

const loadOtherEvents = function(){

    const token = window.localStorage.getItem('x-authenticate-token');
    const fetchOptions = {
        headers: {'Content-Type': 'application/json'}
    }

    if (token) fetchOptions.headers['x-authenticate-token'] = token;
    console.log(fetchOptions.headers);

    if(token){
        fetchOptions.method = 'GET';
        fetch(`${APIAddress}/api/schedules/${currentEvent}`, fetchOptions)
        .then(response => response.json())
        .then(response => getAllSchedules(response))
        .catch(console.error)

        const getAllSchedules = function(data){
            const totalSchedules = [];
            const arrayOfSchedules = [];
            const arrayOfUserSchedule = [];
            let temporary;
            let temporaryUser;
            data.schedules.forEach(el =>{
                if(el.userid == currentUserId){
                    temporaryUser = el.schedulearray.replace(/[\[\]\"']+/g,'')
                    arrayOfUserSchedule.push(temporaryUser)
                }else{
                    temporary = el.schedulearray.replace(/[\[\]\"']+/g,'')
                    arrayOfSchedules.push(temporary)
                }
            });
            

            const temp = document.querySelectorAll('.table-day');
            const eventdata = []
            temp.forEach(el=>{
                eventdata.push(el.id)
            });
            // console.log(eventdata)
            // const eventdata = [];
            // temp.forEach(el=>{
            //     eventdata.push(el.id)
            //     console.log(eventdata)
            // })

            setTimeout(compareSchedules(arrayOfSchedules,eventdata, arrayOfUserSchedule),1000)

            // console.log(eventdata)
        };
    }
    const compareSchedules = function(hours, timeslots, userhours){
        let counter = 0;
        let rgba = 0;

        hours.forEach(el=>{

            timeslots.forEach(el2=>{
                if(el.includes(el2)){
                    document.getElementById(`${el2}`).innerHTML += '| '
                    document.getElementById(`${el2}`).style.background=`rgb(255, 204, ${rgba})`
                    rgba += 2;
                }else{
                    console.log('nope');
                };
            });
        });

        userhours.forEach(el=>{
            timeslots.forEach(el2=>{
                if(el.includes(el2)){
                    document.getElementById(`${el2}`).innerHTML += '| '
                    document.getElementById(`${el2}`).classList.add('active')
                    scheduledDays.push(el2)
                };
            });
        });
    };
};

console.log(currentUserId)
const currentEventInt = parseInt(currentEvent, 10)
console.log(typeof(currentEventInt));

btnSubmitSchedule.addEventListener('click', (e) => {
    const token = window.localStorage.getItem('x-authenticate-token');

    const newSchedulePayload = {
        'eventid': currentEventInt,
        'userid': currentUserId,
        'schedulearray': JSON.stringify(scheduledDays),
    }

    const fetchOptions = {
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newSchedulePayload),
    }

    if (token) fetchOptions.headers['x-authenticate-token'] = token;
    console.log(fetchOptions.headers);

    if (token){
        fetchOptions.method = 'POST';
        fetch(`${APIAddress}/api/schedules/eventschedule`, fetchOptions)
    }
})

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
    
    
    }, 1000);