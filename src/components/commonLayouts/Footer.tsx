export function Footer() {
  return (
    <footer className="border-t bg-muted text-muted-foreground py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} Crafty-Apa. Crafted with care.</p>
      </div>
    </footer>
  );
}
