import Link from "next/link";
import { useRouter } from "next/router";
export default function Navbar() {
  const router = useRouter();
  function handleLogout() {
    fetch("/backend/logout", {
      method: "POST",
    })
      .then((res) => {
        if (res.status === 200) {
          router.push("/").catch((e) => alert(e));
        } else {
          alert("Error logging out");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return (
    <div className={"flex gap-3"}>
      <h1>Navbar</h1>
      <Link href="/">Home</Link>
      <Link href="/login">Login</Link>
      <Link href="/signup">Signup</Link>
      <Link href={`/user/${"username"}`}>Username</Link>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
