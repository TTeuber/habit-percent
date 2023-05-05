import { FormEvent } from "react";
import { useRouter } from "next/router";

export default function SignupPage() {
  const router = useRouter();
  function handleSubmit(e: FormEvent<HTMLFormElement> & { target: any }) {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    console.log(username, password);
    fetch("/backend/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((res) => {
        console.log(res.status);
        if (res.status === 200) {
          router.push(`/user/${username}`).catch((e) => alert(e));
        } else {
          alert("Incorrect username or password");
        }
      })
      .catch((err) => {
        if (err.error === "Connection Error") {
          alert("Connection Error, try again in a few seconds!");
          return;
        }
        alert(err);
      });
  }
  return (
    <>
      <h1>Signup</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input type="text" name="username" placeholder="Username" />
        <input type="password" name="password" placeholder="Password" />
        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
        />
        <button type={"submit"}>Log In</button>
      </form>
    </>
  );
}
