 // khai báo biến

 // Đăng nhập và token duy trì đăng nhập
 // const userId = "b5ea29bd-f409-405a-90e5-6c0f82b81d81";
 // const idToken =
 //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImF1dGgiOiJST0xFX0FETUlOLFJPTEVfVVNFUiIsInNpZCI6InVzZXItMiIsIm5iZiI6MTcwMjkwODEwMywiZXhwIjoxNzA1NTAwMTAzLCJpYXQiOjE3MDI5MDgxMDN9.hCEQ8VGHDGa8aoltSs2qy_vnrj3tlnBIzI_ADSa4iK8";

 var currentUserPage = 1;
 var userRowsPerPage = 7;
 var currentProductPage = 1;
 var productRowsPerPage = 5;

 var currentVoucherPage = 1;
 var vouchersPerPage = 10;

 var currentPromotionPage = 1;
 var promotionsPerPage = 10;

 var isDetailPanelShowing = false;
 var isAddProductPanelShowing = false;
 var isUpdateProductPanelShowing = false;
 var isUpdatePromotionPanelShowing = false;

 // Panel thông tin chi tiết người dùng
 let userDetailPanel = document.querySelector('.user-detail-panel');

 var userDetailID = document.querySelector('.user-detail-ID');
 var userDetailLogin = document.querySelector('.user-detail-login');
 var userDetailName = document.querySelector('.user-detail-name');
 var userDetailCity = document.querySelector('.user-detail-city');
 var userDetailDistrict = document.querySelector('.user-detail-district');
 var userDetailEmail = document.querySelector('.user-detail-email');
 var userDetailPhoneNumber = document.querySelector('.user-detail-phoneNumber');
 var userDetailWard = document.querySelector('.user-detail-ward');
 var userDetailStatus = document.querySelector('.user-detail-status');
 var userDetailCreateDate = document.querySelector('.user-detail-createDate');

 // Panel thêm sản phẩm
 let addNewProductPanel = document.querySelector('.add-new-product-panel');

 // Panel cập nhật sản phẩm
 let updateProductPanel = document.querySelector('.update-product-panel');


 //  Panel Thêm promotion
 let addNewPromotionPanel = document.querySelector('.add-new-promotion-panel');

 //  Panel cập nhật promotion
 let updatePromotionPanel = document.querySelector('.update-promotion-panel');

 // Panel thêm voucher
 let addVoucherPanel = document.querySelector('.add-voucher-panel');


 // khởi tạo
 function start() {
     changeHeader();
     openDefaultTab();
     fetchUserList();
     fetchProductList();
     getAllVoucher();
     getAllPromotion();
     getAllProductForPromotion();
     showUserPage(currentUserPage);
     showProductPage(currentProductPage);
     showVoucherPage(currentVoucherPage);
     getStatisticInfomation();
     getRevenueOfMonth();
 }


 // function

 // Mặc định khi mở giao diện sẽ hiển thị tab đầu tiên (Quản lý người dùng)
 function openDefaultTab() {
     changeTab('tab1');
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


 // Người dùng
 // Phân trang user
 function showUserPage(page) {
     let rows = document.querySelectorAll('.user-table tbody tr');
     let start = (page - 1) * userRowsPerPage;
     let end = start + userRowsPerPage;

     for (let i = 0; i < rows.length; i++) {
         rows[i].style.display = (i >= start && i < end) ? '' : 'none';
     }

     document.getElementById('currentUserPage').innerText = 'Trang ' + page;
 }

 function changeUserPage(offset) {
     let rows = document.querySelectorAll('.user-table tbody tr');

     currentUserPage += offset;

     if (currentUserPage < 1) {
         currentUserPage = 1;
     } else if (currentUserPage > Math.ceil(rows.length / userRowsPerPage)) {
         currentUserPage = Math.ceil(rows.length / userRowsPerPage);
     }

     showUserPage(currentUserPage);
 }

 // Ấn vào tùy chọn ở mỗi user
 function showUserAction(button) {
     let panel = button.nextElementSibling;

     panel.style.display = 'flex';

     document.addEventListener('click', function (e) {
         if ((!panel.contains(e.target) && !button.contains(e.target)) || isDetailPanelShowing == true) {
             panel.style.display = 'none';
         }
     });
 }

 // Lấy dữ liệu từ API hiển thị vào bảng
 function fetchUserList() {
     fetch('https://api-hust.eztek.net/api/admin/Users/GetAllUser?page=0&pagesize=100', {
             method: 'POST',
             headers: {
                 'Authorization': `Bearer ${idToken}`,
                 'Content-Type': 'application/json'
             }
         })
         .then(response => response.json())
         .then(data => {
             let tableBody = document.querySelector('.user-table tbody');

             data.userDtos.forEach(user => {
                 let activated = user.activated === true ? 'Hoạt động' : 'Hủy';

                 tableBody.innerHTML +=
                     `<tr data-user-id="${user.id}">
                                <td class="user-login">${user.login}</td>
                                <td>${user.lastName} ${user.firstName}</td>
                                <td>${user.email}</td>
                                <td>${user.phoneNumber}</td>
                                <td>${activated}</td>
                                <td class="user-more-action">
                                    <img src="/assets/img/icon/more.png" alt="" class="user-more-action-btn"
                                        onclick="showUserAction(this)">
                                    <div class="user-more-action-panel">
                                        <div class="user-more-action-option show-user-detail" onclick="showUserDetail(this)">Xem chi tiết</div>
                                        <div class="user-more-action-option delete-user" onclick="deleteUserByAdmin(this)">Xóa</div>
                                    </div>
                                </td>
                            </tr> `
             })

             showUserPage(currentUserPage);
         })
         .catch(error => {
             console.log(error);
         })


 }

 // Thông tin chi tiết người dùng
 function showUserDetail(showDetailBtn) {
     userDetailPanel.style.display = 'flex';
     isDetailPanelShowing = true;


     let userID = showDetailBtn.parentNode.parentNode.parentNode.getAttribute('data-user-id');

     fetch(`https://api-hust.eztek.net/api/accountByUserId?Id=${userID}`, {
             method: 'GET',
             headers: {
                 'Authorization': `Bearer ${idToken}`,
                 'Content-Type': 'application/json'
             }
         })
         .then(response => response.json())
         .then(data => {
             console.log(data);
             userDetailID.innerHTML = data.id;
             userDetailLogin.innerHTML = data.login;
             userDetailName.innerHTML = data.lastName + ' ' + data.firstName;
             userDetailCity.innerHTML = data.city;
             userDetailDistrict.innerHTML = data.district;
             userDetailEmail.innerHTML = data.email;
             userDetailPhoneNumber.innerHTML = data.phoneNumber;
             userDetailWard.innerHTML = data.ward;
             userDetailStatus.innerHTML = (data.activated == true) ? 'Hoạt động' : 'Không hoạt động';
             userDetailCreateDate.innerHTML = data.createdDate.substring(0, 10);
         })
         .catch(error => {
             console.log(error);
         })
 }

 // Ẩn panel chi tiết người dùng
 function hideUserDetailPanel() {
     userDetailPanel.style.display = 'none';
     isDetailPanelShowing = false;
 }

 // Xóa người dùng
 function deleteUserByAdmin(deleteButton) {
     let deletedRow = deleteButton.parentNode.parentNode.parentNode;
     let userLogin = deleteButton.parentNode.parentNode.parentNode.querySelector('.user-login').innerHTML;

     fetch(`https://api-hust.eztek.net/api/admin/Users/${userLogin}`, {
             method: 'DELETE',
             headers: {
                 'Authorization': `Bearer ${idToken}`,
                 'Content-Type': 'application/json'
             }
         })
         .then(response => response.json())
         .then(data => {

         })
         .catch(error => {
             console.log(error);
         })

     deletedRow.remove();
     showUserPage(currentUserPage);
 }

 // ----------------------------------------------------------------------------------------------------
 // Sản phẩm
 // Tùy chọn của mỗi sản phẩm
 function showProductAction(button) {
     let panel = button.nextElementSibling;

     panel.style.display = 'flex';

     document.addEventListener('click', function (e) {
         if ((!panel.contains(e.target) && !button.contains(e.target)) || isUpdateProductPanelShowing ==
             true) {
             panel.style.display = 'none';
         }
     });
 }

 // Phân trang product
 function showProductPage(page) {
     let rows = document.querySelectorAll('.product-table tbody tr');
     let start = (page - 1) * productRowsPerPage;
     let end = start + productRowsPerPage;

     for (let i = 0; i < rows.length; i++) {
         rows[i].querySelector('.product-STT').innerText = i + 1;
         rows[i].style.display = (i >= start && i < end) ? '' : 'none';
     }

     document.getElementById('currentProductPage').innerText = 'Trang ' + page;
 }

 function changeProductPage(offset) {
     let rows = document.querySelectorAll('.product-table tbody tr');
     currentProductPage += offset;

     if (currentProductPage < 1) {
         currentProductPage = 1;
     } else if (currentProductPage > Math.ceil(rows.length / productRowsPerPage)) {
         currentProductPage = Math.ceil(rows.length / productRowsPerPage);
     }

     showProductPage(currentProductPage);
 }

 // Hiển thị giao diện Thêm sản phẩm mới
 function showAddProductPanel() {
     addNewProductPanel.style.display = 'flex';
 }

 // Ẩn giao diện thêm sản phẩm mới
 function hideAddProductPanel() {
     addNewProductPanel.style.display = 'none';
     isDetailPanelShowing = false;
 }

 // Thêm sản phẩm lên API
 function addNewProductToAPI() {
     let productName = document.getElementById('add-product-name').value;
     let productDescription = document.getElementById('add-product-description').value;
     let productImageUrl = document.getElementById('add-product-image').value;
     let productPrice = document.getElementById('add-product-price').value;
     let productSportID = document.getElementById('add-product-sportName').value;
     let productBrand = document.getElementById('add-product-brand').value;
     let productQuantity = document.getElementById('add-product-quantity').value;
     let productType = document.getElementById('add-product-type').value;
     let productSizeList = document.getElementById('add-product-size-list').value;
     let productColorList = document.getElementById('add-product-color-list').value;

     let product = {
         name: productName,
         description: productDescription,
         image: productImageUrl,
         price: Number(productPrice),
         sportId: productSportID,
         brand: productBrand,
         quantity: Number(productQuantity),
         type: Number(productType),
         listSize: productSizeList.split(", "),
         listColor: productColorList.split(", ")
     }
     if (checkObject(product)) {
         fetch('https://api-hust.eztek.net/product/create', {
                 method: 'POST',
                 headers: {
                     'Authorization': `Bearer ${idToken}`,
                     'Content-Type': 'application/json'
                 },
                 body: JSON.stringify(product)
             })
             .then(response => response.json())
             .then(data => {
                 console.log(data);
             })
             .catch(error => {
                 console.log(error);
             })
             .finally(() => {
                 fetchProductList();
                 hideAddProductPanel();
             })
     } else {
         alert('Vui lòng nhập đủ thông tin')
     }

 }

 // Danh sách sản phẩm
 function fetchProductList() {
     fetch('https://api-hust.eztek.net/get-all-product-in-shop?Page=0&PageSize=100', {
             method: 'GET',
             headers: {
                 'Authorization': `Bearer ${idToken}`,
                 'Content-Type': 'application/json'
             }
         })
         .then(response => response.json())
         .then(data => {
             console.log(data);
             let productTableBody = document.querySelector('.product-table tbody');
             productTableBody.innerHTML = '';
             data.data.forEach(product => {
                 let price = product.price.toLocaleString('vn-VN') + 'đ';

                 productTableBody.innerHTML +=
                     `<tr data-product-id="${product.id}">
                            <td class="product-STT"></td>
                            <td class="product-name">
                                <img src="${product.image}" alt="">
                                <span>${product.name}</span>
                            </td>
                            <td>${product.sportName}</td>
                            <td>${product.brand}</td>
                            <td>${product.quantity}</td>
                            <td>${price}</td>
                            <td class="product-more-action">
                                <img src="/assets/img/icon/more.png" alt="" class="product-more-action-btn"
                                    onclick="showProductAction(this)">
                                <div class="product-more-action-panel">
                                    <div class="product-more-action-option update-product" onclick="showProductToUpdatePanel(this)">Cập nhật</div>
                                    <div class="product-more-action-option delete-product" onclick="deleteProduct(this)">Xóa</div>
                                </div>
                            </td>
                        </tr>  `
             })

             showProductPage(currentProductPage);
         })
         .catch(error => {
             console.log(error);
         })
 }

 // Lọc sản phẩm theo phân loại(môn thể thao)
 function getProductBySportName(event) {
     const choice = event.target.value;
     if (choice === '0') {
         showProductPage(1);
         fetchProductList();
     }
     let sportName = encodeURIComponent(choice);
     console.log(sportName);
     fetch(`https://api-hust.eztek.net/get-all-product-in-shop?SportName=${sportName}&Page=0&PageSize=100`, {
             method: 'GET',
             headers: {
                 'Authorization': `Bearer ${idToken}`,
                 'Content-Type': 'application/json'
             }
         })
         .then(response => response.json())
         .then(data => {
             let productTableBody = document.querySelector('.product-table tbody');
             productTableBody.innerHTML = '';
             data.data.forEach(product => {
                 let price = product.price.toLocaleString('vn-VN') + 'đ';

                 productTableBody.innerHTML +=
                     `<tr>
                            <td class="product-STT"></td>
                            <td class="product-name">
                                <img src="${product.image}" alt="">
                                <span>${product.name}</span>
                            </td>
                            <td>${product.sportName}</td>
                            <td>${product.brand}</td>
                            <td>${product.quantity}</td>
                            <td>${price}</td>
                            <td class="product-more-action">
                                <img src="/assets/img/icon/more.png" alt="" class="product-more-action-btn"
                                    onclick="showProductAction(this)">
                                <div class="product-more-action-panel">
                                    <div class="product-more-action-option update-product" onclick="">Cập nhật</div>
                                    <div class="product-more-action-option delete-product" onclick="">Xóa</div>
                                </div>
                            </td>
                        </tr>  `
             })


             showProductPage(1);

         })
         .catch(error => {
             console.log(error);
         })
 }

 // Xóa sản phẩm
 function deleteProduct(this_button) {
     let productID = this_button.parentNode.parentNode.parentNode.getAttribute('data-product-id');
     let productItem = this_button.parentNode.parentNode.parentNode;

     let bodyRequest = {
         productId: productID
     }

     fetch('https://api-hust.eztek.net/product/delete', {
             method: 'DELETE',
             headers: {
                 'Authorization': `Bearer ${idToken}`,
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify(bodyRequest)
         })
         .then(response => response.json())
         .then(data => {
             productItem.remove();
             showProductPage(currentProductPage);

         })
         .catch(err => {
             console.log(err);
         })


 }

 // Ẩn giao diện cập nhật sản phẩm
 function hideUpdateProductPanel() {
     updateProductPanel.style.display = 'none';
     isUpdateProductPanelShowing = false;
 }

 // Hiển thị thông tin sản phẩm lên updateProductPanel
 function showProductToUpdatePanel(updateButton) {
     let product_id = updateButton.parentNode.parentNode.parentNode.getAttribute('data-product-id');
     isUpdateProductPanelShowing = true;

     updateProductPanel.style.display = 'flex';
     updateProductPanel.setAttribute('data-product-id', product_id);

     let productIDElement = document.getElementById('update-product-id');
     let productName = document.getElementById('update-product-name');
     let productDescription = document.getElementById('update-product-description');
     let productImage = document.getElementById('update-product-image');
     let productSportName = document.getElementById('update-product-sportName');
     let productBrand = document.getElementById('update-product-brand');
     let productPrice = document.getElementById('update-product-price');
     let productQuantity = document.getElementById('update-product-quantity');
     let productType = document.getElementById('update-product-type');
     let productSize = document.getElementById('update-product-size-list');
     let productColor = document.getElementById('update-product-color-list');



     fetch(`https://api-hust.eztek.net/product/get-detail?ProductId=${product_id}`, {
             method: 'GET',
             headers: {
                 'Authorization': `Bearer ${idToken}`,
                 'Content-Type': 'application/json'
             }
         })
         .then(response => response.json())
         .then(data => {
             console.log(data);
             productIDElement.value = product_id;
             productName.value = data.name;
             productDescription.value = data.description;
             productImage.value = data.image;
             productSportName.value = data.sportId;
             productBrand.value = data.brand;
             productPrice.value = data.price;
             productQuantity.value = data.quantity;
             productSize.value = data.listSize.join(', ');
             productColor.value = data.listColor.join(', ');
         })
         .catch(err => {
             console.log(err);
         })
 }

 // Cập nhật sản phẩm
 function updateProduct(updateButton) {
     let productID = updateButton.parentNode.parentNode.getAttribute('data-product-id');
     let productName = document.getElementById('update-product-name').value;
     let productDescription = document.getElementById('update-product-description').value;
     let productImageUrl = document.getElementById('update-product-image').value;
     let productPrice = document.getElementById('update-product-price').value;
     let productSportID = document.getElementById('update-product-sportName').value;
     let productBrand = document.getElementById('update-product-brand').value;
     let productQuantity = document.getElementById('update-product-quantity').value;
     let productType = document.getElementById('update-product-type').value;
     let productSizeList = document.getElementById('update-product-size-list').value;
     let productColorList = document.getElementById('update-product-color-list').value;

     let product = {
         id: productID,
         name: productName,
         description: productDescription,
         image: productImageUrl,
         price: Number(productPrice),
         sportId: productSportID,
         brand: productBrand,
         quantity: Number(productQuantity),
         type: Number(productType),
         listSize: productSizeList.split(", "),
         listColor: productColorList.split(", ")
     }

     if (checkObject(product)) {
         fetch('https://api-hust.eztek.net/product/update', {
                 method: 'PATCH',
                 headers: {
                     'Authorization': `Bearer ${idToken}`,
                     'Content-Type': 'application/json'
                 },
                 body: JSON.stringify(product)
             })
             .then(response => response.json())
             .then(data => {
                 console.log(data);
             })
             .catch(error => {
                 console.log(error);
             })
             .finally(() => {
                 fetchProductList();
                 hideUpdateProductPanel();
                 alert('Cập nhật sản phẩm thành công !');
             })
     } else {
         alert('Vui lòng nhập đủ thông tin')
     }

 }


 function checkObject(obj) {
     return Object.values(obj).every(value => {
         if (typeof value === 'string') {
             return value.trim() !== '';
         }
         return !!value;
     });
 }


 // Tab 3: Thống kê

 // lấy thông tin thống kê
 function getStatisticInfomation() {
     let totalRevenueDisplay = document.getElementById('total-revenue');
     let productSoldItems = document.querySelectorAll('.statistics-sold-item');
     let sellingProductsList = document.querySelector('.selling-products-list');

     fetch('https://api-hust.eztek.net/api/admin/Users/statistics-shop', {
             method: 'GET',
             headers: {
                 'Authorization': `Bearer ${idToken}`,
                 'Content-Type': 'application/json'
             }
         })
         .then(response => response.json())
         .then(data => {
             totalRevenueDisplay.innerText = data.revenue.toLocaleString('vn-VN') + ' VND';


             for (var i = 0; i < 4; i++) {
                 productSoldItems[i].querySelector('h1').innerText = data.countProductOfSport[i]
                     .countProduct;
             }

             data.listProductBestSell.forEach(product => {
                 let type = product.type == 1 ? 'Quần Áo' : product.type == 2 ? 'Giày' :
                     product.type == 3 ? 'Bóng' : product.type == 4 ? 'Kính bơi' : 'Sân bóng'
                 sellingProductsList.innerHTML +=
                     `
                            <li class="selling-products-item">
                                <img src="${product.image}" alt="">
                                <div class="selling-products-item-body">
                                    <h2 class="selling-products-item-name">${product.name}</h2>
                                    <span class="selling-products-item-sportName">${type}</span>
                                </div>
                            </li>
                            `
             })

             console.log(data);
         })
         .catch(err => {
             console.log(err);
         })
 }

 // Doanh thu theo tháng
 function getRevenueOfMonth() {
     console.log('hello');
     let month = Number(document.getElementById('revenue-of-time-month').value);
     let year = Number(document.getElementById('revenue-of-time-year').value);

     fetch(`https://api-hust.eztek.net/api/admin/Users/get-revenue-of-time?Month=${month}&Year=${year}`, {
             method: 'GET',
             headers: {
                 'Authorization': `Bearer ${idToken}`,
                 'Content-Type': 'application/json'
             }
         })
         .then(response => response.json())
         .then(data => {
             document.getElementById('revenue-of-month-display').innerText = data.toLocaleString('vn-VN') +
                 ' đ';
         })
         .catch(err => {
             console.log(err);
         })

 }


 // Tab 4: Giảm giá

 //  voucher
 function getAllVoucher() {
     let voucherTableBody = document.querySelector('.voucher-table tbody');

     fetch('https://api-hust.eztek.net/voucher/show-all-voucher-valid', {
             method: 'GET',
             headers: {
                 'Authorization': `Bearer ${idToken}`,
                 'Content-Type': 'application/json'
             }
         })
         .then(response => response.json())
         .then(data => {
             console.log(data);

             data.forEach(voucher => {
                 voucherTableBody.innerHTML +=
                     `
                            <tr data-voucher-id="${voucher.id}">
                                <td>${voucher.name}</td>
                                <td>${voucher.value.toLocaleString('vn-VN') + 'đ'}</td>
                                <td>${voucher.endDate.substr(0, 10)}</td>
                            </tr>
                        `
             })
             showVoucherPage(currentVoucherPage);

         })
         .catch(err => {
             console.log(err);
         })
 }


 function showVoucherPage(page) {
     let rows = document.querySelectorAll('.voucher-table tbody tr');
     let start = (page - 1) * vouchersPerPage;
     let end = start + vouchersPerPage;

     for (let i = 0; i < rows.length; i++) {
         //  rows[i].querySelector('.product-STT').innerText = i + 1;
         rows[i].style.display = (i >= start && i < end) ? '' : 'none';
     }

     document.getElementById('currentVoucherPage').innerText = 'Trang ' + page;
 }

 function changeVoucherPage(offset) {
     let rows = document.querySelectorAll('.voucher-table tbody tr');
     currentVoucherPage += offset;

     if (currentVoucherPage < 1) {
         currentVoucherPage = 1;
     } else if (currentVoucherPage > Math.ceil(rows.length / vouchersPerPage)) {
         currentVoucherPage = Math.ceil(rows.length / vouchersPerPage);
     }

     showVoucherPage(currentVoucherPage);
 }

 function hideAddVoucherPanel() {
     addVoucherPanel.style.display = 'none';
 }

 function showAddVoucherPanel() {
     addVoucherPanel.style.display = 'flex';
 }

 function addNewVoucher() {
     let voucherName_ = document.getElementById('add-voucher-voucherName').value;
     let voucherValue_ = document.getElementById('add-voucher-value').value;
     let voucherStartDate_ = document.getElementById('add-voucher-startDate').value;
     let voucherEndDate_ = document.getElementById('add-voucher-endDate').value;

     let bodyRequest = {
         name: voucherName_,
         value: Number(voucherValue_),
         startDate: voucherStartDate_,
         endDate: voucherEndDate_
     };
     if (checkObject(bodyRequest)) {
         fetch('https://api-hust.eztek.net/voucher/create', {
                 method: 'POST',
                 headers: {
                     'Authorization': `Bearer ${idToken}`,
                     'Content-Type': 'application/json'
                 },
                 body: JSON.stringify(bodyRequest)
             })
             .then(response => response.json())
             .then(data => {
                 console.log(data);
                 alert('Thêm voucher thành công!');
             })
             .catch(error => {
                 console.log(error);
             })
             .finally(() => {
                 getAllVoucher();
                 hideAddVoucherPanel();
             })
     } else {
         alert('Vui lòng nhập đủ thông tin')
     }

 }

 //  promotion
 async function getAllPromotion() {
     let promotionTableBody = document.querySelector('.promotion-table tbody');

     try {
         const response = await fetch('https://api-hust.eztek.net/promotion/get-all-valid-promotion?Page=0&PageSize=100', {
             method: 'GET',
             headers: {
                 'Authorization': `Bearer ${idToken}`,
                 'Content-Type': 'application/json'
             }
         });

         const data = await response.json();

         console.log(data);

         promotionTableBody.innerHTML = '';

         for (const promotion of data.data) {
             const productName = await getProductNameById(promotion.productId);
             console.log('Promotion:', productName);

             promotionTableBody.innerHTML +=
                 `
                <tr data-promotion-id="${promotion.promotionId}">
                    <td class="promotion-product-name">${productName}</td>
                    <td class="promotion-product-discount">${promotion.discount + '%'}</td>
                    <td class="promotion-product-endDate">${promotion.endDate.substr(0, 10)}</td>
                    <td class="promotion-more-action">
                        <img src="/assets/img/icon/more.png" alt="" class="promotion-more-action-btn"
                                    onclick="showPromotionAction(this)">
                        <div class="promotion-more-action-panel">
                            <div class="promotion-more-action-option update-promotion" onclick="showPromotionToUpdatePanel(this)">Cập nhật</div>
                            <div class="promotion-more-action-option delete-promotion" onclick="deletePromotion(this)">Xóa</div>
                        </div>
                    </td>
                </tr>
                `;
         }
         //  showPromotionPage(currentPromotionPage);x


     } catch (err) {
         console.log(err);
     }
 }

 async function getProductNameById(productID) {
     try {
         const response = await fetch(`https://api-hust.eztek.net/product/get-detail?ProductId=${productID}`, {
             method: 'GET',
             headers: {
                 'Authorization': `Bearer ${idToken}`,
                 'Content-Type': 'application/json'
             }
         });

         const data = await response.json();
         return data.name;

     } catch (err) {
         console.log(err);
     }
 }

 // Hàm lấy tất cả sản phẩm để lựa chọn ở addNewPromotion
 function getAllProductForPromotion() {
     let productSelect = document.getElementById('promotion-product-list');

     fetch('https://api-hust.eztek.net/get-all-product-in-shop?Page=0&PageSize=100', {
             method: 'GET',
             headers: {
                 'Authorization': `Bearer ${idToken}`,
                 'Content-Type': 'application/json'
             }
         })
         .then(response => response.json())
         .then(data => {
             data.data.forEach(product => {
                 productSelect.innerHTML +=
                     `
                    <option value="${product.id}">${product.name}</option>
                    `
             })
         })
         .catch(err => {
             console.log(err);
         })
 }

 function showPromotionPage(page) {
     let rows = document.querySelectorAll('.promotion-table tbody tr');
     let start = (page - 1) * promotionsPerPage;
     let end = start + promotionsPerPage;

     for (let i = 0; i < rows.length; i++) {
         //  rows[i].querySelector('.product-STT').innerText = i + 1;
         rows[i].style.display = (i >= start && i < end) ? '' : 'none';
     }

     document.getElementById('currentpromotionPage').textContent = 'Trang ' + page;
 }

 function changePromotionPage(offset) {
     let rows = document.querySelectorAll('.promotion-table tbody tr');
     currentPromotionPage += offset;

     if (currentPromotionPage < 1) {
         currentPromotionPage = 1;
     } else if (currentPromotionPage > Math.ceil(rows.length / promotionsPerPage)) {
         currentPromotionPage = Math.ceil(rows.length / promotionsPerPage);
     }

     showPromotionPage(currentPromotionPage);
 }

 function showPromotionAction(button) {
     let panel = button.nextElementSibling;

     panel.style.display = 'flex';

     document.addEventListener('click', function (e) {
         if ((!panel.contains(e.target) && !button.contains(e.target)) || isUpdatePromotionPanelShowing === true) {
             panel.style.display = 'none';
         }
     });
 }

 //  Xóa promotion
 function deletePromotion(this_button) {
     let promotionID = this_button.parentNode.parentNode.parentNode.getAttribute('data-promotion-id');
     let promotionItem = this_button.parentNode.parentNode.parentNode;

     console.log(promotionID, promotionItem);

     let bodyRequest = {
         promotionId: promotionID
     }

     fetch('https://api-hust.eztek.net/promotion/delete', {
             method: 'DELETE',
             headers: {
                 'Authorization': `Bearer ${idToken}`,
                 'Content-Type': 'application/json'
             },
             body: JSON.stringify(bodyRequest)
         })
         .then(response => response.json())
         .then(data => {
             promotionItem.remove();
             showPromotionPage(currentPromotionPage);

         })
         .catch(err => {
             console.log(err);
         })


 }

 // Hiển thị panel thêm promotion
 function showAddPromotionPanel() {
     addNewPromotionPanel.style.display = 'flex';
     isUpdatePromotionPanelShowing = true;
 }

 //  Thêm promotion mới
 function addNewPromotionToAPI() {
     let productID_ = document.getElementById('promotion-product-list').value;
     let promotionName_ = document.getElementById('add-promotion-promotionName').value;
     let discount_ = document.getElementById('add-promotion-discount').value;
     let startDate_ = document.getElementById('add-promotion-startDate').value;
     let endDate_ = document.getElementById('add-promotion-endDate').value;


     let promotion = {
         productId: productID_,
         promotionName: promotionName_,
         discount: Number(discount_),
         startDate: startDate_,
         endDate: endDate_
     }


     if (productID_ === '0') {
         alert('Vui lòng chọn sản phẩm !');
     } else {
         if (checkObject(promotion)) {
             fetch('https://api-hust.eztek.net/promotion/create', {
                     method: 'POST',
                     headers: {
                         'Authorization': `Bearer ${idToken}`,
                         'Content-Type': 'application/json'
                     },
                     body: JSON.stringify(promotion)
                 })
                 .then(response => response.json())
                 .then(data => {
                     console.log(data);
                     alert('Thêm khuyến mãi mới thành công!');
                     getAllPromotion();
                     hideAddPromotionPanel();

                 })
                 .catch(error => {
                     console.log(error);
                 })
                 .finally(() => {
                     window.location.reload();
                 })
         } else {
             alert('Vui lòng nhập đủ thông tin')
         }

     }


 }

 //  Ẩn panel thêm promotion
 function hideAddPromotionPanel() {
     addNewPromotionPanel.style.display = 'none';
 }

 //  Ẩn panel cập nhật promotion
 function hideUpdatePromotionPanel() {
     updatePromotionPanel.style.display = 'none';
     isUpdatePromotionPanelShowing = false;
 }

 //  Hiển thị panel cập nhật promotion
 function showUpdatePromotionPanel() {
     updatePromotionPanel.style.display = 'flex';
 }

 function showPromotionToUpdatePanel(updateButton) {
     let promotion_id = updateButton.parentNode.parentNode.parentNode.getAttribute('data-promotion-id');
     isUpdatePromotionPanelShowing = true;

     showUpdatePromotionPanel();
     updatePromotionPanel.setAttribute('data-promotion-id', promotion_id);

     let promotionID_element = document.getElementById('update-promotion-promotionID');
     let productID_element = document.getElementById('update-promotion-productID');
     let promotionName_element = document.getElementById('update-promotion-promotionName');
     let promotionDiscount_element = document.getElementById('update-promotion-discount');
     let promotionStartDate_element = document.getElementById('update-promotion-startDate');
     let promotionEndDate_element = document.getElementById('update-promotion-endDate');




     fetch(`https://api-hust.eztek.net/promotion/get-detail?PromotionId=${promotion_id}`, {
             method: 'GET',
             headers: {
                 'Authorization': `Bearer ${idToken}`,
                 'Content-Type': 'application/json'
             }
         })
         .then(response => response.json())
         .then(data => {
             console.log(data);

             promotionID_element.value = data.promotionId;
             productID_element.value = data.productId;
             promotionName_element.value = data.promotionName;
             promotionDiscount_element.value = data.discount + '%';
             promotionStartDate_element.value = data.startDate;
             promotionEndDate_element.value = data.endDate;

         })
         .catch(err => {
             console.log(err);
         })
 }

 function updatePromotion(updateButton) {
     let promotionID_ = updateButton.parentNode.parentNode.getAttribute('data-promotion-id');
     let productID_ = document.getElementById('update-promotion-productID').value;
     let promotionName_ = document.getElementById('update-promotion-promotionName').value;
     let discountInput = document.getElementById('update-promotion-discount');
     let discount_ = Number(discountInput.value.substr(0, discountInput.value.length - 1));
     let startDate_ = document.getElementById('update-promotion-startDate').value;
     let endDate_ = document.getElementById('update-promotion-endDate').value;


     let promotion = {
         promotionId: promotionID_,
         productId: productID_,
         promotionName: promotionName_,
         discount: discount_,
         startDate: startDate_,
         endDate: endDate_
     }

     console.log(promotion);

     if (checkObject(promotion)) {
         fetch('https://api-hust.eztek.net/promotion/update', {
                 method: 'PATCH',
                 headers: {
                     'Authorization': `Bearer ${idToken}`,
                     'Content-Type': 'application/json'
                 },
                 body: JSON.stringify(promotion)
             })
             .then(response => response.json())
             .then(data => {
                 console.log(data);
             })
             .catch(error => {
                 console.log(error);
             })
             .finally(() => {
                 getAllPromotion();
                 hideUpdatePromotionPanel();
                 alert('Cập nhật khuyến mãi thành công !');
                 window.location.reload();
             })
     } else {
         alert('Vui lòng nhập đủ thông tin')
     }
 }

//  function searchProductAdmin(event) {
//     if (event.keyCode === 13) {
//         // Lấy giá trị từ ô input
//         var keyword = searchInput.value.trim();

//         // Kiểm tra xem từ khóa có tồn tại không
//         if (keyword !== '') {
            
//         }
//     }
//  }


 start();