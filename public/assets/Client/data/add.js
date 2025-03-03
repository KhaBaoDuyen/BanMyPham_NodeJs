var APIurl = 'http://localhost:3000/';
var list = "list";


function getData() {
    let dataFrom = document.getElementById('contact-form').elements;
    let obj = {
        "title": dataFrom['title'].value,
        "note": dataFrom['note'].value,
        "image": dataFrom['image'].value.split('\\')[2]
    };
    return obj;
}

function validation() {
    const title = document.getElementById('title');
    const note = document.getElementById('note');
    const image = document.getElementById('image');
    const errors_title = document.getElementById('errors_title');
    const errors_note = document.getElementById('errors_note');
    const errors_image = document.getElementById('errors_image');
    let isValid = true;

    if (!getData().title) {
        // console.log('title không được bỏ trống');
        errors_title.textContent = "Title không được bỏ trống";
        title.style.border = "1px solid red";
        isValid = false;
    } else {
        errors_title.textContent = "";
        title.style.border = "none";
    }

    if (!getData().note) {
        // console.log(' note không được bỏ trống');
        errors_note.textContent = "Note không được bỏ trống";
        note.style.border = "1px solid red";
        isValid = false;
    } else {
        errors_note.textContent = "";
        note.style.border = "none";
    }

    if (!getData().image) {
        // console.log('title không được bỏ trống');
        errors_image.textContent = "Image không được bỏ trống";
        image.style.border = "1px solid red";
        isValid = false;
    } else {
        errors_image.textContent = "";
        image.style.border = "none";
    }

return isValid;
}



function add(event) {
    // Ngăn chặn hành động mặc định (gửi form)
    event.preventDefault();
    // Kiểm tra kết quả xác thực trước khi gửi dữ liệu
    if (validation()) {
        axios.post(APIurl + list, getData())
            .then(res => {
                console.log(res);
                if (res.status == 200 || res.status == 201) {
                    console.log("Thêm dữ liệu thành công. Chuyển trang...");
                    location.href = '../index.html'; 
                    //  alert('Thêm thanh cong !');
                }
            })
            .catch(err => console.error(err));
    }
}