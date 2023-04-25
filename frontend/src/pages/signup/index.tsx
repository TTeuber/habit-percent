export default function SignupPage() {
  return (
    <>
      <h1>Signup</h1>
      <form action="/backend/signup" method={"post"}>
        <input type="text" name="username" placeholder="Username" />
        <input type="password" name="password" placeholder="Password" />
        <button type={"submit"}>Sign Up</button>
      </form>
    </>
  );
}
