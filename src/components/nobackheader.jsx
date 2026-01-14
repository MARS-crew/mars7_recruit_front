function Nobackheader({ title }) {

  return (
    <div
      style={{
        height: 56,
        display: "flex",
        alignItems: "center",
        position: "relative",
        width: "100%",
        backgroundColor: "#FFFFFF",
        boxSizing: "border-box",
      }}
    >
      <p
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: "20px",
          fontWeight: "600",
          margin: 0,
          color: "#000000",
          pointerEvents: "none",
        }}
      >
        {title}
      </p>
    </div>
  );
}

export default Nobackheader;
