export default (role: string) => {
    const colors = {
        admin: "bg-red-500 hover:bg-red-600",
        manager: "bg-blue-500 hover:bg-blue-600",
        client: "bg-green-500 hover:bg-green-600"
    };
    return colors[role as keyof typeof colors] || "bg-gray-500";
};