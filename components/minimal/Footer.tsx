export default function Footer({ name }: { name: string }) {
  return (
    <footer className="m-footer">
      <span>© {new Date().getFullYear()} {name}</span>
      <span>Designed & built with 🩵</span>
    </footer>
  );
}
