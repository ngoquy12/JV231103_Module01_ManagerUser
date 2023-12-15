let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);
let userLocal = JSON.parse(localStorage.getItem("users")) || [];
let curentPage = 1; // Trang hiện tại đang đứng
let totalPerPage = 5; // Số lượng bản ghi / 1 trang
let btnActive = 1;

let genderValue = 0;

// Lấy phần tử radio giới tính
$$("input[name=gender]").forEach((input) => {
  input.addEventListener("change", (e) => {
    if (e.target.checked) {
      genderValue = e.target.value;
    }
  });
});

// Lắng nghe sự kiện submit form
$("#form").addEventListener("submit", (e) => {
  // Ngăn chặn hành vi mặc định
  e.preventDefault();

  const newUser = {
    userId: Math.ceil(Math.random() * 1000000),
    userName: $("#userName").value,
    gender: +genderValue,
    dateOfBirth: $("#dateOfBirth").value,
    email: $("#email").value,
    status: 1,
    image: "",
    createdDate: new Date().toISOString().split("T")[0],
  };

  // Thêm vào đầu mảng
  userLocal.unshift(newUser);

  // Lưu dữ liệu lên local
  localStorage.setItem("users", JSON.stringify(userLocal));

  // Reder dữ liệu
  renderUser();
});

// Reder dữ liệu

function renderUser() {
  // Vị trí bắt đầu:
  let startIndex = (curentPage - 1) * totalPerPage;

  // Vị trí kết thúc
  let endIndex = startIndex + totalPerPage;

  // Cắt mảng từ vị trí startIndex đến endIndex
  let userSlice = userLocal.slice(startIndex, endIndex);

  // Đưa dữ liệu vào trong chuỗi HTML
  const trHtmls = userSlice.map((user, index) => {
    return `
    <tr>
      <td>${index + 1}</td>
      <td>${user.userName}</td>
      <td>${user.gender === 0 ? "Nam" : user.gender === 1 ? "Nữ" : "Khác"}</td>
      <td>${user.dateOfBirth}</td>
      <td>${user.email}</td>
      <td>${user.status === 1 ? "Đang hoạt động" : "Ngừng hoạt động"}</td>
      <td>
        <button id="block_${user.userId}">${
      user.status === 1 ? "Chặn" : "Bỏ chặn"
    }</button>
        <button>Xem chi tiết</button>
      </td>
    </tr>
    `;
  });

  // CHuyển đổi từ array về string
  const trHtml = trHtmls.join("");

  // Append
  $("#tbody").innerHTML = trHtml;
}

renderUser();

// Lắng nghe sự kiện khi onclick vào tbody
$("#tbody").addEventListener("click", (e) => {
  if (e.target) {
    // Lấy ra thuộc tính id của button chặn trong tbody
    const targetId = e.target.id;
    // Cắt chuỗi để lấy id
    const idDelete = +targetId.split("_")[1];

    // Tìm kiếm user theo id
    const findUser = userLocal.find((user) => user.userId === idDelete);

    // Lấy xác nhận từ người dùng
    let confirmBlock = confirm(
      `Bạn có chắc chắn muốn ${findUser.status === 1 ? "Chặn" : "Bỏ chặn"} ${
        findUser.userName
      } này không?`
    );

    if (confirmBlock) {
      // Gọi hàm handleBlockUser
      handleBlockUser(idDelete);
    }
  }
});

// Xử lý chặn user
function handleBlockUser(id) {
  // Tìm ra vị trí của user cần chặn
  const findIndexUser = userLocal.findIndex((user) => user.userId === id);

  // Dùng vị trí của user, lấy ra phần tử cần block
  userLocal[findIndexUser].status =
    userLocal[findIndexUser].status === 1 ? 0 : 1;

  // Lưu dữ liệu lên local
  localStorage.setItem("users", JSON.stringify(userLocal));

  // Gọi lại hàm render
  renderUser();
}

// Render số lượng button tượng trưng cho từng trang
function renderBtnPage() {
  // Tính số lượng button có thể xuất hiện = Tổng số bản ghi / số lượng bản ghi trên trang
  let totalBtn = Math.ceil(userLocal.length / totalPerPage);

  // Xóa những btn bên HTML
  $("#pageNumberContainer").innerHTML = "";

  // Lặp qua số lượng trang
  for (let i = 1; i <= totalBtn; i++) {
    // Tạo element button
    const btnElement = document.createElement("button");

    // Gán nội dung cho button
    btnElement.textContent = i;

    // Append vào trong DOM
    $("#pageNumberContainer").appendChild(btnElement);

    // Lắng nghe sự kiện khi click vào btn page thì chuyển trang
    btnElement.addEventListener("click", () => {
      // Gán lại currenrPage cho i
      curentPage = i;
      // Gọi hàm render lại dữ liệu
      renderUser();

      handleActive();
    });
  }

  handleActive();
}

renderBtnPage();

// Khi click vào nút tiếp thì cập nhật giá trị của curentPage lên 1

$("#nextPage").addEventListener("click", () => {
  // Lấy ra trang lớn nhất
  let maxPage = Math.ceil(userLocal.length / totalPerPage);

  if (curentPage < maxPage) {
    curentPage++; // Tăng trang hiện tại lên 1
    renderUser(); // render lại giao diện
    handleActive();
  }
});

// Khi click vào nút lùi thì cập nhật giá trị của curentPage giảm xuống 1

$("#previousPage").addEventListener("click", () => {
  if (curentPage > 1) {
    curentPage--; // Tăng trang hiện tại lên 1
    renderUser(); // render lại giao diện
    handleActive();
  }
});

// Hàm xử lý btn đang được active
function handleActive() {
  // Tính số lượng button có thể xuất hiện = Tổng số bản ghi / số lượng bản ghi trên trang
  let totalBtn = Math.ceil(userLocal.length / totalPerPage);

  // Lấy ra element button
  let btnElements = $$("#pageNumberContainer button");

  btnElements.forEach((button, index) => {
    if (index + 1 === curentPage) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

handleActive();

// Lắng nghe sự kiện input
$("#searchInput").addEventListener("input", (e) => {
  // Lấy giá trị trong input
  let inputValue = e.target.value.toLowerCase().trim();
  if (inputValue) {
    const fiterUsres = userLocal.filter((user) => {
      return user.userName
        .toLowerCase()
        .normalize("NFD")
        .replace("\u0041\u006d\u0065\u0301\u006c\u0069\u0065")
        .includes(
          inputValue
            .toLowerCase()
            .normalize("NFD")
            .replace("\u0041\u006d\u0065\u0301\u006c\u0069\u0065")
        );
    });
    // Làm rỗng mảng
    userLocal.length = 0;
    userLocal.unshift(...fiterUsres);
    renderUser();
  } else {
    // Làm rỗng mảng
    userLocal.length = 0;
    // Lưu lại dữ liệu lên local
    userLocal.unshift(...JSON.parse(localStorage.getItem("users")));
    renderUser();
  }
});
