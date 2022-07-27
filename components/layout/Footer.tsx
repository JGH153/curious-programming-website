export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-5 text-center p-5 justify-center items-center border-t-2 ">
      <p>© {year} - Jan Greger Hemb</p>
      <a href="https://curious-programming.sanity.studio/desk">Sanity Studio</a>
    </footer>
  );
}
