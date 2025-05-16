import {QueryContact} from "../Chat/chat_servece.js"
import { Dateformat} from "../utils.js"

export const Homepage = (data) => {
    
    document.querySelector(".style").setAttribute("href","../static/style.css")

    let title = document.querySelector("title")
    let name = title.getAttribute("class")
    document.body.innerHTML = `
    <header class="header">
    <div class="hed">
    <div class="logo">FORUM</div>
        </div>
        <div class="menu">Category<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path fill="currentColor" d="M10.964 5.972 8.177 8.759a.25.25 0 0 1-.354 
        0L5.036 5.972a.75.75 0 1 0-1.06 1.06L6.762 9.82a1.75 1.75 0 0 0 2.475 0l2.787-2.788a.75.75 0 1 0-1.06-1.06"></path></svg></div>
        <div style="display:flex;flex-direction:column;align-items:center;"><span class="material-icons" style="color:#10b981;border:2px solid #10b981;border-radius: 100%;">account_circle</span> ${name}</div>
        <button id="logout">logout</button>
    </header>
    <div class="notification" >
        <div class="notification-icon">
            <span class="material-icons" id="icon">notifications</span>
        </div>
        <div class="notification-content">
            <p class="notification-title">Notification</p>
            <p class="notification-message">notification</p>
        </div>
    </div>
    `
    let container = document.createElement("div");
    container.setAttribute("class", "container")
    let sidebar = document.createElement("div")
 sidebar.classList.add("sidebar")
 sidebar.setAttribute("visibility","off")
sidebar.style.display="none"
    sidebar.innerHTML += `
                <div class="category-list" style="display:block">
                    <button class="cat" value="all" >Home</button>
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
    main.innerHTML+=`
    <div class="contact-bar">
  <div class="contact-scroll"></div>
</div>

    `
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
                time.style.marginLeft="20px"
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
                let comment = document.createElement("div")
                comment.textContent = `${element.Nembre} 💬`
                comment.setAttribute("id", "comment")
                comment.setAttribute("class", "of")
                comment.setAttribute("posteid", element.ID)
           

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
        // Listener()
    } else {
        let post = document.createElement("div")
        post.setAttribute("class", "post")
        let p = document.createElement("p")
        p.textContent = "no post found"
        post.append(p)
        main.append(post)
    }
}
