import Link from "next/link";
export default function Navbar() {
  return (
    <div className={"flex gap-3"}>
      <h1>Navbar</h1>
      <Link href="/">Home</Link>
      <Link href="/login">Login</Link>
      <Link href="/signup">Signup</Link>
      <Link href={`/user/${"username"}`}>Username</Link>
    </div>
  );
}
