import { useLocation } from "react-router";
import { diffWords } from "diff";
import { useState, useEffect } from "react";

type GrammarIssueType =
  | "tense"
  | "aspect"
  | "modal_verb"
  | "subject_verb_agreement"
  | "voice_active_passive"
  | "conditional"
  | "comparative_superlative"
  | "article"
  | "preposition"
  | "conjunction"
  | "relative_clause"
  | "infinitive_gerund"
  | "plural_singular"
  | "countable_uncountable"
  | "determiner"
  | "negation"
  | "question_form"
  | "word_order"
  | "parallel_structure"
  | "ellipsis_substitution"
  | "quantifier"
  | "word_choice"
  | "collocation"
  | "formality_tone"
  | "register"
  | "idiom_usage"
  | "false_friends"
  | "context_mismatch"
  | "sentence_fragment"
  | "run_on_sentence"
  | "clause_misuse"
  | "subordination_coordination"
  | "coherence_cohesion"
  | "punctuation"
  | "capitalization"
  | "spelling"
  | "redundancy_wordiness"
  | "ambiguity"
  | "awkward_expression"
  | "formality_mismatch";

type GrammarIssue = {
  id: string;
  type: GrammarIssueType;
  message: string;
  example_before?: string;
  example_after?: string;
};



type DiaryResult = {
    original: string,
    corrected: string,
    grammar_issues: GrammarIssue[],
    feedback: string,
    level: string,
}

const CorrectedDiary = () => {

    const location = useLocation()
    const [data, setData] = useState<DiaryResult | null>(null)
    const [isShowOriginal, setIsShowOriginal] = useState(false)
    const [isShowCorrected, setIsShowCorrected] = useState(false)

    useEffect(() => {
        setData(location.state)
    }, [])
    if (!data) {
        return <p>Loading...</p>;
    }
    console.log(data)
    const { original, corrected, grammar_issues, feedback, level } = data
    

    const diffs = diffWords(original, corrected)

    return ( 
        <div>
            <h2 className="text-center text-xl font-bold">添削結果</h2>
            <div>
                <h3 className="text-center font-semibold p-4">今回の日記のレベル(CEFR)</h3>
                 <p className="text-center border border-gray-200 p-2">{level}</p>
            </div>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 justify-items-center p-4 mb-4">
                <div className="w-full max-w-md">
                    <button onClick={() => setIsShowOriginal(!isShowOriginal)} className="bg-orange-500 w-full text-white p-4 mb-4 rounded-lg cursor-pointer hover:bg-orange-600">
                        {!isShowOriginal ? "あなたの日記 +" : "あなたの日記 -"}
                    </button>
                    {isShowOriginal ? <p className="text-center border border-gray-200 p-2">{original}</p> : null}
                </div>
                <div className="w-full max-w-md">
                    <button onClick={() => setIsShowCorrected(!isShowCorrected)} className="bg-orange-500 w-full text-white p-4 mb-4 rounded-lg cursor-pointer hover:bg-orange-600">
                        {!isShowCorrected ? "添削後の日記 +" : "添削後の日記 -"}
                    </button>
                    {isShowCorrected ? <p className="text-center border border-gray-200 p-2">{corrected}</p> : null}
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
                {grammar_issues.map((issue: GrammarIssue) => (
                    <p key={issue.id} className="text-center border border-gray-200 p-2">
                        {issue.message}
                    </p>
                ))}
            </div>
            <div>
                <h3 className="text-center font-semibold p-4">フィードバック</h3>
                 <p className="text-center border border-gray-200 p-2">{feedback}</p>
            </div>
        </div>
     );
}
 
export default CorrectedDiary;