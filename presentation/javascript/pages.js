import { Dateformat, LoadCaht , Users } from "./utils.js"
import { Listener, handelcontact, QueryContact, QueryChat } from "./service.js"
import { sendMessage } from "./websocket.js"

export const Homepage = (data) => {

    let title = document.querySelector("title")
    let name = title.getAttribute("class")
    document.body.innerHTML = `
    <header class="header">
        <div class="logo">FORUM</div>
        <button id="logout">logout</button>
    </header>
    `
    let container = document.createElement("div");
    container.setAttribute("class", "container")
    let sidebar = document.createElement("aside")
    sidebar.setAttribute("class", "sidebar")
    let info = document.createElement("div")
    info.setAttribute("class", "contact")
    let profile = document.createElement("span")
    profile.setAttribute("class", "material-icons")
    profile.textContent = "account_circle"
    let user = document.createElement("span")
    user.textContent = name
    let online = document.createElement("span")
    online.setAttribute("class", "online-indicator")
    info.append(profile)
    info.append(user)
    info.append(online)
    sidebar.append(info)
    sidebar.innerHTML += `
                <h3>Category</h3>
                <div class="category-list">
                 <button class="cat" value="all" >All</button>
                <button class="cat" value="Tech Support" >Tech Support</button>
                <button class="cat" value="General Discussion">General Discussion</button>
                <button class="cat" value="Tutorials">Tutorials</button>
                <button class="cat" value="Gaming">Gaming</button>
                <button class="cat" value="Hobbies & Interests">Hobbies & Interests</button>
                <button class="cat" value="Job Listings">Job Listings</button>
                <button class="cat" value="Announcements">Announcements</button>
            </div>
    `
    container.append(sidebar)
    let main = document.createElement("main")
    main.setAttribute("class", "main-content")
    main.id = "main-content"
    let creatPost = document.createElement("div")
    creatPost.setAttribute("class", "create-post")
    creatPost.innerHTML = "<button>+ creat a post</button>"
    main.append(creatPost)
    container.append(main)
    let creatcontainer = document.createElement("div")
    creatcontainer.setAttribute("class", "form-container")
    creatcontainer.innerHTML = `
        <form name="creatpost">
            <div class="form-group">
            <div>
            <span class="material-icons" id="close">
                        close
                </span>
                <label>Post Title</label>
                <input type="text" name="title" class="form-control" placeholder="Enter post title" required >
                </div>
            </div>

            <div class="form-group">
                <label>Post Content</label>
                <textarea class="form-control" name="content"  rows="5" placeholder="Write your post content" required></textarea>
            </div>

            <div class="form-group">
                <label>Select Categories</label>
                <div class="category-grid">
                    <label class="category-checkbox"> 
                        <input type="checkbox" name="categories" value="Tech Support">
                        Tech Support
                    </label>
                    <label class="category-checkbox">
                        <input type="checkbox" name="categories" value="General Discussion" >
                        General Discussion
                    </label>
                    <label class="category-checkbox">
                        <input type="checkbox" name="categories"  value="Tutorials"  >
                        Tutorials
                    </label>
                    <label class="category-checkbox">
                        <input type="checkbox" name="categories" value="Gaming">
                        Gaming
                    </label>
                    <label class="category-checkbox">
                        <input type="checkbox" name="categories" value="Hobbies & Interests">
                        Hobbies & Interests
                    </label>
                    <label class="category-checkbox">
                        <input type="checkbox" name="categories" value="Job Listings">
                        Job Listings
                    </label>
                    <label class="category-checkbox">
                        <input type="checkbox" name="categories" value="Announcements">
                        Announcements
                    </label>
                </div>
            </div>
                <p id="error-message"></p>
            <button type="submit" class="submit-btn">Submit Post</button>
        </form>
    `
    creatcontainer.style.display = "none"
    main.append(creatcontainer)
    container.append(main)
    document.body.append(container)
    QueryContact()
    if (data && data.finish === undefined) {
        MoreData(data)
    } else {
        let post = document.createElement("div")
        post.setAttribute("class", "post")
        let p = document.createElement("p")
        p.textContent = "no post found"
        post.append(p)
        main.append(post)
    }

    // document.querySelector("#back").addEventListener("click", () => {
    //     chatContainer.style.display = "none"
    //     contacts.style.display = "block"
    // })



}

export const Contact = (data) => {
    let username = document.querySelector("title").getAttribute("class")
    let container = document.querySelector(".container")
    let contacts = document.createElement("aside")
    contacts.setAttribute("class", "contacts")
    let contact = document.createElement("div")
    contact.setAttribute("class", "contact")
    contact.setAttribute("id", "contact")
    contacts.innerHTML = `
     <div style=" margin-bottom: 1rem;">
            <span class="material-icons" id="cancel">visibility_off</span>
            <h3>contact</h3>
                 
     </div>
    `
    if (data) {
        data.forEach(element => {
            
            if (element.Nickname !== username) {
                let profile = document.createElement("p")
                profile.setAttribute("class", "users")
                profile.innerHTML = `
        <p class="profile" , data-id="${element.Id}">
        <span class="material-icons" style="margin-right: 10px;">account_circle</span>${element.Nickname}</p>
        `
                contact.append(profile)
                Users(profile , element.Nickname)
             
            }

        });
    } else {
        let profile = document.createElement("p")
        profile.textContent = "Not a contact"
        profile.setAttribute("class", "profile")
        profile.setAttribute("data-id", element.Id)
        contact.append(profile)
    }

    contacts.append(contact)
    container.append(contacts)
    document.body.append(container)
}


export const Chatemp = (data, name,id) => {
    let contact = document.querySelector(".contacts")
    contact.style.display = "none"
    let container = document.querySelector(".container")
    let chatContainer
    if (document.querySelector(".chat-container")) {
        chatContainer = document.querySelector(".chat-container")
    } else {
        chatContainer = document.createElement("div")
        chatContainer.classList.add("chat-container")
    }

    chatContainer.innerHTML = ` 
        <div class="chat-header">
        <span class="material-icons" id="back" style="cursor: pointer;">arrow_back</span>
        <span class="material-icons" style="margin-left: 30%">account_circle</span>
        ${name}
        </div>`
    container.append(chatContainer)
    let div = document.createElement("div")
    div.classList.add("chat-messages")
    div.setAttribute("data-name", name)
    if (data) {
        data.forEach(elem => {
            let msg = document.createElement("div")
            msg.classList.add("message")
            let nickname = document.createElement("div")
            if (elem.Sender === name) {
                nickname.innerHTML = `
                  <small><span class="material-icons" style="margin-right: 10px ;font-size: small;">account_circle</span></small>
               <small> ${elem.Sender}</small>
               <small style="margin-left: 30%;">${Dateformat(elem.Time)}</small>
                `
            } else {
                msg.setAttribute("class", "sendr")
                nickname.innerHTML = `
                 <small><span class="material-icons" style="margin-right: 10px ;font-size: small;">account_circle</span></small>
                 <small> ${elem.Sender}</small>
                 <small style="margin-left: 30%;">${Dateformat(elem.Time)}</small>
                `
            }

            nickname.style.display = "flex"
            let message = document.createElement("P")
            message.textContent = elem.Message
            msg.append(nickname)
            msg.append(message)
            div.append(msg)
        })


    } else {
        let msg = document.createElement("div")
        msg.style.textAlign = "center"
        msg.textContent = "Not a message available"
        div.append(msg)
    }

    chatContainer.append(div)
    chatContainer.innerHTML += `
  <div class="chat-input">
      <input type="text" placeholder="Type a message..." class="message-input">
      <button>Send</button>
    </div>`

    chatContainer.style.display = "flex"
    container.append(chatContainer)
    let divchat = document.querySelector(".chat-input button")
    divchat.id = name
    divchat.setAttribute("data-id", id)

    document.getElementById("back").addEventListener("click", () => {
        contact.style.display = "block"
        chatContainer.style.display = "none"
    })
    // 
    let message_chate = document.querySelector(".chat-messages")



    message_chate.addEventListener("scroll", LoadCaht)
    divchat.addEventListener("click", sendMessage)

}

export const MoreMessage = (data) => {
    let div = document.querySelector(".chat-messages")
    if (data) {
        data.forEach(elem => {
            let msg = document.createElement("div")
            msg.classList.add("message")
            let nickname = document.createElement("div")
            if (elem.Sender === name) {
                nickname.innerHTML = `
                     <span class="material-icons" >account_circle</span>
                    ${elem.Sender}
                    `
            } else {
                msg.setAttribute("class", "sendr")
                nickname.innerHTML = `
                     <span class="material-icons" >account_circle</span>
                    ${elem.Sender}
                    `
            }
            let message = document.createElement("P")
            let time = document.createElement("p")
            message.textContent = elem.Message
            time.textContent = Dateformat(elem.Time)
            time.style.textAlign = "end"
            msg.append(nickname)
            msg.append(message)
            msg.append(time)
            div.append(msg)
        })

    }
}



export const MoreData = (data) => {
    let main = document.querySelector(".main-content")
    let post = document.querySelectorAll(".post")
    let arr = []
    post.forEach((ele) => arr.push(ele.getAttribute("postid")))
    if (data) {
        data.forEach(element => {
            if (!arr.includes(String(element.ID))) {
                let post = document.createElement("div")
                post.setAttribute("postid", element.ID)
                post.setAttribute("class", "post")
                let post_header = document.createElement("div")
                let poster_profile = document.createElement("span")
                poster_profile.setAttribute("class", "material-icons")
                poster_profile.textContent = "account_circle"
                post_header.append(poster_profile)
                post_header.setAttribute("class", "post-header")
                let poster = document.createElement("span")
                poster.textContent = element.Username
                let time = document.createElement("span")
                time.textContent = Dateformat(element.CreatedAt)
                time.style.color = "#6c757d"
                post_header.append(poster)
                post_header.append(time)
                let title = document.createElement("h4")
                title.textContent = element.Title + "   ====> " + element.ID
                let p = document.createElement("p")
                p.textContent = element.Content
                let cat = document.createElement("i")
                cat.textContent = `Categories : [${element.Categories}]`
                cat.style.color = "#b3b3b3"
                post.append(post_header)
                post.append(title)
                post.append(p)
                post.append(cat)
                let reaction = document.createElement("div")
                reaction.setAttribute("class", "post-actions")
                let likes = document.createElement("div")
                likes.setAttribute("class", "reactions")
                likes.innerHTML = `
            <div class="like-button" data-status="of">
            <span id="like" data-type="post" data-status="of" data-id = ${element.ID}  class="material-icons">thumb_up_off_alt</span> <b>${element.Like}</b>
            </div>
            <div class="like-button" data-status="of">
            <span id="dislike" data-type="post" data-status="of" data-id = ${element.ID} class="material-icons">thumb_down_off_alt</span>  <b>${element.DisLike}</b>
            </div>`
                let comment = document.createElement("div")
                comment.textContent = `${element.Nembre} 💬`
                comment.setAttribute("id", "comment")
                comment.setAttribute("class", "of")
                comment.setAttribute("posteid", element.ID)
                console.log(element.Like);

                if (element.Have === "like") {
                    let like = likes.querySelector("#like")
                    like.setAttribute("data-status", "on")
                    like.parentNode.setAttribute("data-status", "on")
                } else if (element.Have === "dislike") {
                    let dislike = likes.querySelector("#dislike")
                    dislike.setAttribute("data-status", "on")
                    dislike.parentNode.setAttribute("data-status", "on")
                }
                reaction.append(likes)
                reaction.append(comment)
                post.append(reaction)
                main.append(post)
                post.innerHTML += `<div class="input-wrapper">
                 <textarea placeholder="Kteb commentaire..." class="comment-input" data-idpost = ${element.ID}></textarea>
                    <button class="send-button">
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                             <path d="M22 2L11 13" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                             <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                         </svg>
                    </button>
                    <p id="error-message"></p>
                    </div>`
            }
        })
        Listener()
    } else {
        let post = document.createElement("div")
        post.setAttribute("class", "post")
        let p = document.createElement("p")
        p.textContent = "no post found"
        post.append(p)
        main.append(post)
    }
}


export const Regester = () => {
    document.body.innerHTML = `
    <div id="register-container">
        <div class="info-side">
            <h2>Create an account</h2>
            <p>Join us and enjoy all the benefits of our platform</p>
            <ul class="feature-list">
                <li>Customer Service 24/7</li>
                <li>Interface simple et intuitive</li>
                <li>Protection of your personal data</li>
                <li>Regular feature updates</li>
            </ul>
        </div>
        <div class="register">
            <h1>Create Your Account</h1>
            <form id="register-form" method="post">
                <div class="name-row">
                    <div class="form-group">
                        <label for="f-n">First Name</label>
                        <input type="text" id="firstName" placeholder="John">
                    </div>
                    <div class="form-group">
                        <label for="l-n">Last Name</label>
                        <input type="text" id="lastName" placeholder="Doe">
                    </div>
                </div>
                <div class="form-group">
                    <label for="age">Age</label>
                    <input type="number" id="age" placeholder="25">
                </div>
                <div class="form-group">
                    <label for="gender">Gender</label>
                    <select id="gender">
                        <option value="" disabled selected>Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="username">Nickname</label>
                    <input type="text" id="nickname" placeholder="johndoe">
                </div>
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" placeholder="john@example.com">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" placeholder="••••••••">
                </div>
                <div class="fill" >
                    <span></span>
                </div>
                <p id="error-message"></p>
                <button type="submit" id="creat-btn">Create Account</button>
                <span class="have">Already have an account?</span>
                <button  id="log"><a href="/">Login</a></button>
            </form>
        </div>
    </div>
 `;

}

export const Login = () => {
    document.body.innerHTML = `<div id="login-container">
        <div class="info-side">
            <h2>Welcome back!</h2>
            <p>Log in to access your account</p>
            <p>Take advantage of all our exclusive services and features.</p>
        </div>
        <div class="login-form">
            <h1>Login</h1>
            <form id="login-form" method="post">
                <div class="form-group">
                    <label>Nickname / Email</label>
                    <input type="text" id="userInput" name="email" placeholder="Nickname ola Email">
                </div>
                <div class="form-group">
                    <label for="password">Mot de passe</label>
                    <input type="password" id="paswd" name="password" placeholder="••••••••" required>
                </div>
                <p id="error-message"></p>
                <button type="submit" id="login-btn">Login</button>
                <div class="register-link">
                    Pas encore de compte? <button id="resgesterlogin">Create an account</button>
                </div>
            </form>
            
        </div>
    </div>
    `
}