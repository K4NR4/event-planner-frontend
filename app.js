const userInfoFromlocalStorage = window.localStorage.accountInfo
const parsedUserInfo = JSON.parse(userInfoFromlocalStorage)
const currentUserId = parsedUserInfo.userid;
const currentUserName = parsedUserInfo.username;
const dashboardMain = document.querySelector('#dashboard-main')
const dashboardHeader = document.querySelector('#dashboard-header')
const btnCreateEvent = document.querySelector('#btnCreateEvent')
const newEventForm = document.querySelector('#newEventForm')
const btnSubmit = document.querySelector('#btnSubmit')
const events = [];
const APIAddress = 'http://127.0.0.1:8888'
window.addEventListener('load', () => {
    loadDashboard();
    loadUserDashboard()
})



const loadAllUserEvents = function(info){
    dashboardHeader.innerHTML += `
    <h2>Welcome ${currentUserName}</h2>
    `;
    info.forEach(el =>{
        dashboardMain.innerHTML += `
        <div class='event' id='${el.eventid}'>
            <div class='event-title'>
                <h2>${el.eventname}</h2>
            </div>
            <div class='event-body'>
                <h3>${el.eventdescription}</h3>
                <h4>Event week: ${el.eventweek}</h4>
            </div>
        </div>
        `
        events.push(el)
    })

}


const loadAllUserEventsNoTitle = function(info){

    info.forEach(el =>{
        // console.log(el)
        dashboardMain.innerHTML += `
        <div class='event' id='${el.eventid}'>
            <div class='event-title'>
                <h2>${el.eventname}</h2>
            </div>
            <div class='event-body'>
                <h3>${el.eventdescription}</h3>
                <h4>Event week: ${el.eventweek}</h4>
            </div>
        </div>
        `
        events.push(el)
    })
}

// console.log(events)


btnCreateEvent.addEventListener('click', ()=>{
    newEventForm.classList.toggle('hidden')
})
const newEventSubmission =[];
btnSubmit.addEventListener('click', ()=>{

    

    const eventName = document.querySelector('#formEventName').value;
    const eventWeek = document.querySelector('#formEventWeek').value;
    const eventDescription = document.querySelector('#formEventDescription').value

    // check if all fields are populated
    if(!eventName && !eventWeek && !eventDescription){
        return alert("you cannot leave empty fields")
    }

    newEventSubmission.push(
        {
            "eventname" : eventName,
            "eventdescription" : eventDescription,
            "eventweek" : eventWeek,
            "userid" : currentUserId
        }
    )

    // console.log(newEventSubmission[0])
    const fetchOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(newEventSubmission[0])
}
    fetch(APIAddress + `/api/schedules`, fetchOptions)

    
    loadUserDashboard()
    setTimeout(function(){
        window.location.reload()
    },1100)
})


const loadDashboard = function(){
    fetch(`${APIAddress}/api/users/${currentUserId}`)
    .then(response=>response.json())
    .then(response => loadAllUserEvents(response))
}

const loadUserDashboard = function(){
    fetch(`${APIAddress}/api/schedules/dashboard/${currentUserId}`)
    .then(response=>response.json())
    .then(response => loadAllUserEventsNoTitle(response))


}

let allEvents = []
setTimeout(function(){
    allEvents = document.querySelectorAll('.event')
    // console.log(allEvents[0])
    allEvents.forEach(el => {
        // console.log(el)
        el.addEventListener('click', ()=>{
            localStorage.setItem('id', el.id)
            window.location.href='event.html'
            // console.log(`You clicked ${el.id} `)
        })
    })
},1000)