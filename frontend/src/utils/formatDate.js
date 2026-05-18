export const formatDate = (value) => {
    if (!value) {
        return "";
    }

    return new Date(value).toLocaleString("vi-VN");
}