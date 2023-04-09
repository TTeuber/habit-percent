import { useRouter } from "next/router";
import { api } from "~/utils/api";

export default function UserPage() {
  const router = useRouter();
  const username = router.query.username as string;

  const data = api.data.test.useQuery(username);

  return (
    <div>
      <h1>{username}</h1>
      <h2>{data.data?.message}</h2>
      <form action="http://localhost:5000/logout" method={"post"}>
        <button type={"submit"}>Log Out</button>
      </form>
    </div>
  );
}
