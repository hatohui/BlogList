import { useToaster } from "react-hot-toast";

const Notification = () => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause, calculateOffset, updateHeight } = handlers;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 100,
        right: 400,
      }}
      onMouseEnter={startPause}
      onMouseLeave={endPause}
    >
      {toasts.map((toast) => {
        const offset = calculateOffset(toast, {
          reverseOrder: true,
          margin: 8,
        });
        const ref = (el) => {
          if (el && typeof toast.height !== "number") {
            const height = el.getBoundingClientRect().height;
            updateHeight(toast.id, height);
          }
        };

        return (
          <div
            className="card text-center 2em"
            key={toast.id}
            ref={ref}
            style={{
              color: "black",
              position: "absolute",
              width: "300px",
              minHeight: "2em",
              background: "rgba(17, 196, 255, 0.9)",
              transition: "all 1s ease-out",
              opacity: toast.visible ? 1 : 0,
              transform: `translateY(${-offset}px)`,
            }}
          >
            {toast.message}
          </div>
        );
      })}
    </div>
  );
};

export default Notification;
