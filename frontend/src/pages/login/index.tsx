export default function LoginPage() {
  return (
    <>
      <h1>Login</h1>
      <form action="/backend/login" method={"post"}>
        <input type="text" name="username" placeholder="Username" />
        <input type="password" name="password" placeholder="Password" />
        <button type={"submit"}>Log In</button>
      </form>
    </>
  );
}
