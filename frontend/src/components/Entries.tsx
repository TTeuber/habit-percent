import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CategoryData } from "~/pages/user/[username]";
import { ActivityData } from "~/pages/user/[username]/[category]";
export default function Entries({
  setShowEntries,
}: {
  setShowEntries: (showEntries: boolean) => void;
}) {
  const router = useRouter();

  const [entryData, setEntryData] = useState<any[]>([]);

  useEffect(() => {
    if (router.isReady) {
      fetch(`/backend/entries/${router.query.username}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    }
  }, [router.isReady]);

  return (
    <div
      className={"fixed inset-0 bg-gray-700/50 backdrop-blur-sm"}
      onClick={(e) => {
        setShowEntries(false);
      }}
    >
      <div
        className={
          "absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform bg-white"
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className={"flex items-center justify-between p-4"}>
          <p className={"text-2xl"}>Entries</p>
          <button
            className={"text-2xl"}
            onClick={() => {
              setShowEntries(false);
            }}
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
}
