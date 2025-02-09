import { Dateformat } from "./utils.js"

export const Homepage = (data) => {
    let title = document.querySelector("title")
    console.log(title);

    let name = title.getAttribute("class")
    // console.log("=>", data[0])
    document.body.innerHTML = `
    <header class="header">
        <div class="logo">FORUM</div>
        <button>logout</button>
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
                <button>Tech Support</button>
                <button>General Discussion</button>
                <button>Tutorials</button>
                <button>Gaming</button>
                <button>Hobbies & Interests</button>
                <button>Job Listings</button>
                <button>Announcements</button>
            </div>
    `
    container.append(sidebar)
    let main = document.createElement("main")
    main.setAttribute("class", "main-content")
    main.id= "main-content"
    //================================

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
    if (data) {
        MoreData(data)
    } else {
        let post = document.createElement("div")
        post.setAttribute("class", "post")
        let p = document.createElement("p")
        p.textContent = "no post found"
        post.append(p)
        main.append(post)
        container.append(main)
    }
    //================================
    let contacts = document.createElement("aside")
    contacts.setAttribute("class", "contacts")
    contacts.innerHTML = `
     <div style=" margin-bottom: 1rem;">
  <span class="material-icons" id="cancel">visibility_off</span>
                <h3>contact</h3>
                 
            </div>
    `
    let contact = document.createElement("div")
    contact.setAttribute("class", "contact")
    contact.setAttribute("id", "contact")

    let sp = document.createElement("span")
    sp.textContent = "yjaouhar"
    contact.append(profile)
    contact.append(sp)
    contacts.append(contact)
    container.append(contacts)
    document.body.append(container)

}


export const MoreData = (data) => {

    let main = document.querySelector("#main-content")
    if (data) {
        data.forEach(element => {
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
            likes.innerHTML = `
    <button>👍</button>
    <button>👎</button>`
            let comment = document.createElement("div")
            comment.textContent = `${element.Nembre} 💬`
            comment.setAttribute("id", "comment")
            comment.setAttribute("class", "of")
            comment.setAttribute("posteid", element.ID)
            reaction.append(likes)
            reaction.append(comment)
            post.append(reaction)
            main.append(post)
            // container.append(main)
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
        })
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
                <div class="fill">
                    <span>Fill in all fields</span>
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
                    <input type="email" id="nicknameDateformat" name="email" placeholder="example@email.com">
                </div>
                <div class="form-group">
                    <label for="password">Mot de passe</label>
                    <input type="password" id="paswd" name="password" placeholder="••••••••" required>
                </div>
                <p id="error-message"></p>
                <button type="submit" id="login-btn">Login</button>
                <div class="register-link">
                    Pas encore de compte? <button id="c-a">Create an account</button>
                </div>
            </form>
            
        </div>
    </div>
    `
}