import styles from "../styles/Hamburger.module.css";

export function HamburgerButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  //         style="transform: none; transform-origin: 0px 0px;"
  //style = "transform: none; transform-origin: 0px 0px;";
  return (
    <button
      id="menu-btn"
      onClick={() => onClick()}
      className={`block ${styles.hamburger} ${open ? styles.open : ""} md:hidden focus:outline-none`}
    >
      <span className={styles["hamburger-top"]}></span>
      <span className={styles["hamburger-middle"]}></span>
      <span className={styles["hamburger-bottom"]}></span>
    </button>
  );
}
