let switchCtn = document.querySelector("#switch-cnt");
let switchC1 = document.querySelector("#switch-c1");
let switchC2 = document.querySelector("#switch-c2");
let switchCircle = document.querySelectorAll(".switch__circle");
let switchBtn = document.querySelectorAll(".switch-btn");
let aContainer = document.querySelector("#a-container");
let bContainer = document.querySelector("#b-container");

let changeForm = (e) => {
    switchCtn.classList.add("is-gx");
    setTimeout(function(){
        switchCtn.classList.remove("is-gx");
    }, 1500)

    switchCtn.classList.toggle("is-txr");
    switchCircle[0].classList.toggle("is-txr");
    switchCircle[1].classList.toggle("is-txr");

    switchC1.classList.toggle("is-hidden");
    switchC2.classList.toggle("is-hidden");
    aContainer.classList.toggle("is-txl");
    bContainer.classList.toggle("is-txl");
    bContainer.classList.toggle("is-z200");
}

let mainF = (e) => {
    for (var i = 0; i < switchBtn.length; i++)
        switchBtn[i].addEventListener("click", changeForm)
    
    document.getElementById('a-form').addEventListener('submit', handleSignup);
    document.getElementById('b-form').addEventListener('submit', handleSignin);
}

async function handleSignup(e){
    e.preventDefault();
    const username = e.target.querySelector('[name="username"]').value;
    const email = e.target.querySelector('[name="email"]').value;
    const password = e.target.querySelector('[name="password"]').value;
    
    try{
        const r = await fetch('http://localhost:3001/api/auth/student/register',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({username,email,password})
        });
        const d = await r.json();
        if(d.success){
            localStorage.setItem('student',JSON.stringify(d.student));
            localStorage.setItem('quiz_user_id',d.student.id);
            alert('Registration successful!');
            window.location.href='index.html';
        }else{
            alert(d.error||'Registration failed');
        }
    }catch(e){
        alert('Server error. Make sure server is running.');
    }
}

async function handleSignin(e){
    e.preventDefault();
    const email = e.target.querySelector('[name="email"]').value;
    const password = e.target.querySelector('[name="password"]').value;
    
    try{
        const r = await fetch('http://localhost:3001/api/auth/student/login',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({email,password})
        });
        const d = await r.json();
        if(d.success){
            localStorage.setItem('student',JSON.stringify(d.student));
            localStorage.setItem('quiz_user_id',d.student.id);
            alert('Login successful!');
            window.location.href='index.html';
        }else{
            alert(d.error||'Login failed');
        }
    }catch(e){
        alert('Server error. Make sure server is running.');
    }
}

window.addEventListener("load", mainF);