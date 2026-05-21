import "./ScrollTopButton.css";

function ScrollTopButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      className="scroll-top-btn"
      onClick={scrollToTop}
      title="Lên đầu trang"
    >
      ↑
    </button>
  );
}

export default ScrollTopButton;