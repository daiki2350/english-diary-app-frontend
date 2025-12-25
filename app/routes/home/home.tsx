import { Link } from "react-router";
import { VscAdd } from "react-icons/vsc";
import { diffWords } from "diff";
import { useQuery } from "@tanstack/react-query";

type GrammarIssue = {
    label: string;
    count: number;
}

type WeeklyLevel = {
    week: number;
    level: string | null;
}

async function fetchMonthlyWords() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/diaries/monthly-word-count`);
    if (!res.ok) throw new Error("Failed to fetch monthly word data");
    const data = await res.json();
    return data.total
}

async function fetchPrevDiary() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/diaries?sort[0]=createdAt:desc&pagination[limit]=1`);
    if (!res.ok) throw new Error("Failed to fetch latest diary");
    const data = await res.json();
    const latest = data.data[0];

    const diffs = diffWords(latest.content, latest.corrected_content);

    return {
        original: latest.content,
        corrected: latest.corrected_content,
        feedback: latest.feedback,
        diffs,
    };
}

async function fetchWeeklyLevel() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/diaries/weekly-level`);
    if (!res.ok) throw new Error("Failed to fetch weekly level");
    const data = await res.json()
    return data.avgLevel
}

async function fetchRecentIssues() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/diaries/recent-grammar-issues`);
    if (!res.ok) throw new Error("Failed to fetch grammar issues");
    const data = await res.json();
    return data.trends
}

async function fetchStreak() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/diaries/calculate-streak`);
    if (!res.ok) throw new Error("Failed to fetch streak");
    const data = await res.json();
    return data.streak
}

    
const Home = () => {

    // ● 今月の文字数
    const { data: words, isLoading: loadingWords } = useQuery({
        queryKey: ["monthlyWords"],
        queryFn: fetchMonthlyWords,
        staleTime: 1000 * 60 * 5,
    });

        // ● 最新の日記
    const { data: prevDiary, isLoading: loadingPrev } = useQuery({
        queryKey: ["prevDiary"],
        queryFn: fetchPrevDiary,
        staleTime: 1000 * 60 * 5,
    });

        // ● 週の平均 CEFR
    const { data: weeklyLevel, isLoading: loadingWeekly } = useQuery({
        queryKey: ["weeklyLevel"],
        queryFn: fetchWeeklyLevel,
        staleTime: 1000 * 60 * 5,
    });

        // ● 文法ミス Top5
    const { data: grammarIssues, isLoading: loadingIssues } = useQuery<GrammarIssue[]>({
        queryKey: ["grammarIssues"],
        queryFn: fetchRecentIssues,
        staleTime: 1000 * 60 * 5,
    });

        // ● ストリーク
    const { data: streak, isLoading: loadingStreak } = useQuery({
        queryKey: ["streak"],
        queryFn: fetchStreak,
        staleTime: 1000 * 60 * 5,
    });

    const isLoading =
        loadingWords ||
        loadingPrev ||
        loadingWeekly ||
        loadingIssues ||
        loadingStreak;

    console.log(weeklyLevel)
    if (isLoading) return (
        <div className="flex justify-center mt-4">
            <p className="text-center p-10">Loading...</p>
            <div className="animate-spin p-10 rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
    )

    const level = weeklyLevel === null ? "今週の記録はありません" : weeklyLevel

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
                    <Link to="issuesdetails" state={grammarIssues}>
                        <h3 className='p-8 text-center font-semibold'>あなたの苦手 Top5</h3>
                        {grammarIssues?.map((issue: GrammarIssue) => (
                            <p key={issue.label} className="mb-4 text-center">{issue.label}: {issue.count}回</p>
                        ))}
                        <p className="text-right text-xs text-gray-400 pr-2">タップで詳細</p>
                    </Link>
                </div>
                <div className="sm:col-span-2 bg-gray-100 border border-gray-200 h-full rounded-lg overflow-hidden shadow-sm transition cursor-pointer hover:shadow-md">
                    <h3 className='p-8 text-center font-semibold'>前回のフィードバック</h3>
                    <p className="mb-4 text-center">{prevDiary?.feedback}</p>
                </div>
                <div className="sm:col-span-3 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-8 transition cursor-pointer hover:shadow-md">
                    <h3 className='p-8 text-center font-semibold'>前回の添削</h3>
                    <div className="px-4 mb-2 max-w-screen-lg mx-auto pb-8">
                        {prevDiary?.diffs.map((part, index) => (
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