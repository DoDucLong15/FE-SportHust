// js cho header
// chuyển sang giao diện danh mục sản phẩm khi ấn vào sản phẩm tương ứng
function redirectToCategory(categoryName, categoryId) {
    window.location.href = 'category.html?name=' + encodeURIComponent(categoryName) + '&id=' + categoryId;
    // if (isLogined) {
    // } else {
    //     alert('Vui lòng đăng nhập để tiếp tục !');
    // }
}

let isLogined = false;

const idToken = localStorage.getItem("idToken");
const userID = localStorage.getItem("user-id");
let user_authorities = localStorage.getItem("user-authorities");
let user_avatar = localStorage.getItem("user-avatar");
let user_fullname = localStorage.getItem("user-fullName");
let user_loginName;


// cart
function moveToCart() {
    let cartItem = document.querySelectorAll('.header_cart-item');

    if (cartItem.length == 0) {
        alert('Giỏ hàng trống !')
    } else
        window.location.href = 'cart.html';
}

// 
function moveToLogin() {
    window.location.href = 'login.html';
}

function updateCart() {
    let cartItems = document.querySelectorAll(".header_cart-item");
    let cart = document.querySelector(".header_cart-body");
    let cartTitle = document.querySelector(".header_cart-list-title");


    if (cartItems.length === 0) {
        cart.querySelector(".header_cart-no-cart-img").style.display = "block";
        cart.querySelector(".header_cart-list-no-cart-msg").style.display = "block";
        cartTitle.style.display = "none";
    } else {
        cart.querySelector(".header_cart-no-cart-img").style.display = "none";
        cart.querySelector(".header_cart-list-no-cart-msg").style.display = "none";
        cartTitle.style.display = "block";
    }
}

// Xóa sản phẩm trong giỏ (menu)
function deleteProductFromCart(deleteButton) {
    let cartItem = deleteButton.parentNode.parentNode.parentNode;
    let productCartID = deleteButton.parentNode.parentNode.parentNode.getAttribute('data-product-id-in-cart');

    let requestBody = {
        shoppingCartItemId: [
            productCartID
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
            cartItem.remove();
            window.location.reload();
        })
        .catch(error => {
            console.log(error);
        })

    updateCart();


}

function showShoppingCartMenu() {
    let cart = document.getElementById('header-cart-list');

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
            data.listShoppingCartItem.forEach(item => {
                cart.innerHTML +=
                    `
                <li class="header_cart-item" data-product-id-in-cart="${item.id}">
                        <img src="${item.image}" alt="" class="header_cart-item-img">
                        <div class="header_cart-item-info">
                            <div class="header_cart-item-info-top">
                                <h5 class="header_cart-item-name">${item.productName}</h5>
                                <div class="header_cart-item-price-wrap">
                                    <span class="header_cart-item-price">${item.productPrice.toLocaleString('vn-VN') + 'đ'}</span>
                                    <span class="header_cart-item-multiply">x</span>
                                    <span class="header_cart-item-quantity">${item.quantity}</span>
                                </div>
                            </div>
                            <div class="header_cart-item-info-bottom">
                                <span class="header_cart-item-description">
                                    Phân loại: <span>${item.sportName}, Size: ${item.size === undefined ? 'Mặc định' : item.size}</span>
                                </span>
                                <span class="header_cart-item-remove" onclick="deleteProductFromCart(this)">Xóa</span>
                            </div>
                        </div>
                    </li>
                `
                updateCart();
            })
        })
}

// Tìm kiếm sản phẩm
function searchProductByKeyword() {
    // Lấy giá trị từ ô input

    var keyword = document.getElementById('searchProductInput').value;
    // Kiểm tra xem từ khóa có tồn tại không
    if (keyword.trim() !== '') {
        // Chuyển hướng sang trang category.html với tham số truyền vào là từ khóa tìm kiếm
        window.location.href = 'category.html?keyword=' + encodeURIComponent(keyword);
    }

}

console.log(encodeURIComponent("Giày chạy marathong"));

function suggestSearching(item) {
    let keyword = item.textContent;

    // Kiểm tra xem từ khóa có tồn tại không
    if (keyword.trim() !== '') {
        // Chuyển hướng sang trang category.html với tham số truyền vào là từ khóa tìm kiếm
        window.location.href = 'category.html?keyword=' + encodeURIComponent(keyword);
    }

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



// Đăng xuất
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

// Xem tài khoản
function showProfilePage() {
    if (user_authorities == 'ROLE_USER') {
        window.location.href = 'profile.html';
    } else if (user_authorities.includes('ROLE_ADMIN')) {
        window.location.href = 'admin.html';
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


// fetchProvinces();