const userInfoFromlocalStorage = window.localStorage.accountInfo
const parsedUserInfo = JSON.parse(userInfoFromlocalStorage)
const currentUserId = parsedUserInfo.userid;
const currentUserName = parsedUserInfo.username;
const dashboardMain = document.querySelector('#dashboard-main')
const dashboardHeader = document.querySelector('#dashboard-header')
const events = [];
console.log(currentUserId)

window.addEventListener('load', () => {
    fetch(`${APIAddress}/api/users/${currentUserId}`)
    .then(response=>response.json())
    .then(response => loadAllUserEvents(response))
})

const loadAllUserEvents = function(info){
    info.forEach(el => {
        dashboardHeader.innerHTML = `Welcome ${currentUserName}`;
        dashboardMain.innerHTML += `
        <div class='event'>
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
console.log(events)
let allEvents = []
setTimeout(function(){
    allEvents = document.querySelectorAll('.event')
    allEvents.forEach(el => {
        el.addEventListener('click', ()=>{
            window.location.href='event.html'
        })
    })
},1000)