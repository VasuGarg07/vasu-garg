export default function Footer({ name }: { name: string }) {
  return (
    <footer className="p-footer">
      Made with 💛 &amp; lots of ☕ by {name} · {new Date().getFullYear()}
    </footer>
  );
}


