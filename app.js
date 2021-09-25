const userInfoFromlocalStorage = window.localStorage.accountInfo
const parsedUserInfo = JSON.parse(userInfoFromlocalStorage)
const currentUserId = parsedUserInfo.userid;
console.log(currentUserId)

const APIAddress = 'http://127.0.0.1:8176'

window.addEventListener('load', ()=>{
    
})