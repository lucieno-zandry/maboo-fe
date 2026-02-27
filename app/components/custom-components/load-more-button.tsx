type Props = {
    loading: boolean;
    onClick: () => void;
};

export function LoadMoreButton({ loading, onClick}: Props) {
    return (
        <div className="flex justify-center mt-8">
            <button
                onClick={onClick}
                disabled={loading}
                className="px-6 py-3 rounded-xl border hover:bg-muted transition disabled:opacity-50"
            >
                {loading ? "Loading..." : "Load More"}
            </button>
        </div>
    );
}