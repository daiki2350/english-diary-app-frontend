import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import LoadComponent from '~/components/Loading';
import { useAuthStore } from '~/stores/auth';

type WeeklyLevel = {
    week: number;
    avgLevel: string | null;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CefrDetails = () => {
    const { token } = useAuthStore()
    const [weeklyLevel, setWeeklyLevel] = useState<WeeklyLevel[] | null>(null)
    const [weeks, setWeeks] = useState<number[]>([])
    const [levels, setLevels] = useState<(string | null)[]>([])

    const getRecntLevels = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/diaries/recent-weekly-levels`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        const data = await res.json()
        setWeeklyLevel(data)
    }

    useEffect(() => {
        getRecntLevels()
    }, [])

    useEffect(() => {
        if (!weeklyLevel) return;

        weeklyLevel.reverse()

        const preWeeks = weeklyLevel.map(w => w.week);
        const preLevels = weeklyLevel.map(w => w.avgLevel);

        setWeeks(preWeeks);
        setLevels(preLevels);
    }, [weeklyLevel]);

    if (weeklyLevel === null) {
        return <LoadComponent />
    }

    
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: '',
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'CEFR Level', // ← ここが Y軸のラベル！
                },
                ticks: {
                    stepSize: 1,        // レベルなので1刻み
                    callback: (value: string | number) => {
                    const map: Record<number, string | null> = {
                        0: null,
                        1: "A1",
                        2: "A2",
                        3: "B1",
                        4: "B2",
                        5: "C1",
                        6: "C2",
                    };
                    const n = Number(value)
                    return map[n] ?? value;
                    }
                },
            min: 0,
            max: 6,
            }
        }
    };

    const levelMap: Record<string, number> = {
        null: 0, A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6,
    };

    console.log(levels)
    const numericLevels = levels.map(l => (l ? levelMap[l] : null));
    console.log(numericLevels)

    let labels: string[] = []

    for(let i=0; i<weeks.length; i++) {
        const label = "week" + weeks[i]
        labels.push(label)
    }

    const data = {
        labels,
        datasets: [
            {
            label: '週ごとのCEFRレベル推移',
            data: numericLevels,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ]
    }


    return ( 
        <div>
            <Line options={options} data={data} />
        </div>
     );
}
 
export default CefrDetails;