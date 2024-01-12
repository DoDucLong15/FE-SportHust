const idToken = localStorage.getItem("idToken");
const userID = localStorage.getItem("user-id");
let user_authorities = localStorage.getItem("user-authorities");
let user_avatar = localStorage.getItem("user-avatar");
let user_fullname = localStorage.getItem("user-fullName");
let user_loginName;

// header
function redirectToCategory(categoryName, categoryId) {
    window.location.href = 'category.html?name=' + encodeURIComponent(categoryName) + '&id=' + categoryId;
}

function logOut() {
    isLogined = false;
    let headerLoginButton = document.querySelector('.heading-btn');
    let headerUser = document.querySelector('.header-user');
    headerLoginButton.style.display = 'block';
    headerUser.style.display = 'none';
    localStorage.clear();
    alert('Đăng xuất thành công !');
    window.location.href = 'index.html';
}

function changeHeader() {
    let headerLoginButton = document.querySelector('.heading-btn');
    let headerUser = document.querySelector('.header-user');

    if (localStorage.getItem("idToken")) {
        headerLoginButton.style.display = "none";
        headerUser.style.display = 'flex';
        isLogined = true;
        if (user_authorities.includes('ROLE_ADMIN')) {
            headerUser.querySelector('.header-fullname').textContent = 'ADMIN';
            headerUser.querySelector('.header-user-avatar').setAttribute('src', 'assets/img/others/profile.png');
            headerUser.querySelector('.user-profile').innerText = 'Quản lý ADMIN';
        } else {
            headerUser.querySelector('.header-user-avatar').setAttribute('src', user_avatar);
            headerUser.querySelector('.header-fullname').textContent = user_fullname;
        }
    } else {
        return;
    }
}

function showProfilePage() {
    if (user_authorities == 'ROLE_USER') {
        window.location.href = 'profile.html';
    } else if (user_authorities.includes('ROLE_ADMIN')) {
        window.location.href = 'admin.html';
    }
}

// cart and payment page
const cartItems = document.querySelectorAll(".cart-item-info");
const totalPriceElement = document.getElementById("total-price");
const updatePriceButton = document.querySelector(".update-total-price");
const totalQuantityDisplay = document.getElementById("total-quantity");
const totalPriceWithDiscount = document.getElementById("total-price-after-discount");
const billCartPrice = document.querySelector(".bill-cart-price span");
const shppingCost = document.querySelector(".shipping-cost span");
const billTotal = document.querySelector(".bill-total span");

function start() {
    changeHeader();
    fetchProvinces();
    getProductCart();
    updateVoucher();
}

function getProductCart() {
    let cart = document.querySelector('.cart-container-left-item-list');
    let totalQuantityDisplay = document.getElementById('total-quantity');
    let totalQuantity = 0;
    let totalMoneyDisplay = document.getElementById('total-price');
    let totalMoneyFinal = document.getElementById('total-price-after-discount');



    fetch(`https://api-hust.eztek.net/view-shoppingcart-by-user?UserId=${userID}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            localStorage.setItem("user-cart-id", data.id);
            localStorage.setItem("cart-intoMoney", data.intoMonney);
            totalMoneyDisplay.innerText = data.intoMonney.toLocaleString('vn-VN') + 'đ';
            totalMoneyFinal.innerText = data.intoMonney.toLocaleString('vn-VN') + 'đ';

            data.listShoppingCartItem.forEach(item => {
                totalQuantity += item.quantity;
                cart.innerHTML +=
                    `
                    <div class="cart-item-info" data-productCart-id="${item.id}">
                            <div class="cart-item-name-img">
                                <img src="${item.image}" alt="">
                                <div class="cart-item-name">${item.productName}</div>
                            </div>
                            <div class="cart-item-size">${item.size == undefined ? '' : item.size}</div>
                            <div class="cart-item-color" style="background-color:${item.color}"></div>
                            <div class="cart-item-quantity">                                
                                <span class="cart-item-quantity-number">${item.quantity}</span>
                            </div>
                            <span class="cart-item-price">${item.productPrice.toLocaleString('vn-VN') + 'đ'}</span>
                            <div class="cart-item-remove" onclick="deleteProductFromCart(this)">&times;</div>
                        </div>
                    `
            })
            totalQuantityDisplay.innerText = totalQuantity;


        })
        .catch(err => {
            console.log(err);
        })
}


// Xóa sản phẩm trong giỏ
function deleteProductFromCart(deleteButton) {
    let item = deleteButton.parentNode;
    let id = deleteButton.parentNode.getAttribute('data-productCart-id');

    let requestBody = {
        shoppingCartItemId: [
            id
        ]
    }

    fetch('https://api-hust.eztek.net/delete-product-to-shopping-cart', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert('Đã xóa sản phẩm thành công !');
            item.remove();
            window.location.reload();
        })
        .catch(error => {
            console.log(error);
        })



}

function addVoucherToShoppingCart(confirmButton) {
    let voucher = confirmButton.parentNode.querySelector('input').value;
    let cartID = localStorage.getItem("user-cart-id");


    let requestBody = {
        voucherCode: voucher,
        shoppingCartId: cartID
    };
    console.log(requestBody);

    fetch('https://api-hust.eztek.net/voucher/add-voucher-to-shoppingcart', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json-patch+json'
            },
            body: JSON.stringify(requestBody)
        })
        .then((response) => {
            if (!response.ok) alert('Thêm voucher thất bại. Không tồn tại mã voucher này !')
            return response.json();
        })
        .then(data => {
            console.log(data);
            confirmButton.parentNode.querySelector('input').value = data.name;
            alert('Thêm voucher thành công !');
            localStorage.setItem('cart-voucherCode', data.name);
            document.querySelector('.cart-container-right-info').innerHTML += 
                `
                    <p id="apply-voucher-complete">Mã giảm giá ${data.name} đã được áp dụng thành công, đơn hàng được giảm ${data.value.toLocaleString('vn-VN') + 'đ'} !</p>
                `   

            getTotalCost();
        })
        .catch(err => {
            console.log(err);
        })
}


function getBill() {
    let fullName = document.querySelector('.user-info-name-input').value;
    let phoneNumber = document.querySelector('.user-info-phone-input').value;
    let city = document.getElementById('provinces');
    let district = document.getElementById('districts');
    let ward = document.getElementById('wards');
    let shoppingCartID = localStorage.getItem('user-cart-id');

    let cityIndex = city.selectedIndex;
    let districtIndex = district.selectedIndex;
    let wardIndex = ward.selectedIndex;



    console.log(fullName)
    console.log(phoneNumber);
    console.log(city.options[cityIndex].text);
    console.log(district.options[districtIndex].text);
    console.log(ward.options[wardIndex].text, shoppingCartID);

    fetch(`https://api-hust.eztek.net/get-bill?FullName=${fullName}&PhoneNumber=${phoneNumber}&City=${city.options[cityIndex].text}&District=${district.options[districtIndex].text}&Ward=${ward.options[wardIndex].text}&ShoppingCartId=${shoppingCartID}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json-patch+json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            localStorage.setItem('bill-code', data.code);
            localStorage.setItem('bill-info', data.informationDelivery);
            localStorage.setItem('bill-startDate', data.createdDate.substr(0, 10));
            localStorage.setItem('bill-endDate', data.endDate.substr(0, 10));

            localStorage.removeItem('cart-voucherCode');
            window.location.href = 'final.html';
        })
        .catch(err => {
            alert('Vui lòng nhập đầy đủ thông tin !')
            console.log(err);
        })

}

function updateVoucher() {
    let intoMonney = localStorage.getItem('cart-intoMoney');
    let voucherCode = localStorage.getItem('cart-voucherCode');
    if (voucherCode) document.querySelector('.cart-container-right-info-discount-input').value = voucherCode;
    document.querySelector('.bill-cart-price span').innerText = Number(intoMonney).toLocaleString('vn-VN') + 'đ';
    document.querySelector('.bill-total span').innerText = (Number(intoMonney) + 30000).toLocaleString('vn-VN') + 'đ';
}

function getTotalCost() {
    let intoMonney = localStorage.getItem('cart-intoMoney');
    let voucherCode = localStorage.getItem('cart-voucherCode');

    fetch(`https://api-hust.eztek.net/get-total-money-in-shoppingCart?intoMoney=${intoMonney}&voucherCode=${voucherCode}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('cart-intoMoney', Number(data));
            document.getElementById('total-price-after-discount').innerText = data.toLocaleString('vn-VN') + 'đ';
            document.querySelector('.bill-cart-price span').innerText = data.toLocaleString('vn-VN') + 'đ';
            document.querySelector('.bill-total span').innerText = (data + 30000).toLocaleString('vn-VN') + 'đ';
        })
        .catch(err => {
            console.log(err);
        })
}


// payment
let cartPage = document.querySelector(".cart-wrapper");
let paymentPage = document.querySelector(".payment-wrapper");
let paymentButton = document.querySelector(".cart-payment-button");
let returnCart = document.querySelector(".return-cart");

let cartProgessText = document.querySelector(".text .progress-cart");
let cartProgessIcon = document.querySelector(".progress-bar .progress-cart-circle");
let paymentProgessText = document.querySelector(".text .progress-payment");
let paymentProgessIcon = document.querySelector(".progress-bar .progress-payment-circle");

paymentButton.addEventListener("click", () => {
    cartProgessText.classList.remove("current-progress");
    cartProgessIcon.classList.remove("current-progress");
    paymentProgessText.classList.add("current-progress");
    paymentProgessIcon.classList.add("current-progress");

    paymentPage.style.left = "0";
    cartPage.style.left = "-100" + '%';
});

returnCart.addEventListener("click", () => {
    cartProgessText.classList.add("current-progress");
    cartProgessIcon.classList.add("current-progress");
    paymentProgessText.classList.remove("current-progress");
    paymentProgessIcon.classList.remove("current-progress");

    paymentPage.style.left = "100" + '%';
    cartPage.style.left = '0';
})


// Khi chọn thông tin khách hàng, input sẽ thay đổi
function toggleUserInfoInput(enable) {
    var inputs = document.querySelectorAll('.user-info-input-item input , .user-info-input-item select');
    inputs.forEach(function (input) {
        input.disabled = !enable;
    });

    if (!enable) getUserInfoFromAPI();
    else resetUserInfoInput();
}


// Hàm để trở về trạng thái ban đầu
function resetUserInfoInput() {
    let userNameInput = document.querySelector('.user-info-name-input');
    let phoneNumberInput = document.querySelector('.user-info-phone-input');
    let citySelect = document.getElementById('provinces');
    let districtSelect = document.getElementById('districts');
    let wardSelect = document.getElementById('wards');

    let inputs = document.querySelectorAll('.user-info-input-item input , .user-info-input-item select');
    inputs.forEach(function (input) {
        input.disabled = false;
    });

    userNameInput.value = '';
    phoneNumberInput.value = '';


    citySelect.querySelector('option[value="0"]').innerHTML = "Chọn tỉnh/ thành phố";
    districtSelect.querySelector('option[value="0"]').innerHTML = "Chọn quận/ huyện";
    wardSelect.querySelector('option[value="0"]').innerHTML = "Chọn phường/ xã";
    fetchProvinces();
}




async function getUserInfoFromAPI() {
    try {
        let userNameInput = document.querySelector('.user-info-name-input');
        let phoneNumberInput = document.querySelector('.user-info-phone-input');
        let citySelect = document.getElementById('provinces');
        let districtSelect = document.getElementById('districts');
        let wardSelect = document.getElementById('wards');


        userNameInput.disabled = false;
        phoneNumberInput.disabled = false;
        citySelect.disabled = false;
        districtSelect.disabled = false;
        wardSelect.disabled = false;

        const userDataResponse = await fetch(`https://api-hust.eztek.net/api/accountByUserId?Id=${userID}`, {
            headers: {
                Authorization: 'Bearer ' + idToken
            }
        });
        const userData = await userDataResponse.json();

        const userAddressResponse = await fetch(`https://api-hust.eztek.net/address/view-all-by-UserId?UserId=${userID}`, {
            headers: {
                Authorization: 'Bearer ' + idToken
            }
        })
        const userAddresses = await userAddressResponse.json();
        var defaultAddress;

        for (let i = 0; i < userAddresses.length; i++) {
            if (userAddresses[i].status === 0) {
                defaultAddress = userAddresses[i];
                break;
            }
        }

        userNameInput.value = userData.lastName + ' ' + userData.firstName;
        phoneNumberInput.value = userData.phoneNumber;
        citySelect.innerHTML = `<option value="0">${defaultAddress.city}</option>`;
        districtSelect.innerHTML = `<option value="0">${defaultAddress.district}</option>`;
        wardSelect.innerHTML = `<option value="0">${defaultAddress.ward}</option>`;

        // vô hiệu hóa input
        userNameInput.disabled = true;
        phoneNumberInput.disabled = true;
        citySelect.disabled = true;
        districtSelect.disabled = true;
        wardSelect.disabled = true;

    } catch (error) {
        console.error('Error fetching or processing user info data:', error);
    }
}

// Lấy api tỉnh thành để hiển thị vào giao diện
const provinceOptions = document.getElementById('provinces');
const districtOptions = document.getElementById('districts');
const wardOptions = document.getElementById('wards');


function fetchProvinces() {
    fetch('https://api-hust.eztek.net/show-all-city')
        .then(response => response.json())
        .then(data => {
            let provinceList = data;
            provinceList.map(value => provinceOptions.innerHTML +=
                `<option value="${value.code}">${value.full_name}</option>`);
        })
        .catch(error => {
            console.log(error);
        });
}

// Lấy danh sách quận/ huyện
function fetchDistricts(provinceCode) {
    fetch(`https://api-hust.eztek.net/show-all-district-in-city?city_code=${provinceCode}`)
        .then(response => response.json())
        .then(data => {
            let districtList = data;

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
    const selectedProvinceCode = event.target.value;

    // Nếu giá trị của tỉnh là 0
    if (selectedProvinceCode === "0") {
        districtOptions.innerHTML = '<option value="">Chọn quận/ huyện</option>';
        wardOptions.innerHTML = '<option value="">Chọn phường/ xã</option>';
    } else {
        fetchDistricts(selectedProvinceCode);
    }
}


// hàm hiển thị danh sách xã/phường tương ứng khi thay đổi lựa chọn quận/huyện
function getDistrict(event) {
    fetchWards(event.target.value);
}