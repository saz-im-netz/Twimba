import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.delete){
        handleDeleteBtnClick(e.target.dataset.delete)
    }
    else if(e.target.dataset.newreply){
        handleMyReplyClick(e.target.dataset.newreply)
    } 
    else if(e.target.id === 'reset-btn'){
        clearLocalStorage()
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked

    saveTweetsToLocalStorage(tweetsData)
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted

    saveTweetsToLocalStorage(tweetsData)
    render() 
}

function handleReplyClick(replyId){
    document.getElementById('replies-'+replyId).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })

        saveTweetsToLocalStorage(tweetsData)
        render()
        tweetInput.value = ''
    }

}

function handleDeleteBtnClick(deleteId){
    
    let position = tweetsData.findIndex(tweet => tweet.uuid === deleteId)
    

    tweetsData.splice(position, 1)
    saveTweetsToLocalStorage(tweetsData)
    render()
}

function handleMyReplyClick(myReplyId){
    const myTweetInput = document.getElementById('reply-input-'+myReplyId)   

    let targetTweetObj
    for( let tweet of tweetsData){
        if(tweet.uuid === myReplyId){
            targetTweetObj = tweet
        }
    }
 
    if(myTweetInput.value){
        targetTweetObj.replies.push({
            handle: '@Scrimba',
            profilePic: 'images/scrimbalogo.png',
            tweetText: myTweetInput.value,
        })
    }
    
    saveTweetsToLocalStorage(tweetsData)
        
    render() 

    myTweetInput.value = ''
}

function saveTweetsToLocalStorage(tweets){
    localStorage.setItem("tweetsInStorage", JSON.stringify(tweets))
}

function clearLocalStorage(){
    localStorage.clear()
    location.reload()
}

function getFeedHtml(){
    let feedHtml = ``
    let currentData
    if("tweetsInStorage" in localStorage){
        currentData = JSON.parse(localStorage.getItem("tweetsInStorage"))
    }
    else{
        currentData = tweetsData
    }

    currentData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="reply-option">
                <img src="images/scrimbalogo.png" class="profile-pic-reply">
                <input type="text" class="reply-input" id="reply-input-${tweet.uuid}">
                <i class="fa-solid fa-reply"
                    data-newreply="${tweet.uuid}"
                    ></i>
            </div>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-trash-can"
                    data-delete="${tweet.uuid}"
                    ></i>
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })

   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

