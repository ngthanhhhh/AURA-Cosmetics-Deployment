import Swal from "sweetalert2";

export const confirmDelete = async (
    title = "Bạn có chắc chắn?",
    text = "Dữ liệu sẽ không thể khôi phục!"
) => {
    const result = await Swal.fire({
        title,
        text,
        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",

        confirmButtonColor: "#e74c3c",
        cancelButtonColor: "#6c757d",

        reverseButtons: true,
    });

    return result.isConfirmed;
};

export const confirmUpdate = async (
    title = "Xác nhận cập nhật",
    text = "Bạn có muốn cập nhật dữ liệu này?"
) => {
    const result = await Swal.fire({
        title,
        text,
        icon: "question",

        showCancelButton: true,
        confirmButtonText: "Cập nhật",
        cancelButtonText: "Hủy",

        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#6c757d",

        reverseButtons: true,
    });

    return result.isConfirmed;
};