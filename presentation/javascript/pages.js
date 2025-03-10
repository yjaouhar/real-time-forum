import { Dateformat, LoadCaht, Users } from "./utils.js"
import { Listener, handelcontact, QueryContact, QueryChat } from "./service.js"
import { sendMessage } from "./websocket.js"

export const Homepage = (data) => {


    let title = document.querySelector("title")
    let name = title.getAttribute("class")
    document.body.innerHTML = `
    <header class="header">
    <div class="hed">
        <div  class="menu" data-vis="visibility"><span class="material-icons" style="margin: 0 30px;" >menu</span></div>
        <div class="logo">FORUM</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;"><span class="material-icons" style="color:#10b981;border:2px solid #10b981;border-radius: 100%;">account_circle</span> ${name}</div>
        <button id="logout">logout</button>
    </header>
    `
    let container = document.createElement("div");
    container.setAttribute("class", "container")
    let sidebar = document.createElement("aside")
    sidebar.setAttribute("class", "sidebar")

    sidebar.innerHTML += `
            <div>
                <h3 id="categor" class="visibility" ><svg width="50px" height="50px" viewBox="0 0 48.00 48.00" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>category-list-solid</title> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> </g> <g id="icons_Q2" data-name="icons Q2"> <path d="M24,10h0a2,2,0,0,1,2-2H42a2,2,0,0,1,2,2h0a2,2,0,0,1-2,2H26A2,2,0,0,1,24,10Z"></path> <path d="M24,24h0a2,2,0,0,1,2-2H42a2,2,0,0,1,2,2h0a2,2,0,0,1-2,2H26A2,2,0,0,1,24,24Z"></path> <path d="M24,38h0a2,2,0,0,1,2-2H42a2,2,0,0,1,2,2h0a2,2,0,0,1-2,2H26A2,2,0,0,1,24,38Z"></path> <path d="M12,2a2.1,2.1,0,0,0-1.7,1L4.2,13a2.3,2.3,0,0,0,0,2,1.9,1.9,0,0,0,1.7,1H18a2.1,2.1,0,0,0,1.7-1,1.8,1.8,0,0,0,0-2l-6-10A1.9,1.9,0,0,0,12,2Z"></path> <path d="M12,30a6,6,0,1,1,6-6A6,6,0,0,1,12,30Z"></path> <path d="M16,44H8a2,2,0,0,1-2-2V34a2,2,0,0,1,2-2h8a2,2,0,0,1,2,2v8A2,2,0,0,1,16,44Z"></path> </g> </g> </g></svg></h3>
                <div class="category-list" style="display:none">
                    <button class="cat" value="all" ><span class="material-icons">home</span></button>
                    <button class="cat" value="Tech Support" >Tech Support</button>
                    <button class="cat" value="General Discussion">General Discussion</button>
                    <button class="cat" value="Tutorials">Tutorials</button>
                    <button class="cat" value="Gaming">Gaming</button>
                    <button class="cat" value="Hobbies & Interests">Hobbies & Interests</button>
                    <button class="cat" value="Job Listings">Job Listings</button>
                    <button class="cat" value="Announcements">Announcements</button>
                </div>
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
}

export const Contact = (data) => {

    let username = document.querySelector("title").getAttribute("class")
    let aside = document.querySelector("aside")
    let contactcontainer = document.createElement("div")
    contactcontainer.classList = "contact-container"
    let contact;
    let contacts;
    if (document.getElementById("contact")) {
        contacts = document.querySelector(".proficone")
        contact = document.getElementById("contact")
    } else {
        contacts = document.createElement("div")
        contact = document.createElement("div")
        contact.setAttribute("class", "contact")
        contact.setAttribute("id", "contact")
        contact.style.display = "none"
    }


    contacts.innerHTML = `
     <div class="proficone" style=" margin-bottom: 1rem;">
            <!--<span class="material-icons" id="cancel">visibility_off</span>-->
            <h3 class="visibility" id="cancel"><svg fill="#000000" width="50px" height="50px" viewBox="-3 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>group</title> <path d="M20.906 20.75c1.313 0.719 2.063 2 1.969 3.281-0.063 0.781-0.094 0.813-1.094 0.938-0.625 0.094-4.563 0.125-8.625 0.125-4.594 0-9.406-0.094-9.75-0.188-1.375-0.344-0.625-2.844 1.188-4.031 1.406-0.906 4.281-2.281 5.063-2.438 1.063-0.219 1.188-0.875 0-3-0.281-0.469-0.594-1.906-0.625-3.406-0.031-2.438 0.438-4.094 2.563-4.906 0.438-0.156 0.875-0.219 1.281-0.219 1.406 0 2.719 0.781 3.25 1.938 0.781 1.531 0.469 5.625-0.344 7.094-0.938 1.656-0.844 2.188 0.188 2.469 0.688 0.188 2.813 1.188 4.938 2.344zM3.906 19.813c-0.5 0.344-0.969 0.781-1.344 1.219-1.188 0-2.094-0.031-2.188-0.063-0.781-0.188-0.344-1.625 0.688-2.25 0.781-0.5 2.375-1.281 2.813-1.375 0.563-0.125 0.688-0.469 0-1.656-0.156-0.25-0.344-1.063-0.344-1.906-0.031-1.375 0.25-2.313 1.438-2.719 1-0.375 2.125 0.094 2.531 0.938 0.406 0.875 0.188 3.125-0.25 3.938-0.5 0.969-0.406 1.219 0.156 1.375 0.125 0.031 0.375 0.156 0.719 0.313-1.375 0.563-3.25 1.594-4.219 2.188zM24.469 18.625c0.75 0.406 1.156 1.094 1.094 1.813-0.031 0.438-0.031 0.469-0.594 0.531-0.156 0.031-0.875 0.063-1.813 0.063-0.406-0.531-0.969-1.031-1.656-1.375-1.281-0.75-2.844-1.563-4-2.063 0.313-0.125 0.594-0.219 0.719-0.25 0.594-0.125 0.688-0.469 0-1.656-0.125-0.25-0.344-1.063-0.344-1.906-0.031-1.375 0.219-2.313 1.406-2.719 1.031-0.375 2.156 0.094 2.531 0.938 0.406 0.875 0.25 3.125-0.188 3.938-0.5 0.969-0.438 1.219 0.094 1.375 0.375 0.125 1.563 0.688 2.75 1.313z"></path> </g></svg></h3>
                 
     </div>
    `
    if (data) {
        data.forEach(element => {

            if (element.Nickname !== username) {
                let profile = document.createElement("p")
                profile.setAttribute("class", "profile")
                profile.setAttribute("contact-id", `${element.Id}`)
                profile.innerHTML = `
        <span class="material-icons" style="margin-right: 10px;">account_circle</span>${element.Nickname}</p>
        `
                if (element.Type === "online") {
                    profile.style.background = "#10b981"
                } else {
                    profile.style.background = "#939393"
                }
                contact.append(profile)
                Users(profile, element.Nickname)

            }


        });
    } else {
        let profile = document.createElement("p")
        profile.textContent = "Not a contact"
        profile.setAttribute("class", "profile")
        profile.setAttribute("contact-id", element.Id)


        contact.append(profile)
    }

    contactcontainer.append(contact)
    aside.append(contacts)
    aside.prepend(contactcontainer)

}


export const Chatemp = (data, name, id) => {

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
            let message = document.createElement("pre")
            message.className = "message-text";
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
      <textarea  class="message-input" placeholder="Type a message..."  required maxlength="1000"></textarea>
      <button>Send</button>
    </div>
    <div><small class="messageError" style="color:red ; display:none"></small></div>
    `

    chatContainer.style.display = "flex"
    container.append(chatContainer)
    let divchat = document.querySelector(".chat-input button")
    divchat.id = name
    divchat.setAttribute("data-id", id)

    document.getElementById("back").addEventListener("click", () => {
        chatContainer.style.display = "none"
    })

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

export const CategoryPost = (data) => {
    let post = document.querySelectorAll(".post")
    post.forEach(element => {
        element.remove()
    });

    MoreData(data)
}

export const MoreData = (data) => {
    let main = document.querySelector(".main-content")
    let post = document.querySelectorAll(".post")
    let arr = []
    post.forEach((ele) => arr.push(ele.getAttribute("postid")))
    if (data && data.length > 0) {
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
                title.textContent = element.Title
                let p = document.createElement("pre")
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
                <button  id="log">Login</button>
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