import { useSelector } from "react-redux";

const Notification = () => {
  const message = useSelector(({ notification }) => notification);
  if (!message) return null;
  return (
    <div id="notification">
      <h3>Notification: {message}</h3>
    </div>
  );
};

export default Notification;
