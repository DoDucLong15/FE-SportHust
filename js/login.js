let isLogin = !!localStorage.getItem("idToken");
let username;
let email;
let password;

//của logres
const logregBox = document.querySelector('.logreg-box');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');

registerLink.addEventListener('click', () => {
    logregBox.classList.add('active');
});
loginLink.addEventListener('click', () => {
    logregBox.classList.remove('active');
});

//end logres

function togglePasswordVisibility(button, inputId) {
    var passwordInput = document.getElementById(inputId);
    var icon = document.querySelector('.password-icon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        button.innerHTML = '<i class="bx bx-show"></i>'; // Change the icon to represent open lock
    } else {
        passwordInput.type = 'password';
        button.innerHTML = '<i class="bx bx-hide"></i>'; // Change the icon to represent closed lock
    }
}


//chuyen giua register sang UPregister
let btnexit = document.querySelector('.btn-exitUPregister');
let btnlogreg = document.querySelector('.btn-logreg.reg');

function hideUserInfoRegister(closeBtn) {
    let container = closeBtn.parentNode;
    container.classList.remove('active1');
}

//lay thong tin tu form dang nhap ve





// const nameElement = document.getElementById('user-name');
// const emailElement = document.getElementById('email');
// const passwordElement = document.getElementById('password');
// const firstnameElement = document.getElementById('first-name');
// const lastnameElement = document.getElementById('last-name');
// // const dateElement = document.getElementById('date');
// const phonenumberElement = document.getElementById('phone-number');
// const genderElement = document.getElementById('gender');
// const provincesElement = document.getElementById('provinces');
// const districtsElement = document.getElementById('districts');
// const wardsElenment = document.getElementById('wards');

function register() {
    let firstName = document.getElementById('first-name').value;
    let lastName = document.getElementById('last-name').value;
    let dateOfBirth = document.getElementById('date').value;
    let phoneNumber = document.getElementById('phone-number').value;
    let gender = document.getElementById('gender').value;
    let img = document.getElementById('image').value;

    let provinceIndex = document.getElementById('provinces').selectedIndex;
    let districtIndex = document.getElementById('districts').selectedIndex;
    let wardIndex = document.getElementById('wards').selectedIndex;

    let province = document.getElementById('provinces').options[provinceIndex].text;
    let district = document.getElementById('districts').options[districtIndex].text;
    let ward = document.getElementById('wards').options[wardIndex].text;

    console.log(username);
    console.log(email);
    console.log(password);
    console.log(firstName);
    console.log(lastName);
    console.log(gender);
    console.log(dateOfBirth);
    console.log(phoneNumber);
    console.log(province);
    console.log(district);
    console.log(ward);
    console.log(img);

    if (firstName && lastName && dateOfBirth && phoneNumber && img && gender && province && district && ward) {
        let userData = {
            login: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            imageUrl: img,
            city: province,
            district: district,
            ward: ward,
            gender: gender,
            dateOfBirth: dateOfBirth,
            password: password
        };

        fetch('https://api-hust.eztek.net/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData),
            })
            .then(response => {
                console.log("Raw Response:", response);
                if (!response.ok) {
                    alert('Địa chỉ email hoặc tên đăng nhập đã được sử dụng !');
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                showOTPPanel();
                sendOTP(username, email);
            })
            .catch(error => {
                console.error('Lỗi khi gửi dữ liệu:', error);
            });
    } else {
        alert('Hãy nhập đầy dủ thông tin !');
    }

}


//otp

function showOTPPanel() {
    let OTPPanel = document.querySelector('.OTP-confirm-email-panel');

    OTPPanel.style.display = 'flex';
    OTPPanel.querySelector('.OTP-confirm-email-body').innerHTML +=
        `
            <p>Mã OTP đã được gửi về email: <span>${email}</span></p>
            <p>Vui lòng check email để lấy mã OTP, nếu quý khách không nhận được xin vui lòng ấn gửi lại OTP.</p>
            <div class="OTP-confirm-email-input">
                    <h2>Nhập OTP: </h2>
                    <input type="text" name="OTP-input" id="OTP-input">

            </div>

            <div class="OTP-confirm-email-button">
                <button onclick="verifyOTP()">Xác nhận OTP</button>
                <button onclick="sendOTP('${username}', '${email}')">Gửi lại OTP</button>
            </div>
        `
}

function hideOTPPanel() {
    let OTPPanel = document.querySelector('.OTP-confirm-email-panel');

    OTPPanel.style.display = 'none';
}

function sendOTP(username_, email_) {

    let dataToSend = {
        login: username_,
        value: email_,

    }
    fetch('https://api-hust.eztek.net/api/account/verified-email-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        })
        .then(response => {
            if (!response.ok) {
                alert('Invalid OTP. Please try again.');
                throw response;
            } else {
                alert('Gửi OTP thành công, hãy kiểm tra email của bạn !');
                return response.json();
            }
        })  
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            if (typeof error.json === 'function') {
                error.json().then(jsonError => {
                    // Xử lý lỗi từ API
                    console.error('API Error:', jsonError.message);
                }).catch(genericError => {
                    // Xử lý lỗi khác
                    console.error('Generic Error:', error.statusText);
                });
            } else {
                console.error('Fetch Error:', error);
            }
        });
}

function verifyOTP() {
    let enterOTPElement = document.getElementById('OTP-input');

    if (enterOTPElement) {
        let enterOTP = enterOTPElement.value;

        fetch('https://api-hust.eztek.net/api/account/verified-email-complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: username,
                    key: enterOTP
                }),
            })
            .then(response => {
                if (!response.ok) {
                    alert('Invalid OTP. Please try again.');
                    throw response;
                } else {
                    alert('Đăng ký tài khoản thành công !');
                    return response.json();
                }
            })
            .then(data => {
                console.log(data);
                hideOTPPanel();
                window.location.reload();
            })
            .catch(error => {
                if (typeof error.json === 'function') {
                    error.json().then(jsonError => {
                        // Xử lý lỗi từ API
                        console.error('API Error:', jsonError.message);
                    }).catch(genericError => {
                        // Xử lý lỗi khác
                        console.error('Generic Error:', error.statusText);
                    });
                } else {
                    console.error('Fetch Error:', error);
                }
            });
    } else {
        console.error('Element with id "OTP-input" not found.');
    }
}

function checkRegisterStep1(event, button) {
    event.preventDefault();
    let UPregister = document.querySelector('.UPregister');

    let parentNode = button.parentNode.parentNode;

    let username_ = parentNode.querySelector('#user-name').value;
    let password_ = parentNode.querySelector('#password').value;
    let email_ = parentNode.querySelector('#email').value;
    let agreeBox = parentNode.querySelector('.remember-forgot input');

    if (username_ && password_ && email_) {
        if (agreeBox.checked) {
            username = username_;
            email = email_;
            password = password_;


            console.log(username_, password_, email_);
            UPregister.classList.add('active1');
        } else {
            alert('Vui lòng đồng ý với điều khoản !');
        }
    } else {
        alert('Vui lòng nhập đầy đủ thông tin');
    }
}


//login
function getIdToken(event) {
    event.preventDefault();

    let user_name = document.getElementById('taikhoan').value;
    let pass_word = document.getElementById('matkhau').value;
    let remember_me = document.getElementById('remember-me-box').checked;

    let bodyRequest = {
        username: user_name,
        password: pass_word,
        rememberMe: remember_me
    };

    fetch('https://api-hust.eztek.net/api/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyRequest),
        })
        .then(response => {
            if (response.ok !== true) {
                alert('Đăng nhập thất bại, tài khoản hoặc mật khẩu không đúng !');
                document.getElementById('taikhoan').value = '';
                document.getElementById('matkhau').value = '';
                return;
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            localStorage.setItem('idToken', data.id_token);
            saveUser(data.id_token);
            isLogin = true;
            isLogined = true;
            checkLogin();
        })
        .catch(err => {
            console.log(err);
        })

    // try {
    //     const response = await fetch('https://api-hust.eztek.net/api/authenticate', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(datagettoken),
    //     });

    //     if (!response.ok) {
    //         throw new Error('Login failed');
    //     }

    //     const data = await response.json();
    //     console.log(response.ok);


    // } catch (error) {
    //     console.error('Error during login: ', error.message);
    // }

}

function checkLogin() {
    if (isLogin) {
        alert('Đăng nhập thành công !');
        window.location.href = "index.html";
    }
}

function saveUser(IDToken) {

    fetch('https://api-hust.eztek.net/api/account', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${IDToken}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            localStorage.setItem("user-id", data.id);
            localStorage.setItem("user-avatar", data.imageUrl);
            localStorage.setItem("user-fullName", data.lastName + ' ' + data.firstName);
            localStorage.setItem("user-authorities", data.authorities);
        })
        .catch(err => {
            console.log(err);
        })

}


fetch('https://api-hust.eztek.net/show-all-city')
    .then(response => response.json())
    .then(data => {
        let provinceList = data;
        provinceList.map(value => document.getElementById('provinces').innerHTML +=
            `<option value="${value.code}">${value.full_name}</option>`);
    })
    .catch(error => {
        console.log(error);
    });

// Lấy danh sách quận/ huyện
function fetchDistricts(provinceCode) {
    fetch(`https://api-hust.eztek.net/show-all-district-in-city?city_code=${provinceCode}`)
        .then(response => response.json())
        .then(data => {
            let districtList = data;
            const districtOptions = document.getElementById('districts');

            districtOptions.innerHTML = '<option value="">Chọn quận/ huyện</option>';

            if (districtList != undefined) {
                districtList.map(district => districtOptions.innerHTML +=
                    `<option value="${district.code}">${district.full_name}</option>`);
            }
        })
        .catch(error => {
            console.log(error);
        });
}

// Lấy danh sách xã/phường
function fetchWards(districtCode) {
    fetch(`https://api-hust.eztek.net/show-all-ward-in-district?district_code=${districtCode}`)
        .then(response => response.json())
        .then(data => {
            let wardList = data;
            const wardOptions = document.getElementById('wards');

            wardOptions.innerHTML = '<option value="">Chọn phường/ xã</option>';

            if (wardList != undefined) {
                wardList.map(ward => wardOptions.innerHTML +=
                    `<option value="${ward.code}">${ward.full_name}</option>`);
            }
        })
        .catch(error => {
            console.log(error);
        });
}

// hàm hiển thị danh sách quận/ huyện tương ứng khi thay đổi lựa chọn tỉnh
function getProvince(event) {
    fetchDistricts(event.target.value);
}


// hàm hiển thị danh sách xã/phường tương ứng khi thay đổi lựa chọn quận/huyện
function getDistrict(event) {
    fetchWards(event.target.value);
}