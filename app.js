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
console.log(currentUserId)
const APIAddress = 'http://127.0.0.1:8888'



    window.addEventListener('load', () => {
        const token = window.localStorage.getItem('x-authenticate-token');
        const fetchOptions = {
            headers: {'Content-Type': 'application/json'}
        }

        if (token) fetchOptions.headers['x-authenticate-token'] = token;
        console.log(fetchOptions.headers);
        
        // render public article
        fetchOptions.method = 'GET';
        if(token){
            fetch(`${APIAddress}/api/users/${currentUserId}`, fetchOptions)
            .then(response=>response.json())
            .then(response => loadAllUserEvents(response))
        }
    })

    const loadAllUserEvents = function(info){
        dashboardHeader.innerHTML += `
        <h2>Welcome ${currentUserName}</h2>
        `;
        info.forEach(el =>{
            console.log(el)
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

console.log(events)

let allEvents = []
setTimeout(function(){
    allEvents = document.querySelectorAll('.event')
    allEvents.forEach(el => {
        el.addEventListener('click', ()=>{
            window.location.href='event.html'
            localStorage.setItem('id', el.id)
            let ourID = localStorage.getItem('id')
            console.log(`OUR ID IS ${ourID}`)
            window.location.href='event.html'
        })
    })
},1000)

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

    console.log(newEventSubmission[0])
    const fetchOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(newEventSubmission[0])
}
    fetch(APIAddress + '/api/schedules', fetchOptions)
        .then(response => {
            console.log(response);
            newEventForm.classList.toggle('hidden');
        });
});


