const userInfoFromlocalStorage = window.localStorage.accountInfo
const parsedUserInfo = JSON.parse(userInfoFromlocalStorage)
const currentUserId = parsedUserInfo.userid;
const currentEvent = localStorage.getItem('id');
const callendar = document.querySelector('#callendar')
const scheduledDays = [];
let newDate;
// console.log(currentEvent)
const APIAddress = 'http://127.0.0.1:8176'

window.addEventListener('load', ()=>{
    fetch(`${APIAddress}/api/schedules/${currentEvent}`)
    .then(response=>response.json())
    // .then(response => console.log(response.eventweek))
    .then(response => displayCurrentEvent(response.eventweek))
})
const calendarTemplate = [];




    const displayCurrentEvent = function(week){
        
        fetch('./calendar.json')
        .then(response => response.json())
        .then(response => buildCallendar(Object.values(response[week])))
    
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
    
    }, 400)