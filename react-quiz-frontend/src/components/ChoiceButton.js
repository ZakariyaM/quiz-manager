import React from "react";

// Creation of function choice button to be used on quiz
function ChoiceButton({ title, onClick = undefined, style }) {
  return (
    <button
      style={{
        borderWidth: 0,
        display: "block",
        minWidth: 200,
        borderRadius: 18,
        height: 40,
        fontSize: 20,
        marginBottom: 16,
        fontWeight: "500",
        ...style,
      }}
      onClick={onClick}
    >
      {title}
    </button>
  );
}

export default ChoiceButton;
