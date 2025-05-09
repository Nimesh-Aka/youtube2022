import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import Analytics from "@/routes/analytics/analytics"
import Reports from "@/routes/reports/reports"
import Users from "@/routes/users/users"
import Busses from "@/routes/busses/busses"
import Addbus from "@/routes/add-bus/addbus"
import Updatebus from "@/routes/update-bus/updatebus"
import Settings from "@/routes/settings/settings"
import EditBus from "./routes/update-bus/editBus";

// Fix the syntax error in your Layout element and routing structure
function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Layout />, // Fixed syntax
            children: [          // This should be moved to be part of the route object
                {
                    index: true,
                    element: <DashboardPage />
                },
                {
                    path: "analytics",
                    element: <Analytics/>,
                },
                {
                    path: "reports",
                    element: <Reports/>,
                },
                {
                    path: "users",
                    element: <Users/>,
                },
                {
                    path: "busses",
                    element: <Busses/>,
                },
                {
                    path: "add-bus",
                    element: <Addbus/>,
                },
                {
                    path: "update-bus",
                    element: <Updatebus/>,
                },
                {
                    path: 'edit-bus/:id',
                    element: <EditBus/>,
                },
                {
                    path: "settings",
                    element: <Settings/>,
                },
            ]
        },
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
