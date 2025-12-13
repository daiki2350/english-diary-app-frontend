import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout('./routes/layouts/home.tsx', [index("./routes/home/home.tsx")]),
    layout('./routes/layouts/main.tsx', [
        route('diaryform', './routes/diaryform/index.tsx'),
        route('showresult', './routes/corrected-diary/index.tsx')
    ])
] satisfies RouteConfig;
