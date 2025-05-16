export const Login = ()=>{
    document.querySelector(".style").setAttribute("href","../static/login.css")
    
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

export const Regester = () => {
    document.querySelector(".style").setAttribute("href","../static/regester.css")
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
