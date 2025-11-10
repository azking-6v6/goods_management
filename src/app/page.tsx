import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

type GameItem = {
  id: string;
  title: string;
  platform: "Switch" | "PS5" | "PS4" | "PC" | "Xbox" | "Mobile" | "Other";
  count: number; // 所持数
  status: "未プレイ" | "プレイ中" | "クリア" | "積み中" | "中断";
};

function statusClasses(status: GameItem["status"]) {
  switch (status) {
    case "クリア":
      return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
    case "プレイ中":
      return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
    case "未プレイ":
      return "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-900/30 dark:text-zinc-300 dark:border-zinc-800";
    case "積み中":
      return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";
    case "中断":
      return "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800";
    default:
      return "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-900/30 dark:text-zinc-300 dark:border-zinc-800";
  }
}

export default async function Home() {
  const { data, error } = await supabase
    .from("library_entries")
    .select(`count, status, game:game_id ( id, title, platform_id )`)
    .order("updated_at", { ascending: false })
    .limit(30);

  let items: GameItem[] = [];
  if (!error && data) {
    items = data
      .filter((row: any) => row.game)
      .map((row: any) => ({
        id: row.game.id as string,
        title: row.game.title as string,
        platform: (row.game.platform_id as string) as GameItem["platform"],
        count: row.count as number,
        status: row.status as GameItem["status"],
      }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">所持ゲーム一覧</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          所持しているゲームの一覧を表示します。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((g) => (
          <article
            key={g.id}
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
          >
            <h3 className="line-clamp-2 text-base font-medium leading-6">
              {g.title}
            </h3>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950 dark:text-indigo-300">
                {g.platform}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="text-zinc-600 dark:text-zinc-400">
                所持数: <span className="font-medium text-zinc-900 dark:text-zinc-200">{g.count}</span>
              </div>
              <div>
                <span
                  className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${statusClasses(g.status)}`}
                >
                  {g.status}
                </span>
              </div>
            </div>
          </article>
        ))}
        {!error && items.length === 0 && (
          <div className="col-span-full rounded-md border border-zinc-200 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            表示できるゲームがありません。Supabaseにデータを追加してください。
          </div>
        )}
        {error && (
          <div className="col-span-full rounded-md border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950 dark:text-rose-300">
            データ取得に失敗しました。設定をご確認ください。
          </div>
        )}
      </div>
    </div>
  );
}

