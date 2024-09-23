import { useState, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";

const Togglable = forwardRef((props, refs) => {
  const [view, setView] = useState(false);

  const hideWhenVisible = { display: view ? "none" : "" };
  const showWhenVisible = { display: view ? "" : "none" };

  const toggleVisibility = () => {
    setView(!view);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div
      className="mt-3"
      style={{
        marginLeft: "5px",
      }}
    >
      <div style={hideWhenVisible}>
        <button className="btn btn-outline-primary" onClick={toggleVisibility}>
          {props.label}
        </button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button
          className="btn btn-primary mt-2"
          onClick={toggleVisibility}
          style={{ marginRight: "6px" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
});

Togglable.displayName = "Togglable";

Togglable.propTypes = {
  label: PropTypes.string.isRequired,
};

export default Togglable;
