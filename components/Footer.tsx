export default function Footer({ name }: { name: string }) {
  return (
    <footer className="nb-footer">
      scribbled with care by <em>{name}</em> · {new Date().getFullYear()} · end of notebook ✎
    </footer>
  );
}
