import CheckerboardBackground from "./CheckerboardBackground";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="m-auto grid h-dvh max-w-7xl place-items-center p-6">
      <CheckerboardBackground />
      {children}
    </div>
  );
}
