export default function Button({
  label,
  type = "button",
  onClick,
  customWidth = "100%",
  height = 60,
}) {
  return (
    <button
      style={{
        width: customWidth,
        height: height,
        backgroundColor: "#2572B9",
        border: "1px solid #D9D9D9",
        borderRadius: 16,
        fontSize: "20px",
        fontWeight: "600",
        color: "#FFFFFF",
      }}
      type={type}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
