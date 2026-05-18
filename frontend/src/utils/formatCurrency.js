export const formatCurrency = (value) => {
    const numberValue = Number(value || 0);

    return numberValue.toLocaleString("vi-VN") + " đ";
};