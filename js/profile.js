// Thông tin người dùng trên header
let userNameHeader = document.querySelector('.header-username');
let userAvatarHeader = document.querySelector('.header-user-avatar');

// user info
let userInfoInputList = document.querySelector('.info-input');
let userLoginNameInput = userInfoInputList.querySelector('.info-input-loginName input');
let userFullNameInput = userInfoInputList.querySelector('.info-input-username input');
let userPhoneNumberInput = userInfoInputList.querySelector('.info-input-phoneNumber input');
let userEmailInput = userInfoInputList.querySelector('.info-input-email input');
let userAvatarImg = document.querySelector('.info-avatar-img');

// change user info
const changeUserInfoPanel = document.querySelector('.change-user-info-panel');
const changUserInfoBtn = document.querySelector('.change-info-btn');
const closeChangeInfoPanel = document.querySelector('.change-user-info-closeBtn');

// address
const addNewAddress = document.querySelector('.add-new-adress');
const newAddressPanel = document.querySelector('.new-address-panel');
const closeNewAddressPanel = document.querySelector('.new-address-closeBtn');
let addressListDiv = document.querySelector('.address-list');
let newAddressList = [];

var currentBillPage = 1;
var billRowsPerPage = 9;

// khởi tạo
function start() {
    isLogined = true;
    fetchProvinces();
    openDefaultTab();
    getUserInfomation(userID);
    handleAddAddressClick();
    showAllAddress(userID);
    showBillList(userID);
    showBillPage(currentBillPage);
}

// function

// thay đổi thông tin trên header
function changeHeaderRight(userName, imgSrc) {
    userNameHeader.innerHTML = userName;
    userAvatarHeader.src = imgSrc;
}

// Mặc định khi mở giao diện sẽ hiển thị tab đầu tiên (Hồ sơ)
function openDefaultTab() {
    changeTab('tab1');
}

// Chức năng chọn địa chỉ mặc định (giống select option)
function selectDefaultAddress(clickedItem) {
    let allItems = document.querySelectorAll('.address-item');

    allItems.forEach(function (item) {
        item.querySelector('.address-item-selected').classList.remove('default');
        item.querySelector('.address-default').style.display = 'none';
    });

    let selectedItem = clickedItem.parentNode;
    // Thêm class 'default' và thẻ 'Mặc định' vào mục được chọn
    selectedItem.querySelector('.address-item-selected').classList.add('default');
    selectedItem.querySelector('.address-default').style.display = 'block';
}

// Thay đổi nội dung khi ấn chọn tab tương ứng
function changeTab(tabId) {
    let tabContents = document.querySelectorAll('.tab-content');
    let tabs = document.querySelectorAll('.tab');

    tabContents.forEach(function (tabContent) {
        tabContent.classList.remove('active');
    });

    tabs.forEach(function (tab) {
        tab.classList.remove('active-tab');
    });

    document.getElementById(tabId).classList.add('active');
    document.querySelector('[onclick="changeTab(\'' + tabId + '\')"]').classList.add('active-tab');
}

// Lấy thông tin hồ sơ người dùng
function getUserInfomation(userId) {
    fetch(`https://api-hust.eztek.net/api/accountByUserId?Id=${userId}`, {
            headers: {
                'Authorization': `Bearer ${idToken}`
            }
        })
        .then(response => response.json())
        .then(data => {

            console.log(data);

            userLoginNameInput.value = data.login;
            userFullNameInput.value = data.lastName + ' ' + data.firstName;
            userPhoneNumberInput.value = data.phoneNumber;
            userEmailInput.value = data.email;
            userAvatarImg.src = data.imageUrl;

            userLoginNameInput.disabled = true;
            userFullNameInput.disabled = true;
            userPhoneNumberInput.disabled = true;
            userEmailInput.disabled = true;
            userAvatarImg.disabled = true;

            changeHeaderRight(data.login, data.imageUrl);
        })
}

// Button edit userinfo
// function editUserInfo(editButton) {
//     let parentDiv = editButton.parentNode;
//     let input = parentDiv.querySelector('input');
//     input.disabled = false;
//     input.focus();
// }

// Cập nhật thông tin người dùng
function updateUserInfo() {
    let phoneNumber_ = document.querySelector('.change-user-info-phoneNumber').value;
    let email_ = document.querySelector('.change-user-info-email').value;
    let updatedInfo = {
        email: email_,
        phoneNumber: phoneNumber_
    };

    if (!phoneNumber_ || !email_) {
        console.error('Invalid email or phone number');
        return;
    }

    console.log(updatedInfo);

    fetch('https://api-hust.eztek.net/api/account', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedInfo)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            hideChangeInfo();
            alert('Thay đổi thông tin thành công !');
            window.location.reload();
        })
        .catch(err => {
            console.error('Error:', err);
        });


}


// Sự kiện cho nút thêm địa chỉ
function hideAddAddress() {
    newAddressPanel.style.display = 'none';
    provinceOptions.selectedIndex = 0;
    districtOptions.innerHTML = '<option value="0">Chọn quận/ huyện</option>';
    wardOptions.innerHTML = '<option value="0">Chọn phường/ xã</option>';
}

function hideChangeInfo() {
    changeUserInfoPanel.style.display = 'none';
}

changUserInfoBtn.addEventListener('click', () => {
    changeUserInfoPanel.style.display = 'flex';
})

closeChangeInfoPanel.addEventListener('click', hideChangeInfo);

addNewAddress.addEventListener('click', () => {
    newAddressPanel.style.display = 'flex';
});

closeNewAddressPanel.addEventListener('click', hideAddAddress);

// Lấy địa chỉ từ API và hiển thị
function showAllAddress(userId) {
    // updateNewAddressList();
    fetch(`https://api-hust.eztek.net/address/view-all-by-UserId?UserId=${userId}`, {
            headers: {
                'Authorization': `Bearer ${idToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            let addressList = data;
            console.log(data);
            let htmls = addressList.map((address) => {
                let isSelected = address.status === 0 ? 'default' : '';
                let isDefaultDisplay = address.status === 0 ? 'block' : 'none';

                return `
                    <li class="address-item" data-address-id="${address.id}">
                        <div class="address-item-left" onclick="selectDefaultAddress(this)">
                            <span class="address-item-selected ${isSelected}"></span>
                            <p class="address-item-info">${address.ward}, ${address.district}, ${address.city}</p>
                        </div>
                        <div class="address-item-right">
                            <span class="address-default" style="display: ${isDefaultDisplay}">Mặc định</span>
                            <img src="/assets/img/icon/bin.png" alt="" class="address-item-delete" onclick="handleDeleteAddressClick(this)">
                        </div>
                    </li>
                    `;
            });
            addressListDiv.innerHTML = htmls.join('');
        });
}

// Thay đổi địa chỉ mặc định
function addressUpdateChange() {
    let selectedAddressItem;
    let allAddress = document.querySelectorAll('.address-item');

    allAddress.forEach(address => {
        if (address.querySelector('.default')) {
            selectedAddressItem = address;
        }
    });

    let defaultAddressID = selectedAddressItem.getAttribute('data-address-id');
    const requestBody = {
        addressId: `${defaultAddressID}`
    }

    fetch('https://api-hust.eztek.net/address/register-address-default', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then((response) => response.json())
        .then(data => {
            console.log(data);
            window.location.reload();
        })
        .catch(err => {
            console.log(err);
        })
}

// Thêm địa chỉ mới
function fetchCreateAddress(newAddress) {
    var addressID;
    fetch('https://api-hust.eztek.net/address/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAddress)
        })
        .then((response) => response.json())
        .then(data => {
            addressID = data.id;

        })
        .catch(err => {
            console.log(err);
        })
        .finally(() => {
            return addressID;
        })
}

// Xử lý thêm địa chỉ
function handleAddAddressClick() {
    let addNewAddressButton = document.querySelector('.add-address-button');

    addNewAddressButton.onclick = () => {

        let province = document.getElementById('provinces');
        let district = document.getElementById('districts');
        let ward = document.getElementById('wards');

        let provinceName = province.options[province.selectedIndex].textContent;
        let districtName = district.options[district.selectedIndex].textContent;
        let wardName = ward.options[ward.selectedIndex].textContent;

        let newAddress = {
            userId: userID,
            city: provinceName,
            district: districtName,
            ward: wardName,
            status: 1
        };

        fetch('https://api-hust.eztek.net/address/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newAddress)
            })
            .then((response) => response.json())
            .then(data => {
                addressListDiv.innerHTML +=
                    `   <li class="address-item" data-address-id="${data.id}">
                    <div class="address-item-left" onclick="selectDefaultAddress(this)">
                        <span class="address-item-selected"></span>
                        <p class="address-item-info">
                            ${data.ward},
                            ${data.district},
                            ${data.city}
                        </p>
                    </div>
                    <div class="address-item-right">
                        <span class="address-default">Mặc định</span>
                        <img src="/assets/img/icon/bin.png" alt="" class="address-item-delete" onclick="handleDeleteAddressClick(this)">
                    </div>
                    
                </li>
            `;
            })
            .catch(err => {
                console.log(err);
            })


        hideAddAddress();

    }
    document.querySelector('.update-address-btn').style.display = 'block';

}


// Xử lý xóa địa chỉ
function handleDeleteAddressClick(deleteButton) {
    let addressItem = deleteButton.parentNode.parentNode;
    let addressItemID = addressItem.getAttribute('data-address-id');

    const requestBody = {
        addressId: `${addressItemID}`
    }

    fetch(`https://api-hust.eztek.net/address/delete?addressId=${addressItemID}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then((response) => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.log(err);
        })

    addressItem.remove();

}


// Thêm ảnh đại diện
function displaySelectedImage() {
    let input = document.getElementById('avatarImg');
    let img = document.querySelector('.info-avatar-img');

    let file = input.files[0];

    if (file) {
        let reader = new FileReader();

        reader.onload = function (e) {
            img.src = e.target.result;
            console.log(e.target.result);
            // updateUserImage(e.target.result);
        };

        reader.readAsDataURL(file);
    }
}

function updateUserImage(base64Image) {
    fetch('https://api-hust.eztek.net/api/account/update-user', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: userID, // Thay user_id_here bằng ID của người dùng cần cập nhật
                imageUrl: base64Image,
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Xử lý kết quả từ backend nếu cần
            console.log('Image updated successfully:', data);
        })
        .catch(error => {
            console.error('Error updating image:', error);
        });
}


// Thay đổi mật khẩu
function changeUserPassword() {
    let current_password = document.getElementById('current-password').value;
    let new_password = document.getElementById('new-password').value;
    let new_password_again = document.getElementById('new-password-again').value;

    if (!current_password || !new_password || !new_password_again || new_password_again !== new_password) {
        alert('Mật khẩu chưa hợp lệ, hãy nhập lại !');
    } else {
        let requestBody = {
            currentPassword: current_password,
            newPassword: new_password
        };

        fetch('https://api-hust.eztek.net/api/account/change-password', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                alert('Thay đổi mật khẩu thành công !');
                window.location.reload();
            })
            .catch(err => {
                console.log(err);
                alert('Đã xảy ra lỗi !');
            });
    }
}

function toggleUserPasswordVisibility(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const passwordIcon = document.getElementById(iconId);

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passwordIcon.classList.remove('bx-hide');
        passwordIcon.classList.add('bx-show'); // Add a class to change the icon to show
    } else {
        passwordInput.type = "password";
        passwordIcon.classList.remove('bx-show'); // Remove the class to change the icon back to hide
        passwordIcon.classList.add('bx-hide');
    }
}



// Render hóa đơn ra bảng
function showBillList(userId) {
    const billList = document.querySelector('#bill-list-table tbody');
    fetch(`https://api-hust.eztek.net/get-all-bill-history?UserId=${userId}`, {
            headers: {
                'Authorization': `Bearer ${idToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data, typeof data[0].startDate);
            data.forEach(bill => {
                let billStatus = bill.status === 0 ? "Đang xử lý" : (bill.status === 1 ?
                    "Đang vận chuyển" : (bill.status === 2 ? "Hoàn thành" : "Hủy"));
                let billRow = `<tr>
                                <td class="bill-code">${bill.code}</td>
                                <td>${bill.startDate.substr(0, 10)}</td>
                                <td>${bill.endDate.substr(0, 10)}</td>
                                <td>${String(bill.totalMoney.toLocaleString('vn-VN') + 'đ')}</td>
                                <td class="bill-status" data-bill-status="${bill.status}">${billStatus}</td>
                                <td class="bill-more-action">
                                    <img src="/assets/img/icon/more.png" alt="" class="user-more-action-btn"
                                            onclick="showBillAction(this)">
                                    <div class="bill-more-action-panel">
                                        <div class="bill-more-action-option bill-detail" onclick="">Xem chi tiết</div>
                                        <div class="bill-more-action-option confirm-bill" onclick="receivedBill(this)">Đã nhận hàng</div>
                                        <div class="bill-more-action-option cancel-bill" onclick="cancelBill(this)">Hủy đơn hàng</div>
                                    </div>
                                </td>
                              </tr>`
                billList.innerHTML += billRow;
                showBillPage(currentBillPage);
            })
        });

}

// Hiển thị tùy chọn Bill
function showBillAction(button) {
    let panel = button.nextElementSibling;

    panel.style.display = 'flex';

    document.addEventListener('click', function (e) {
        if (!panel.contains(e.target) && !button.contains(e.target)) {
            panel.style.display = 'none';
        }
    });
}

// Xác nhận nhận hàng (Người dùng)
function receivedBill(button) {
    let billCode = button.parentNode.parentNode.parentNode.querySelector('.bill-code').innerText;
    let bodyRequest = {
        status: 2,
        code: billCode,
        userId: userID
    };


    fetch('https://api-hust.eztek.net/confirm-status-order', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyRequest)
        })
        .then(response => response.json())
        .then(data => {
            let billListBody = document.querySelector('#bill-list-table tbody');
            billListBody.innerHTML = '';
            showBillList(userID);
        })
        .catch(err => {
            console.log(err);
        })


}

function cancelBill(button) {
    let currentBillStatus = Number(button.parentNode.parentNode.parentNode.querySelector('.bill-status').getAttribute('data-bill-status'));

    if (currentBillStatus == 2) {
        alert('Đơn hàng đã hoàn thành !');
    } else if (currentBillStatus == 3) {
        alert('Đơn hàng đã hủy !')
    } else {
        let billCode = button.parentNode.parentNode.parentNode.querySelector('.bill-code').innerText;
        let bodyRequest = {
            status: 3,
            code: billCode,
            userId: userID
        };

        fetch('https://api-hust.eztek.net/confirm-status-order', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyRequest)
            })
            .then(response => response.json())
            .then(data => {
                let billListBody = document.querySelector('#bill-list-table tbody');
                billListBody.innerHTML = '';
                showBillList(userID);
            })
            .catch(err => {
                console.log(err);
            })
    }
}


function showBillPage(page) {
    let rows = document.querySelectorAll('#bill-list-table tbody tr');
    let start = (page - 1) * billRowsPerPage;
    let end = start + billRowsPerPage;

    for (let i = 0; i < rows.length; i++) {
        rows[i].style.display = (i >= start && i < end) ? '' : 'none';
    }

    document.getElementById('current-bill-page').innerText = 'Trang ' + page;
}

function changeBillPage(offset) {
    let rows = document.querySelectorAll('#bill-list-table tbody tr');

    currentBillPage += offset;

    if (currentBillPage < 1) {
        currentBillPage = 1;
    } else if (currentBillPage > Math.ceil(rows.length / billRowsPerPage)) {
        currentBillPage = Math.ceil(rows.length / billRowsPerPage);
    }

    showBillPage(currentBillPage);
}