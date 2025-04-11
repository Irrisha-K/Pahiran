import React from "react";

const PromoBar = () => {
  return (
    <div
      style={{
        background: "#000",
        color: "#fff",
        padding: "8px 0",
        textAlign: "center",
        fontSize: "14px",
      }}
    >
      BUY 1 GET 1 FREE | Use Code:{" "}
      <span
        style={{
          background: "#f44336",
          padding: "2px 8px",
          borderRadius: "5px",
        }}
      >
        BIG1
      </span>
    </div>
  );
};

export default PromoBar;
