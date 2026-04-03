export default function Footer({ name }: { name: string }) {
  return (
    <footer className="d-footer">
      Built with <span>♥</span> by {name} · {new Date().getFullYear()}
    </footer>
  );
}
