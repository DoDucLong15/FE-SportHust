// Slider
// const imgPosition = document.querySelectorAll(".slide-container img");
// const imgContainer = document.querySelector(".slide-container");

// let index = 0;

// console.log(imgPosition);
// imgPosition.forEach(function(image, index){
//     image.style.left = index * 100 + '%';
// });

// function imgSlide() {
//     index = index == imgPosition.length - 1 ? index = 0 : index + 1;
//     imgContainer.style.left = '-' + index * 100 + '%';
// }

// setInterval(imgSlide, 4000); // Slide chuyển ảnh sau 4 giây

let slideIndex = 0;
slide();

function slide() {
    let i;
    let images = document.querySelectorAll(".slide-container img");
    for(i = 0; i < images.length; i++){
        images[i].style.display = "none";
    }
    slideIndex++;
    if(slideIndex > images.length) slideIndex = 1;
    images[slideIndex-1].style.display = "block";
    setTimeout(slide, 3000);
}

// -------------------------------------------------------------------------------------------


document.addEventListener('DOMContentLoaded', function () {
    // Lấy danh sách các thẻ a trong menu
    var menuItems = document.querySelectorAll('.sub-menu-product a');

    menuItems.forEach(function (menuItem) {
        menuItem.addEventListener('click', function (event) {
            // Ngăn chặn hành động mặc định của thẻ a (tránh chuyển trang)
            event.preventDefault();

            // Lấy đường dẫn từ thuộc tính href của thẻ a
            var href = menuItem.getAttribute('href');

            // Chuyển hướng đến đường dẫn
            window.location.href = href;
        });
    });
});








