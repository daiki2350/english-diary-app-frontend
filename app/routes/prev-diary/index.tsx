import { useState, useEffect } from "react";
import { diffWords } from "diff";
import type { ChangeObject } from "diff";

type GrammarIssue = {
  id: string;
  type: string;
  message: string;
  example_before?: string;
  example_after?: string;
};

type DiaryResult = {
    content: string,
    corrected_content: string,
    grammar_issues: GrammarIssue[],
    feedback: string,
    level: string,
    createdAt: string
}

const prevDiary = () => {
    const [diaries, setDiaries] = useState<DiaryResult[]>([])
    const [counter, setCounter] = useState(0)
    const [diffs, setDiffs] = useState<ChangeObject<string>[]>([])
    const [isShowOriginal, setIsShowOriginal] = useState(false)
    const [isShowCorrected, setIsShowCorrected] = useState(false)

    const getDiaries = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/diaries?sort[0]=createdAt:desc&fields[0]=content&fields[1]=corrected_content&fields[2]=grammar_issues&fields[3]=feedback&fields[4]=level&fields[5]=createdAt`)
        const json = await res.json()
        console.log(json)
        setDiaries(json.data?.map((item: any) => item))
    }

    function formatDate(iso: string): string {
        return new Date(iso).toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    }

    const onPrevDiary = () => setCounter(counter+1) //降順だからcounter小さい方が最近

    const onNextDiary = () => setCounter(counter-1)

    useEffect(() => {
        getDiaries()
    }, [])

    useEffect(() => {
        if (diaries.length > 0) {
            const d = diaries[counter];
            setDiffs(diffWords(d.content, d.corrected_content));
        }
        console.log(counter)
    }, [counter, diaries])

    if (diaries.length === 0) {
        return <p className="text-center p-10">ロード中...</p>;
    }

    return ( 
        <div>
            <h2 className="text-center font-bold text-lg">{formatDate(diaries[counter].createdAt)}の日記</h2>
            <div className="grid grid-cols-2 items-stretch">
                {/* 左ボタン */}
                <div className="flex">
                    {diaries.length - (counter + 1) > 0 && (
                        <button
                            onClick={onPrevDiary}
                            className="px-4 py-2 cursor-pointer hover:text-gray-600 border rounded h-full"
                        >
                            ← 前の日記
                        </button>
                    )}
                </div>

                {/* 右ボタン */}
                <div className="flex justify-end">
                    {counter > 0 && (
                        <button
                            onClick={onNextDiary}
                            className="px-4 py-2 cursor-pointer hover:text-gray-600 border rounded h-full"
                        >
                            次の日記 →
                        </button>
                    )}
                </div>
            </div>

            <div>
                <h3 className="text-center font-semibold p-4">レベル(CEFR)</h3>
                 <p className="text-center border border-gray-200 p-2">{diaries[counter].level}</p>
            </div>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 justify-items-center p-4 mb-4">
                <div className="w-full max-w-md">
                    <button onClick={() => setIsShowOriginal(!isShowOriginal)} className="bg-orange-500 w-full text-white p-4 mb-4 rounded-lg cursor-pointer hover:bg-orange-600">
                        {!isShowOriginal ? "あなたの日記 +" : "あなたの日記 -"}
                    </button>
                    {isShowOriginal ? <p className="text-center border border-gray-200 p-2">{diaries[counter].content}</p> : null}
                </div>
                <div className="w-full max-w-md">
                    <button onClick={() => setIsShowCorrected(!isShowCorrected)} className="bg-orange-500 w-full text-white p-4 mb-4 rounded-lg cursor-pointer hover:bg-orange-600">
                        {!isShowCorrected ? "添削後の日記 +" : "添削後の日記 -"}
                    </button>
                    {isShowCorrected ? <p className="text-center border border-gray-200 p-2">{diaries[counter].corrected_content}</p> : null}
                </div>
            </div>
            <div>
                <h3 className="text-center font-semifold p-4">添削前後の比較</h3>
                { diffs.map((part, index) => (
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
            <div>
                <h3 className="text-center font-semibold p-4">気をつけるべき文法</h3>
                {diaries[counter].grammar_issues.map((issue: GrammarIssue, index) => (
                    <p key={index} className="text-center border border-gray-200 p-2">
                        {issue.message}
                    </p>
                ))}
            </div>
            <div>
                <h3 className="text-center font-semibold p-4">フィードバック</h3>
                 <p className="text-center border border-gray-200 p-2">{diaries[counter].feedback}</p>
            </div>
        </div>
     );
}
 
export default prevDiary;