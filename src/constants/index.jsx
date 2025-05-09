    import { ChartColumn, Home, NotepadText, Package, PackagePlus, Settings, ShoppingBag, UserCheck, UserPlus, Users } from "lucide-react";

    import ProfileImage from "@/assets/profile-image.jpg";
    import Bus from "@/assets/Bus.jpg";

    export const navbarLinks = [
        {
            title: "Dashboard",
            links: [
                {
                    label: "Dashboard",
                    icon: Home,
                    path: "/",
                },
                {
                    label: "Analytics",
                    icon: ChartColumn,
                    path: "/analytics",
                },
                {
                    label: "Reports",
                    icon: NotepadText,
                    path: "/reports",
                },
            ],
        },
        {
            title: "Users",
            links: [
                {
                    label: "Users",
                    icon: Users,
                    path: "/users",
                },
                /*{
                    label: "New customer",
                    icon: UserPlus,
                    path: "/new-customer",
                },
                {
                    label: "Verified customers",
                    icon: UserCheck,
                    path: "/verified-customers",
                }, */
            ],
        },
        {
            title: "Busses",    //change
            links: [
                {
                    label: "Busses",    //change
                    icon: Package,
                    path: "/busses",
                },
                {
                    label: "Add Bus",     //change
                    icon: PackagePlus,
                    path: "/add-bus",
                },
                {
                    label: "Bus Management",   //change
                    icon: ShoppingBag,
                    path: "/update-bus",
                },
            ],
        },
        {
            title: "Settings",
            links: [
                {
                    label: "Settings",
                    icon: Settings,
                    path: "/settings",
                },
            ],
        },
    ];

    export const overviewData = [
        {
            name: "Jan",
            total: 1500,
        },
        {
            name: "Feb",
            total: 2000,
        },
        {
            name: "Mar",
            total: 1000,
        },
        {
            name: "Apr",
            total: 5000,
        },
        {
            name: "May",
            total: 2000,
        },
        {
            name: "Jun",
            total: 5900,
        },
        {
            name: "Jul",
            total: 2000,
        },
        {
            name: "Aug",
            total: 5500,
        },
        {
            name: "Sep",
            total: 2000,
        },
        {
            name: "Oct",
            total: 4000,
        },
        {
            name: "Nov",
            total: 1500,
        },
        {
            name: "Dec",
            total: 2500,
        },
    ];

    export const recentSalesData = [
        {
            id: 1,
            name: "Dasun Shanaka",
            email: "Dasun@email.com",
            image: ProfileImage,
            total: 1500,
        },
        {
            id: 2,
            name: "Kusal Mendis",
            email: "Kusal@email.com",
            image: ProfileImage,
            total: 2000,
        },
        {
            id: 3,
            name: "Snath Jayasooriya",
            email: "Snath@email.com",
            image: ProfileImage,
            total: 4000,
        },
        {
            id: 4,
            name: "kamindu Mendis",
            email: "kamindu@email.com",
            image: ProfileImage,
            total: 3000,
        },
        {
            id: 5,
            name: "kamindu Mendis",
            email: "kamindu@email.com",
            image: ProfileImage,
            total: 2500,
        },
        {
            id: 6,
            name: "kamindu Mendis",
            email: "kamindu@email.com",
            image: ProfileImage,
            total: 4500,
        },
        {
            id: 7,
            name: "kamindu Mendis",
            email: "kamindu@email.com",
            image: ProfileImage,
            total: 5300,
        },
    ];

    export const topProducts = [
        {
            number: 1,
            name: "supper Line",
            image: Bus,
            description: "Kandy to Colombo Express Bus",
            price: 200,
            status: "Available",
            rating: 4.5,
        },
        {
            number: 2,
            name: "CityLine",
            image: Bus,
            description: "Matara to Colombo Express Bus",
            price: 1000,
            status: "Available",
            rating: 4.7,
        },
        {
            number: 3,
            name: "CityLine",
            image: Bus,
            description: "Matara to Colombo Express Bus",
            price: 1000,
            status: "Available",
            rating: 4.7,
        },
        {
            number: 4,
            name: "CityLine",
            image: Bus,
            description: "Matara to Colombo Express Bus",
            price: 1000,
            status: "Available",
            rating: 4.7,
        },
        {
            number: 5,
            name: "CityLine",
            image: Bus,
            description: "Matara to Colombo Express Bus",
            price: 1000,
            status: "Available",
            rating: 4.7,
        },
        {
            number: 6,
            name: "CityLine",
            image: Bus,
            description: "Matara to Colombo Express Bus",
            price: 1000,
            status: "Available",
            rating: 4.7,
        },
        {
            number: 7,
            name: "CityLine",
            image: Bus,
            description: "Matara to Colombo Express Bus",
            price: 1000,
            status: "Available",
            rating: 4.7,
        },
        {
            number: 8,
            name: "CityLine",
            image: Bus,
            description: "Matara to Colombo Express Bus",
            price: 1000,
            status: "Available",
            rating: 4.7,
        },
        {
            number: 9,
            name: "CityLine",
            image: Bus,
            description: "Matara to Colombo Express Bus",
            price: 1000,
            status: "Available",
            rating: 4.7,
        },
        {
            number: 10,
            name: "CityLine",
            image: Bus,
            description: "Matara to Colombo Express Bus",
            price: 1000,
            status: "Available",
            rating: 4.7,
        },
    ];
