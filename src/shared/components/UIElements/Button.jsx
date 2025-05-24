import classNames from "classnames";
import styles from "./Button.module.css";

export default function Button({
  children,
  className = "",
  variant = "default",
  onClick,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={classNames(styles.buttonBase, styles[variant], className)}
    >
      {children}
    </button>
  );
}
