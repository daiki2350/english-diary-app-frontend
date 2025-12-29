import { Link } from "react-router";
import { VscAdd } from "react-icons/vsc";
import { diffWords } from "diff";
import { useQuery } from "@tanstack/react-query";
import LoadComponent from "~/components/Loading";
import { useAuthStore } from "~/stores/auth"

type GrammarIssue = {
    label: string;
    count: number;
}

type WeeklyLevel = {
    week: number;
    level: string | null;
}


async function fetchMonthlyWords(token: string) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/diaries/monthly-word-count`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to fetch monthly word data");
    const data = await res.json();
    return data.total ?? 0
}

async function fetchLastDiary(token: string) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/diaries/get-lastdiary`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to fetch latest diary");
    const data = await res.json();
    const diary = Array.isArray(data) ? data[0] : data;

    if (!diary) {
        return null;
    }

    const diffs = diffWords(
        diary.content ?? "",
        diary.corrected_content ?? ""
    );

    return {
        feedback: diary.feedback ?? null,
        diffs,
    };

}

async function fetchWeeklyLevel(token: string) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/diaries/weekly-level`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to fetch weekly level");
    const data = await res.json()
    return data.avgLevel ?? null
}

async function fetchRecentIssues(token: string) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/diaries/recent-grammar-issues`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to fetch grammar issues");
    const data = await res.json();
    return data.trends ?? null
}

async function fetchStreak(token: string) {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/diaries/calculate-streak`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to fetch streak");
    const data = await res.json();
    return data.streak ?? 0
}

    
const Home = () => {
    const { token, hydrated } = useAuthStore()

    // ● 今月の文字数
    const { data: words, isLoading: loadingWords } = useQuery({
        queryKey: ["monthlyWords", token],
        queryFn: () => fetchMonthlyWords(token!),
        enabled: hydrated && !!token,
        staleTime: 1000 * 60 * 5,
    });

        // ● 最新の日記
    const { data: lastDiary = null, isLoading: loadingLast } = useQuery({
        queryKey: ["lastDiary", token],
        queryFn: () => fetchLastDiary(token!),
        enabled: hydrated && !!token,
        staleTime: 1000 * 60 * 5,
    });

        // ● 週の平均 CEFR
    const { data: weeklyLevel, isLoading: loadingWeekly } = useQuery({
        queryKey: ["weeklyLevel", token],
        queryFn: () => fetchWeeklyLevel(token!),
        enabled: hydrated && !!token,
        staleTime: 1000 * 60 * 5,
    });

        // ● 文法ミス Top5
    const { data: grammarIssues, isLoading: loadingIssues } = useQuery<GrammarIssue[]>({
        queryKey: ["grammarIssues", token],
        queryFn: () => fetchRecentIssues(token!),
        enabled: hydrated && !!token,
        staleTime: 1000 * 60 * 5,
    });

        // ● ストリーク
    const { data: streak, isLoading: loadingStreak } = useQuery({
        queryKey: ["streak", token],
        queryFn: () => fetchStreak(token!),
        enabled: hydrated && !!token,
        staleTime: 1000 * 60 * 5,
    });

    const isLoading =
        loadingWords ||
        loadingLast ||
        loadingWeekly ||
        loadingIssues ||
        loadingStreak;

    if (isLoading) return (
        <LoadComponent />
    )

    console.log(lastDiary)

    const level = weeklyLevel === null ? "今週の英語はこれから。今日の一文から始めましょう。" : weeklyLevel
    const issue = grammarIssues?.length === 0 ? "あなたの記録はありません。" : null
    const lastDiaryMsg = lastDiary === null ? "右下のボタンから日記を書こう!" : null
    const diffMsg = lastDiary === null ? "AIがあなたの英語を、より自然で伝わる表現に整えます。" : null

    return ( 
        <div>
            <h2 className='font-bold text-xl text-center my-6'>英語日記アプリ</h2>
            <div className="grid gap-2 sm:grid-cols-3 items-start">
                <div className="bg-gray-100 border h-full border-gray-200 rounded-lg overflow-hidden shadow-sm transition cursor-pointer hover:shadow-md">
                        <h3 className='p-8 text-center font-semibold'>連続記録</h3>
                        <p className="mb-4 text-center">{streak}</p>
                </div>
                <div className="bg-gray-100 border h-full border-gray-200 rounded-lg overflow-hidden shadow-sm transition cursor-pointer hover:shadow-md"> 
                    <Link to='cefrdetails'>
                        <h3 className='p-8 text-center font-semibold'>今月の平均レベル</h3>
                        <p className="mb-4 text-center">{level}</p>
                        <p className="text-right text-xs text-gray-400 pr-2">タップで詳細</p>
                    </Link>
                </div>
                <div className="bg-gray-100 border border-gray-200 h-full rounded-lg overflow-hidden shadow-sm transition cursor-pointer hover:shadow-md">
                    <h3 className='p-8 text-center font-semibold'>今月の文字数</h3>
                    <p className="mb-4 text-center">{words}</p>
                </div>
                <div className="bg-gray-100 border border-gray-200 h-full rounded-lg overflow-hidden shadow-sm transition cursor-pointer hover:shadow-md"> 
                    <Link to="issuesdetails">
                        <h3 className='p-8 text-center font-semibold'>あなたの苦手 Top5</h3>
                        {issue && <p className="mb-4 text-center">{issue}</p>}
                        {grammarIssues?.map((issue: GrammarIssue) => (
                            <p key={issue.label} className="mb-4 text-center">{issue.label}: {issue.count}回</p>
                        ))}
                        <p className="text-right text-xs text-gray-400 pr-2">タップで詳細</p>
                    </Link>
                </div>
                <div className="sm:col-span-2 bg-gray-100 border border-gray-200 h-full rounded-lg overflow-hidden shadow-sm transition cursor-pointer hover:shadow-md">
                    <h3 className='p-8 text-center font-semibold'>前回のフィードバック</h3>
                    {lastDiaryMsg && <p className="mb-4 text-center">{lastDiaryMsg}</p>}
                    <p className="mb-4 text-center">{lastDiary?.feedback}</p>
                </div>
                <div className="sm:col-span-3 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-8 transition cursor-pointer hover:shadow-md">
                    <h3 className='p-8 text-center font-semibold'>前回の添削</h3>
                    {diffMsg && <p className="mb-4 text-center">{diffMsg}</p>}
                    <div className="px-4 mb-2 max-w-screen-lg mx-auto pb-8">
                        {lastDiary?.diffs.map((part, index) => (
                            <span 
                            key={index} 
                            style={{
                                color: part.added ? 'green' : part.removed ? 'red' : 'black',
                                textDecoration: part.removed ? 'line-through' : 'none',
                            }}
                            >
                                { part.value }
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className='fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow'>
                <Link to="/diaryform">
                    <VscAdd size={28} />
                </Link>
            </div>
        </div>
     );
}
 
export default Home;