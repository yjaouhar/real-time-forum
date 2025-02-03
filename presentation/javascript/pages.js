export const Regester = () => {
    document.body.innerHTML=document.body.innerHTML = `
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
            <form id="register-form">
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
            </form>
        </div>
    </div>
 `;
 
//  // Wla ymkn lik dir creation dyal kol element wa7do:
 
//  const container = document.createElement('div');
//  container.id = 'register-container';
 
//  const infoSide = document.createElement('div');
//  infoSide.className = 'info-side';
//  // ... etc l kol element
 
//  // Exemple dyal kif tzid child elements:
//  container.appendChild(infoSide);
//  document.body.appendChild(container);
}