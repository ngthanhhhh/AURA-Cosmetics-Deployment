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