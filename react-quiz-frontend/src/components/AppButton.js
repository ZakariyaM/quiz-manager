import React from "react";

function AppButton({
  title,
  width = 100,
  style = {},
  color,
  onClick = undefined,
  disabled = false,
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        borderWidth: 0,
        width: width,
        borderRadius: 20,
        margin: 20,
        height: 40,
        fontWeight: "500",
        color: color,
        ...style,
      }}
    >
      {title}
    </button>
  );
}

export default AppButton;
